// This file is part of Indico.
// Copyright (C) 2002 - 2019 CERN
//
// Indico is free software; you can redistribute it and/or
// modify it under the terms of the MIT License; see the
// LICENSE file for more details.

import React from 'react';
import PropTypes from 'prop-types';
import {Checkbox, Dropdown, Form, Popup, Radio, TextArea} from 'semantic-ui-react';
import {Field, FormSpy} from 'react-final-form';
import formatters from './formatters';
import parsers from './parsers';
import validators from './validators';

import './ReduxFormField.module.scss';


export function ReduxFormField(
    {
        input, label, placeholder, required, children, disabled, componentLabel, defaultValue, fieldProps,
        hideValidationError, hideErrorWhileActive,
        meta: {touched, error, submitError, submitting, dirty, dirtySinceLastSubmit, active},
        as: Component,
        ...props
    }
) {
    // we show errors if:
    // - the field was touched (focused+unfocused)
    //   ...and failed local validation
    //   ...and does not have the initial value
    // - there was an error during submission
    //   ...and the field has not been modified since the failed submission
    let errorMessage = null;
    if (touched && error && (dirty || required)) {
        if (!hideValidationError) {
            errorMessage = error;
        }
    } else if (submitError && !dirtySinceLastSubmit && !submitting) {
        errorMessage = submitError;
    }

    const showErrorPopup = !!errorMessage && (!hideErrorWhileActive || !active);

    const field = (
        <Form.Field required={required}
                    disabled={disabled || submitting}
                    error={!!errorMessage}
                    defaultValue={defaultValue}
                    {...fieldProps}>
            {label && <label>{label}</label>}
            <Component {...input}
                       {...props}
                       label={componentLabel}
                       placeholder={placeholder}
                       required={required}
                       disabled={disabled || submitting} />
            {children}
        </Form.Field>
    );

    return (
        <Popup trigger={field}
               position="left center"
               open={showErrorPopup}>
            <div styleName="field-error">
                {errorMessage}
            </div>
        </Popup>
    );
}

ReduxFormField.propTypes = {
    disabled: PropTypes.bool,
    input: PropTypes.object.isRequired,
    required: PropTypes.bool,
    hideValidationError: PropTypes.bool,
    hideErrorWhileActive: PropTypes.bool,
    label: PropTypes.string,
    componentLabel: PropTypes.oneOfType([PropTypes.string, PropTypes.exact({children: PropTypes.node})]),
    placeholder: PropTypes.string,
    meta: PropTypes.object.isRequired,
    as: PropTypes.elementType.isRequired,
    children: PropTypes.node,
    defaultValue: PropTypes.any,
    fieldProps: PropTypes.object,
};

ReduxFormField.defaultProps = {
    disabled: false,
    required: false,
    hideValidationError: false,
    hideErrorWhileActive: false,
    placeholder: null,
    label: null,
    componentLabel: null,
    children: null,
    defaultValue: null,
    fieldProps: {},
};


export function ReduxRadioField(props) {
    const {
        input,
        // eslint-disable-next-line react/prop-types
        type,  // unused, just don't pass it along with the ...rest
        ...rest
    } = props;
    return (
        <ReduxFormField input={input}
                        {...rest}
                        as={Radio}
                        onChange={(__, {checked, value}) => {
                            if (checked) {
                                input.onChange(value);
                            }
                        }} />
    );
}

ReduxRadioField.propTypes = {
    input: PropTypes.object.isRequired,
};


function ReduxCheckboxField(props) {
    const {
        input: {value, ...input},
        // eslint-disable-next-line react/prop-types
        type,  // unused, just don't pass it along with the ...rest
        ...rest
    } = props;
    return (
        <ReduxFormField input={input}
                        {...rest}
                        as={Checkbox}
                        onChange={(__, {checked}) => {
                            input.onChange(checked);
                        }} />
    );
}

ReduxCheckboxField.propTypes = {
    input: PropTypes.object.isRequired,
};


function ReduxDropdownField({input, required, clearable, onChange, ...props}) {
    return (
        <ReduxFormField input={input}
                        {...props}
                        required={required}
                        as={Dropdown}
                        clearable={clearable === undefined ? !required : clearable}
                        selectOnBlur={false}
                        onChange={(__, {value}) => {
                            input.onChange(value);
                            onChange(value);
                        }} />
    );
}


ReduxDropdownField.propTypes = {
    input: PropTypes.object.isRequired,
    required: PropTypes.bool,
    clearable: PropTypes.bool,
    onChange: PropTypes.func,
};

ReduxDropdownField.defaultProps = {
    required: false,
    clearable: undefined,
    onChange: () => {},
};


