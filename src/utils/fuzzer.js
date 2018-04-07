function randomString() {
	return Math.random().toString(36).slice(2);
}
function randomInteger(min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
}

function course() {
	return {
		subj_name: randomString(),
		subj_code: randomString(),
		student_count: randomInteger(0, 1000),
		cbl_hours: randomInteger(0, 12) * 0.5,
		lecture_hours: randomInteger(0, 12) * 0.5,
		merged_lectures: true,
	};
}

