import React from 'react';
import Menu from '../reducers/menu';
import { CHANGE_MAIN_TAB, ADD_SUBJECT } from '../types';

describe('Menu reducer', () => {
    it('should change tabs', () => {
        expect(
            Menu(undefined, { type: CHANGE_MAIN_TAB })
        ).toEqual({
            tab: true,
        })
    })
    
    it('should handle signing out', () => {
        expect(
            Menu(undefined, { type: ADD_SUBJECT })
        ).toBeFalsy({
            subjectName: null,
        })
    })

})