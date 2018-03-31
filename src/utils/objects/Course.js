// subj_code, subj_name, type, student_count, cbl_hours, lecture_hours, merged_lectures

export default class Course {
  constructor(key, id, title, start, end, desc='') {
    this.key = key;
    this.id = id;
    this.title = title;
    this.start = start;
    this.end = end;
    this.desc = desc;
  }

  asFirebaseObject() {
    let { id, title, start, end, desc } = this;
    return {
      id,
      title,
      desc,
      start: start.toString(),
      end: end.toString(),
    };
  }
}