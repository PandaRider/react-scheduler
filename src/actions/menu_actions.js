import { CHANGE_MAIN_TAB, ADD_SUBJECT } from './types';

export const changeTab = (tabNo) => ({
    type: CHANGE_MAIN_TAB,
    payload: tabNo,
})

export const addSubject = (subjectName) => ({
    type: ADD_SUBJECT,
    payload: subjectName,
})
