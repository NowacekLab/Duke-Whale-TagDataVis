import React from 'react';
import Dropdown from './Dropdown';

interface DropdownBoolProps {
    title: string,
    description: string,
    bool: boolean,
    label?: string,
    onBoolChange: Function,
}

export default function DropdownBool(props: DropdownBoolProps) {

    const choices = [
        {
            value: true,
            label: 'Yes',
        },
        {
            value: false,
            label: 'No',
        }
    ]

    return (
        <Dropdown 
            title = {props.title}
            description = {props.description}
            label = {props.label}
            choice = {props.bool}
            choices = {choices}
            onChoiceChange = {props.onBoolChange}
        />
    )

}