import React from 'react';
import { StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

import { Input } from 'galio-framework';

import Icon from './Icon';
import { argonTheme } from '../constants';

const ArInput = ({ shadowless, success, error, ...props }) => {
  const inputStyles = [
    styles.input,
    !shadowless && styles.shadow,
    success && styles.success,
    error && styles.error,
    { ...props.style },
  ];

  return (
    <Input
      // placeholder="write something here"
      placeholderTextColor={argonTheme.COLORS.MUTED}
      style={inputStyles}
      color={argonTheme.COLORS.HEADER}
      // iconContent={<Icon size={14} color={argonTheme.COLORS.ICON} name="link" family="AntDesign" />}
      // right
      // label="abc"
      {...props}
    />
  );
};

ArInput.defaultProps = {
  shadowless: false,
  success: false,
  error: false,
};

ArInput.propTypes = {
  shadowless: PropTypes.bool,
  success: PropTypes.bool,
  error: PropTypes.bool,
};

const styles = StyleSheet.create({
  input: {
    // borderRadius: 4,
    borderColor: argonTheme.COLORS.BORDER,
    height: 44,
    backgroundColor: '#FFFFFF',
  },
  success: {
    borderColor: argonTheme.COLORS.INPUT_SUCCESS,
  },
  error: {
    borderColor: argonTheme.COLORS.ERROR,
  },
  shadow: {
    shadowColor: argonTheme.COLORS.BLACK,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    shadowOpacity: 0.05,
    elevation: 2,
  },
});

export default ArInput;
