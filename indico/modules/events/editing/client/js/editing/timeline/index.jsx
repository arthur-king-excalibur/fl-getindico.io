// This file is part of Indico.
// Copyright (C) 2002 - 2020 CERN
//
// Indico is free software; you can redistribute it and/or
// modify it under the terms of the MIT License; see the
// LICENSE file for more details.

import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Loader} from 'semantic-ui-react';

import TimelineHeader from 'indico/modules/events/editing/editing/timeline/TimelineHeader';
import TimelineContent from 'indico/modules/events/reviewing/components/TimelineContent';
import SubmitRevision from './SubmitRevision';

import * as actions from './actions';
import * as selectors from './selectors';
import TimelineItem from './TimelineItem';
import FileDisplay from './FileDisplay';

export default function Timeline() {
  const dispatch = useDispatch();
  const details = useSelector(selectors.getDetails);
  const isInitialEditableDetailsLoading = useSelector(selectors.isInitialEditableDetailsLoading);
  const needsSubmitterChanges = useSelector(selectors.needsSubmitterChanges);
  const canPerformSubmitterActions = useSelector(selectors.canPerformSubmitterActions);
  const lastRevision = useSelector(selectors.getLastRevision);
  const timelineBlocks = useSelector(selectors.getTimelineBlocks);
  const {eventId, contributionId, editableType, fileTypes} = useSelector(selectors.getStaticData);

  useEffect(() => {
    dispatch(actions.loadTimeline(eventId, contributionId, editableType));
  }, [contributionId, eventId, editableType, dispatch]);

  if (isInitialEditableDetailsLoading) {
    return <Loader active />;
  } else if (!details) {
    return null;
  }

  return (
    <>
      <TimelineHeader
        contribution={details.contribution}
        state={details.state}
        submitter={timelineBlocks[0].submitter}
        eventId={eventId}
      >
        <FileDisplay
          fileTypes={fileTypes}
          files={lastRevision.files}
          downloadURL={lastRevision.downloadFilesURL}
          tags={lastRevision.tags}
        />
      </TimelineHeader>
      <TimelineContent blocks={timelineBlocks} itemComponent={TimelineItem} />
      {canPerformSubmitterActions && needsSubmitterChanges && <SubmitRevision />}
    </>
  );
}
