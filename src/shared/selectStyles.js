import React from 'react';
import { components } from 'react-select';
import { getCssVariable } from './sharedUtils';

function getSelectStyles({ hasFocusStyle }) {
  return {
    control: (provided, state) => {
      const { isFocused } = state;
      const borderColor =
        hasFocusStyle && isFocused
          ? getCssVariable('--primary-70')
          : getCssVariable('--grey-30');

      return {
        ...provided,
        borderColor,
        borderWidth: hasFocusStyle && isFocused ? 2 : 1,
        boxShadow: 'none',
        padding:
          hasFocusStyle && isFocused
            ? '11px 6px 11px 13px'
            : '12px 7px 12px 14px',
        '&:hover': {
          ...provided['&:hover'],
          borderColor,
        },
      };
    },
    valueContainer: (provided, state) => {
      return {
        ...provided,
        padding: 0,
        height: 24,
        lineHeight: '24px',
      };
    },
    placeholder: (provided, state) => {
      return {
        ...provided,
        margin: 0,
      };
    },
    option: (provided, state) => {
      const { isFocused } = state;

      return {
        ...provided,
        padding: '15px 12px',
        color: getCssVariable('--grey-100'),
        backgroundColor: isFocused
          ? getCssVariable('--grey-20')
          : 'transparent',
        ':active': {
          ...provided[':active'],
          backgroundColor: getCssVariable('--grey-20'),
        },
      };
    },
    menu: (provided, state) => {
      return {
        ...provided,
        backgroundColor: '#fff',
        boxShadow: getCssVariable('--box-shadow-5'),
      };
    },
    menuList: (provided, state) => {
      return {
        ...provided,
        padding: '8px 0',
      };
    },
    singleValue: (provided, state) => {
      return {
        ...provided,
        marginLeft: 0,
        marginRight: 0,
        maxWidth: 'none',
        left: 0,
        right: 0,
      };
    },
    dropdownIndicator: (provided, state) => {
      return {
        ...provided,
        padding: 0,
      };
    },
  };
}

function DropdownIndicator(props) {
  const { selectProps } = props;
  const { menuIsOpen } = selectProps;

  return (
    <components.DropdownIndicator {...props}>
      {menuIsOpen ? (
        <svg width="24" height="24" viewBox="0 0 24 24">
          <path
            fill={getCssVariable('--grey-50')}
            fillRule="evenodd"
            d="M8.7 13.7a1 1 0 1 1-1.4-1.4l4-4a1 1 0 0 1 1.4 0l4 4a1 1 0 0 1-1.4 1.4L12 10.42l-3.3 3.3z"
          />
        </svg>
      ) : (
        <svg width="24" height="24" viewBox="0 0 24 24">
          <path
            fill={getCssVariable('--grey-50')}
            fillRule="evenodd"
            d="M15.3 10.3a1 1 0 0 1 1.4 1.4l-4 4a1 1 0 0 1-1.4 0l-4-4a1 1 0 0 1 1.4-1.4l3.3 3.29 3.3-3.3z"
          />
        </svg>
      )}
    </components.DropdownIndicator>
  );
}

export { getSelectStyles, DropdownIndicator };
