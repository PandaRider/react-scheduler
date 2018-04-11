import { getCourses } from '../utils/Firebase';

export const UPDATE_COURSES = 'UPDATE_COURSES';

export function updateCourses(courses) {
	return {
		type: UPDATE_COURSES,
		courses,
	};
}

export function fetchCourses(isAdmin, uid = null) {
	return (dispatch) => {
		getCourses(uid).then(courses => {
			dispatch(updateCourses(courses));
		});
	};
};