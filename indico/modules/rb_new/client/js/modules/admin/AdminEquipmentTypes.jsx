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

import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Form as FinalForm, Field} from 'react-final-form';
import {Button, Confirm, Header, Icon, List, Placeholder, Popup, Form} from 'semantic-ui-react';
import {ReduxFormField, ReduxDropdownField, formatters} from 'indico/react/forms';
import {Param, Plural, PluralTranslate, Singular, Translate} from 'indico/react/i18n';
import * as adminActions from './actions';
import * as adminSelectors from './selectors';

import './AdminEquipmentTypes.module.scss';


class EquipmentType extends React.PureComponent {
    static propTypes = {
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        features: PropTypes.array.isRequired,
        availableFeatures: PropTypes.array.isRequired,
        numRooms: PropTypes.number.isRequired,
        deleteEquipmentType: PropTypes.func.isRequired,
        updateEquipmentType: PropTypes.func.isRequired,
    };

    state = {
        // delete
        confirming: false,
        deleting: false,
        // edit
        editing: false,
        saving: false,
    };

    handleDeleteClick = () => {
        this.setState({confirming: true, editing: false});
    };

    cancelDelete = () => {
        this.setState({confirming: false});
    };

    confirmDelete = () => {
        const {id, deleteEquipmentType} = this.props;
        this.setState({deleting: true, confirming: false});
        deleteEquipmentType(id);
    };

    handleEditClick = () => {
        const {editing} = this.state;
        this.setState({editing: !editing});
    };

    handleSubmit = async (data) => {
        const {id, updateEquipmentType} = this.props;
        this.setState({saving: true});
        const rv = await updateEquipmentType(id, data);
        if (rv.error) {
            this.setState({saving: false});
            return rv.error;
        }
        this.setState({saving: false, editing: false});
    };

    render() {
        const {confirming, editing, deleting, saving} = this.state;
        const {name, numRooms, features, availableFeatures} = this.props;

        const confirmDeleteMessage = (
            <>
                <Translate>
                    Are you sure you want to delete the equipment type
                    {' '}
                    <Param name="name" wrapper={<strong />} value={name} />?
                </Translate>
                {numRooms > 0 && (
                    <>
                        <br />
                        <PluralTranslate count={numRooms}>
                            <Singular>
                                It is currently used by <Param name="count" wrapper={<strong />}>one</Param> room.
                            </Singular>
                            <Plural>
                                It is currently used by
                                {' '}
                                <Param name="count" wrapper={<strong />} value={numRooms} /> rooms.
                            </Plural>
                        </PluralTranslate>
                    </>
                )}
            </>
        );

        const featureOptions = availableFeatures.map(feat => ({
            key: feat.name,
            value: feat.name,
            text: feat.title,
            icon: feat.icon,
        }));

        return (
            <List.Item>
                <div styleName="item">
                    {editing ? (
                        <FinalForm onSubmit={this.handleSubmit}
                                   initialValues={{name, features: features.map(x => x.name)}}
                                   initialValuesEqual={_.isEqual}
                                   subscription={{submitting: true, hasValidationErrors: true, pristine: true}}>
                            {(fprops) => (
                                <Form onSubmit={fprops.handleSubmit}>
                                    <Form.Group widths="equal">
                                        <Field name="name" component={ReduxFormField} as="input"
                                               format={formatters.trim} formatOnBlur
                                               placeholder={Translate.string('Name')}
                                               disabled={fprops.submitting} />
                                        <Field name="features" component={ReduxDropdownField}
                                               multiple selection options={featureOptions}
                                               placeholder={Translate.string('Features')}
                                               disabled={fprops.submitting} />
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Button type="submit"
                                                     disabled={(
                                                         fprops.hasValidationErrors ||
                                                         fprops.pristine ||
                                                         fprops.submitting
                                                     )}
                                                     loading={fprops.submitting} primary
                                                     content={Translate.string('Save')} />
                                    </Form.Group>
                                </Form>
                            )}
                        </FinalForm>
                    ) : (
                        <>
                            <List.Content styleName="info">
                                <List.Header>
                                    {name}
                                </List.Header>
                                <List.Description>
                                    {!numRooms ? (
                                        <Translate>Currently unused</Translate>
                                    ) : (
                                        <PluralTranslate count={numRooms}>
                                            <Singular>
                                                Available in <Param name="count" wrapper={<strong />}>one</Param> room
                                            </Singular>
                                            <Plural>
                                                Available in
                                                {' '}
                                                <Param name="count" wrapper={<strong />} value={numRooms} />
                                                {' '}
                                                rooms
                                            </Plural>
                                        </PluralTranslate>
                                    )}
                                </List.Description>
                            </List.Content>
                            <List.Content>
                                {features.map(feat => (
                                    <Popup key={feat.name}
                                           trigger={<Icon name={feat.icon || 'cog'} color="blue" circular
                                                          styleName="feature" />}>
                                        <Translate>
                                            This equipment type provides the
                                            {' '}
                                            <Param name="name" wrapper={<strong />} value={feat.title} /> feature.
                                        </Translate>
                                    </Popup>
                                ))}
                            </List.Content>
                        </>
                    )}
                    <List.Content>
                        <Button icon="pencil" size="mini" circular onClick={this.handleEditClick}
                                disabled={saving || deleting} primary={editing} />
                        <Button icon="trash" size="mini" circular negative onClick={this.handleDeleteClick}
                                loading={deleting} disabled={saving || deleting} />
                        <Confirm header={Translate.string('Confirm deletion')}
                                 content={{content: confirmDeleteMessage}}
                                 confirmButton={<Button content={Translate.string('Delete')} negative />}
                                 cancelButton={Translate.string('Cancel')}
                                 open={confirming}
                                 onCancel={this.cancelDelete}
                                 onConfirm={this.confirmDelete} />
                    </List.Content>
                </div>
            </List.Item>
        );
    }
}


