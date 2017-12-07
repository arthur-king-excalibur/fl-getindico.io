# This file is part of Indico.
# Copyright (C) 2002 - 2018 European Organization for Nuclear Research (CERN).
#
# Indico is free software; you can redistribute it and/or
# modify it under the terms of the GNU General Public License as
# published by the Free Software Foundation; either version 3 of the
# License, or (at your option) any later version.
#
# Indico is distributed in the hope that it will be useful, but
# WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
# General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with Indico; if not, see <http://www.gnu.org/licenses/>.

from __future__ import unicode_literals

from operator import attrgetter, itemgetter

from flask import flash, redirect, request, session
from werkzeug.exceptions import NotFound

from indico.modules.events.abstracts import logger
from indico.modules.events.abstracts.controllers.base import RHManageAbstractsBase
from indico.modules.events.abstracts.forms import (AbstractReviewingRolesForm, AbstractReviewingSettingsForm,
                                                   AbstractsScheduleForm, AbstractSubmissionSettingsForm)
from indico.modules.events.abstracts.models.abstracts import Abstract
from indico.modules.events.abstracts.models.review_questions import AbstractReviewQuestion
from indico.modules.events.abstracts.models.review_ratings import AbstractReviewRating
from indico.modules.events.abstracts.models.reviews import AbstractReview
from indico.modules.events.abstracts.operations import close_cfa, open_cfa, schedule_cfa
from indico.modules.events.abstracts.settings import abstracts_reviewing_settings, abstracts_settings
from indico.modules.events.abstracts.util import get_roles_for_event
from indico.modules.events.abstracts.views import WPManageAbstracts
from indico.modules.events.reviewing_questions_fields import get_reviewing_field_types
from indico.modules.events.util import update_object_principals
from indico.util.i18n import _
from indico.util.string import handle_legacy_description
from indico.web.flask.util import url_for
from indico.web.forms.base import FormDefaults
from indico.web.util import jsonify_data, jsonify_form, jsonify_template


class RHAbstractsDashboard(RHManageAbstractsBase):
    """Dashboard of the abstracts module"""

    # Allow access even if the feature is disabled
    EVENT_FEATURE = None

    def _process(self):
        if not self.event.has_feature('abstracts'):
            return WPManageAbstracts.render_template('management/disabled.html', self.event)
        else:
            abstracts_count = Abstract.query.with_parent(self.event).count()
            return WPManageAbstracts.render_template('management/overview.html', self.event,
                                                     abstracts_count=abstracts_count, cfa=self.event.cfa)


class RHScheduleCFA(RHManageAbstractsBase):
    """Schedule the call for abstracts"""

    def _process(self):
        form = AbstractsScheduleForm(obj=FormDefaults(**abstracts_settings.get_all(self.event)),
                                     event=self.event)
        if form.validate_on_submit():
            rescheduled = self.event.cfa.start_dt is not None
            schedule_cfa(self.event, **form.data)
            if rescheduled:
                flash(_("Call for abstracts has been rescheduled"), 'success')
            else:
                flash(_("Call for abstracts has been scheduled"), 'success')
            return jsonify_data(flash=False)
        return jsonify_form(form)


class RHOpenCFA(RHManageAbstractsBase):
    """Open the call for abstracts"""

    def _process(self):
        open_cfa(self.event)
        flash(_("Call for abstracts is now open"), 'success')
        return redirect(url_for('.management', self.event))


class RHCloseCFA(RHManageAbstractsBase):
    """Close the call for abstracts"""

    def _process(self):
        close_cfa(self.event)
        flash(_("Call for abstracts is now closed"), 'success')
        return redirect(url_for('.management', self.event))


class RHManageAbstractSubmission(RHManageAbstractsBase):
    """Configure abstract submission"""

    def _process(self):
        settings = abstracts_settings.get_all(self.event)
        form = AbstractSubmissionSettingsForm(event=self.event, obj=FormDefaults(**settings))
        if form.validate_on_submit():
            abstracts_settings.set_multi(self.event, form.data)
            flash(_('Abstract submission settings have been saved'), 'success')
            return jsonify_data()
        elif not form.is_submitted():
            handle_legacy_description(form.announcement, settings,
                                      get_render_mode=itemgetter('announcement_render_mode'),
                                      get_value=itemgetter('announcement'))
        return jsonify_form(form)


