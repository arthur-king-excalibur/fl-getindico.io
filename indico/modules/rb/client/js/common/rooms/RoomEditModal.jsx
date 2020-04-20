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
import {
  Button,
  Dimmer,
  Form,
  Grid,
  Label,
  Loader,
  Menu,
  Message,
  Modal,
  Tab,
} from 'semantic-ui-react';
import React, {useEffect, useState, useCallback, useMemo} from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import arrayMutators from 'final-form-arrays';
import {useDispatch} from 'react-redux';
import {snakifyKeys} from 'indico/utils/case';
import {Translate} from 'indico/react/i18n';
import {indicoAxios, handleAxiosError} from 'indico/utils/axios';

import './RoomEditModal.module.scss';
import {getChangedValues, handleSubmitError, parsers as p} from 'indico/react/forms';
import {useFavoriteUsers} from 'indico/react/hooks';
import {usePermissionInfo} from 'indico/react/components/principals/hooks';
import RoomPhoto from './RoomPhoto';
import RoomEditDetails from './edit/RoomEditDetails';
import RoomEditNotifications from './edit/RoomEditNotifications';
import RoomEditLocation from './edit/RoomEditLocation';
import RoomEditPermissions from './edit/RoomEditPermissions';
import RoomEditOptions from './edit/RoomEditOptions';
import {actions as roomsActions} from '../../common/rooms';
import {actions as userActions} from '../../common/user';

