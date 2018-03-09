export default class Course {
  constructor(key, id, name) {
    this.key = key;
    this.id = id;
    this.name = name;
  }

  asObject() {
    return {
      id: this.id,
      name: this.name,
    };
  }
}