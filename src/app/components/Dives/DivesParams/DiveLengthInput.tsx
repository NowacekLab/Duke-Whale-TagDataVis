import React, {useState, useEffect} from 'react';
import TextInputWithError from '../../TextInputWithError';

interface DiveLengthInputProps {
  value: string,
  onInputChange: Function,
  error: boolean,
  onErrorChange: Function,
}

export default function DiveLengthInput(props: DiveLengthInputProps) {

  const validateInput = () => {
    if (props.value === "") props.onErrorChange(true);
    else props.onErrorChange(false);
  }

  return (
    <TextInputWithError 
      key={"Dive Length Input Sub"}
      error={props.error}
      onInputChange={props.onInputChange}
      validateInput={validateInput}
      value={props.value}
      label={"Minimum Length"}
      errorHelperText={"Error!"}
      regHelperText={"Minimum length of a dive in seconds before dive is recorded"}
    />
  )
}