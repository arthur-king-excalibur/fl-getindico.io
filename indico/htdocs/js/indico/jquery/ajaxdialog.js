/* This file is part of Indico.
 * Copyright (C) 2002 - 2015 European Organization for Nuclear Research (CERN).
 *
 * Indico is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License as
 * published by the Free Software Foundation; either version 3 of the
 * License, or (at your option) any later version.
 *
 * Indico is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Indico; if not, see <http://www.gnu.org/licenses/>.
 */

(function(global, $) {
    'use strict';

    // Ajaxifies a link to open the target page (which needs to be using WPJinjaMixin.render_template) in a
    // modal dialog. Any forms on the page are ajaxified and should be using redirect_or_jsonify() in case
    // of success (or just return a JSON response containing success=true and possibly flashedmessages).
    // The link target MUST point to a page which is also valid when loaded directly in the browser since the
    // link could still be opened in a new tab manually. If you don't have a non-AJAX version, place the url in
    // data-href.
    $.fn.ajaxDialog = function jqAjaxDialog(options) {
        return this.on('click', function(e) {
            e.preventDefault();
            var href = $(this).attr('href');
            if (href == '#') {
                var data_href = $(this).data('href');
                href = data_href ? data_href : href;
            }
            ajaxDialog($.extend({}, options, {
                url: href,
                trigger: this
            }));
        });
    };

    // See the documentation of $.fn.ajaxDialog - use this function if you want to open an ajax-based dialog
    // manually instead of triggering it from a link using its href.
    global.ajaxDialog = function ajaxDialog(options) {
        options = $.extend({
            trigger: null, // element that opened the dialog
            title: null, // title of the dialog
            url: null, // url to GET the form from
            backSelector: '[data-button-back]', // elements in the form which will close the form
            clearFlashes: true, // clear existing flashed messages before showing new ones
            onClose: null, // callback to invoke after closing the dialog. first argument is null if closed manually,
                           // otherwise the JSON returned by the server
            getExtraData: function() {}  // callback to add data to the form. receives the <form> element as `this`
        }, options);

        var popup = null;

        $.ajax({
            type: 'GET',
            url: options.url,
            cache: false, // IE caches GET AJAX requests. WTF.
            complete: IndicoUI.Dialogs.Util.progress(),
            error: handleAjaxError,
            success: function(data) {
                if (handleAjaxError(data)) {
                    return;
                }
                showDialog(data);
            }
        });

        function showDialog(dialogData) {
            popup = new ExclusivePopup(options.title, function() {
                if (options.onClose) {
                    options.onClose(null);
                }
                return true;
            }, false, false);
            popup.draw = function() {
                this.ExclusivePopup.prototype.draw.call(this, dialogData.html);
            };
            popup.postDraw = ajaxifyForms;
            popup.open();
        }

        function closeDialog(callbackData) {
            if (options.onClose) {
                options.onClose(callbackData);
            }
            popup.close();
        }

        function ajaxifyForms() {
            var killProgress = null;
            var forms = popup.contentContainer.find('form');
            showFormErrors(popup.resultContainer);
            forms.on('click', options.backSelector, function(e) {
                e.preventDefault();
                closeDialog();
            }).each(function() {
                // We often use forms with an empty action; those need to go to
                // their page and not the page that loaded the dialog!
                var action = $(this).attr('action') || options.url;
                $(this).ajaxForm({
                    url: action,
                    dataType: 'json',
                    data: options.getExtraData.call(this, options.trigger),
                    traditional: true,
                    beforeSubmit: function() {
                        killProgress = IndicoUI.Dialogs.Util.progress();
                    },
                    error: function(xhr) {
                        killProgress();
                        closeDialog();
                        handleAjaxError(xhr);
                    },
                    success: function(data) {
                        killProgress();
                        if (handleAjaxError(data)) {
                            closeDialog();
                            return;
                        }

                        if (options.clearFlashes) {
                            $('#flashed-messages').empty();
                        }
                        if (data.flashed_messages) {
                            var flashed = $(data.flashed_messages.trim()).children();
                            $('#flashed-messages').append(flashed);
                        }

                        if (data.close_dialog || data.success) {
                            closeDialog(data);
                        } else if (data.html) {
                            popup.contentContainer.html(data.html);
                            ajaxifyForms();
                        }
                    }
                });
            });
        }
    };
})(window, jQuery);
