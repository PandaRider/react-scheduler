import { CHANGE_MAIN_TAB, ADD_SUBJECT } from './types';

export const changeTab = (tabNo) => ({
    type: CHANGE_MAIN_TAB,
    payload: tabNo,
})

export const addSubject = (subjectName) => ({
    type: ADD_SUBJECT,
    payload: subjectName,
})

// export const testFirebase = () => (dispatch) => {
//     Firebase.database().ref('users').child('MhfSenYDsYh4b6G41hmsk1KKcxF2').child('name').once('value',
//         (snapshot) => dispatch(setTitle(snapshot.val())))
// }