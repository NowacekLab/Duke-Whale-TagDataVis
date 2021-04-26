import React, {useState, useEffect} from 'react';
import TextInputWithError from '../../TextInputWithError';
import DropdownBool from '../../DropdownBool';

interface WaveletsColorByVarProps {
  value: boolean,
  onInputChange: Function,
  error: boolean,
  onErrorChange: Function,
}

export default function WaveletsColorByVarInput(props: WaveletsColorByVarProps) {

  return (

    <DropdownBool 
      title = {""}
      description = {""}
      label = {"Shade depth plot based on chosen variable"}
      bool = {props.value}
      onBoolChange = {(e: any) => props.onInputChange(e)}
    />
  
  )
}