import Auth from '../reducers/auth';
import { AUTH_USER, SIGN_OUT_USER } from '../actions';

describe('Authentication reducer', () => {
    it('should handle signing in', () => {
        expect(
            Auth(undefined, { type: AUTH_USER })
        ).toEqual({
            authenticated: true,
            error: null
        })
    })
    
    it('should handle signing out', () => {
        expect(
            Auth(undefined, { type: SIGN_OUT_USER })
        ).toEqual({
            authenticated: false,
            error: null
        })
    })

})