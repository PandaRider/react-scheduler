import { getCourses, setEvents } from './Firebase';
let moment = require('moment');
let _ = require('lodash');

function generateSlots() {
	let timeSlots = [];
	let h = 8, m = '30';
	while (h < 18) {
		let start = _.padStart(h, 2, '0') + m;
		
		h = m == '00' ? h : h + 1;
		m = m == '00' ? '30' : '00';
		let end = _.padStart(h, 2, '0') + m;

		timeSlots.push({
			start,
			end,
		});
	}

	let locationSlots = {
		lt1: {
			taken: false,
			capacity: 300,
			disp_name: 'lt1',
		},
		lt2: {
			taken: false,
			capacity: 150,
			disp_name: 'lt2',
		},
		lt3: {
			taken: false,
			capacity: 100,
			disp_name: 'lt3',
		},
		tt18: {
			taken: false,
			capacity: 20,
			disp_name: 'tt18',
		},
		cc14: {
			taken: false,
			capacity: 50,
			disp_name: '2.507',
		},
	};

	return {
		time_slots: timeSlots,
		location_slots: locationSlots,
	};
}

function map(inp){
	/*function objective: assign "day_of_week", "start", "end", "location" to provided input*/

	var pre_sl = generateSlots();
	/*subfunctions to remove unwanted slots like wednesday afternoon*/

	/*PREPROCESSOR1: section unpacks timeslots by adding day_of_week from mon-fri*/
	let start = new Date(2018, 0, 29);
	let days = _.range(5).map(i => {
		let date = new Date(start);
		date.setDate(date.getDate() + i);
		return date;
	});

	var sl={};
	var ts=[];
	for (let day of days) {
		for (let time of pre_sl.time_slots) {
			let start = new Date(day);
			start.setHours(time.start.slice(0, 2));
			start.setMinutes(time.start.slice(2));
			start = moment(start).format();

			let end = new Date(day);
			end.setHours(time.end.slice(0, 2));
			end.setMinutes(time.end.slice(2));
			end = moment(end).format();

			ts.push({
				start,
				end,
			});

			//var k=JSON.parse(JSON.stringify(pre_sl.time_slots[j]));
			//k.day_of_week=day;
			//ts.push(k);
		}
	}
	sl.time_slots=ts;
	sl.location_slots=pre_sl.location_slots;

	/*PREPROCESSOR2: section adds all venues to slots*/
	for (var i=0; i<sl.time_slots.length; i++){
		sl.time_slots[i].locs=JSON.parse(JSON.stringify(sl.location_slots)); /*do not take out parse and stringify; it is to make a deep copy instead of shallow copy*/
	}

	/*lectures = mon/tues*/
	/*place -> time*/
	var pre_req = inp;
	/*var pre_req=JSON.parse('{"101201685623458202163":[{"subj_code":"10.009","subj_name":"Digital World","student_count":50,"cbl_hours":6.0,"lecture_hours":0.0,"merged_lectures":true},{"subj_code":"50.004","subj_name":"Introduction to Algorithms","student_count":45,"cbl_hours":4.0,"lecture_hours":2.0,"merged_lectures":true}]}');*/

	/*PREPROCESSOR3: process the unprocessed form inputs of professors; gabriel's format to reqs.json format*/
	function sum(arr){
	  var total=0;
	  for (var i=0; i<arr.length; i++) { total += arr[i]; }
	  return total;
	}
	function divide(i){
		let sub=[];
		for(var n=0; n<Math.floor(Math.floor(2*i+1)/3)-1; n++){ sub.push(1.5); }
		if (sum(sub)<i){ sub.push(i-sum(sub)); }
		return sub;
	}
	let reqs={};
	let lessons=[];
	for (var prof in pre_req){
		for (var subj=0; subj<pre_req[prof].length; subj++){
			//console.log(pre_req[prof][subj]);
			var za=pre_req[prof][subj].subj_code;
			var zb=pre_req[prof][subj].subj_name;
			var zc=pre_req[prof][subj].student_count;
			var zd=pre_req[prof][subj].lecture_hours;
			var ze=pre_req[prof][subj].cbl_hours;
			var zf=pre_req[prof][subj].merged_lectures;
			var yd=divide(zd);
		    var ye=divide(ze);
		    
		    for (var g=0; g<yd.length; g++){
		      var l={};
		      l.subj_code=za;
		      l.subj_name=zb;
		      l.type="Lecture";
		      l.student_count=zc;
		      l.hrs=yd[g];
		      l.session_number=g+1;
		      l.merged_lectures=zf;
		      l.profId=prof;
		      lessons.push(l);
		    }

	       for (g=0; g<ye.length; g++){ /*reuse tha variables g*/
		      var l={};
		      l.subj_code=za;
		      l.subj_name=zb;
		      l.type="CBL";
		      l.student_count=zc;
		      l.hrs=ye[g];
		      l.session_number=g+1;
		      l.profId=prof;
		      lessons.push(l);
		    }
		}
	}
	reqs.lessons=lessons;
	pre_req=reqs;

	/*PREPROCESSOR4: section multiplies each req and assign suitable student_count & class_number, using coord.html input field totalStudents*/
	/*var totalStudents=document.getElementById('totalStudents').value;*/
	var totalStudents=20;
	var es=[];
	var accountedFor=0;
	for (var i=0;Math.ceil(totalStudents/i)>40;i++){}
	for (var j=0;j<i;j++){
		var thisClassStudents=Math.floor(totalStudents/i); 
		es.push(thisClassStudents); 
		accountedFor+=thisClassStudents; 
	}
	for (var k=totalStudents-accountedFor;k>0;k--){
	  es[k-1]+=1;
	}
	var req={};
	var re=[];
	for (var i=0;i<pre_req.lessons.length;i++){ 
		var k=JSON.parse(JSON.stringify(pre_req.lessons[i]));
		if (k.type=="Lecture" && k.merged_lectures){
			k.student_count=parseInt(totalStudents);
			k.class_number=1;
			re.push(k);
		} else {
			for (var j=0;j<es.length;j++){
				k=JSON.parse(JSON.stringify(k));
				k.student_count=es[j];
				k.class_number=j+1;
				re.push(k);
			}
		}

	}
	req.lessons=re;

	var subject_last_active_timeslot=0;
	/*main allocator function begins*/
	mainAllocator:
	for (var i=0; i<req.lessons.length; i++){
		var thisLesson = req.lessons[i];
		var duration=thisLesson.hrs;
		duration = duration *2; /*slots are 30mins each*/

		/*need mod location selector to depend on "student count" */
		/*TODO: across then down, prioritize finish lessons earlier*/
		/*TODO: compress schedule to remove empty spaces*/

		var suited_locs=[];
		for (var locs in sl.location_slots){
			if (thisLesson.student_count<=sl.location_slots[locs].capacity && sl.location_slots[locs].capacity<=1.5*thisLesson.student_count){
				/*suited_locs.push(Object.keys(sl.location_slots)[locs]);*/
				suited_locs.push(locs);
			}
		}
		if (suited_locs.length==0) throw new Error ("student_count unacceptable: "+thisLesson.student_count);
		/*		for (var thisLoc in suited_locs){*/
		suited_locs.reverse();
		// console.log(suited_locs);

		/*note this assumes a single subject. current input technique does not allow >1 subject, so unable to test*/
		timePlaceAllocator:
		for (var j=subject_last_active_timeslot; j<sl.time_slots.length-duration; j++){

			if (sl.time_slots[j].day_of_week!=sl.time_slots[j+duration].day_of_week) continue;	/*lesson will end past end of day*/

			// console.log("reach1");

			var emptyPlace=false;										/*try to find a loc in suited_locs*/
			locTrail:
			for (var m=0; m<suited_locs.length; m++){
				for (var n=0; n<duration; n++){
					if (sl.time_slots[j].locs[suited_locs[m]].taken){
						continue locTrail;
					}
				}
				emptyPlace=true;
			}
			if (!emptyPlace) continue;
			m--;

			// console.log("reach2");

			for (var p=j; p<j+duration; p++){								/*set slots to taken so others cannot take*/
				// console.log(sl.time_slots[p].locs);
				// console.log(suited_locs[m]);
				sl.time_slots[p].locs[suited_locs[m]].taken=true;
			}
			thisLesson.day_of_week=sl.time_slots[j].day_of_week;	/*assign values*/
			thisLesson.start=sl.time_slots[j].start;
			thisLesson.end=sl.time_slots[j+duration-1].end;
			thisLesson.location=suited_locs[m];
			subject_last_active_timeslot=j+duration;
			continue mainAllocator;

		}
	}
	return req.lessons;
}

export function generateEvents(courses) {
	let results = map(courses);
	let events = results.map(slot => {
		let { subj_code, subj_name, start, end, profId } = slot;
		return {
			uid: profId,
			title: subj_name,
			desc: subj_code,
			start,
			end,
		};
	});

	setEvents(events);
	return events;
}