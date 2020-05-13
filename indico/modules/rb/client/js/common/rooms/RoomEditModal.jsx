// This file is part of Indico.
// Copyright (C) 2002 - 2020 CERN
//
// Indico is free software; you can redistribute it and/or
// modify it under the terms of the MIT License; see the
// LICENSE file for more details.

import roomURL from 'indico-url:rb.admin_room';
import roomsURL from 'indico-url:rb.admin_rooms';
import fetchRoomAttributesURL from 'indico-url:rb.admin_room_attributes';
import fetchRoomAvailabilityURL from 'indico-url:rb.admin_room_availability';
import fetchAttributesURL from 'indico-url:rb.admin_attributes';
import updateRoomEquipmentURL from 'indico-url:rb.admin_update_room_equipment';
import updateRoomAttributesURL from 'indico-url:rb.admin_update_room_attributes';
import updateRoomAvailabilityURL from 'indico-url:rb.admin_update_room_availability';

import {Form as FinalForm, FormSpy} from 'react-final-form';
import {Button, Form, Grid, Message, Modal, Tab} from 'semantic-ui-react';
import React, {useEffect, useState, useCallback, useMemo} from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import arrayMutators from 'final-form-arrays';
import {camelizeKeys, snakifyKeys} from 'indico/utils/case';
import {Translate} from 'indico/react/i18n';
import {indicoAxios, handleAxiosError} from 'indico/utils/axios';

import './RoomEditModal.module.scss';
import {getChangedValues, handleSubmitError, parsers as p} from 'indico/react/forms';
import RoomPhoto from './RoomPhoto';
import RoomEditNotifications from './RoomEditNotifications';
import RoomEditLocation from './RoomEditLocation';
import RoomEditDetails from './RoomEditDetails';
import RoomEditPermissions from './RoomEditPermissions';
import RoomEditOptions from './RoomEditOptions';

