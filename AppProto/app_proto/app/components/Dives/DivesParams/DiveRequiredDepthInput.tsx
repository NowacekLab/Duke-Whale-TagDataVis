import React, {useState, useEffect} from 'react';
import TextInputWithError from '../../TextInputWithError';

interface DiveRequiredDepthInputProps {
  value: string,
  onInputChange: Function,
  error: boolean,
  onErrorChange: Function,
}

export default function DiveRequiredDepthInput(props: DiveRequiredDepthInputProps) {

  const validateInput = () => {
    if (props.value === "") props.onErrorChange(true);
    else props.onErrorChange(false);
  }

  return (
    <TextInputWithError 
      key={"Dive Required Depth Input Sub"}
      error={props.error}
      onInputChange={props.onInputChange}
      validateInput={validateInput}
      value={props.value}
      label={"Required Depth"}
      errorHelperText={"Error!"}
      regHelperText={"Required depth in same units as given for dive to be recorded"}
    />
  )
}