import React from "react";
import WrapWithDialog from "../WrapWithDialog";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from '@material-ui/core/ListItemText';

type GraphViewDialogProps = {
  showModal: boolean,
  handleClose: any,
  handleBack: Function,
  displayGraphName: string,
  confirmDisplayGraphName: any,
  infoOpen: boolean,
  onInfoClose: any,
  viewGraphInfo: Function,
  graphs: any,
}

export default function GraphViewDialog(props: GraphViewDialogProps) {

  return (
      <WrapWithDialog
        showModal={props.showModal}
        handleClose={props.handleClose}
        handleBack={props.infoOpen ? () => props.onInfoClose(false) : props.handleBack}
        title={props.infoOpen ? props.displayGraphName : "Graphs"}
        bodyStyle={{
            minWidth: '500px'
        }}
    >
      {

      
        props.infoOpen ? 

        <div
          style={{
              height: "50%",
              minWidth: "500px",
              display: "flex",
              flexDirection: "column",
              padding: "10px"
          }}
        >
          <List>
              {
                  <ListItem>
                      
                      <ListItemText
                          disableTypography
                      >

                      </ListItemText>


                  </ListItem>

              }
          </List>

          {
              props.displayGraphName === ""

              ?

              undefined

              :

              <div
                  style={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center"
                  }}
              >
                  <Button
                      id="color-themed"
                      className="btn"
                      onClick={props.confirmDisplayGraphName}
                      variant="outlined"
                  >
                      {`Select`}
                  </Button>
              </div>
          }

        </div>

        :

        <List
          style={{
              minWidth: "500px"
          }}
        >
        {
          props.graphs && 
          Object.keys(props.graphs) ?
          Object.keys(props.graphs).map((graphName) => {
              
              const graphPath = props.graphs[graphName];

              return (
                  <React.Fragment
                    key={`${graphName}-fragment`}
                  >

                      <ListItem
                          button
                          onClick={() => {props.viewGraphInfo(graphName, graphPath)}}
                          key={graphName}
                      >
                          <ListItemText
                              primary={graphName}
                          />

                      </ListItem>

                  </React.Fragment>
              )            

          })  

          :

          null
        }

        </List>

    }

    </WrapWithDialog>
  )
}