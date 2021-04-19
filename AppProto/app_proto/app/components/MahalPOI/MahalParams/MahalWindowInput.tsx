import React from 'react';
import TextInputWithError from '../../TextInputWithError';

interface MahalWindowInputProps {
  value: string,
  onInputChange: Function,
  error: boolean,
  onErrorChange: Function,
}

export default function MahalWindowInput(props: MahalWindowInputProps) {

  const validateInput = () => {
    if (props.value === "") props.onErrorChange(true);
    else props.onErrorChange(false);
  }

  return (
    <TextInputWithError 
      key={"Mahal Window Input Sub"}
      error={props.error}
      onInputChange={props.onInputChange}
      validateInput={validateInput}
      value={props.value}
      label={"Window Size"}
      errorHelperText={"Error!"}
      regHelperText={"Length in seconds of a window of data"}
    />
  )
}