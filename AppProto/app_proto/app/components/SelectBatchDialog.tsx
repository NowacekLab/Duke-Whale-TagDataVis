import React from "react";
import WrapWithDialog from "./WrapWithDialog";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';

type SelectBatchDialogProps = {
    showModal: boolean,
    handleClose: any,
    handleBack: Function,
    currBatchInfo: any,
    infoOpen: boolean,
    onInfoClose: any,
    displayBatchName: string,
    confirmDisplayBatchName: any,
    viewBatchInfo: Function,
    uploads: any,
}

export default function SelectBatchDialog(props: SelectBatchDialogProps) {

    return (

    <WrapWithDialog
        showModal={props.showModal}
        handleClose={props.handleClose}
        handleBack={props.infoOpen ? () => props.onInfoClose() : props.handleBack}
        title = {props.infoOpen ? props.displayBatchName : "Batches"}
        bodyStyle={{
            minWidth: '500px'
        }}
    >
        {

            props.infoOpen ? 

            <div
                id="batches"
                className="list"
            >

                <List>
                    {
                        props.currBatchInfo.map((batchInfoObj: Record<string, string>) => {
                            const title = batchInfoObj["title"];
                            const info = batchInfoObj["info"];

                            return (

                                <ListItem
                                    key={title}
                                >
                                    
                                    <ListItemText
                                        disableTypography
                                        primary={
                                            <Typography
                                                style={{
                                                    color: "black",
                                                    fontWeight: "bold"
                                                }}
                                            >
                                                {title}
                                            </Typography>
                                        }
                                        secondary={
                                            <Typography
                                                style={{
                                                    color: "black"
                                                }}
                                            >
                                                {info}
                                            </Typography>
                                        }
                                    >

                                    </ListItemText>


                                </ListItem>

                            )
                        })
                    }
                </List>



                {
                    props.displayBatchName === ""

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
                            onClick={props.confirmDisplayBatchName}
                            variant="outlined"
                        >
                            {`Select`}
                        </Button>
                    </div>
                }

            </div>

            :

            <List
                className="list"
            >
                {
                    Object.keys(props.uploads) ?
                    Object.keys(props.uploads).map((batchName) => {
                        
                        //@ts-ignore
                        const uploadProgObj = props.uploads[batchName];
                        const uploadInfoArr = uploadProgObj ? uploadProgObj["uploadInfoArr"] : [];

                        return (

                                <ListItem
                                    button
                                    onClick={() => {props.viewBatchInfo(batchName, uploadInfoArr)}}
                                    key={batchName}
                                >
                                    <ListItemText
                                        primary={batchName}
                                    />

                                </ListItem>
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