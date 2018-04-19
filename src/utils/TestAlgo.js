import { algo } from './algo';
import { getCourses, setEvents } from './Firebase';
let _ = require('lodash');
let assert = require('assert');
let fuzzer = require('./fuzzer');

function testNoLessonOutsideSchoolHours(timetable) {
	let datesParsed = timetable.map(event => {
		let { start, end } = event;
		return {
			start: new Date(start),
			end: new Date(end),
		};
	});
	let timesParsed = datesParsed.map(date => {
		let { start, end } = date;
		let pad = (n) => _.padStart(n, 2, '0');
		let convert = (date) => pad(date.getHours()) + pad(date.getMinutes());
		return {
			start: convert(start),
			end: convert(end),
		};
	});

	timesParsed.forEach(time => {
		let { start, end } = time;
		assert(start >= '0830', time);
		assert(end <= '1800', time);
	});
}

function testNoClashOfLocation(timetable) {
	let locations = new Set(timetable.map(event => event.location));
	for (let location of locations) {
		let events = timetable.filter(event => event.location === location);
		let times = events.map(event => {
			let { start, end } = event;
			return {
				start: new Date(start),
				end: new Date(end),
			}
		});

		for (let a of times) {
			for (let b of times) {
				if (a === b) continue;
				assert.equal(a.start < b.end && a.end > b.start, false, {a, b});
			}
		}
	}
}

function testNoClashOfProf(timetable) {
	let profs = new Set(timetable.map(event => event.uid));
	for (let prof of profs) {
		let events = timetable.filter(event => event.uid === prof);
		let times = events.map(event => {
			let { start, end } = event;
			return {
				start: new Date(start),
				end: new Date(end),
			};
		});

		for (let a of times) {
			for (let b of times) {
				if (a === b) continue;
				assert.equal(a.start < b.end && a.end > b.start, false, {a, b});
			}
		}
	}
}

function testTotalHours(courses, timetable) {
	let courseHours = 0;
	for (let uid in courses)
		for (let course of courses[uid])
			courseHours += course.cbl_hours + course.lecture_hours;

	let dateDiff = (a, b) => {
		a = new Date(a);
		b = new Date(b);
		let ms = b.getTime() - a.getTime();
		return ms / 1000 / 60 / 60;
	}
	let times = timetable.map(event => dateDiff(event.start, event.end));
	assert.equal(courseHours, _.sum(times));
}

function unitTest() {
	let courses = fuzzer.getCourses();
	let timetable = algo(courses);
	testNoLessonOutsideSchoolHours(timetable);
	testNoClashOfLocation(timetable);
	testNoClashOfProf(timetable);
	testTotalHours(courses, timetable);
	console.log('Timetable unit testing passed');
}

function performanceTest() {
	let courses = fuzzer.getCourses();

	let timings = [];
	for (let i=0; i<100; i++) {
		console.log(i);
		let start = performance.now();
		let timetable = algo(courses);
		let end = performance.now();

		let elapsed = end - start;
		timings.push(elapsed);
	}
	console.log('Performance testing', _.sum(timings)/timings.length);
	// 3781.544
}

function loadTest() {
	for (let i=10; i<20; i++) {
		let courses = fuzzer.getCourses(i);
		algo(courses);
		console.log(i, 'done');
	}
}
