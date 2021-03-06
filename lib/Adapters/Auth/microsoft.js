"use strict";

// Helper functions for accessing the microsoft graph API.
var Parse = require('parse/node').Parse;

const httpsRequest = require('./httpsRequest'); // Returns a promise that fulfills if this user mail is valid.


function validateAuthData(authData) {
  return request('me', authData.access_token).then(response => {
    if (response && response.id && response.id == authData.id) {
      return;
    }

    throw new Parse.Error(Parse.Error.OBJECT_NOT_FOUND, 'Microsoft Graph auth is invalid for this user.');
  });
} // Returns a promise that fulfills if this app id is valid.


function validateAppId() {
  return Promise.resolve();
} // A promisey wrapper for api requests


function request(path, access_token) {
  return httpsRequest.get({
    host: 'graph.microsoft.com',
    path: '/v1.0/' + path,
    headers: {
      Authorization: 'Bearer ' + access_token
    }
  });
}

module.exports = {
  validateAppId: validateAppId,
  validateAuthData: validateAuthData
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9BZGFwdGVycy9BdXRoL21pY3Jvc29mdC5qcyJdLCJuYW1lcyI6WyJQYXJzZSIsInJlcXVpcmUiLCJodHRwc1JlcXVlc3QiLCJ2YWxpZGF0ZUF1dGhEYXRhIiwiYXV0aERhdGEiLCJyZXF1ZXN0IiwiYWNjZXNzX3Rva2VuIiwidGhlbiIsInJlc3BvbnNlIiwiaWQiLCJFcnJvciIsIk9CSkVDVF9OT1RfRk9VTkQiLCJ2YWxpZGF0ZUFwcElkIiwiUHJvbWlzZSIsInJlc29sdmUiLCJwYXRoIiwiZ2V0IiwiaG9zdCIsImhlYWRlcnMiLCJBdXRob3JpemF0aW9uIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7QUFBQTtBQUNBLElBQUlBLEtBQUssR0FBR0MsT0FBTyxDQUFDLFlBQUQsQ0FBUCxDQUFzQkQsS0FBbEM7O0FBQ0EsTUFBTUUsWUFBWSxHQUFHRCxPQUFPLENBQUMsZ0JBQUQsQ0FBNUIsQyxDQUVBOzs7QUFDQSxTQUFTRSxnQkFBVCxDQUEwQkMsUUFBMUIsRUFBb0M7QUFDbEMsU0FBT0MsT0FBTyxDQUFDLElBQUQsRUFBT0QsUUFBUSxDQUFDRSxZQUFoQixDQUFQLENBQXFDQyxJQUFyQyxDQUEwQ0MsUUFBUSxJQUFJO0FBQzNELFFBQUlBLFFBQVEsSUFBSUEsUUFBUSxDQUFDQyxFQUFyQixJQUEyQkQsUUFBUSxDQUFDQyxFQUFULElBQWVMLFFBQVEsQ0FBQ0ssRUFBdkQsRUFBMkQ7QUFDekQ7QUFDRDs7QUFDRCxVQUFNLElBQUlULEtBQUssQ0FBQ1UsS0FBVixDQUNKVixLQUFLLENBQUNVLEtBQU4sQ0FBWUMsZ0JBRFIsRUFFSixnREFGSSxDQUFOO0FBSUQsR0FSTSxDQUFQO0FBU0QsQyxDQUVEOzs7QUFDQSxTQUFTQyxhQUFULEdBQXlCO0FBQ3ZCLFNBQU9DLE9BQU8sQ0FBQ0MsT0FBUixFQUFQO0FBQ0QsQyxDQUVEOzs7QUFDQSxTQUFTVCxPQUFULENBQWlCVSxJQUFqQixFQUF1QlQsWUFBdkIsRUFBcUM7QUFDbkMsU0FBT0osWUFBWSxDQUFDYyxHQUFiLENBQWlCO0FBQ3RCQyxJQUFBQSxJQUFJLEVBQUUscUJBRGdCO0FBRXRCRixJQUFBQSxJQUFJLEVBQUUsV0FBV0EsSUFGSztBQUd0QkcsSUFBQUEsT0FBTyxFQUFFO0FBQ1BDLE1BQUFBLGFBQWEsRUFBRSxZQUFZYjtBQURwQjtBQUhhLEdBQWpCLENBQVA7QUFPRDs7QUFFRGMsTUFBTSxDQUFDQyxPQUFQLEdBQWlCO0FBQ2ZULEVBQUFBLGFBQWEsRUFBRUEsYUFEQTtBQUVmVCxFQUFBQSxnQkFBZ0IsRUFBRUE7QUFGSCxDQUFqQiIsInNvdXJjZXNDb250ZW50IjpbIi8vIEhlbHBlciBmdW5jdGlvbnMgZm9yIGFjY2Vzc2luZyB0aGUgbWljcm9zb2Z0IGdyYXBoIEFQSS5cbnZhciBQYXJzZSA9IHJlcXVpcmUoJ3BhcnNlL25vZGUnKS5QYXJzZTtcbmNvbnN0IGh0dHBzUmVxdWVzdCA9IHJlcXVpcmUoJy4vaHR0cHNSZXF1ZXN0Jyk7XG5cbi8vIFJldHVybnMgYSBwcm9taXNlIHRoYXQgZnVsZmlsbHMgaWYgdGhpcyB1c2VyIG1haWwgaXMgdmFsaWQuXG5mdW5jdGlvbiB2YWxpZGF0ZUF1dGhEYXRhKGF1dGhEYXRhKSB7XG4gIHJldHVybiByZXF1ZXN0KCdtZScsIGF1dGhEYXRhLmFjY2Vzc190b2tlbikudGhlbihyZXNwb25zZSA9PiB7XG4gICAgaWYgKHJlc3BvbnNlICYmIHJlc3BvbnNlLmlkICYmIHJlc3BvbnNlLmlkID09IGF1dGhEYXRhLmlkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRocm93IG5ldyBQYXJzZS5FcnJvcihcbiAgICAgIFBhcnNlLkVycm9yLk9CSkVDVF9OT1RfRk9VTkQsXG4gICAgICAnTWljcm9zb2Z0IEdyYXBoIGF1dGggaXMgaW52YWxpZCBmb3IgdGhpcyB1c2VyLidcbiAgICApO1xuICB9KTtcbn1cblxuLy8gUmV0dXJucyBhIHByb21pc2UgdGhhdCBmdWxmaWxscyBpZiB0aGlzIGFwcCBpZCBpcyB2YWxpZC5cbmZ1bmN0aW9uIHZhbGlkYXRlQXBwSWQoKSB7XG4gIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbn1cblxuLy8gQSBwcm9taXNleSB3cmFwcGVyIGZvciBhcGkgcmVxdWVzdHNcbmZ1bmN0aW9uIHJlcXVlc3QocGF0aCwgYWNjZXNzX3Rva2VuKSB7XG4gIHJldHVybiBodHRwc1JlcXVlc3QuZ2V0KHtcbiAgICBob3N0OiAnZ3JhcGgubWljcm9zb2Z0LmNvbScsXG4gICAgcGF0aDogJy92MS4wLycgKyBwYXRoLFxuICAgIGhlYWRlcnM6IHtcbiAgICAgIEF1dGhvcml6YXRpb246ICdCZWFyZXIgJyArIGFjY2Vzc190b2tlbixcbiAgICB9LFxuICB9KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIHZhbGlkYXRlQXBwSWQ6IHZhbGlkYXRlQXBwSWQsXG4gIHZhbGlkYXRlQXV0aERhdGE6IHZhbGlkYXRlQXV0aERhdGEsXG59O1xuIl19