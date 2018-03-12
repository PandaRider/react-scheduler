import { CHANGE_MAIN_TAB } from './types';

export const changeTab = (tabNo) => ({
    type: CHANGE_MAIN_TAB,
    payload: tabNo,
})