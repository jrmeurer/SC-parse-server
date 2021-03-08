"use strict";

class Id {
  constructor(className, objectId) {
    this.className = className;
    this.objectId = objectId;
  }

  toString() {
    return this.className + ':' + this.objectId;
  }

  static fromString(str) {
    var split = str.split(':');

    if (split.length !== 2) {
      throw new TypeError('Cannot create Id object from this string');
    }

    return new Id(split[0], split[1]);
  }

}

module.exports = Id;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9MaXZlUXVlcnkvSWQuanMiXSwibmFtZXMiOlsiSWQiLCJjb25zdHJ1Y3RvciIsImNsYXNzTmFtZSIsIm9iamVjdElkIiwidG9TdHJpbmciLCJmcm9tU3RyaW5nIiwic3RyIiwic3BsaXQiLCJsZW5ndGgiLCJUeXBlRXJyb3IiLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOztBQUFBLE1BQU1BLEVBQU4sQ0FBUztBQUlQQyxFQUFBQSxXQUFXLENBQUNDLFNBQUQsRUFBb0JDLFFBQXBCLEVBQXNDO0FBQy9DLFNBQUtELFNBQUwsR0FBaUJBLFNBQWpCO0FBQ0EsU0FBS0MsUUFBTCxHQUFnQkEsUUFBaEI7QUFDRDs7QUFDREMsRUFBQUEsUUFBUSxHQUFXO0FBQ2pCLFdBQU8sS0FBS0YsU0FBTCxHQUFpQixHQUFqQixHQUF1QixLQUFLQyxRQUFuQztBQUNEOztBQUVELFNBQU9FLFVBQVAsQ0FBa0JDLEdBQWxCLEVBQStCO0FBQzdCLFFBQUlDLEtBQUssR0FBR0QsR0FBRyxDQUFDQyxLQUFKLENBQVUsR0FBVixDQUFaOztBQUNBLFFBQUlBLEtBQUssQ0FBQ0MsTUFBTixLQUFpQixDQUFyQixFQUF3QjtBQUN0QixZQUFNLElBQUlDLFNBQUosQ0FBYywwQ0FBZCxDQUFOO0FBQ0Q7O0FBQ0QsV0FBTyxJQUFJVCxFQUFKLENBQU9PLEtBQUssQ0FBQyxDQUFELENBQVosRUFBaUJBLEtBQUssQ0FBQyxDQUFELENBQXRCLENBQVA7QUFDRDs7QUFsQk07O0FBcUJURyxNQUFNLENBQUNDLE9BQVAsR0FBaUJYLEVBQWpCIiwic291cmNlc0NvbnRlbnQiOlsiY2xhc3MgSWQge1xuICBjbGFzc05hbWU6IHN0cmluZztcbiAgb2JqZWN0SWQ6IHN0cmluZztcblxuICBjb25zdHJ1Y3RvcihjbGFzc05hbWU6IHN0cmluZywgb2JqZWN0SWQ6IHN0cmluZykge1xuICAgIHRoaXMuY2xhc3NOYW1lID0gY2xhc3NOYW1lO1xuICAgIHRoaXMub2JqZWN0SWQgPSBvYmplY3RJZDtcbiAgfVxuICB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLmNsYXNzTmFtZSArICc6JyArIHRoaXMub2JqZWN0SWQ7XG4gIH1cblxuICBzdGF0aWMgZnJvbVN0cmluZyhzdHI6IHN0cmluZykge1xuICAgIHZhciBzcGxpdCA9IHN0ci5zcGxpdCgnOicpO1xuICAgIGlmIChzcGxpdC5sZW5ndGggIT09IDIpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0Nhbm5vdCBjcmVhdGUgSWQgb2JqZWN0IGZyb20gdGhpcyBzdHJpbmcnKTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBJZChzcGxpdFswXSwgc3BsaXRbMV0pO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gSWQ7XG4iXX0=