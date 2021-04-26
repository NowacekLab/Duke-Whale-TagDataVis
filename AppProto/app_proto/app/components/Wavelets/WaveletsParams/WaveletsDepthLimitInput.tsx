import React, {useState, useEffect} from 'react';
import TextInputWithError from '../../TextInputWithError';

interface WaveletsDepthLimitInputProps {
  value: string,
  onInputChange: Function,
  error: boolean,
  onErrorChange: Function,
}

export default function WaveletsDepthLimitInput(props: WaveletsDepthLimitInputProps) {

  const validateInput = () => {
    if (props.value === "") props.onErrorChange(true);
    else props.onErrorChange(false);
  }

  return (
    <TextInputWithError 
      key={"Wavelets Depth Limit Input Sub"}
      error={props.error}
      onInputChange={props.onInputChange}
      validateInput={validateInput}
      value={props.value}
      label={"Minimum Depth"}
      errorHelperText={"Error!"}
      regHelperText={"Minimum depth that must be reached before POI are recorded"}
    />
  )
}