function RoomEditModal({roomId, locationId, onClose, afterCreation}) {
  const [globalAttributes, setGlobalAttributes] = useState([]);
  const [newRoomId, setNewRoomId] = useState(null);
  const [wasEverUpdated, setWasEverUpdated] = useState(null);

  const [roomDetails, setRoomDetails] = useState({
    aclEntries: [],
    availableEquipment: [],
    notificationEmails: [],
    notificationsEnabled: true,
    endNotificationsEnabled: true,
    isReservable: true,
    owner: null,
    reservationsNeedConfirmation: false,
    capacity: null,
    longitude: null,
    latitude: null,
    protectionMode: 'public',
  });
  const [roomAttributes, setRoomAttributes] = useState([]);
  const [roomAvailability, setRoomAvailability] = useState({
    bookableHours: [],
    nonbookablePeriods: [],
  });

  const isNewRoom = useCallback(() => roomId === undefined, [roomId]);

  const fetch = useCallback(async (url, params = {}) => {
    let response;
    try {
      response = await indicoAxios.get(url(params));
    } catch (error) {
      handleAxiosError(error);
      return;
    }
    return camelizeKeys(response.data);
  }, []);

  const fetchRoomData = useCallback(async () => {
    const resp = await Promise.all([
      fetch(roomURL, {room_id: roomId}),
      fetch(fetchRoomAttributesURL, {room_id: roomId}),
      fetch(fetchRoomAvailabilityURL, {room_id: roomId}),
    ]);
    [setRoomDetails, setRoomAttributes, setRoomAvailability].forEach((x, i) => x(resp[i]));
  }, [fetch, roomId]);

  const handleSubmit = async (data, form) => {
    const changedValues = getChangedValues(data, form);
    const {
      attributes,
      bookableHours,
      nonbookablePeriods,
      availableEquipment,
      ...basicDetails
    } = changedValues;
    try {
      if (isNewRoom()) {
        const payload = snakifyKeys(basicDetails);
        payload.location_id = locationId;
        const response = await indicoAxios.post(roomsURL(), payload);
        setNewRoomId(response.data.id);
      } else if (!_.isEmpty(basicDetails)) {
        await indicoAxios.patch(roomURL({room_id: roomId}), snakifyKeys(basicDetails));
      }
      if (availableEquipment) {
        await indicoAxios.post(
          updateRoomEquipmentURL({room_id: roomId}),
          snakifyKeys({available_equipment: availableEquipment})
        );
      }
      if (attributes) {
        await indicoAxios.post(updateRoomAttributesURL({room_id: roomId}), {attributes});
      }
      if (bookableHours || nonbookablePeriods) {
        const availability = {bookableHours, nonbookablePeriods};
        await indicoAxios.post(
          updateRoomAvailabilityURL({room_id: roomId}),
          snakifyKeys(availability)
        );
      }
      // reload room so the form gets new initialValues
      if (!isNewRoom()) {
        setWasEverUpdated(true);
        fetchRoomData();
      }
    } catch (e) {
      return camelizeKeys(handleSubmitError(e));
    }
  };

  const closeModal = () => {
    onClose(wasEverUpdated || afterCreation);
  };

  useEffect(() => {
    (async () => setGlobalAttributes(await fetch(fetchAttributesURL)))();
  }, [fetch]);

  useEffect(() => {
    if (!isNewRoom()) {
      fetchRoomData();
    }
  }, [isNewRoom, fetchRoomData]);

  const tabPanes = useMemo(
    () => [
      {
        menuItem: 'Basic Details',
        pane: {key: 'basic-details', content: <RoomEditDetails />},
      },
      {
        menuItem: 'Location',
        pane: {key: 'location', content: <RoomEditLocation />},
      },
      {
        menuItem: 'Permissions',
        pane: {key: 'permissions', content: <RoomEditPermissions />},
      },
      {
        key: 'notifications',
        menuItem: 'Notifications',
        pane: {
          key: 'notifications',
          content: <RoomEditNotifications />,
        },
      },
      {
        key: 'options',
        menuItem: 'Options',
        pane: {
          key: 'options',
          content: <RoomEditOptions showEquipment globalAttributes={globalAttributes} />,
        },
      },
    ],
    [globalAttributes]
  );

  const renderModal = formProps => {
    const {
      handleSubmit: handleFormSubmit,
      hasValidationErrors,
      pristine,
      submitting,
      dirty,
    } = formProps;
    return (
      <Modal open onClose={closeModal} size="large" centered={false} closeIcon>
        <Modal.Header>
          {isNewRoom() ? <Translate>Add Room</Translate> : <Translate>Edit Room Details</Translate>}
        </Modal.Header>
        <Modal.Content>
          <Message styleName="submit-message" positive hidden={!afterCreation || wasEverUpdated}>
            <Translate>Room has been successfully created.</Translate>
          </Message>
          <FormSpy subscription={{submitSucceeded: true}}>
            {({submitSucceeded}) => {
              return (
                <Message styleName="submit-message" positive hidden={!submitSucceeded || dirty}>
                  <Translate>Room has been successfully updated.</Translate>
                </Message>
              );
            }}
          </FormSpy>
          <FormSpy subscription={{submitFailed: true}}>
            {({submitFailed}) => {
              return (
                <Message styleName="submit-message" negative hidden={!submitFailed || dirty}>
                  <p>
                    <Translate>Room could not be updated.</Translate>
                  </p>
                  <Button
                    type="button"
                    icon="undo"
                    size="mini"
                    color="red"
                    content={Translate.string('Reset form')}
                    onClick={() => formProps.form.reset()}
                  />
                </Message>
              );
            }}
          </FormSpy>
          <Grid columns="equal">
            {!isNewRoom() && (
              <Grid.Column width={4}>
                <RoomPhoto roomId={roomId} hasPhoto={roomDetails.hasPhoto} />
              </Grid.Column>
            )}
            <Grid.Column>
              <Form id="room-form" onSubmit={handleFormSubmit}>
                <Tab renderActiveOnly={false} panes={tabPanes} />
              </Form>
            </Grid.Column>
          </Grid>
        </Modal.Content>
        <Modal.Actions>
          <FormSpy subscription={{submitSucceeded: true}}>
            {({submitSucceeded}) => (
              <Button onClick={onClose}>
                {submitSucceeded ? <Translate>Close</Translate> : <Translate>Cancel</Translate>}
              </Button>
            )}
          </FormSpy>
          <Button
            type="submit"
            form="room-form"
            disabled={pristine || submitting || hasValidationErrors}
            loading={submitting}
            primary
          >
            <Translate>Save</Translate>
          </Button>
        </Modal.Actions>
      </Modal>
    );
  };

  const renderForm = () => {
    const {bookableHours, nonbookablePeriods} = roomAvailability || {};

    if (newRoomId) {
      return <RoomEditModal roomId={newRoomId} onClose={onClose} afterCreation />;
    }

    return (
      <FinalForm
        onSubmit={handleSubmit}
        initialValues={{
          ...roomDetails,
          attributes: roomAttributes,
          bookableHours,
          nonbookablePeriods,
        }}
        initialValuesEqual={_.isEqual}
        render={renderModal}
        subscription={{
          submitting: true,
          hasValidationErrors: true,
          pristine: true,
          dirty: true,
        }}
        mutators={{...arrayMutators}}
      />
    );
  };

  return renderForm();
}

RoomEditModal.propTypes = {
  roomId: PropTypes.number,
};

export default RoomEditModal;