class AdminEquipmentTypes extends React.PureComponent {
    static propTypes = {
        isFetching: PropTypes.bool.isRequired,
        features: PropTypes.array.isRequired,
        equipmentTypes: PropTypes.array.isRequired,
        actions: PropTypes.exact({
            fetchEquipmentTypes: PropTypes.func.isRequired,
            deleteEquipmentType: PropTypes.func.isRequired,
            updateEquipmentType: PropTypes.func.isRequired,
            fetchFeatures: PropTypes.func.isRequired,
        }).isRequired,
    };

    componentDidMount() {
        const {actions: {fetchEquipmentTypes, fetchFeatures}} = this.props;
        fetchEquipmentTypes();
        fetchFeatures();
    }

    render() {
        const {
            isFetching, equipmentTypes, features,
            actions: {deleteEquipmentType, updateEquipmentType}
        } = this.props;

        return (
            <>
                <Header as="h2">
                    <Translate>Equipment types</Translate>
                </Header>
                {isFetching ? (
                    <Placeholder fluid>
                        {_.range(20).map(i => (
                            <Placeholder.Line key={i} length="full" />
                        ))}
                    </Placeholder>
                ) : (
                    <List divided relaxed>
                        {equipmentTypes.map(eq => (
                            <EquipmentType key={eq.id}
                                           {...eq}
                                           availableFeatures={features}
                                           deleteEquipmentType={deleteEquipmentType}
                                           updateEquipmentType={updateEquipmentType} />
                        ))}
                    </List>
                )}
            </>
        );
    }
}

export default connect(
    state => ({
        isFetching: adminSelectors.isFetchingFeaturesOrEquipmentTypes(state),
        equipmentTypes: adminSelectors.getEquipmentTypes(state),
        features: adminSelectors.getFeatures(state),
    }),
    dispatch => ({
        actions: bindActionCreators({
            fetchEquipmentTypes: adminActions.fetchEquipmentTypes,
            deleteEquipmentType: adminActions.deleteEquipmentType,
            updateEquipmentType: adminActions.updateEquipmentType,
            fetchFeatures: adminActions.fetchFeatures,
        }, dispatch),
    })
)(AdminEquipmentTypes);
