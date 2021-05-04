import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import ExportDialog from './ExportDialog';

const useStyles = makeStyles({
  btnActive: {
      color: "white",
      backgroundColor: "rgba(0,0,0,0.1)",
      transition: "all 0.15s linear",
      backgroundSize: "110% 110%"
  },
});

type ExportActionProps = {
  enabled: boolean,
}

export default function ExportAction(props: ExportActionProps) {

  const classes = useStyles();

  const actionIfEnabled = () => {
    if (!props.enabled) return;
  }

  return (
    <React.Fragment>

      <Tooltip
          title="Editor"
          placement="right"
          arrow
      >
          <IconButton
              onClick={() => {
                  actionIfEnabled()
              }}
          >
              <EditIcon className={classes.btnActive} />
          </IconButton>

      </Tooltip>

    </React.Fragment>

  )

}