function RoomEditModal({roomId, locationId, onClose, afterCreation}) {
  const favoriteUsersController = useFavoriteUsers();
  const [permissionManager, permissionInfo] = usePermissionInfo();
  const dispatch = useDispatch();

  const [globalAttributes, setGlobalAttributes] = useState([]);
  const [newRoomId, setNewRoomId] = useState(null);
  const [wasEverUpdated, setWasEverUpdated] = useState(null);
  const [tabsWithError, setTabsWithError] = useState([]);
  const [loading, setLoading] = useState(false);

  const [roomDetails, setRoomDetails] = useState({
    acl_entries: [],
    available_equipment: [],
    notification_emails: [],
    notifications_enabled: true,
    end_notifications_enabled: true,
    is_reservable: true,
    owner: null,
    reservations_need_confirmation: false,
    capacity: null,
    longitude: null,
    latitude: null,
    protection_mode: 'public',
  });
  const [roomAttributes, setRoomAttributes] = useState([]);
  const [roomAvailability, setRoomAvailability] = useState({
    bookable_hours: [],
    nonbookable_periods: [],
  });

  const isNewRoom = useCallback(() => roomId === undefined, [roomId]);

  const fetch = useCallback(async url => {
    let response;
    try {
      response = await indicoAxios.get(url);
    } catch (error) {
      handleAxiosError(error);
      return;
    }
    return response.data;
  }, []);

  const fetchRoomData = useCallback(async () => {
    const resp = await Promise.all([
      fetch(roomURL({room_id: roomId})),
      fetch(fetchRoomAttributesURL({room_id: roomId})),
      fetch(fetchRoomAvailabilityURL({room_id: roomId})),
    ]);
    [setRoomDetails, setRoomAttributes, setRoomAvailability].forEach((x, i) => x(resp[i]));
  }, [fetch, roomId]);

  const tabPanes = useMemo(
    () =>
      [
        {
          key: 'basic-details',
          menuItem: <Translate>Basic Details</Translate>,
          pane: (
            <RoomEditDetails
              key="basic-details"
              favoriteUsersController={favoriteUsersController}
            />
          ),
          fields: ['owner', 'key_location', 'telephone', 'capacity', 'division', 'comments'],
        },
        {
          key: 'location',
          menuItem: <Translate>Location</Translate>,
          pane: <RoomEditLocation key="location" />,
          fields: [
            'verbose_name',
            'site',
            'building',
            'floor',
            'number',
            'surface_area',
            'latitude',
            'longitude',
            'max_advance_days',
            'booking_limit_days',
          ],
        },
        {
          key: 'permissions',
          menuItem: <Translate>Permissions</Translate>,
          pane: (
            <RoomEditPermissions
              key="permissions"
              permissionManager={permissionManager}
              permissionInfo={permissionInfo}
            />
          ),
          fields: ['protection_mode', 'acl_entries'],
        },
        {
          key: 'notifications',
          menuItem: <Translate>Notifications</Translate>,
          pane: <RoomEditNotifications key="notifications" />,
          fields: [
            'notification_emails',
            'notification_before_days',
            'notification_before_days_weekly',
            'notification_before_days_monthly',
            'end_notification_daily',
            'end_notification_weekly',
            'end_notification_monthly',
          ],
        },
        {
          key: 'options',
          menuItem: <Translate>Options</Translate>,
          pane: <RoomEditOptions key="options" showEquipment globalAttributes={globalAttributes} />,
          fields: [
            'bookable_hours',
            'nonbookable_periods',
            'available_equipment',
            'attributes',
            'is_reservable',
            'reservations_need_confirmation',
            'notifications_enabled',
            'end_notifications_enabled',
          ],
        },
      ].map(x => ({
        ...x,
        menuItem: (
          <Menu.Item key={x.key}>
            {x.menuItem} {tabsWithError.includes(x.key) ? <Label color="red">Error</Label> : null}
          </Menu.Item>
        ),
      })),
    [favoriteUsersController, globalAttributes, permissionInfo, permissionManager, tabsWithError]
  );

  const handleSubmit = async (data, form) => {
    const changedValues = getChangedValues(data, form);
    const {
      attributes,
      bookable_hours: bookableHours,
      nonbookable_periods: nonbookablePeriods,
      available_equipment: availableEquipment,
      ...basicDetails
    } = changedValues;
    try {
      if (isNewRoom()) {
        const payload = {...basicDetails};
        payload.location_id = locationId;
        const response = await indicoAxios.post(roomsURL(), payload);
        setNewRoomId(response.data.id);
      } else if (!_.isEmpty(basicDetails)) {
        await indicoAxios.patch(roomURL({room_id: roomId}), basicDetails);
      }
      if (availableEquipment) {
        await indicoAxios.post(updateRoomEquipmentURL({room_id: roomId}), {
          available_equipment: availableEquipment,
        });
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
      const submitErrors = handleSubmitError(e);
      setTabsWithError(
        Object.keys(submitErrors).map(err => {
          const pane = tabPanes.find(t => t.fields && t.fields.includes(err));
          return pane && pane.key;
        })
      );
      return submitErrors;
    }
  };

  const closeModal = async () => {
    setLoading(true);
    if ((roomId || newRoomId) !== null && wasEverUpdated) {
      await Promise.all([
        dispatch(roomsActions.fetchRoom(roomId)),
        dispatch(roomsActions.fetchEquipmentTypes()),
        dispatch(userActions.fetchRoomPermissions(roomId)),
        dispatch(roomsActions.fetchDetails(roomId, true)),
      ]);
    }

    onClose(wasEverUpdated || afterCreation);
  };

  useEffect(() => {
    (async () => setGlobalAttributes(await fetch(fetchAttributesURL())))();
  }, [fetch]);

  useEffect(() => {
    (async () => {
      if (!isNewRoom()) {
        setLoading(true);
        await fetchRoomData();
        setLoading(false);
      }
    })();
  }, [isNewRoom, fetchRoomData]);

  const renderModal = formProps => {
    const {
      handleSubmit: handleFormSubmit,
      hasValidationErrors,
      pristine,
      submitting,
      dirty,
    } = formProps;
    if (loading) {
      return (
        <Dimmer active page>
          <Loader />
        </Dimmer>
      );
    }
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
    if (newRoomId) {
      return <RoomEditModal roomId={newRoomId} onClose={onClose} afterCreation />;
    }

    return (
      <FinalForm
        onSubmit={handleSubmit}
        initialValues={{
          ...roomDetails,
          ...roomAvailability,
          attributes: roomAttributes,
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
