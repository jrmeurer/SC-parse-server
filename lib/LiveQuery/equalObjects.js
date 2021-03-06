"use strict";

var toString = Object.prototype.toString;
/**
 * Determines whether two objects represent the same primitive, special Parse
 * type, or full Parse Object.
 */

function equalObjects(a, b) {
  if (typeof a !== typeof b) {
    return false;
  }

  if (typeof a !== 'object') {
    return a === b;
  }

  if (a === b) {
    return true;
  }

  if (toString.call(a) === '[object Date]') {
    if (toString.call(b) === '[object Date]') {
      return +a === +b;
    }

    return false;
  }

  if (Array.isArray(a)) {
    if (Array.isArray(b)) {
      if (a.length !== b.length) {
        return false;
      }

      for (var i = 0; i < a.length; i++) {
        if (!equalObjects(a[i], b[i])) {
          return false;
        }
      }

      return true;
    }

    return false;
  }

  if (Object.keys(a).length !== Object.keys(b).length) {
    return false;
  }

  for (var key in a) {
    if (!equalObjects(a[key], b[key])) {
      return false;
    }
  }

  return true;
}

module.exports = equalObjects;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9MaXZlUXVlcnkvZXF1YWxPYmplY3RzLmpzIl0sIm5hbWVzIjpbInRvU3RyaW5nIiwiT2JqZWN0IiwicHJvdG90eXBlIiwiZXF1YWxPYmplY3RzIiwiYSIsImIiLCJjYWxsIiwiQXJyYXkiLCJpc0FycmF5IiwibGVuZ3RoIiwiaSIsImtleXMiLCJrZXkiLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOztBQUFBLElBQUlBLFFBQVEsR0FBR0MsTUFBTSxDQUFDQyxTQUFQLENBQWlCRixRQUFoQztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUNBLFNBQVNHLFlBQVQsQ0FBc0JDLENBQXRCLEVBQXlCQyxDQUF6QixFQUE0QjtBQUMxQixNQUFJLE9BQU9ELENBQVAsS0FBYSxPQUFPQyxDQUF4QixFQUEyQjtBQUN6QixXQUFPLEtBQVA7QUFDRDs7QUFDRCxNQUFJLE9BQU9ELENBQVAsS0FBYSxRQUFqQixFQUEyQjtBQUN6QixXQUFPQSxDQUFDLEtBQUtDLENBQWI7QUFDRDs7QUFDRCxNQUFJRCxDQUFDLEtBQUtDLENBQVYsRUFBYTtBQUNYLFdBQU8sSUFBUDtBQUNEOztBQUNELE1BQUlMLFFBQVEsQ0FBQ00sSUFBVCxDQUFjRixDQUFkLE1BQXFCLGVBQXpCLEVBQTBDO0FBQ3hDLFFBQUlKLFFBQVEsQ0FBQ00sSUFBVCxDQUFjRCxDQUFkLE1BQXFCLGVBQXpCLEVBQTBDO0FBQ3hDLGFBQU8sQ0FBQ0QsQ0FBRCxLQUFPLENBQUNDLENBQWY7QUFDRDs7QUFDRCxXQUFPLEtBQVA7QUFDRDs7QUFDRCxNQUFJRSxLQUFLLENBQUNDLE9BQU4sQ0FBY0osQ0FBZCxDQUFKLEVBQXNCO0FBQ3BCLFFBQUlHLEtBQUssQ0FBQ0MsT0FBTixDQUFjSCxDQUFkLENBQUosRUFBc0I7QUFDcEIsVUFBSUQsQ0FBQyxDQUFDSyxNQUFGLEtBQWFKLENBQUMsQ0FBQ0ksTUFBbkIsRUFBMkI7QUFDekIsZUFBTyxLQUFQO0FBQ0Q7O0FBQ0QsV0FBSyxJQUFJQyxDQUFDLEdBQUcsQ0FBYixFQUFnQkEsQ0FBQyxHQUFHTixDQUFDLENBQUNLLE1BQXRCLEVBQThCQyxDQUFDLEVBQS9CLEVBQW1DO0FBQ2pDLFlBQUksQ0FBQ1AsWUFBWSxDQUFDQyxDQUFDLENBQUNNLENBQUQsQ0FBRixFQUFPTCxDQUFDLENBQUNLLENBQUQsQ0FBUixDQUFqQixFQUErQjtBQUM3QixpQkFBTyxLQUFQO0FBQ0Q7QUFDRjs7QUFDRCxhQUFPLElBQVA7QUFDRDs7QUFDRCxXQUFPLEtBQVA7QUFDRDs7QUFDRCxNQUFJVCxNQUFNLENBQUNVLElBQVAsQ0FBWVAsQ0FBWixFQUFlSyxNQUFmLEtBQTBCUixNQUFNLENBQUNVLElBQVAsQ0FBWU4sQ0FBWixFQUFlSSxNQUE3QyxFQUFxRDtBQUNuRCxXQUFPLEtBQVA7QUFDRDs7QUFDRCxPQUFLLElBQUlHLEdBQVQsSUFBZ0JSLENBQWhCLEVBQW1CO0FBQ2pCLFFBQUksQ0FBQ0QsWUFBWSxDQUFDQyxDQUFDLENBQUNRLEdBQUQsQ0FBRixFQUFTUCxDQUFDLENBQUNPLEdBQUQsQ0FBVixDQUFqQixFQUFtQztBQUNqQyxhQUFPLEtBQVA7QUFDRDtBQUNGOztBQUNELFNBQU8sSUFBUDtBQUNEOztBQUVEQyxNQUFNLENBQUNDLE9BQVAsR0FBaUJYLFlBQWpCIiwic291cmNlc0NvbnRlbnQiOlsidmFyIHRvU3RyaW5nID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZztcblxuLyoqXG4gKiBEZXRlcm1pbmVzIHdoZXRoZXIgdHdvIG9iamVjdHMgcmVwcmVzZW50IHRoZSBzYW1lIHByaW1pdGl2ZSwgc3BlY2lhbCBQYXJzZVxuICogdHlwZSwgb3IgZnVsbCBQYXJzZSBPYmplY3QuXG4gKi9cbmZ1bmN0aW9uIGVxdWFsT2JqZWN0cyhhLCBiKSB7XG4gIGlmICh0eXBlb2YgYSAhPT0gdHlwZW9mIGIpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgaWYgKHR5cGVvZiBhICE9PSAnb2JqZWN0Jykge1xuICAgIHJldHVybiBhID09PSBiO1xuICB9XG4gIGlmIChhID09PSBiKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgaWYgKHRvU3RyaW5nLmNhbGwoYSkgPT09ICdbb2JqZWN0IERhdGVdJykge1xuICAgIGlmICh0b1N0cmluZy5jYWxsKGIpID09PSAnW29iamVjdCBEYXRlXScpIHtcbiAgICAgIHJldHVybiArYSA9PT0gK2I7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBpZiAoQXJyYXkuaXNBcnJheShhKSkge1xuICAgIGlmIChBcnJheS5pc0FycmF5KGIpKSB7XG4gICAgICBpZiAoYS5sZW5ndGggIT09IGIubGVuZ3RoKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYS5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAoIWVxdWFsT2JqZWN0cyhhW2ldLCBiW2ldKSkge1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBpZiAoT2JqZWN0LmtleXMoYSkubGVuZ3RoICE9PSBPYmplY3Qua2V5cyhiKS5sZW5ndGgpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgZm9yICh2YXIga2V5IGluIGEpIHtcbiAgICBpZiAoIWVxdWFsT2JqZWN0cyhhW2tleV0sIGJba2V5XSkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRydWU7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZXF1YWxPYmplY3RzO1xuIl19