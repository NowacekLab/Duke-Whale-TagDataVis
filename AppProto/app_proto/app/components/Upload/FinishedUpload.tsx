import React, {useState} from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';

interface FinishedUploadProps {
  batchName: string,
  handleCurrUploadInfo: Function, 
  uploadInfoArray: Array<any>,
  removeUpload: Function,
}

export default function FinishedUpload(props: FinishedUploadProps) {

  const batchName = props.batchName;

  const [hover, setHover] = useState(false);

  return (
    <ListItem
        button
        onClick={() => {props.handleCurrUploadInfo(batchName, props.uploadInfoArray)}}
        key={batchName}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
    >
        <ListItemText
            primary={batchName}
        />
        <ListItemSecondaryAction>
          {
            hover && 
            <IconButton 
                edge = "end"
                onClick={() => {props.removeUpload(batchName)}}
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
            >
                <DeleteIcon />
            </IconButton>
          }
        </ListItemSecondaryAction>

    </ListItem>
  )

}