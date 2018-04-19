import * as _ from 'lodash';
import * as moment from 'moment';
import constants from './Constants';
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

	let { capacity } = constants.locations;
	let locationSlots = [
		{
			name: 'Albert Hong Lecture Theater',
			type: 'LT',
			capacity: capacity.LT,
		},
		{
			name: 'Cohort Classroom 14',
			type: 'CC',
			capacity: capacity.CC,
		},
		{
			name: 'Think Tank 18',
			type: 'TT',
			capacity: capacity.TT,
		},
	];

	let slots = [];
	for (let location of locationSlots)
		for (let day of daySlots)
			for (let time of timeSlots)
				slots.push({
					day,
					time,
					location,
				});

	for (let i=0; i<slots.length; i++) {
		slots[i].id = i; // number the elements with its index for identification later
		slots[i].eventId = null; // preset eventId field
	}
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

	if (hours % 1.0 === 0) {
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
	for (let i=0; i<eventList.length; i++) eventList[i].id = i;
	return eventList;
}

function placeLectures(slots, events) {
	// begin by placing lectures first
	let lectures = events.filter(event => event.type === 'Lecture');
	for (let previousId = null; lectures.length > 0; ) { // used a for-loop to scope previousId
		let lectureSlots = slots.filter(slot => slot.location.type === 'LT');
		let availableSlots = lectureSlots.filter(slot => slot.eventId === null); // fetches non-assigned/non-blocked slots

		let lecture = _.sample(lectures);
		let numSlots = parseInt(lecture.hours / 0.5, 10);

		// check if there are enough slots for the rest of the day (n / n+1)
		let offset = 0;
		let n = lecture.uid !== previousId ? numSlots : numSlots + 1;
		let remainingSlots = availableSlots.filter(slot => slot.day === availableSlots[0].day);
		if (n > remainingSlots.length) {
			for (let slot of remainingSlots) slot.eventId = -1; // block the rest of the day
			offset = remainingSlots.length; // allow this iteration to skip over these lessons
			// did not remove the previousId here, so that sometimes people start at 9am
			previousId = -1;
		}


		if (lecture.uid !== previousId) { // simply assign back to back use of LT
			for (let i=0; i<numSlots; i++) availableSlots[i + offset].eventId = lecture.id;
		}
		else { // otherwise give 0.5 hours break
			availableSlots[offset].eventId = -1; // block it here
			for (let i=0; i<numSlots; i++) availableSlots[i+1 + offset].eventId = lecture.id;
		}

		lectures = lectures.filter(item => item !== lecture);
		previousId = lecture.uid;
	}

	// lecture cleanup - remove all temporarily marked slots
	for (let slot of slots.filter(slot => slot.eventId === -1)) slot.eventId = null;
}

function placeLargeCohorts(slots, events) {
	let largeCohorts = events.filter(event => event.type === 'CBL' && event.student_count > constants.locations.capacity.TT);
	while (largeCohorts.length > 0) {
		let cohort = _.sample(largeCohorts);
		let numSlots = parseInt(cohort.hours / 0.5, 10);

		// get all slots where prof is free && all slots where location is free 
		let profUnavailable = slots.filter(slot => slot.eventId !== null && events[slot.eventId].uid === cohort.uid);
		let locAvailable = slots.filter(slot => slot.location.type === 'CC' && slot.eventId === null);
		// check if slot in {locAvailable} clashes in timing with any slot in {profUnavailable}
		let clash = (slot) => {
			for (let unavailable of profUnavailable) {
				if (slot.day === unavailable.day && slot.time.start === unavailable.time.start && slot.time.end === unavailable.time.end) return true;
			}
			return false;
		};
		let available = locAvailable.filter(slot => !clash(slot));

		// find first chunk of slots to fit {cohort}
		let fit = (slots, index, numSlots) => {
			let id = slots[index].id;
			let day = slots[index].day;
			for (let i=1; i<=numSlots; i++) { // allocate n+1 slots - 0.5 hour break before lesson
				if (slots[index+i].id !== id + i || slots[index+i].day !== day) return false;
			}
			return true;
		};

		for (let i=0; i<available.length - numSlots; i++) {
			if (fit(available, i, numSlots)) {
				for (let j=1; j<=numSlots; j++) available[i+j].eventId = cohort.id;
				break;
			}
		}

		largeCohorts = largeCohorts.filter(item => item !== cohort);
	}
}

