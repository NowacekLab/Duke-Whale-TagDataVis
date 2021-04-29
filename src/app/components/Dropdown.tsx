import React, {useState} from 'react';
import Typography from '@material-ui/core/Typography';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import { FormHelperText } from '@material-ui/core';

interface Choice {
    [index: string] : any,
    label: string,
    value: any,
}
type Choices = Array<Choice>;

interface DropdownProps {
    title: string,
    description: string,
    label?: string,
    choices: Choices,
    choice: boolean,
    onChoiceChange: Function,
}

export default function Dropdown(props: DropdownProps) {

    const handleActionChange = (e: any) => {
        props.onChoiceChange(e);
    }

    const showTitle = props.title !== "";
    const showDesc = props.description !== "";

    console.log(props.label);

  return (
    <div
      className="flex-col-center"
      style={{
        gap: "10px"
      }}
    >

      {
          showTitle &&
            <Typography>
                {props.title} 
            </Typography>
      }

      {
          showDesc &&
            <p
            style={{
                padding: "0px",
                margin: "0px"
            }}
            >
            {props.description}
            </p>
      }

    <FormControl
        style={{
        minWidth: "200px"
        }}
    >
        <InputLabel>Select</InputLabel>
        <Select
            value={props.choice}
            onChange={handleActionChange}
        >
            {
                props.choices &&
                props.choices.length > 0 &&
                props.choices.map((choice) => {

                    return (
                        <MenuItem
                            value={choice['value']}
                        >
                            {choice['label']}
                        </MenuItem>
                    )

                })
            }
        </Select>
        <FormHelperText>
                {props.label ?? ""}
        </FormHelperText>
    </FormControl>

    </div>
  )

}