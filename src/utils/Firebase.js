import Firebase from 'firebase';
import Course from './objects/Course';

const config = require('./firebase_config.json');
const firebaseApp = Firebase.initializeApp(config);

const COURSES = 'courses';

function getSnap(ref) {
  return new Promise(resolve => {
    ref.on('value', snap => resolve(snap));
  });
}

async function getCourses() {
  let ref = firebaseApp.database().ref(COURSES);
  let snap = await getSnap(ref);

  let items = [];
  snap.forEach(child => {
    let course = new Course(child.key, child.val().name);
    items.push(course);
  });
  return items;
}

function addCourse(course) {
  let ref = firebaseApp.database().ref(COURSES);
  ref.push(course.asObject());
}

function removeCourse(course) {
  let ref = firebaseApp.database().ref(COURSES);
  ref.child(course.key).remove();
}


function testAddCourse() {
  addCourse(new Course(null, '10.009', 'Digital World'));
  addCourse(new Course(null, '10.010', 'Digital World 2'));
}

async function testGetCourse() {
  let courses = await getCourses();
  console.log(courses);
  return courses;
}

function testRemoveCourse(course) {
  removeCourse(course);
}

async function testCourse() {
  testAddCourse();
  let courses = await testGetCourse();
  testRemoveCourse(courses[1]);
}

//testCourse();