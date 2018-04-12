import Firebase from 'firebase';
import constants from './Constants';
var _ = require('lodash');

const config = require('./firebase_config.json');
const firebaseApp = Firebase.initializeApp(config);

const COURSES = 'courses/';
const EVENTS = 'events/';
const USERS = 'users/';
const CHAT = 'chat/'

function getSnap(ref) {
  return new Promise(resolve => {
    ref.on('value', snap => resolve(snap));
  });
}

export async function getCourses(uid = null) {
  let path = uid === null ? COURSES : COURSES + uid;
  let ref = firebaseApp.database().ref(path);
  let snap = await getSnap(ref);

  if (uid === null) {
    let obj = {};
    snap.forEach(child => {
      let uid = child.key;
      let courses = child.val();

      let items = [];
      for (var key in courses) {
        let course = _.pick(courses[key], constants.courses.fields);
        course = Object.assign({ uid, key, }, course);
        items.push(course);
      }

      obj[uid] = items;
    });

    return obj;
  }
  else {
    let items = [];
    snap.forEach(child => {
      let course = _.pick(child.val(), constants.courses.fields);
      course.key = child.key;
      items.push(course);
    });
    return items;
  }
}

export function addCourse(uid, course) {
  let path = uid === null ? COURSES : COURSES + uid;
  let ref = firebaseApp.database().ref(path);
  ref.push(course);
  console.log('Added course', uid, course);
}

export function updateCourse(uid, key, course) {
  let ref = firebaseApp.database().ref(COURSES + uid + '/' + key);
  let newCourse = _.pick(course, constants.courses.fields);
  ref.set(newCourse);
  console.log('Updated course', newCourse);
}

export function deleteCourse(uid, key) {
  let ref = firebaseApp.database().ref(COURSES + uid);
  ref.child(key).remove();
}

export async function getEvents(uid = null) {
  let path = EVENTS;
  let ref = firebaseApp.database().ref(path);
  let snap = await getSnap(ref);

  let events = [];
  snap.forEach(child => {
    let id = child.key;
    let { title, desc, start, end, uid } = child.val();

    events.push({
      id,
      uid,
      title,
      desc,
      start: new Date(start),
      end: new Date(end),
    });
  });
  
  return events;
}

export function setEvents(events) {
  let ref = firebaseApp.database().ref(EVENTS);
  ref.set(events);
}

export function setMessage(uid, msg) {
  let ref = firebaseApp.database().ref(CHAT).child('MhfSenYDsYh4b6G41hmsk1KKcxF2').push();
  ref.set( { message: msg } );
}