export interface GraphFileState {
    chosenFile: string 
}

export type GenericGraphFileAction = ChangeChosenFile; 

export interface ChangeChosenFile {
    type: string, 
    payload: string
}