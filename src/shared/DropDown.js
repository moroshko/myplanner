import React, { useState, useCallback } from 'react';
import AsyncSelect from 'react-select/lib/Async';
import { getSelectStyles, DropdownIndicator } from './selectStyles';

const selectStyles = getSelectStyles({ hasFocusStyle: false });
const selectComponents = {
  DropdownIndicator,
  IndicatorSeparator: null,
  LoadingIndicator: null,
};

function DropDown({ getOptionsPromise, value, onChange }) {
  const [options, setOptions] = useState();
  const selectedOption =
    options && options.find(option => option.value === value);
  const loadOptions = useCallback(() => {
    return getOptionsPromise().then(options => {
      setOptions(options);

      return options;
    });
  }, []);
  const onSelectedOptionChange = useCallback(
    selectedOption => {
      onChange(selectedOption.value);
    },
    [onChange]
  );

  return (
    <AsyncSelect
      isSearchable={false}
      defaultOptions={true}
      loadOptions={loadOptions}
      value={selectedOption}
      onChange={onSelectedOptionChange}
      components={selectComponents}
      styles={selectStyles}
    />
  );
}

export default DropDown;