/**
 * A wrapper for final-form's Field component that handles the markup
 * around the field.
 */
export function FinalField({name, adapter, component, description, required, ...rest}) {
    const extraProps = {};

    if (description) {
        extraProps.children = (
            <p className="field-description">
                {description}
            </p>
        );
    }

    if (required) {
        extraProps.validate = validators.required;
        extraProps.required = true;
    }

    if (extraProps.validate && rest.validate) {
        extraProps.validate = validators.chain(extraProps.validate, rest.validate);
        delete rest.validate;
    }

    return (
        <Field name={name} component={adapter} as={component} {...extraProps} {...rest} />
    );
}

FinalField.propTypes = {
    name: PropTypes.string.isRequired,
    adapter: PropTypes.elementType,
    component: PropTypes.elementType,
    description: PropTypes.node,
    required: PropTypes.bool,
};

FinalField.defaultProps = {
    adapter: ReduxFormField,
    component: undefined,
    description: null,
    required: false,
};


/**
 * Like `FinalField` but with extra features for ``<input>`` fields.
 */
export function FinalInput({name, label, type, nullIfEmpty, noAutoComplete, ...rest}) {
    const extraProps = {};

    if (type === 'number') {
        extraProps.parse = parsers.number;
    } else if (type === 'text' || type === 'email') {
        extraProps.format = formatters.trim;
        extraProps.formatOnBlur = true;
        if (nullIfEmpty) {
            extraProps.parse = parsers.nullIfEmpty;
        }
    }

    if (noAutoComplete) {
        extraProps.autoComplete = 'off';
    }

    return (
        <FinalField name={name}
                    label={label}
                    component="input"
                    type={type}
                    {...extraProps}
                    {...rest} />
    );
}

FinalInput.propTypes = {
    name: PropTypes.string.isRequired,
    label: PropTypes.string,
    // XXX: just add new <input> types here as soon as you start using them,
    // but make sure to handle it properly above (like adding the trim formatter
    // for a field that lets users enter strings)
    type: PropTypes.oneOf(['text', 'email', 'number']),
    nullIfEmpty: PropTypes.bool,
    noAutoComplete: PropTypes.bool,
};

FinalInput.defaultProps = {
    label: null,
    type: 'text',
    nullIfEmpty: false,
    noAutoComplete: false,
};


/**
 * Like `FinalField` but with extra features for ``<textarea>`` fields.
 */
export function FinalTextArea({name, label, nullIfEmpty, ...rest}) {
    const extraProps = {};
    if (nullIfEmpty) {
        extraProps.parse = parsers.nullIfEmpty;
    }

    return (
        <FinalField name={name}
                    label={label}
                    component={TextArea}
                    format={formatters.trim}
                    formatOnBlur
                    {...extraProps}
                    {...rest} />
    );
}

FinalTextArea.propTypes = {
    name: PropTypes.string.isRequired,
    label: PropTypes.string,
    nullIfEmpty: PropTypes.bool,
};

FinalTextArea.defaultProps = {
    label: null,
    nullIfEmpty: false,
};


/**
 * Like `FinalField` but for a checkbox.
 */
export function FinalCheckbox({name, label, ...rest}) {
    return (
        <FinalField name={name} adapter={ReduxCheckboxField} type="checkbox" componentLabel={label} {...rest} />
    );
}

FinalCheckbox.propTypes = {
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
};


/**
 * Like `FinalField` but for a radio button.
 */
export function FinalRadio({name, label, ...rest}) {
    return (
        <FinalField name={name} adapter={ReduxRadioField} type="radio" componentLabel={label} {...rest} />
    );
}

FinalRadio.propTypes = {
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
};


/**
 * Like `FinalField` but for a checkbox.
 */
export function FinalDropdown({name, label, ...rest}) {
    return (
        <FinalField name={name} adapter={ReduxDropdownField} label={label} parse={null} {...rest} />
    );
}

FinalDropdown.propTypes = {
    name: PropTypes.string.isRequired,
    label: PropTypes.string,
};

FinalDropdown.defaultProps = {
    label: null,
};


/**
 * A submit button that will update according to the final-form state.
 */
export function FinalSubmitButton({label}) {
    return (
        <FormSpy subscription={{hasValidationErrors: true, pristine: true, submitting: true}}>
            {({hasValidationErrors, pristine, submitting}) => (
                <Form.Button type="submit"
                             disabled={(hasValidationErrors || pristine || submitting)}
                             loading={submitting}
                             primary
                             content={label} />
            )}
        </FormSpy>
    );
}

FinalSubmitButton.propTypes = {
    label: PropTypes.string.isRequired,
};
