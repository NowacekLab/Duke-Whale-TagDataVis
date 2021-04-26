import React, {useState} from 'react';
import DropdownBool from '../DropdownBool';
import SelectAction from '../SelectAction';

export interface WaveletsLevelsValue {
    [index: string]: any,
    action: string,
    newFilePath: string,
    showLevels: boolean,
    dirPath: string,
}

export const defaultWaveletsLevels: WaveletsLevelsValue = {
    action: "temp",
    newFilePath: "",
    showLevels: false,
    dirPath: "",
}

interface WaveletsLevelsProps {
    value: WaveletsLevelsValue,
    onInputChange: Function,
    error: boolean,
    onErrorChange: Function,
}

export default function WaveletsShowLevels(props: WaveletsLevelsProps) {

    const onValChange = (key: string, value: any) => {
        props.onInputChange({
            ...props.value,
            [key]: value,
        })
    }  
    function onActionSelect(val: string) {
        onValChange("action", val);
    }
    const [fileObj, setFileObj] = useState({
        "path": "",
    })
    function onFileChange(fileObj: any) {
        setFileObj(fileObj);
        onValChange("dirPath", fileObj['path']);
    }
    const [exportFileName, setExportFileName] = useState("");
    const [exportFileNameError, setExportFileNameError] = useState(false);
    const onExportFileNameChange = (e: any) => {
        setExportFileName(e.target.value ?? "");
    }
    const onExportFileErrorChange = (error: boolean) => {
        setExportFileNameError(error);
        props.onErrorChange(error);
    } 
    const [fileExistCheck, setFileExistCheck] = useState(false);
    const onFileExistCheckChange = (exists: boolean) => {
        setFileExistCheck(exists); 
        props.onErrorChange(!exists);
    }
    const [fileExists, setFileExists] = useState(false);
    const onFileExistsChange = (exists: boolean) => {
        setFileExists(exists);
        props.onErrorChange(exists);
    } 
    const onFilePathChange = (path: string) => {
        onValChange("newFilePath", path);
    }

    return (

        <React.Fragment
            key = {"Wavelets Show Levels"}
        >
            <DropdownBool
                title = {""}
                description = {"Would you like a second plot of all the levels of the discrete wavelets?"}
                bool={props.value.showLevels}
                onBoolChange={(e: any) => {onValChange("showLevels", e.target.value ?? false)}}
            />

            {
                props.value.showLevels && 
                <SelectAction 
                    key = {"Select Action WAVELETS"}
                    action = {props.value.action}
                    onActionChange={onActionSelect}
                    fileObj={fileObj}
                    onFileChange={onFileChange}
                    onFileNameChange={onExportFileNameChange}
                    fileNameExt={".html"}
                    fileName={exportFileName}
                    onFileNameErrorChange={onExportFileErrorChange}
                    fileNameError={exportFileNameError}
                    exportLabel={"Export HTML"}
                    fileExistCheck={fileExistCheck}
                    onFileExistCheckChange={onFileExistCheckChange}
                    filePath={props.value.newFilePath} 
                    onFilePathChange={onFilePathChange}
                    fileExists={fileExists}
                    onFileExistsChange={onFileExistsChange}
                />
            }


        </React.Fragment>

    )

}