function placeRemainingCohorts(slots, events) {
	// grab all unique eventId that has been assigned to slots
	let allocatedEvents = new Set(slots.filter(slot => slot.eventId !== null).map(slot => slot.eventId));
	// now grab all events that have not been assigned
	let cohorts = events.filter(event => event.type === 'CBL' && !allocatedEvents.has(event.id));

	while (cohorts.length > 0) {
		let cohort = _.sample(cohorts);
		let numSlots = parseInt(cohort.hours / 0.5, 10);

		// get all slots where prof is free && all slots where location is free 
		let profUnavailable = slots.filter(slot => slot.eventId != null && events[slot.eventId].uid === cohort.uid);
		// here the difference is any location that is not LT is usable
		let locAvailable = slots.filter(slot => slot.location.type !== 'LT' && slot.eventId === null);
		// check if slot in {locAvailable} clashes in timing with any slot in {profUnavailable}
		let clash = (slot) => {
			for (let unavailable of profUnavailable) {
				if (slot.day === unavailable.day && slot.time.start === unavailable.time.start && slot.time.end === unavailable.time.end) return true;
			}
			return false;
		};
		let available = locAvailable.filter(slot => !clash(slot));

		// find first chunk of slots to fit {cohort}
		let fit = (slots, index, numSlots) => {
			let id = slots[index].id;
			let day = slots[index].day;
			for (let i=1; i<=numSlots; i++) { // allocate n+1 slots - 0.5 hour break before lesson
				if (slots[index+i].id !== id + i || slots[index+i].day !== day) return false;
			}
			return true;
		};

		for (let i=0; i<available.length - numSlots; i++) {
			if (fit(available, i, numSlots)) {
				for (let j=1; j<=numSlots; j++) available[i+j].eventId = cohort.id;
				break;
			}
		}

		cohorts = cohorts.filter(item => item !== cohort);
	}
}

function swapSlots(slots, events) {
	let trySwap = (slots1, slots2) => {
		let event1 = events[slots1[0].eventId];
		let event2 = events[slots2[0].eventId];

		// first check if swapping will result in self conflict
		let time1 = {
			start: min(slots1.map(slot => slot.time.start)),
			end: max(slots1.map(slot => slot.time.end)),
		};
		let time2 = {
			start: min(slots2.map(slot => slot.time.start)),
			end: max(slots2.map(slot => slot.time.end)),
		};

		let clash = (slot, time, uid) => {
			let timeCheck = slot.time.start < time.end && slot.time.end > time.start; // find all slots within that time
			let uidCheck = slot.eventId !== null && events[slot.eventId].uid === uid;  // find all slots that this guy owns
			return timeCheck && uidCheck;
		};

		let target1 = slots.filter(slot => clash(slot, time2, event1.uid));
		let target2 = slots.filter(slot => clash(slot, time1, event2.uid));

		if (target1.length > 0 || target2.length > 0) return false;

		// move on
		let shorter = event1.hours < event2.hours ? slots1 : slots2;
		let longer = shorter === slots1 ? slots2 : slots1;

		let shortEvent = shorter[0].eventId;
		let longEvent = longer[0].eventId;
		let shortDay = shorter[0].day;
		let longDay = longer[0].day;

		let slotDiff = longer.length - shorter.length;
		let frontPtr = min(shorter.map(slot => slot.id));
		let backPtr = max(shorter.map(slot => slot.id));
		let counter = 0;

		while (counter < slotDiff) {
			// check if can expand around {shorter}
			let leftCapped = frontPtr - 1 < 0 || slots[frontPtr - 1].eventId !== null || slots[frontPtr - 1].day !== shortDay;
			let rightCapped = backPtr + 1 >= slots.length || slots[backPtr + 1].eventId !== null || slots[backPtr + 1].day !== shortDay;

			if (leftCapped && rightCapped) return false;

			if (leftCapped) {
				backPtr++;
			}
			else if (rightCapped) {
				frontPtr--;
			}
			else {
				if (counter % 2 == 1) frontPtr--;
				else backPtr++;
			}
			counter++;
		}

		let shortPtr = longer[0].id;
		// fit longer
		for (let i=frontPtr; i<=backPtr; i++) {
			slots[i].eventId = longEvent;
		}
		// fit shorter
		for (let i=0; i<shorter.length; i++) {
			slots[shortPtr + i].eventId = shortEvent;
		}
		for (let i=shorter.length; i<longer.length; i++) {
			slots[shortPtr + i].eventId = null;
		}

		return true;
	}

	// start swapping at random
	let a = _.sample(slots.filter(slot => slot.eventId !== null));
	let b = _.sample(slots.filter(slot => slot.eventId !== a.eventId));
	let slots1 = slots.filter(slot => slot.eventId === a.eventId);

	// if b is empty space, simply transfer a over
	if (b.eventId === null) {
		// check if there's space to move over
		for (let i=0; i<slots1.length; i++) {
			if (b.id + i >= slots.length) return false; // check if out-of-bounds
			if (slots[b.id + i].day !== slots[b.id].day) return false; // check if overflow of day
			if (slots[b.id + i].eventId !== null) return false; // check if clash with another course
			// check if already have lesson in that time
			let sameTime = slots.filter(slot => slot.time.start === slots[b.id + i].time.start);
			for (let slot of sameTime) {
				if (slot.eventId === null) continue;
				if (events[slot.eventId].uid === events[a.eventId].uid) return false;
			}
		}
		// otherwise move it over
		for (let i=0; i<slots1.length; i++) {
			slots[b.id + i].eventId = slots1[i].eventId;
			slots1[i].eventId = null;
		}
		return true;
	}

	let slots2 = slots.filter(slot => slot.eventId === b.eventId);
	// otherwise, attempt to swap a and b
	return trySwap(slots1, slots2);
}

