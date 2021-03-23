import React, {useState} from "react";
import SelectBatchDialog from './SelectBatchDialog';
import {useDispatch, useSelector} from "react-redux";
import {uploadsActionsHandler} from "../functions/reduxHandlers/handlers";
import Button from "@material-ui/core/Button";

interface SelectBatchBtnProps {
  batchName: string,
  onBatchSelect: Function,
}

export default function SelectBatchBtn(props: SelectBatchBtnProps) { 

  const dispatch = useDispatch();

  //@ts-ignore
  const uploadProgState = useSelector(state => state["uploads"]);
  const uploadProgHandler = new uploadsActionsHandler(dispatch);
  const uploadsFinished = uploadProgHandler.getUploadsFinished(uploadProgState);
  const [currBatchInfo, setCurrBatchInfo] = useState([]);

  const [showBatchModal, setShowBatchModal] = useState(false);
  const handleBatchModalClose = () => {
    setShowBatchModal(false);
  }
  const toggleBatchModal = () => {
      setShowBatchModal(!showBatchModal);
  }
  const [infoOpen, setInfoOpen] = useState(false);
  const handleInfoToggle = () => {
      setInfoOpen(!infoOpen);
  }
  const handleCloseInfo = () => {
      setInfoOpen(false);
  }
  const [tempBatchName, setTempBatchName] = useState("");
  const getCalcFilePath = (batchName: string) => {

    //@ts-ignore
    if (!uploadsFinished.hasOwnProperty(batchName) && !uploadsFinished[batchName]['calcPath']) {
      return "";
    } 

    //@ts-ignore
    return uploadsFinished[batchName]['calcPath'];
  }
  const onBatchNameSelect = (batchName: string) => {

    console.log("Select Batch Button - On Batch Name Select");
    console.log("BATCH NAME: ");
    console.log(batchName);
    console.log("UPLOADS FINISHED: ");
    console.log(uploadsFinished);

    const calcFilePath = getCalcFilePath(batchName);
    props.onBatchSelect(batchName, calcFilePath);
  }
  const confirmTempBatchName = () => {
      onBatchNameSelect(tempBatchName);
      handleBatchModalClose();
  }
  const viewCurrBatchInfo = (batchName: string, uploadInfoArr: any) => {
    setTempBatchName(batchName);
    setCurrBatchInfo(uploadInfoArr);
    handleInfoToggle();
  }

  const batchBtnVal = props.batchName === "" ? "No batch chosen" : props.batchName;

    return (

      <>
            <Button
                onClick={toggleBatchModal}
                id="color-themed"
                className="btn"
                variant="outlined"
            >
                {batchBtnVal}
            </Button>

            <SelectBatchDialog 
                showModal={showBatchModal}
                handleClose={handleBatchModalClose}
                handleBack={handleBatchModalClose}
                currBatchInfo={currBatchInfo}
                infoOpen={infoOpen}
                onInfoClose={handleCloseInfo}
                displayBatchName={tempBatchName}
                confirmDisplayBatchName={confirmTempBatchName}
                viewBatchInfo={viewCurrBatchInfo}
                uploads={uploadsFinished}
            />
      </>

    )

}