import React, {useState, useEffect} from 'react';
import TextInputWithError from '../../TextInputWithError';

interface MahalDepthInputProps {
  value: string,
  onInputChange: Function,
  error: boolean,
  onErrorChange: Function,
}

export default function MahalDepthInput(props: MahalDepthInputProps) {

  const validateInput = () => {
    if (props.value === "") props.onErrorChange(true);
    else props.onErrorChange(false);
  }

  return (
    <TextInputWithError 
      key={"Mahal Depth Input Sub"}
      error={props.error}
      onInputChange={props.onInputChange}
      validateInput={validateInput}
      value={props.value}
      label={"Depth"}
      errorHelperText={"Error!"}
      regHelperText={"Minimum depth for POI to trigger"}
    />
  )
}