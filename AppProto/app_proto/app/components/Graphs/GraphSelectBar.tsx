import React, {useState} from "react";
import {useDispatch} from "react-redux";
import SelectBatchBtn from '../SelectBatchBtn';
import SelectGraphBtn from '../SelectGraphBtn';
import {notifsActionsHandler} from "../../functions/reduxHandlers/handlers";
import Button from '@material-ui/core/Button';

type GraphSelectBarProps = {
    onGraphSelect: any,
}

export default function GraphSelectButtons(props: GraphSelectBarProps) {

    const dispatch = useDispatch();

    const notifActionHandler = new notifsActionsHandler(dispatch, "Created Graphs");

    const [batchName, setBatchName] = useState("");
    const onBatchNameSelect = (batchName: string) => {
        setBatchName(batchName);
        resetGraphSelect();
    }

    const resetGraphSelect = () => {
        onGraphSelect("", "");
    }

    const [graphName, setGraphName] = useState("");
    const [graphPath, setGraphPath] = useState("");
    const onGraphSelect = (graphName: string, graphPath: string) => {
        setGraphName(graphName);
        setGraphPath(graphPath);
        props.onGraphSelect(graphName, graphPath);
    }

    return (
        <div
            className = "btnContainer"
        >   

            <SelectBatchBtn 
                batchName={batchName}
                onBatchSelect={onBatchNameSelect}
            />

            <SelectGraphBtn 
                batchName={batchName}
                onToggleError={(error: string) => notifActionHandler.showErrorNotif(error)}
                onGraphSelect={onGraphSelect}
                graphName={graphName}
                graphPath={graphPath}
            />

        </div>
    )

}
