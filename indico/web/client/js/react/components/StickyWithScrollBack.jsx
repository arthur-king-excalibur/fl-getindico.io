// This file is part of Indico.
// Copyright (C) 2002 - 2019 CERN
//
// Indico is free software; you can redistribute it and/or
// modify it under the terms of the MIT License; see the
// LICENSE file for more details.

import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {Sticky} from 'semantic-ui-react';

import {ScrollButton} from 'indico/react/components';
import {useResponsive} from 'indico/react/util';

import {useScrollUp} from '../hooks';

import './StickyWithScrollBack.module.scss';

export default function StickyWithScrollBack({children, context, responsive}) {
  const [scrollButtonVisible, setScrollButtonVisible] = useState(false);
  const isScrollingUp = useScrollUp(responsive);

  const {isPhone, isTablet, isLandscape} = useResponsive();
  const isResponsiveDevice = responsive && (isPhone || isTablet) && isLandscape;
  return (
    <Sticky
      context={context}
      styleName={`sticky-content ${isResponsiveDevice && !isScrollingUp ? 'hidden' : ''}`}
      onStick={() => setScrollButtonVisible(true)}
      onUnstick={() => setScrollButtonVisible(false)}
    >
      {children}
      <ScrollButton visible={scrollButtonVisible} />
    </Sticky>
  );
}

StickyWithScrollBack.propTypes = {
  children: PropTypes.node,
  context: PropTypes.object,
  responsive: PropTypes.bool,
};

StickyWithScrollBack.defaultProps = {
  children: null,
  context: null,
  responsive: false,
};
