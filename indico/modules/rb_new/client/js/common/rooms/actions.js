/* This file is part of Indico.
 * Copyright (C) 2002 - 2018 European Organization for Nuclear Research (CERN).
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

import fetchRoomsURL from 'indico-url:rooms_new.rooms';
import fetchRoomAvailabilityURL from 'indico-url:rooms_new.room_availability';
import fetchRoomAttributesURL from 'indico-url:rooms_new.room_attributes';
import {indicoAxios} from 'indico/utils/axios';
import {ajaxAction} from 'indico/utils/redux';


export const ROOMS_RECEIVED = 'rooms/ROOMS_RECEIVED';
export const FETCH_ROOMS_REQUEST = 'rooms/FETCH_ROOMS_REQUEST';
export const FETCH_ROOMS_SUCCESS = 'rooms/FETCH_ROOMS_SUCCESS';
export const FETCH_ROOMS_ERROR = 'rooms/FETCH_ROOMS_ERROR';

export const AVAILABILITY_RECEIVED = 'rooms/AVAILABILITY_RECEIVED';
export const FETCH_AVAILABILITY_REQUEST = 'rooms/FETCH_AVAILABILITY_REQUEST';
export const FETCH_AVAILABILITY_SUCCESS = 'rooms/FETCH_AVAILABILITY_SUCCESS';
export const FETCH_AVAILABILITY_ERROR = 'rooms/FETCH_AVAILABILITY_ERROR';

export const ATTRIBUTES_RECEIVED = 'rooms/ATTRIBUTES_RECEIVED';
export const FETCH_ATTRIBUTES_REQUEST = 'rooms/FETCH_ATTRIBUTES_REQUEST';
export const FETCH_ATTRIBUTES_SUCCESS = 'rooms/FETCH_ATTRIBUTES_SUCCESS';
export const FETCH_ATTRIBUTES_ERROR = 'rooms/FETCH_ATTRIBUTES_ERROR';


export function fetchRooms() {
    return ajaxAction(
        () => indicoAxios.get(fetchRoomsURL()),
        FETCH_ROOMS_REQUEST,
        [ROOMS_RECEIVED, FETCH_ROOMS_SUCCESS],
        FETCH_ROOMS_ERROR
    );
}

export function fetchDetails(id) {
    return async (dispatch) => {
        dispatch(fetchAvailability(id));
        dispatch(fetchAttributes(id));
    };
}

export function fetchAvailability(id) {
    return async (dispatch, getStore) => {
        const {rooms: {availability: rooms}} = getStore();
        if (id in rooms) {
            return;
        }
        return await ajaxAction(
            () => indicoAxios.get(fetchRoomAvailabilityURL({room_id: id})),
            FETCH_AVAILABILITY_REQUEST,
            [AVAILABILITY_RECEIVED, FETCH_AVAILABILITY_SUCCESS],
            FETCH_AVAILABILITY_ERROR,
            data => ({id, availability: data}),
        )(dispatch);
    };
}

export function fetchAttributes(id) {
    return async (dispatch, getStore) => {
        const {rooms: {attributes: rooms}} = getStore();
        if (id in rooms) {
            return;
        }
        return await ajaxAction(
            () => indicoAxios.get(fetchRoomAttributesURL({room_id: id})),
            FETCH_ATTRIBUTES_REQUEST,
            [ATTRIBUTES_RECEIVED, FETCH_ATTRIBUTES_SUCCESS],
            FETCH_ATTRIBUTES_ERROR,
            data => ({id, attributes: data}),
        )(dispatch);
    };
}