// consolidates individual slots into firebase-usable events
function processSlots(slots, events) {
	let timetable = [];
	let usedSlots = slots.filter(slot => slot.eventId !== null);
	let uniqueEvents = new Set(usedSlots.map(slot => slot.eventId));
	for (let eventId of uniqueEvents) {
		let eventSlots = slots.filter(slot => slot.eventId === eventId);

		let start = min(eventSlots.map(slot => slot.time.start));
		let end = max(eventSlots.map(slot => slot.time.end));

		// dates are string-formatted for firebase
		let { uid, subj_name, subj_code, type } = events[eventId];
		timetable.push({
			uid,
			type,
			title: subj_name,
			desc: subj_code,
			location: eventSlots[0].location.name,
			day: eventSlots[0].day,
			start,
			end,
		});
	}
	return timetable;
}

// assigns the actual date to the objects
function assignDates(timetable) {
	return timetable.map(event => {
		let startOfWeek = new Date(2018, 0, 28);
		let dayOfEvent = new Date(startOfWeek);
		dayOfEvent.setDate(startOfWeek.getDate() + event.day);

		let { start, end } = event;

		let startDate = new Date(dayOfEvent);
		startDate.setHours(start.slice(0, 2));
		startDate.setMinutes(start.slice(2));
		startDate = moment(startDate).format();

		let endDate = new Date(dayOfEvent);
		endDate.setHours(end.slice(0, 2));
		endDate.setMinutes(end.slice(2));
		endDate = moment(endDate).format();

		let datedEvent = _.pick(event, ['uid', 'type', 'title', 'desc', 'location']);

		return Object.assign(datedEvent, {
			start: startDate,
			end: endDate,
		});
	});
}

