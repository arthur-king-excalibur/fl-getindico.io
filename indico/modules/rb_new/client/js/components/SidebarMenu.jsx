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

import React from 'react';
import PropTypes from 'prop-types';
import {Icon, Sidebar, Menu} from 'semantic-ui-react';
import {connect} from 'react-redux';
import {push as pushRoute} from 'connected-react-router';
import {Translate} from 'indico/react/i18n';

import {selectors as userSelectors} from '../common/user';
import {actions as blockingsActions} from '../modules/blockings';
import {actions as filtersActions} from '../common/filters';

import './SidebarMenu.module.scss';


export function SidebarTrigger({onClick, active}) {
    const icon = <Icon name="bars" size="large" />;
    // The icon can only be wrapped by the 'trigger' element if it's clickable,
    // otherwise the 'click outside' event would be caught both by the EventStack
    // in SUI's Sidebar component and the trigger's onClick handler (and silently
    // cancel itself)
    return (
        <div className={active ? 'active' : ''} styleName="sidebar-button">
            {active
                ? icon
                : <div onClick={onClick}>{icon}</div>
            }
        </div>
    );
}

SidebarTrigger.propTypes = {
    onClick: PropTypes.func.isRequired,
    active: PropTypes.bool.isRequired
};

function SidebarMenu({
    isAdmin, hasOwnedRooms, gotoMyBookings, gotoMyRoomsList, gotoMyBlockings, gotoRBAdminArea, visible, onClickOption
}) {
    const options = [
        {
            key: 'my_bookings',
            icon: 'list alternate outline',
            text: Translate.string('My Bookings'),
            onClick: gotoMyBookings,
        },
        {
            key: 'bookings_my_rooms',
            icon: 'checkmark',
            text: Translate.string('Bookings in My Rooms'),
            disabled: true,
            onlyIf: hasOwnedRooms
        },
        {
            key: 'my_rooms',
            icon: 'user',
            text: Translate.string('List of My Rooms'),
            onClick: gotoMyRoomsList,
            onlyIf: hasOwnedRooms
        },
        {
            key: 'my_blockings',
            icon: 'window close outline',
            text: Translate.string('My Blockings'),
            onClick: gotoMyBlockings,
        },
        {
            key: 'isAdmin',
            icon: 'cogs',
            text: Translate.string('Administration'),
            onClick: gotoRBAdminArea,
            onlyIf: isAdmin
        }
    ].filter(({onlyIf}) => onlyIf === undefined || onlyIf);

    return (
        <Sidebar as={Menu}
                 animation="overlay"
                 icon="labeled"
                 vertical
                 width="thin"
                 direction="right"
                 onHide={onClickOption}
                 inverted
                 visible={visible}
                 styleName="sidebar">
            {options.map(({key, text, icon, onClick}) => (
                <Menu.Item as="a" key={key} onClick={() => {
                    onClick();
                    if (onClickOption) {
                        onClickOption();
                    }
                }}>
                    <Icon name={icon} />
                    {text}
                </Menu.Item>
            ))}
        </Sidebar>
    );
}

SidebarMenu.propTypes = {
    isAdmin: PropTypes.bool.isRequired,
    hasOwnedRooms: PropTypes.bool.isRequired,
    gotoMyBookings: PropTypes.func.isRequired,
    gotoMyRoomsList: PropTypes.func.isRequired,
    gotoMyBlockings: PropTypes.func.isRequired,
    gotoRBAdminArea: PropTypes.func.isRequired,
    visible: PropTypes.bool,
    onClickOption: PropTypes.func
};

SidebarMenu.defaultProps = {
    visible: false,
    onClickOption: null
};


export default connect(
    state => ({
        isAdmin: userSelectors.isUserAdmin(state),
        hasOwnedRooms: userSelectors.hasOwnedRooms(state),
    }),
    dispatch => ({
        gotoMyBookings() {
            dispatch(filtersActions.setFilterParameter('calendar', 'myBookings', true));
            dispatch(pushRoute('/calendar?my_bookings=true'));
        },
        gotoMyRoomsList() {
            dispatch(filtersActions.setFilterParameter('roomList', 'onlyMine', true));
            dispatch(pushRoute('/rooms?mine=true'));
        },
        gotoMyBlockings() {
            dispatch(blockingsActions.setFilterParameter('myBlockings', true));
            dispatch(pushRoute('/blockings?myBlockings=true'));
        },
        gotoRBAdminArea() {
            dispatch(pushRoute('/admin'));
        },
    })
)(SidebarMenu);
