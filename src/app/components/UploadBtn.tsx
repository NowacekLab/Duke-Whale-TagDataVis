import React, {useRef} from 'react';
import Button from "@material-ui/core/Button";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
    containedBtn: {
        marginLeft: "2px",
        marginRight: "2px",
        fontSize: "12px",
        backgroundColor: "#012069",
        color: "white",
        "&:hover": {
            backgroundColor: "rgba(1,32,105,0.5)"
        }
    },
}))

interface UploadBtnProps {
    onUploadFileObjChange: Function,
}

export default function UploadBtn(props: UploadBtnProps) {

    const classes = useStyles();

    const uploadWavFileRef = useRef(null);

    const wavFileEnding = ".wav"; 

    const handleRefClick = (e: React.ChangeEvent<HTMLInputElement>) => {

        //@ts-ignore 
        const file_path = e.target.files && e.target.files[0].path;
        const file_name = e.target.files && e.target.files[0].name; 
        e.target.value = "";

        const file_obj = {
            "name": file_name || "",
            "path": file_path || "",
        }

        if (file_name && file_name !== "") {
            props.onUploadFileObjChange(file_obj);
        }

    }

    const handleUploadBtnClick = () => {
        //@ts-ignore 
        uploadWavFileRef && uploadWavFileRef.current ? uploadWavFileRef.current.click() : null;
    }

    return (

        <React.Fragment
            key = {"Generic Upload Btn"}
        >
            <input 
                type = "file"
                id = "file-upload"
                ref={uploadWavFileRef}
                style={{display: "none"}}
                onChange={(e) => {handleRefClick(e)}}
                accept={wavFileEnding}

            />

            <Button

                variant="contained"
                className={classes.containedBtn}
                onClick={() => handleUploadBtnClick()}
            >
                Upload
            </Button>

        </React.Fragment>


    )

}
