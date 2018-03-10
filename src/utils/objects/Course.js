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