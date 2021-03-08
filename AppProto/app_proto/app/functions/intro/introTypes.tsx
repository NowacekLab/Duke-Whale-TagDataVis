export interface IntroState {
    first: boolean 
}

export type GenericUpdateNotif = UpdateIntroStatus; 

interface UpdateIntroStatus {
    type: typeof SET_NOT_FIRST, 
    payload: IntroState,
}

export const SET_NOT_FIRST = "SET_NOT_FIRST_TIME";

export const USER_FIRST_TIME_KEY = 'userFirstTime';