import React from 'react';
import WrapWithModal from './WrapWithModal';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Typography from '@material-ui/core/Typography';

type WrapWithDialogProps = {
  showModal: boolean,
  handleClose: any,
  handleBack: Function,
  title: string,
  children: any,
  modalStyle?: any,
  bodyStyle?: any,
  innerBodyStyle?: any,
}

export default function WrapWithDialog(props: WrapWithDialogProps) {

  return (

    <WrapWithModal
      showModal={props.showModal}
      handleClose={props.handleClose}
      style={props.modalStyle}
  >
      <Paper
          elevation={3}
          style={{
              ...props.bodyStyle,
              outline: "none",
          }}
      >
          <div
              style={{
                  ...props.innerBodyStyle,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  padding: "10px"
              }}
          >

              <div
                  style={{
                      width: "100%",
                      maxHeight: "40px"
                  }}
              >
                  <IconButton
                      onClick={() => props.handleBack()}
                      style={{
                          justifySelf: "flex-start",
                          alignSelf: "center"
                      }}
                  >
                      <ArrowBackIcon 
                          style={{
                              color: "black"
                          }}
                      />
                  </IconButton>
              </div>

              <div
                  style={{
                      width: "100%",
                      display: "flex", 
                      justifyContent: "center",
                      alignItems: "center"
                  }}
              >
                  <Typography
                    variant={'h4'}
                  >
                      {props.title}
                  </Typography>
              </div>
                
              {props.children}

          </div>
      </Paper>
  </WrapWithModal>

  )

}