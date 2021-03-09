import React from 'react';
import WrapWithModal from './WrapWithModal';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

type WrapWithDialogProps = {
  showModal: boolean,
  handleClose: any,
  handleBack: Function,
  title: string,
  children: any,
}

export default function WrapWithDialog(props: WrapWithDialogProps) {

  return (

    <WrapWithModal
      showModal={props.showModal}
      handleClose={props.handleClose}
  >
      <Paper
          elevation={3}
          style={{
              outline: "none"
          }}
      >
          <div
              style={{
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
                      maxHeight: "40px",
                      display: "flex", 
                      justifyContent: "center",
                      alignItems: "center"
                  }}
              >
                  <h3>
                      {props.title}
                  </h3>
              </div>
                
              {props.children}

          </div>
      </Paper>
  </WrapWithModal>

  )

}