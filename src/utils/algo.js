import * as _ from 'lodash';
import * as moment from 'moment';
import { getCourses, setEvents } from './Firebase';

// quick utility functions
let min = (arr) => arr.reduce((m, e) => e < m ? e : m);
let max = (arr) => arr.reduce((m, e) => e > m ? e : m);

// contains static information on timings, locations of lessons
function generateSlots() {
	let daySlots = [1, 2, 3, 4, 5];

	let timeSlots = [];
	let h = 8, m = '30';
	while (h < 18) {
		let start = _.padStart(h, 2, '0') + m;
		
		h = m === '00' ? h : h + 1;
		m = m === '00' ? '30' : '00';
		let end = _.padStart(h, 2, '0') + m;

		timeSlots.push({
			start,
			end,
		});
	}

	let locationSlots = [
		{
			name: 'LT',
			type: 'Lecture',
			capacity: 150,
		},
		{
			name: 'CC',
			type: 'CBL',
			capacity: 50,
		},
		{
			name: 'TT',
			type: 'CBL',
			capacity: 25,
		},
	];

	let slots = [];
	for (let day of daySlots)
		for (let time of timeSlots)
			for (let location of locationSlots)
				slots.push({
					day,
					time,
					location,
				});

	// number the elements with its index for identification later
	for (let i=0; i<slots.length; i++) slots[i].id = i;
	return slots;
}

// splits a course of n hours into a list of smaller hours
function divide(course, hours = null) {
	if (hours == null) {
		let attrs = ['uid', 'subj_name', 'subj_code', 'student_count'];
		let info = _.pick(course, attrs);

		let cbl = Object.assign({ type: 'CBL' }, info);
		let lec = Object.assign({ type: 'Lecture'}, info);

		let cblEvents = divide(cbl, course.cbl_hours);
		let lecEvents = divide(lec, course.lecture_hours);

		let events = [];
		events.push(...cblEvents, ...lecEvents);
		return events;
	}

	// return as a list to allow recursive extension of list
	if (hours <= 2.0) return [Object.assign({hours}, course)];

	if (hours % 1.0 == 0) {
		let result = divide(course, 2.0);
		result.push(...divide(course, hours - 2.0));
		return result;
	}
	else {
		let result = divide(course, 1.5);
		result.push(...divide(course, hours - 1.5));
		return result;
	}
}

// processes courses object from firebase into list
function coursesToEvents(courses) {
	// unpack courses into single list
	let courseList = [];
	for (let key in courses) courseList.push(...courses[key]);

	// divide courses into sessions of 0-2 hours
	let eventList = [];
	courseList.map(course => eventList.push(...divide(course)));

	// number the elements with its index for identification later
	for (let i=0; i<eventList.length; i++) eventList[i].id = parseInt(i);
	return eventList;
}

// consolidates individual slots into firebase-usable events
function processSlots(slots, events) {
	let results = [];
	let usedSlots = slots.filter(slot => slot.eventId !== undefined && slot.eventId !== -1);
	let uniqueEvents = new Set(usedSlots.map(slot => slot.eventId));
	for (let eventId of uniqueEvents) {
		let eventSlots = slots.filter(slot => slot.eventId === eventId);

		let start = min(eventSlots.map(slot => slot.time.start));
		let end = max(eventSlots.map(slot => slot.time.end));

		// day hacking
		let startOfWeek = new Date(2018, 0, 29);
		let dayOfEvent = new Date(startOfWeek);
		dayOfEvent.setDate(startOfWeek.getDate() + eventSlots[0].day - 1);

		let startDate = new Date(dayOfEvent);
		startDate.setHours(start.slice(0, 2));
		startDate.setMinutes(start.slice(2));
		startDate = moment(startDate).format();

		let endDate = new Date(dayOfEvent);
		endDate.setHours(end.slice(0, 2));
		endDate.setMinutes(end.slice(2));
		endDate = moment(endDate).format();

		// dates are string-formatted for firebase
		let { uid, subj_name, subj_code, type } = events[eventId];
		results.push({
			uid,
			type,
			title: subj_name,
			desc: subj_code,
			location: eventSlots[0].location.name,
			start: startDate,
			end: endDate,
		});
	}
	return results;
}

function algo(courses) {
	let slots = generateSlots(); console.log('slots', slots);
	let events = coursesToEvents(courses); console.log('events', events);

	// begin by placing lectures first
	let lectures = events.filter(event => event.type === 'Lecture');
	for (let previousId = null; lectures.length > 0; ) { // used a for-loop to scope previousId
		let lectureSlots = slots.filter(slot => slot.location.type === 'Lecture');
		let availableSlots = lectureSlots.filter(slot => slot.eventId == undefined);

		let lecture = _.sample(lectures);
		let numSlots = parseInt(lecture.hours / 0.5);

		// check if there are enough slots for the rest of the day (n / n+1)
		let offset = 0;
		let n = lecture.uid !== previousId ? numSlots : numSlots + 1;
		let remainingSlots = availableSlots.filter(slot => slot.day === availableSlots[0].day);
		if (n > remainingSlots.length) {
			for (let slot of remainingSlots) slot.eventId = -1; // block the rest of the day
			offset = remainingSlots.length; // allow this iteration to skip over these lessons
			// did not remove the previousId here, so that sometimes people start at 9am
		}


		if (lecture.uid !== previousId) { // simply assign back to back use of LT
			for (let i=0; i<numSlots; i++) availableSlots[i + offset].eventId = lecture.id;
		}
		else { // otherwise give 0.5 hours break
			availableSlots[offset].eventId = -1;
			for (let i=0; i<numSlots; i++) availableSlots[i+1 + offset].eventId = lecture.id;
		}

		lectures = lectures.filter(item => item !== lecture);
		previousId = lecture.uid;
	}

	let results = processSlots(slots, events);
	return results;
}
/*
[
	{
		uid,
		title,
		desc,
		location,
		start,
		end,
	},
]
*/

async function test() {
	let courses = await getCourses();
	//let course = courses['MhfSenYDsYh4b6G41hmsk1KKcxF2'][0];
	let results = algo(courses);
	console.log(results);
	setEvents(results);
}

test();