function score(timetable) {
	/* scoring system
		1. uniqueCourses - how many different types of courses are there in 1 day
		2. numCourses - how distributed are a prof's courses across the whole week
		3. numConsecutive - how many back-to-back lessons does a prof have
		4. numLunchBreaks - how many days does a prof have a break during lunch time (12 - 1)
		5. numEarlyClasses - how many days does a prof start at 830am
	*/
	let scores  = {
		uniqueCourses: 0,
		numCourses: 0,
		numConsecutive: 0,
		numLunchBreaks: 0,
		numEarlyClasses: 0,
	};

	let days = new Set(timetable.map(event => event.day));
	let profs = new Set(timetable.map(event => event.uid));

	// metric 1 - number of unique courses per day
	scores.uniqueCourses = 0;
	for (let prof of profs) {
		let profScore = 0;
		let profCourses = timetable.filter(event => event.uid === prof);
		for (let day of days) {
			let profCoursesOfDay = profCourses.filter(event => event.day === day);
			if (profCoursesOfDay.length === 0) {
				profScore += 1;
				continue;
			}

			let uniqueCoursesOfDay = new Set(profCoursesOfDay.map(event => event.title));
			profScore += uniqueCoursesOfDay.size / profCoursesOfDay.length;
		}
		profScore /= 5;
		scores.uniqueCourses += 1 - profScore; // profScore == 1 : 100% of events in a day are unique
	}
	scores.uniqueCourses /= profs.size;

	// metric 2 - number of courses each prof has in a day
	for (let prof of profs) {
		let profScore = 0;
		let profCourses = timetable.filter(event => event.uid === prof);
		let averageCoursesPerDay = profCourses.length / 5;
		for (let day of days) {
			let profCoursesOfDay = profCourses.filter(event => event.day === day);
			profScore += Math.abs(profCoursesOfDay.length - averageCoursesPerDay) / averageCoursesPerDay;
		}
		profScore /= 5;
		scores.numCourses += profScore; // profScore == 0 : number of events everyday in equal
	}
	scores.numCourses /= profs.size;

	// metric 3 - number of consecutive pairs of lessons per prof (no break)
	for (let prof of profs) {
		let profScore = 0;
		let profCourses = timetable.filter(event => event.uid === prof);
		for (let day of days) {
			let profCoursesOfDay = profCourses.filter(event => event.day === day);
			// no need to compute if only 1 lesson in a day
			if (profCoursesOfDay.length <= 1) continue;

			let profCoursesOfDayTimings = profCoursesOfDay.map(event => { return { start: event.start, end: event.end, }});
			profCoursesOfDayTimings.sort((a, b) => a.start < b.start ? -1 : 1);

			let consecutive = 0;
			for (let i=0; i<profCoursesOfDayTimings.length - 1; i++) {
				let a = profCoursesOfDayTimings[i];
				let b = profCoursesOfDayTimings[i+1];
				if (a.end === b.start) consecutive++;
			}
			profScore += consecutive / (profCoursesOfDay.length - 1);
		}
		profScore /= 5;
		scores.numConsecutive += profScore; // profScore == 0 : no consecutive lessons
	}
	scores.numConsecutive /= profs.size;

	// metric 4 - number of lunch breaks (12 - 1) per prof
	for (let prof of profs) {
		let profScore = 0;
		let profCourses = timetable.filter(event => event.uid === prof);
		for (let day of days) {
			let profCoursesOfDay = profCourses.filter(event => event.day === day);
			// check if any courses intersect with 12 - 1
			let lunchCourses = profCoursesOfDay.filter(event => event.start < '1300' && event.end > '1200');
			if (lunchCourses.length > 0) profScore++;
		}
		profScore /= 5;
		scores.numLunchBreaks += 1 - profScore; // profScore == 1 : lunch break available everyday
	}
	scores.numLunchBreaks /= profs.size;

	// metric 5 - number of early classes
	for (let prof of profs) {
		let profScore = 0;
		let profCourses = timetable.filter(event => event.uid === prof);
		for (let day of days) {
			let earlyCourses = profCourses.filter(event => event.day === day && event.start === '0830');
			if (earlyCourses.length > 0) profScore++;
		}
		profScore /= 5;
		scores.numEarlyClasses += 1 - profScore; // profScore == 1 : no 830am class everyday
	}
	scores.numEarlyClasses /= profs.size;

	return _.sum([
		4 * scores.uniqueCourses,
		6 * scores.numCourses,
		1 * scores.numConsecutive,
		1 * scores.numLunchBreaks,
		1 * scores.numEarlyClasses,
	]);
}

export function algo(courses) {
	let slots = generateSlots();
	let events = coursesToEvents(courses);

	// seed - create an initial random state
	placeLectures(slots, events);
	placeLargeCohorts(slots, events);
	placeRemainingCohorts(slots, events);

	// simulated annealing
	let temp = 100000;
	let coolingRate = 0.003;

	let timetable = processSlots(slots, events);
	let bestTimetable = timetable.slice();

	while (temp > 1) {
		while (!swapSlots(slots, events));
		let newTimetable = processSlots(slots, events);

		let currentScore = score(timetable);
		let newScore = score(newTimetable);

		if (newScore < currentScore) {
			timetable = newTimetable.slice();
		}
		else {
			if (Math.exp((currentScore - newScore) / temp) > Math.random()) {
				timetable = newTimetable.slice();
			}
		}

		if (newScore < score(bestTimetable)) {
			bestTimetable = newTimetable.slice();
		}

		temp *= 1 - coolingRate;
	}

	return assignDates(bestTimetable);
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
