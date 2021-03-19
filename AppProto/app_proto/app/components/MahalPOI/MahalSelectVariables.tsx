import React, {useEffect, useState} from 'react';
import Paper from '@material-ui/core/Paper'; 
import {useDispatch, useSelector} from "react-redux";
import Autocomplete from '@material-ui/lab/Autocomplete';
import {uploadsActionsHandler} from "../../functions/reduxHandlers/handlers";
import {getBatchVars} from '../../functions/batches/getBatchAttrs';
import {throwErrIfFail} from '../../functions/responses';
import useIsMountedRef from '../../functions/useIsMountedRef';
import TextField from '@material-ui/core/TextField';
import Chip from '@material-ui/core/Chip';
import CircularProgress from '@material-ui/core/CircularProgress';
import Fade from '@material-ui/core/Fade';


interface MultiSelectVariablesProps {
  chosenBatchName: string,
  onChosenBatchVarsChange: Function,
  chosenBatchVarLimit: number, 
  chosenBatchVars: Array<string>,
}

export default function MahalSelectVariables(props: MultiSelectVariablesProps) {
  const dispatch = useDispatch();

  const isMountedRef = useIsMountedRef();

  //@ts-ignore
  const uploadProgState = useSelector(state => state["uploads"]);
  const uploadProgHandler = new uploadsActionsHandler(dispatch);
  const uploadsFinished = uploadProgHandler.getUploadsFinished(uploadProgState);

  const [availBatchVars, setAvailBatchVars] = useState([]);

  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setProgress(30);
    if (isMountedRef.current) {
      getAvailBatchVars().then((res) => {
        setAvailBatchVars(res);
        endProgress();
      }).catch(() => {
        endProgress();
      }) 
    }
  }, [props.chosenBatchName])

  const endProgress = () => {
    setProgress(100);
    if (isMountedRef.current) {
      setTimeout(
        () => {
          if (isMountedRef.current) {
            setLoading(false);
          }
        }, 500)
    }
  }

  async function getAvailBatchVars() {
    try {

      console.log("GET AVAIL BATCH VARS");
      console.log("CURRENT BATCH NAME: ");
      console.log(props.chosenBatchName);

      //@ts-ignore
      const batchVarsRes = await getBatchVars(uploadsFinished, props.chosenBatchName);
      console.log("RESULT OF GETTING AVAIL BATCH VARS: ");
      console.log(batchVarsRes);
      throwErrIfFail(batchVarsRes);
      const batchVars = batchVarsRes.response;
      return batchVars;
    } catch (err) {
        return [];
    }
  };


  const numLimit = props.chosenBatchVarLimit; 
  const [disableInput, setDisableInput] = useState(props.chosenBatchVars.length > numLimit);

  function onInputChange(e: any, val: any, reason: string) {
    if (val.length >= numLimit) {
      setDisableInput(true);
    } else {
      setDisableInput(false);
    }
    props.onChosenBatchVarsChange(val);
  }

  return (
      <>
      {
        loading ?
        <CircularProgress 
          variant="determinate"
          value={progress}
        />
        :

        <Fade
          in={!loading}
        >
          <Autocomplete 
            key={"Mahal Select Vars"}
            value={props.chosenBatchVars ?? []}
            disabled={disableInput}
            multiple 
            options={availBatchVars}
            getOptionLabel={(option) => option}
            renderInput={(params) => (
              <TextField  
                {...params}
                variant="standard"
                label="Variables"
                placeholder="Select Three Variables"
              />
            )} 
            renderTags={(tagValues, getTagProps) =>
              tagValues.map((option, index) => {
                return (
                  <Chip
                    key={index}
                    label={option}
                    {...getTagProps({ index })}
                    // Set disable explicitly after getTagProps
                    disabled={false}
                  />
                );
              })
            }
            onChange={onInputChange}
            style={{
              minWidth: "500px"
            }}
          />
        </Fade>
      }

      </>

  )
}