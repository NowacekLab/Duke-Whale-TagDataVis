import React, {useState} from 'react';
import {mahalPOIParams} from '../../../functions/exec/process';
import {makeStyles} from '@material-ui/core/styles';
import MahalDepthInput from './MahalDepthInput';
import MahalGroupInput from './MahalGroupInput';
import MahalPInput from './MahalPInput';
import MahalWindowInput from './MahalWindowInput';

const useStyles = makeStyles({
  root: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gridTemplateRows: '1fr 1fr',
  }
});

interface mahalPOIParamErrors {
  [index: string]: boolean,
  pLimit: boolean,
  windowSize: boolean,
  groupSize: boolean,
  depthLimit: boolean,
}

interface MahalParamsProps {
  onParamsChange: Function,
  onErrorsChange: Function, 
  mahalParamsObj: mahalPOIParams,
  mahalParamsErrors: mahalPOIParamErrors,
};

export default function MahalParams(props: MahalParamsProps) {

    const classes = useStyles();
        // p_limit : p value of mahalanobis distance must be less than this value to trigger POI
        // windowSize : length in seconds of a window of data, default 60 seconds to calculate mahalanobis distance
        // groupSize : number of instersecting windows to calucualte mean from, default 5 windows
        // depthLimit : minimum depth necessary in order for POI to trigger, default 0

    const onMahalDepthChange = (e: any) => {
      changeParam(e, "depthLimit");
    };

    const onMahalGroupChange = (e: any) => {
      changeParam(e, "groupSize");
    };
    
    const onMahalWindowChange = (e:any) => {
      changeParam(e, "windowSize");
    };

    const onMahalPChange = (e: any) => {
      changeParam(e, "pLimit");
    }

    const changeParam = (e: any, param: string) => {
      const newVal = e.target.value ?? "";
      props.onParamsChange({
        ...props.mahalParamsObj,
        [param]: newVal,
      })
    } 

    const changeDepthError = (error: boolean) => {
      changeInputError(error, "depthLimit");
    };

    const changeGroupError = (error: boolean) => {
      changeInputError(error, "groupSize");
    };

    const changeWindowError = (error: boolean) => {
      changeInputError(error, "windowSize");
    };

    const changePError = (error: boolean) => {
      changeInputError(error, "pLimit");
    };

    const changeInputError = (error: boolean, param: string) => {
      props.onErrorsChange({
        ...props.mahalParamsErrors,
        [param]: error,
      })
    }

    const getInputVal = (param: string) => {
      return props.mahalParamsObj[param];
    }

    const getErrorVal = (param: string) => {
      return props.mahalParamsErrors[param];
    }

    return (
      <div
        className={classes.root}
      >
        <MahalDepthInput 
          key = {"Mahal Depth Input"}
          value = {getInputVal('depthLimit') ?? ""}
          onInputChange = {onMahalDepthChange}
          error = {getErrorVal('depthLimit') ?? false}
          onErrorChange = {changeDepthError}
        />

        <MahalGroupInput 
          key = {"Mahal Group Input"}
          value = {getInputVal('groupSize') ?? ""}
          onInputChange = {onMahalGroupChange}
          error = {getErrorVal('groupSize') ?? false}
          onErrorChange = {changeGroupError}
        />

        <MahalPInput 
          key = {"Mahal P Input"}
          value = {getInputVal('pLimit') ?? ""}
          onInputChange = {onMahalPChange}
          error = {getErrorVal('pLimit') ?? false}
          onErrorChange = {changePError}          
        />

        <MahalWindowInput 
            key = {"Mahal Window Input"}
            value = {getInputVal('windowSize') ?? ""}
            onInputChange = {onMahalWindowChange}
            error = {getErrorVal('windowSize') ?? false}
            onErrorChange = {changeWindowError}
        />
      </div>
    )


};
