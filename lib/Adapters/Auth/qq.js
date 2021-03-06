"use strict";

// Helper functions for accessing the qq Graph API.
const httpsRequest = require('./httpsRequest');

var Parse = require('parse/node').Parse; // Returns a promise that fulfills iff this user id is valid.


function validateAuthData(authData) {
  return graphRequest('me?access_token=' + authData.access_token).then(function (data) {
    if (data && data.openid == authData.id) {
      return;
    }

    throw new Parse.Error(Parse.Error.OBJECT_NOT_FOUND, 'qq auth is invalid for this user.');
  });
} // Returns a promise that fulfills if this app id is valid.


function validateAppId() {
  return Promise.resolve();
} // A promisey wrapper for qq graph requests.


function graphRequest(path) {
  return httpsRequest.get('https://graph.qq.com/oauth2.0/' + path, true).then(data => {
    return parseResponseData(data);
  });
}

function parseResponseData(data) {
  const starPos = data.indexOf('(');
  const endPos = data.indexOf(')');

  if (starPos == -1 || endPos == -1) {
    throw new Parse.Error(Parse.Error.OBJECT_NOT_FOUND, 'qq auth is invalid for this user.');
  }

  data = data.substring(starPos + 1, endPos - 1);
  return JSON.parse(data);
}

