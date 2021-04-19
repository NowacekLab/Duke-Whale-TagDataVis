import React from 'react';
import TextInputWithError from '../../TextInputWithError';

interface MahalPInputProps {
  value: string,
  onInputChange: Function,
  error: boolean,
  onErrorChange: Function,
}

export default function MahalPInput(props: MahalPInputProps) {

  const validateInput = () => {
    if (props.value === "") props.onErrorChange(true);
    else props.onErrorChange(false);
  }

  return (
    <TextInputWithError 
      key={"Mahal P Input Sub"}
      error={props.error}
      onInputChange={props.onInputChange}
      validateInput={validateInput}
      value={props.value}
      label={"P Limit"}
      errorHelperText={"Error!"}
      regHelperText={"If p value <= p limit, trigger POI"}
    />
  )
}