import Firebase from 'firebase';
import constants from './Constants';
var _ = require('lodash');

const config = require('./firebase_config.json');
const firebaseApp = Firebase.initializeApp(config);

const COURSES = 'courses/';

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
        course.key = child.key;
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

export function updateCourse(uid, course) {
  if (course.key == null) { // use == to catch both null and undefined
    console.error("Error updating course (key not found):", course);
    return;
  }

  let ref = firebaseApp.database().ref(COURSES + uid + '/' + course.key);
  ref.set(_.pick(course, constants.courses.fields));
}

export function removeCourse(uid, course) {
  let ref = firebaseApp.database().ref(COURSES + uid);
  ref.child(course.key).remove();
}

async function testGetCourse() {
  let uid = "MhfSenYDsYh4b6G41hmsk1KKcxF2";
  let courses = await getCourses();
  console.log(courses);
  return courses;
}

function testRemoveCourse(course) {
  removeCourse(course);
}

async function testUpdateCourse() {
  let courses = await getCourses();
  let course = courses[0];
  course.id = 3;
  updateCourse(course);
}

async function testCourse() {
  //testAddCourse();
  let courses = await testGetCourse();
  testRemoveCourse(courses[0]);
  testUpdateCourse();
}