class RHManageAbstractReviewing(RHManageAbstractsBase):
    """Configure abstract reviewing"""

    def _process(self):
        has_ratings = (AbstractReviewRating.query
                       .join(AbstractReviewRating.review)
                       .join(AbstractReview.abstract)
                       .join(AbstractReviewRating.question)
                       .filter(~Abstract.is_deleted, Abstract.event == self.event,
                               AbstractReviewQuestion.field_type == 'rating')
                       .has_rows())
        defaults = FormDefaults(**abstracts_reviewing_settings.get_all(self.event))
        form = AbstractReviewingSettingsForm(event=self.event, obj=defaults, has_ratings=has_ratings)
        if form.validate_on_submit():
            data = form.data
            abstracts_reviewing_settings.set_multi(self.event, data)
            flash(_('Abstract reviewing settings have been saved'), 'success')
            return jsonify_data()
        self.commit = False
        disabled_fields = form.RATING_FIELDS if has_ratings else ()
        return jsonify_form(form, disabled_fields=disabled_fields)


class RHManageReviewingRoles(RHManageAbstractsBase):
    """Configure track roles (reviewers/conveners)."""

    def _process(self):
        roles = get_roles_for_event(self.event)
        form = AbstractReviewingRolesForm(event=self.event, obj=FormDefaults(roles=roles))

        if form.validate_on_submit():
            role_data = form.roles.role_data
            self.event.global_conveners = set(role_data['global_conveners'])
            self.event.global_abstract_reviewers = set(role_data['global_reviewers'])

            for track, user_roles in role_data['track_roles'].viewitems():
                track.conveners = set(user_roles['convener'])
                track.abstract_reviewers = set(user_roles['reviewer'])

            # Update actual ACLs
            update_object_principals(self.event, role_data['all_conveners'], permission='track_convener')
            update_object_principals(self.event, role_data['all_reviewers'], permission='abstract_reviewer')

            flash(_("Abstract reviewing roles have been updated."), 'success')
            logger.info("Abstract reviewing roles of %s have been updated by %s", self.event, session.user)
            return jsonify_data()
        return jsonify_form(form, skip_labels=True, form_header_kwargs={'id': 'reviewing-role-form'},
                            disabled_until_change=True)


class RHManageAbstractReviewingQuestions(RHManageAbstractsBase):
    def _process(self):
        return jsonify_template('events/abstracts/management/abstract_reviewing_questions.html', event=self.event,
                                reviewing_questions=self.event.abstract_review_questions,
                                field_types=get_reviewing_field_types('abstracts'))


class RHCreateAbstractReviewingQuestion(RHManageAbstractsBase):
    def _process_args(self):
        RHManageAbstractsBase._process_args(self)
        try:
            self.field_cls = get_reviewing_field_types('abstracts')[request.args['field_type']]
        except KeyError:
            raise NotFound

    def _process(self):
        form = self.field_cls.create_config_form()
        if form.validate_on_submit():
            new_question = AbstractReviewQuestion()
            new_question.no_score = True if self.field_cls.name != 'rating' else form.no_score
            field = self.field_cls(new_question)
            field.update_object(form.data)
            form.populate_obj(new_question)
            self.event.abstract_review_questions.append(new_question)
            return jsonify_data(flash=False)
        return jsonify_form(form, fields=getattr(form, '_order', None))


class RHSortReviewingQuestions(RHManageAbstractsBase):
    def _process(self):
        questions_by_id = {q.id: q for q in self.event.abstract_review_questions}
        question_ids = map(int, request.form.getlist('field_ids'))
        for index, question_id in enumerate(question_ids, 0):
            questions_by_id[question_id].position = index
            del questions_by_id[question_id]

        for index, field in enumerate(sorted(questions_by_id.values(), key=attrgetter('position')), len(question_ids)):
            field.position = index
        return jsonify_data(flash=False)


class RHReviewingQuestionBase(RHManageAbstractsBase):
    locator_args = {
        lambda self: self.question
    }

    def _process_args(self):
        RHManageAbstractsBase._process_args(self)
        self.question = AbstractReviewQuestion.get_one(request.view_args['question_id'])


class RHEditAbstractReviewingQuestion(RHReviewingQuestionBase):
    def _process(self):
        defaults = FormDefaults(obj=self.question, **self.question.field_data)
        form = self.question.field.create_config_form(obj=defaults)
        if form.validate_on_submit():
            self.question.field.update_object(form.data)
            form.populate_obj(self.question)
            return jsonify_data(flash=False)
        return jsonify_form(form, fields=getattr(form, '_order', None))


class RHDeleteAbstractReviewingQuestion(RHReviewingQuestionBase):
    def _process(self):
        self.question.is_deleted = True
        return jsonify_data(flash=False)
