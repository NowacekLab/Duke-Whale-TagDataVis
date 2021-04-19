import React, {useEffect} from 'react';
import TextField from '@material-ui/core/TextField';

interface TextInputWithErrorProps {
  error: boolean,
  onInputChange: any,
  validateInput: Function,
  value: any,
  label: string,
  errorHelperText: string,
  regHelperText: string,
}

export default function TextInputWithError(props: TextInputWithErrorProps) {

  useEffect(() => {
    props.validateInput();
  }, [props.value])

  return (
    <div
      style={{
        padding: "10px"
      }}
    >
      {
          props.error ?
          <TextField 
            error 
            label = {props.label}
            value = {props.value}
            onChange = {props.onInputChange}
            helperText = {props.errorHelperText}
          />

          :

          <TextField 
            label = {props.label}
            value = {props.value}
            onChange = {props.onInputChange}
            helperText = {props.regHelperText}
          />
      }
    </div>
  )

}