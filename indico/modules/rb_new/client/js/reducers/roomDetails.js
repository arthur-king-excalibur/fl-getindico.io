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

import * as actions from '../actions';


const initialState = {
    rooms: {},
    isFetching: false,
    currentViewID: null
};

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case actions.FETCH_ROOM_DETAILS_STARTED:
            return {...state, isFetching: true};
        case actions.FETCH_ROOM_DETAILS_FAILED:
            return {...state, isFetching: false};
        case actions.UPDATE_ROOM_DETAILS:
            return {...state, isFetching: false, rooms: {...state.rooms, [action.room.id]: action.room}};
        case actions.SET_ROOM_DETAILS_MODAL:
            return {...state, currentViewID: action.id};
        default:
            return state;
    }
}
