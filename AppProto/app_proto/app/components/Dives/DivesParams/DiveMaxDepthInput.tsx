import React, {useState, useEffect} from 'react';
import TextInputWithError from '../../TextInputWithError';

interface DiveMaxDepthInputProps {
  value: string,
  onInputChange: Function,
  error: boolean,
  onErrorChange: Function,
}

export default function DiveMaxDepthInput(props: DiveMaxDepthInputProps) {

  const validateInput = () => {
    if (props.value === "") props.onErrorChange(true);
    else props.onErrorChange(false);
  }

  return (
    <TextInputWithError 
      key={"Dive Max Depth Input Sub"}
      error={props.error}
      onInputChange={props.onInputChange}
      validateInput={validateInput}
      value={props.value}
      label={"Max Depth"}
      errorHelperText={"Error!"}
      regHelperText={"Dives with depths greater than this will not be recorded"}
    />
  )
}