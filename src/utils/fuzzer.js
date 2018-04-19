function randomString() {
	return Math.random().toString(36).slice(2);
}
function randomInteger(min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
}

function course() {
	return {
		uid: randomString(),
		subj_name: randomString(),
		subj_code: randomString(),
		student_count: randomInteger(0, 1000),
		cbl_hours: randomInteger(0, 12) * 0.5,
		lecture_hours: randomInteger(0, 12) * 0.5,
		merged_lectures: randomInteger(0, 1) == 0 ? false : true,
	};
}

export function getCourses(n = 10) {
	let courses = {};
	for (let i=0; i<n; i++) {
		let c = course();
		courses[c.uid] = [c];
	}
	return courses;
}