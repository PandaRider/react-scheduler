import Firebase from 'firebase';
import Course from './objects/Course';

const config = require('./firebase_config.json');
const firebaseApp = Firebase.initializeApp(config);

const COURSES = 'courses/';

function getSnap(ref) {
  return new Promise(resolve => {
    ref.on('value', snap => resolve(snap));
  });
}

export async function getCourses() {
  let ref = firebaseApp.database().ref(COURSES);
  let snap = await getSnap(ref);

  let items = [];
  snap.forEach(child => {
    let { id, title, start, end, desc } = child.val();
    let course = new Course(child.key, id, title, new Date(start), new Date(end));
    items.push(course);
  });
  return items;
}

export function addCourse(course) {
  let ref = firebaseApp.database().ref(COURSES);
  console.log(course.asFirebaseObject());
  ref.push(course.asFirebaseObject());
}

export function updateCourse(course) {
  if (course.key == null) { // use == to catch both null and undefined
    console.error("Error updating course (key not found):", course);
    return;
  }

  let ref = firebaseApp.database().ref(COURSES + course.key);
  ref.set(course.asFirebaseObject());
}

export function removeCourse(course) {
  let ref = firebaseApp.database().ref(COURSES);
  ref.child(course.key).remove();
}


export function testAddCourse() {
  let c0 = new Course(null, -1, 'Heh', new Date(), new Date());
  let c1 = new Course(null, 0, 'Software Construction', new Date(2018, 0, 29, 8, 30, 0), new Date(2018, 0, 29, 10, 0, 0));
  let c2 = new Course(null, 6, 'Meeting', new Date(2018, 2, 12, 10, 30, 0, 0), new Date(2018, 2, 12, 12, 30, 0, 0), 'Pre-meeting meeting, to prepare for the meeting');
  addCourse(c0);
  addCourse(c1);
  addCourse(c2);
}

async function testGetCourse() {
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
  testAddCourse();
  let courses = await testGetCourse();
  testRemoveCourse(courses[0]);
  testUpdateCourse();
}