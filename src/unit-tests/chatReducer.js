import React from 'react';
import Chat from '../reducers/chat';
import { SET_MESSAGE, FETCH_MESSAGES, INIT_MESSAGES } from '../actions/types';

describe('Chat reducer', () => {
    it('should send a single message from client', () => {
        expect(
            Chat(undefined, { type: SET_MESSAGE, payload: { userType: 'tester', message: 'test message'} })
        ).toEqual([
            { userType: 'tester', message: 'test message'}
        ])
    })
    
    it('should receive an array of messages from remote backend', () => {
        expect(
            Chat(undefined, { type: FETCH_MESSAGES, payload: 
              { userType: 'tester2', message: 'test message'},
            })
        ).toEqual([
          { userType: 'tester1', message: 'test message'},
          
        ])
    })
    it('should initialize array when mounted', () => {
        expect(
            Chat(undefined, { type: INIT_MESSAGES, payload: { userType: 'tester', message: 'test message'} })
        ).toEqual([
            { userType: 'tester', message: 'test message'}
        ])
    })

})