module.exports = {
  validateAppId,
  validateAuthData,
  parseResponseData
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9BZGFwdGVycy9BdXRoL3FxLmpzIl0sIm5hbWVzIjpbImh0dHBzUmVxdWVzdCIsInJlcXVpcmUiLCJQYXJzZSIsInZhbGlkYXRlQXV0aERhdGEiLCJhdXRoRGF0YSIsImdyYXBoUmVxdWVzdCIsImFjY2Vzc190b2tlbiIsInRoZW4iLCJkYXRhIiwib3BlbmlkIiwiaWQiLCJFcnJvciIsIk9CSkVDVF9OT1RfRk9VTkQiLCJ2YWxpZGF0ZUFwcElkIiwiUHJvbWlzZSIsInJlc29sdmUiLCJwYXRoIiwiZ2V0IiwicGFyc2VSZXNwb25zZURhdGEiLCJzdGFyUG9zIiwiaW5kZXhPZiIsImVuZFBvcyIsInN1YnN0cmluZyIsIkpTT04iLCJwYXJzZSIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7O0FBQUE7QUFDQSxNQUFNQSxZQUFZLEdBQUdDLE9BQU8sQ0FBQyxnQkFBRCxDQUE1Qjs7QUFDQSxJQUFJQyxLQUFLLEdBQUdELE9BQU8sQ0FBQyxZQUFELENBQVAsQ0FBc0JDLEtBQWxDLEMsQ0FFQTs7O0FBQ0EsU0FBU0MsZ0JBQVQsQ0FBMEJDLFFBQTFCLEVBQW9DO0FBQ2xDLFNBQU9DLFlBQVksQ0FBQyxxQkFBcUJELFFBQVEsQ0FBQ0UsWUFBL0IsQ0FBWixDQUF5REMsSUFBekQsQ0FBOEQsVUFBVUMsSUFBVixFQUFnQjtBQUNuRixRQUFJQSxJQUFJLElBQUlBLElBQUksQ0FBQ0MsTUFBTCxJQUFlTCxRQUFRLENBQUNNLEVBQXBDLEVBQXdDO0FBQ3RDO0FBQ0Q7O0FBQ0QsVUFBTSxJQUFJUixLQUFLLENBQUNTLEtBQVYsQ0FBZ0JULEtBQUssQ0FBQ1MsS0FBTixDQUFZQyxnQkFBNUIsRUFBOEMsbUNBQTlDLENBQU47QUFDRCxHQUxNLENBQVA7QUFNRCxDLENBRUQ7OztBQUNBLFNBQVNDLGFBQVQsR0FBeUI7QUFDdkIsU0FBT0MsT0FBTyxDQUFDQyxPQUFSLEVBQVA7QUFDRCxDLENBRUQ7OztBQUNBLFNBQVNWLFlBQVQsQ0FBc0JXLElBQXRCLEVBQTRCO0FBQzFCLFNBQU9oQixZQUFZLENBQUNpQixHQUFiLENBQWlCLG1DQUFtQ0QsSUFBcEQsRUFBMEQsSUFBMUQsRUFBZ0VULElBQWhFLENBQXFFQyxJQUFJLElBQUk7QUFDbEYsV0FBT1UsaUJBQWlCLENBQUNWLElBQUQsQ0FBeEI7QUFDRCxHQUZNLENBQVA7QUFHRDs7QUFFRCxTQUFTVSxpQkFBVCxDQUEyQlYsSUFBM0IsRUFBaUM7QUFDL0IsUUFBTVcsT0FBTyxHQUFHWCxJQUFJLENBQUNZLE9BQUwsQ0FBYSxHQUFiLENBQWhCO0FBQ0EsUUFBTUMsTUFBTSxHQUFHYixJQUFJLENBQUNZLE9BQUwsQ0FBYSxHQUFiLENBQWY7O0FBQ0EsTUFBSUQsT0FBTyxJQUFJLENBQUMsQ0FBWixJQUFpQkUsTUFBTSxJQUFJLENBQUMsQ0FBaEMsRUFBbUM7QUFDakMsVUFBTSxJQUFJbkIsS0FBSyxDQUFDUyxLQUFWLENBQWdCVCxLQUFLLENBQUNTLEtBQU4sQ0FBWUMsZ0JBQTVCLEVBQThDLG1DQUE5QyxDQUFOO0FBQ0Q7O0FBQ0RKLEVBQUFBLElBQUksR0FBR0EsSUFBSSxDQUFDYyxTQUFMLENBQWVILE9BQU8sR0FBRyxDQUF6QixFQUE0QkUsTUFBTSxHQUFHLENBQXJDLENBQVA7QUFDQSxTQUFPRSxJQUFJLENBQUNDLEtBQUwsQ0FBV2hCLElBQVgsQ0FBUDtBQUNEOztBQUVEaUIsTUFBTSxDQUFDQyxPQUFQLEdBQWlCO0FBQ2ZiLEVBQUFBLGFBRGU7QUFFZlYsRUFBQUEsZ0JBRmU7QUFHZmUsRUFBQUE7QUFIZSxDQUFqQiIsInNvdXJjZXNDb250ZW50IjpbIi8vIEhlbHBlciBmdW5jdGlvbnMgZm9yIGFjY2Vzc2luZyB0aGUgcXEgR3JhcGggQVBJLlxuY29uc3QgaHR0cHNSZXF1ZXN0ID0gcmVxdWlyZSgnLi9odHRwc1JlcXVlc3QnKTtcbnZhciBQYXJzZSA9IHJlcXVpcmUoJ3BhcnNlL25vZGUnKS5QYXJzZTtcblxuLy8gUmV0dXJucyBhIHByb21pc2UgdGhhdCBmdWxmaWxscyBpZmYgdGhpcyB1c2VyIGlkIGlzIHZhbGlkLlxuZnVuY3Rpb24gdmFsaWRhdGVBdXRoRGF0YShhdXRoRGF0YSkge1xuICByZXR1cm4gZ3JhcGhSZXF1ZXN0KCdtZT9hY2Nlc3NfdG9rZW49JyArIGF1dGhEYXRhLmFjY2Vzc190b2tlbikudGhlbihmdW5jdGlvbiAoZGF0YSkge1xuICAgIGlmIChkYXRhICYmIGRhdGEub3BlbmlkID09IGF1dGhEYXRhLmlkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRocm93IG5ldyBQYXJzZS5FcnJvcihQYXJzZS5FcnJvci5PQkpFQ1RfTk9UX0ZPVU5ELCAncXEgYXV0aCBpcyBpbnZhbGlkIGZvciB0aGlzIHVzZXIuJyk7XG4gIH0pO1xufVxuXG4vLyBSZXR1cm5zIGEgcHJvbWlzZSB0aGF0IGZ1bGZpbGxzIGlmIHRoaXMgYXBwIGlkIGlzIHZhbGlkLlxuZnVuY3Rpb24gdmFsaWRhdGVBcHBJZCgpIHtcbiAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xufVxuXG4vLyBBIHByb21pc2V5IHdyYXBwZXIgZm9yIHFxIGdyYXBoIHJlcXVlc3RzLlxuZnVuY3Rpb24gZ3JhcGhSZXF1ZXN0KHBhdGgpIHtcbiAgcmV0dXJuIGh0dHBzUmVxdWVzdC5nZXQoJ2h0dHBzOi8vZ3JhcGgucXEuY29tL29hdXRoMi4wLycgKyBwYXRoLCB0cnVlKS50aGVuKGRhdGEgPT4ge1xuICAgIHJldHVybiBwYXJzZVJlc3BvbnNlRGF0YShkYXRhKTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIHBhcnNlUmVzcG9uc2VEYXRhKGRhdGEpIHtcbiAgY29uc3Qgc3RhclBvcyA9IGRhdGEuaW5kZXhPZignKCcpO1xuICBjb25zdCBlbmRQb3MgPSBkYXRhLmluZGV4T2YoJyknKTtcbiAgaWYgKHN0YXJQb3MgPT0gLTEgfHwgZW5kUG9zID09IC0xKSB7XG4gICAgdGhyb3cgbmV3IFBhcnNlLkVycm9yKFBhcnNlLkVycm9yLk9CSkVDVF9OT1RfRk9VTkQsICdxcSBhdXRoIGlzIGludmFsaWQgZm9yIHRoaXMgdXNlci4nKTtcbiAgfVxuICBkYXRhID0gZGF0YS5zdWJzdHJpbmcoc3RhclBvcyArIDEsIGVuZFBvcyAtIDEpO1xuICByZXR1cm4gSlNPTi5wYXJzZShkYXRhKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIHZhbGlkYXRlQXBwSWQsXG4gIHZhbGlkYXRlQXV0aERhdGEsXG4gIHBhcnNlUmVzcG9uc2VEYXRhLFxufTtcbiJdfQ==