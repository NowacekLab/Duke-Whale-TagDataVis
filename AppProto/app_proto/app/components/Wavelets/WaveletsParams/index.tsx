import React, {useState} from 'react';
import {wavesParams} from '../../../functions/exec/process';
import {makeStyles} from '@material-ui/core/styles';
import WaveletsColorByVarInput from './WaveletsColorByVarInput';
import WaveletsDepthLimitInput from './WaveletsDepthLimitInput';

const useStyles = makeStyles({
  root: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gridTemplateRows: '1fr 1fr',
  }
});

interface waveletsParamErrors {
  [index: string]: boolean,
  depthLimit: boolean,
  colorByVar: boolean,
}

interface WaveletsParamsProps {
  onParamsChange: Function,
  onErrorsChange: Function, 
  waveletsParamsObj: wavesParams,
  waveletsParamsErrors: waveletsParamErrors,
};

export default function WaveletsParams(props: WaveletsParamsProps) {

    const classes = useStyles();

    // depthLimit : float of depth that must be reached before POI are recorded (Default set to 0)
    // colorByVar : boolean, determines whether to shade depth plot based on 'var'

    const onWaveDepthChange = (e: any) => {
      changeParam(e, "depthLimit");
    };

    const onWaveColorByVarChange = (e: any) => {
      changeParam(e, "colorByVar");
    };
    
    const changeParam = (e: any, param: string) => {
      const newVal = e.target.value ?? "";
      props.onParamsChange({
        ...props.waveletsParamsObj,
        [param]: newVal,
      })
    } 

    const changeInputError = (error: boolean, param: string) => {
      props.onErrorsChange({
        ...props.waveletsParamsErrors,
        [param]: error,
      })
    }

    const changeWaveDepthError = (error: boolean) => {
      changeInputError(error, "depthLimit");
    };

    const changeWaveColorByVarError = (error: boolean) => {
      changeInputError(error, "colorByVar");
    };


    const getInputVal = (param: string) => {
      return props.waveletsParamsObj[param];
    }

    const getErrorVal = (param: string) => {
      return props.waveletsParamsErrors[param];
    }

    return (
      <div
        className={classes.root}
      >

        <WaveletsColorByVarInput 
          key = {"Wavelets Color By Var Input"}
          value = {getInputVal("colorByVar") ?? ""}
          onInputChange={onWaveColorByVarChange}
          error = {getErrorVal("colorByVar") ?? false}
          onErrorChange = {changeWaveColorByVarError}
        />

        <WaveletsDepthLimitInput 
          key = {"Wavelets Depth Limit Input"}
          value = {getInputVal("depthLimit") ?? ""}
          onInputChange = {onWaveDepthChange}
          error = {getErrorVal("depthLimit") ?? false}
          onErrorChange = {changeWaveDepthError}
        />
      

      </div>
    )


};

