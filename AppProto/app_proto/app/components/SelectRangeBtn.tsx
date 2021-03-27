import React, {useState} from 'react';
import RangeSelectDialog from './EditorCont/RangeSelectDialog';
import Button from '@material-ui/core/Button';
import {useDispatch} from 'react-redux';
import {notifsActionsHandler} from '../functions/reduxHandlers/handlers';

interface SelectRangeBtnProps {
  batchName: string,
  realMinRange: string,
  realMaxRange: string,
  rangeConfirmed: boolean,
  onRangeConfirmation: Function,
  disabled?: boolean,
}

export default function SelectRangeBtn(props: SelectRangeBtnProps) {

  const dispatch = useDispatch();
  const notifActionHandler = new notifsActionsHandler(dispatch, "Custom Graphing");

  const [showRangeModal, setShowRangeModal] = useState(false);
  const toggleRangeModal = () => {
    if (!props.batchName || props.batchName === "") {
      notifActionHandler.showErrorNotif("You must select a batch first");
      return;
    }
    setShowRangeModal(!showRangeModal);
  }
  const handleRangeModalClose = () => {
    setShowRangeModal(false);
  }
  const onRangeConfirmation = (inputMinRange: string, inputMaxRange: string) => {
    props.onRangeConfirmation(inputMinRange, inputMaxRange);
    handleRangeModalClose();
  }

  const btnDisabled = props.disabled ?? false;

  return (
    <React.Fragment>
      <Button
          id="color-themed"
          className="btn"
          onClick={toggleRangeModal}
          variant="outlined"
          disabled={btnDisabled}
      >
          {props.rangeConfirmed ? `${props.realMinRange} : ${props.realMaxRange}` : "Confirm Range"}
      </Button>

      <RangeSelectDialog 
          showModal={showRangeModal}
          handleClose={handleRangeModalClose}
          handleBack={handleRangeModalClose}
          onRangeConfirm={onRangeConfirmation}
          currInputMinRange={props.realMinRange}
          currInputMaxRange={props.realMaxRange}
      />

    </React.Fragment>
  )

}