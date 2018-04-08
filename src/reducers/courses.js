import { UPDATE_COURSES } from '../actions';

const initialState = {
	courses: null,
};

export default function courses(state = initialState, action) {
	if (action.type === UPDATE_COURSES) {
		return {
			...state,
			courses: action.courses,
		};
	}
	else return state;
}