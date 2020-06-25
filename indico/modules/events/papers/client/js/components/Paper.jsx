// This file is part of Indico.
// Copyright (C) 2002 - 2020 CERN
//
// Indico is free software; you can redistribute it and/or
// modify it under the terms of the MIT License; see the
// LICENSE file for more details.

import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import {useDispatch, useSelector} from 'react-redux';
import {Icon, Loader, Step} from 'semantic-ui-react';

import fileTypesURL from 'indico-url:event_editing.api_file_types';
import editableURL from 'indico-url:event_editing.api_editable';
import TimelineContent from 'indico/modules/events/reviewing/components/TimelineContent';
import {useIndicoAxios} from 'indico/react/hooks';
import EditableSubmissionButton from 'indico/modules/events/editing/editing/EditableSubmissionButton';
import {EditableType} from 'indico/modules/events/editing/models';
import {Translate} from 'indico/react/i18n';
import {
  fileTypePropTypes,
  uploadablePropTypes,
} from 'indico/modules/events/editing/editing/timeline/FileManager/util';
import TimelineHeader from './TimelineHeader';
import {fetchPaperDetails} from '../actions';
import {getPaperDetails, isFetchingInitialPaperDetails} from '../selectors';
import PaperDecisionForm from './PaperDecisionForm';
import PaperContent from './PaperContent';
import TimelineItem from './TimelineItem';
import {PaperState} from '../models';

export default function Paper({eventId, contributionId}) {
  const dispatch = useDispatch();
  const paper = useSelector(getPaperDetails);
  const isInitialPaperDetailsLoading = useSelector(isFetchingInitialPaperDetails);
  const {data: fileTypes} = useIndicoAxios({
    url: fileTypesURL({confId: eventId, type: EditableType.paper}),
    trigger: eventId,
    camelize: true,
  });
  const {data: editable} = useIndicoAxios({
    url: editableURL({confId: eventId, contrib_id: contributionId, type: 'paper'}),
    trigger: [eventId, contributionId],
    unhandledErrors: [404],
    camelize: true,
  });

  useEffect(() => {
    dispatch(fetchPaperDetails(eventId, contributionId));
  }, [dispatch, contributionId, eventId]);

  if (isInitialPaperDetailsLoading) {
    return <Loader active />;
  } else if (!paper) {
    return null;
  }

  const {
    contribution,
    lastRevision: {submitter, files},
    revisions,
    state,
    isInFinalState,
    canSubmitProceedings,
    editingEnabled,
  } = paper;

  return (
    <>
      <TimelineHeader
        contribution={contribution}
        state={state}
        submitter={submitter}
        eventId={eventId}
      >
        <PaperContent />
      </TimelineHeader>
      {canSubmitProceedings && editingEnabled && (
        <PaperSteps
          isInFinalState={isInFinalState}
          isRejected={state.name === PaperState.rejected}
          hasEditable={!!editable}
          fileTypes={fileTypes}
          uploadableFiles={files}
        />
      )}
      <TimelineContent itemComponent={TimelineItem} blocks={revisions} />
      <PaperDecisionForm />
    </>
  );
}

Paper.propTypes = {
  eventId: PropTypes.number.isRequired,
  contributionId: PropTypes.number.isRequired,
};

function PaperSteps({isInFinalState, isRejected, hasEditable, fileTypes, uploadableFiles}) {
  const {event, contribution} = useSelector(getPaperDetails);

  return (
    <Step.Group fluid>
      <Step active={!isInFinalState} completed={isInFinalState}>
        <Icon name="copy outline" />
        <Step.Content>
          <Step.Title>Peer Reviewing</Step.Title>
          <Step.Description style={{marginBottom: 0}}>
            {isInFinalState ? (
              <Translate>The paper was reviewed</Translate>
            ) : (
              <Translate>Your paper is under review</Translate>
            )}
          </Step.Description>
        </Step.Content>
      </Step>
      <Step active={isInFinalState} completed={hasEditable} disabled={isRejected}>
        <Icon name="pencil alternate" />
        <Step.Content>
          <Step.Title>
            {hasEditable || !isInFinalState || isRejected ? (
              <Translate>Submit for Editing</Translate>
            ) : (
              <EditableSubmissionButton
                eventId={event.id}
                contributionId={contribution.id}
                contributionCode={contribution.code}
                fileTypes={{[EditableType.paper]: fileTypes}}
                uploadableFiles={uploadableFiles}
              />
            )}
          </Step.Title>
        </Step.Content>
      </Step>
    </Step.Group>
  );
}

PaperSteps.propTypes = {
  isInFinalState: PropTypes.bool.isRequired,
  isRejected: PropTypes.bool.isRequired,
  hasEditable: PropTypes.bool.isRequired,
  fileTypes: PropTypes.arrayOf(PropTypes.shape(fileTypePropTypes)).isRequired,
  uploadableFiles: PropTypes.arrayOf(PropTypes.shape(uploadablePropTypes)),
};

PaperSteps.defaultProps = {
  uploadableFiles: [],
};
