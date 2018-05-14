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

import PropTypes from 'prop-types';
import React from 'react';
import {Grid, Icon, Message} from 'semantic-ui-react';

import {Slot} from 'indico/react/util';
import RoomBookingMap from '../RoomBookingMap';
import RoomSearchPane from '../RoomSearchPane';
import BookingFilterBar from '../BookingFilterBar';
import filterBarFactory from '../../containers/FilterBar';
import searchBoxFactory from '../../containers/SearchBar';
import {getAspectBounds, getMapBounds} from '../../util';
import Room from '../Room';


const FilterBar = filterBarFactory('bookRoom', BookingFilterBar);
const SearchBar = searchBoxFactory('bookRoom');


export default class BookRoom extends React.Component {
    static propTypes = {
        map: PropTypes.shape({
            bounds: PropTypes.array,
            search: PropTypes.bool.isRequired,
            aspects: PropTypes.array
        }).isRequired,
        fetchMapDefaultAspects: PropTypes.func.isRequired,
        updateLocation: PropTypes.func.isRequired,
        toggleMapSearch: PropTypes.func.isRequired,
        rooms: PropTypes.shape({
            list: PropTypes.array,
            isFetching: PropTypes.bool,
        }).isRequired,
        fetchRooms: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            aspectBounds: props.map.bounds || null
        };
        this.map = React.createRef();
        if (!props.map.bounds) {
            const {fetchMapDefaultAspects} = props;
            const callback = () => {
                const {map: {bounds}} = this.props;
                this.setState({aspectBounds: bounds}, this.updateToMapBounds);
            };
            fetchMapDefaultAspects(callback);
        }
    }

    componentDidMount() {
        const {fetchRooms} = this.props;
        fetchRooms();
    }

    onMove(e) {
        const {updateLocation} = this.props;
        updateLocation(getMapBounds(e.target));
    }

    onChangeAspect(aspectIdx) {
        const {map: {aspects}} = this.props;
        this.setState({aspectBounds: getAspectBounds(aspects[aspectIdx])}, this.updateToMapBounds);
    }

    updateToMapBounds() {
        const {updateLocation} = this.props;
        const map = this.map.current.leafletElement;
        updateLocation(getMapBounds(map));
    }

    renderRoom = (room) => {
        return (
            <Room key={room.id} room={room}>
                <Slot>
                    <Grid centered columns={3} style={{margin: 0, height: '100%', opacity: 0.9}}>
                        <Grid.Column verticalAlign="middle" width={14}>
                            <Message size="mini" warning compact>
                                <Message.Header>
                                    <Icon name="clock" /> 25 minutes later
                                </Message.Header>
                            </Message>
                        </Grid.Column>
                    </Grid>
                </Slot>
            </Room>
        );
    };

    render() {
        const {toggleMapSearch, map: {search, aspects}, rooms, fetchRooms} = this.props;
        const {aspectBounds} = this.state;
        const roomMarkers = rooms.list.map((room) => (
            {id: room.id, lat: parseFloat(room.latitude), lng: parseFloat(room.longitude)}
        ));
        return (
            <Grid columns={2}>
                <Grid.Column width={11}>
                    <RoomSearchPane rooms={rooms}
                                    fetchRooms={fetchRooms}
                                    filterBar={<FilterBar />}
                                    searchBar={<SearchBar onConfirm={fetchRooms} onTextChange={fetchRooms} />}
                                    renderRoom={this.renderRoom} />
                </Grid.Column>
                <Grid.Column width={5}>
                    {aspectBounds && (
                        <RoomBookingMap mapRef={this.map} bounds={aspectBounds} onMove={(e) => this.onMove(e)}
                                        searchCheckbox isSearchEnabled={search}
                                        onToggleSearchCheckbox={(e, data) => toggleMapSearch(data.checked)}
                                        aspects={aspects}
                                        onChangeAspect={(e, data) => this.onChangeAspect(data.value)}
                                        rooms={roomMarkers} />
                    )}
                </Grid.Column>
            </Grid>
        );
    }
}
