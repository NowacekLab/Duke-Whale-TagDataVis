import React from 'react';
import TextInputWithError from '../../TextInputWithError';

interface MahalGroupInputProps {
  value: string,
  onInputChange: Function,
  error: boolean,
  onErrorChange: Function,
}

export default function MahalGroupInput(props: MahalGroupInputProps) {

  const validateInput = () => {
    if (props.value === "") props.onErrorChange(true);
    else props.onErrorChange(false);
  }

  return (
    <TextInputWithError 
      key={"Mahal Group Input Sub"}
      error={props.error}
      onInputChange={props.onInputChange}
      validateInput={validateInput}
      value={props.value}
      label={"Group"}
      errorHelperText={"Error!"}
      regHelperText={"Number of intersecting windows to calculate mean"}
    />
  )
}