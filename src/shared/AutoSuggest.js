import React, { useState, useMemo, useCallback } from 'react';
import Autosuggest from 'react-autosuggest';
import TextInput from './TextInput';
import './AutoSuggest.css';

const theme = {
  container: 'AutoSuggestContainer',
  containerOpen: 'AutoSuggestContainerOpen',
  input: 'AutoSuggestInput',
  inputOpen: 'AutoSuggestInputOpen',
  inputFocused: 'AutoSuggestInputFocused',
  suggestionsContainer: 'AutoSuggestSuggestionsContainer',
  suggestionsContainerOpen: 'AutoSuggestSuggestionsContainerOpen',
  suggestionsList: 'AutoSuggestSuggestionsList',
  suggestion: 'AutoSuggestSuggestion',
  suggestionFirst: 'AutoSuggestSuggestionFirst',
  suggestionHighlighted: 'AutoSuggestSuggestionHighlighted',
};

function AutoSuggest({
  placeholder,
  noSuggestionsMessage,
  disabled,
  getSuggestions,
  renderSuggestion,
  onSuggestionSelected,
  onSuggestionsChange,
}) {
  const [value, setValue] = useState('');
  const [suggestions, setSuggestions] = useState(getSuggestions(value));
  const [isFocused, setIsFocused] = useState(false);
  const helperText =
    isFocused && value.trim() !== '' && suggestions.length === 0
      ? noSuggestionsMessage
      : null;
  const onSuggestionsFetchRequested = useCallback(
    ({ value }) => {
      const suggestions = getSuggestions(value);

      setSuggestions(suggestions);
      onSuggestionsChange(suggestions);
    },
    [getSuggestions]
  );
  const onSuggestionsClearRequested = useCallback(() => {
    setSuggestions([]);
    onSuggestionsChange([]);
  }, []);
  const getSuggestionValue = useCallback(suggestion => suggestion.name, []);
  const onChange = useCallback((_, { newValue }) => {
    setValue(newValue);
  }, []);
  const onAutosuggestSuggestionSelected = useCallback(
    (_, { suggestion }) => {
      setValue('');
      onSuggestionSelected(suggestion);
    },
    [onSuggestionSelected]
  );
  const onFocus = useCallback(() => {
    setIsFocused(true);
  }, []);
  const onBlur = useCallback(() => {
    setIsFocused(false);
  }, []);
  const inputProps = useMemo(
    () => ({
      placeholder: disabled ? 'Loading...' : placeholder,
      disabled,
      value,
      onChange,
      onFocus,
      onBlur,
    }),
    [placeholder, disabled, value, onChange, onFocus, onBlur]
  );
  const renderInputComponent = ({ ref, ...inputProps }) => {
    const { onChange, ...restInputProps } = inputProps;
    const textInputOnChange = newValue =>
      onChange({ target: { value: newValue } }); // Feels like a terrible hack, but it does the job!

    return (
      <TextInput
        icon="search"
        helperText={helperText}
        onChange={textInputOnChange}
        {...restInputProps}
        inputRef={ref}
      />
    );
  };

  return (
    <Autosuggest
      suggestions={suggestions}
      onSuggestionsFetchRequested={onSuggestionsFetchRequested}
      onSuggestionsClearRequested={onSuggestionsClearRequested}
      getSuggestionValue={getSuggestionValue}
      renderSuggestion={renderSuggestion}
      inputProps={inputProps}
      onSuggestionSelected={onAutosuggestSuggestionSelected}
      renderInputComponent={renderInputComponent}
      theme={theme}
    />
  );
}

export default AutoSuggest;
