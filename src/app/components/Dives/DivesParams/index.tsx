import React, {useState} from 'react';
import {divesParams} from '../../../functions/exec/process';
import {makeStyles} from '@material-ui/core/styles';
import DiveLength from './DiveLengthInput';
import DiveMaxDepth from './DiveMaxDepthInput';
import DiveRequiredDepth from './DiveRequiredDepthInput';

const useStyles = makeStyles({
  root: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gridTemplateRows: '1fr 1fr',
  }
});

interface diveParamErrors {
  [index: string]: boolean,
  minLength: boolean,
  requiredDepth: boolean,
  maxDepth: boolean,
}

interface DiveParamsProps {
  onParamsChange: Function,
  onErrorsChange: Function, 
  divesParamsObj: divesParams,
  divesParamsErrors: diveParamErrors,
};

export default function DiveParams(props: DiveParamsProps) {

    const classes = useStyles();

//     #        Inputs:
//     # calcFilePath, newFilePath, isExport
// # minLength : type int or float, sets the minimum length of a dive in seconds before a dive is recorded (Default is 60 seconds)
// # requiredDepth : type int or float, a dive must reach this depth (same units as file) in order to be recorded (Defualt is None)
// # maxDepth : type int or float, dives over that reach a depth greater than this will not be recorded (Default is None)
// # interestVars : tpye list of string, each string is the name of a variable to coloscale dives, creates a subplot for each

    const onDiveLengthChange = (e: any) => {
      changeParam(e, "minLength");
    };

    const onDiveRequiredDepthChange = (e: any) => {
      changeParam(e, "requiredDepth");
    };
    
    const onDiveMaxDepthChange = (e:any) => {
      changeParam(e, "maxDepth");
    };

    const changeParam = (e: any, param: string) => {
      const newVal = e.target.value ?? "";
      props.onParamsChange({
        ...props.divesParamsObj,
        [param]: newVal,
      })
    } 

    const changeLengthError = (error: boolean) => {
      changeInputError(error, "minLength");
    };

    const changeRequiredDepthError = (error: boolean) => {
      changeInputError(error, "requiredDepth");
    };

    const changeMaxDepthError = (error: boolean) => {
      changeInputError(error, "maxDepth");
    };

    const changeInputError = (error: boolean, param: string) => {
      props.onErrorsChange({
        ...props.divesParamsErrors,
        [param]: error,
      })
    }

    const getInputVal = (param: string) => {
      return props.divesParamsObj[param];
    }

    const getErrorVal = (param: string) => {
      return props.divesParamsErrors[param];
    }

    return (
      <div
        className={classes.root}
      >
        <DiveLength 
          key = {"Dives Min Length"}
          value = {getInputVal('minLength') ?? ""}
          onInputChange = {onDiveLengthChange}
          error = {getErrorVal('minLength') ?? false}
          onErrorChange = {changeLengthError}
        />

        <DiveMaxDepth 
          key = {"Dives Max Depth"}
          value = {getInputVal('maxDepth') ?? ""}
          onInputChange = {onDiveMaxDepthChange}
          error = {getErrorVal('maxDepth') ?? false}
          onErrorChange = {changeMaxDepthError}
        />

        <DiveRequiredDepth 
          key = {"Dives Required Depth"}
          value = {getInputVal('requiredDepth') ?? ""}
          onInputChange = {onDiveRequiredDepthChange}
          error = {getErrorVal('requiredDepth') ?? false}
          onErrorChange = {changeRequiredDepthError}          
        />

      </div>
    )


};
