"use strict";

/*
 * This auth adapter is based on the OAuth 2.0 Token Introspection specification.
 * See RFC 7662 for details (https://tools.ietf.org/html/rfc7662).
 * It's purpose is to validate OAuth2 access tokens using the OAuth2 provider's
 * token introspection endpoint (if implemented by the provider).
 *
 * The adapter accepts the following config parameters:
 *
 * 1. "tokenIntrospectionEndpointUrl" (string, required)
 *      The URL of the token introspection endpoint of the OAuth2 provider that
 *      issued the access token to the client that is to be validated.
 *
 * 2. "useridField" (string, optional)
 *      The name of the field in the token introspection response that contains
 *      the userid. If specified, it will be used to verify the value of the "id"
 *      field in the "authData" JSON that is coming from the client.
 *      This can be the "aud" (i.e. audience), the "sub" (i.e. subject) or the
 *      "username" field in the introspection response, but since only the
 *      "active" field is required and all other reponse fields are optional
 *      in the RFC, it has to be optional in this adapter as well.
 *      Default: - (undefined)
 *
 * 3. "appidField" (string, optional)
 *      The name of the field in the token introspection response that contains
 *      the appId of the client. If specified, it will be used to verify it's
 *      value against the set of appIds in the adapter config. The concept of
 *      appIds comes from the two major social login providers
 *      (Google and Facebook). They have not yet implemented the token
 *      introspection endpoint, but the concept can be valid for any OAuth2
 *      provider.
 *      Default: - (undefined)
 *
 * 4. "appIds" (array of strings, required if appidField is defined)
 *      A set of appIds that are used to restrict accepted access tokens based
 *      on a specific field's value in the token introspection response.
 *      Default: - (undefined)
 *
 * 5. "authorizationHeader" (string, optional)
 *      The value of the "Authorization" HTTP header in requests sent to the
 *      introspection endpoint. It must contain the raw value.
 *      Thus if HTTP Basic authorization is to be used, it must contain the
 *      "Basic" string, followed by whitespace, then by the base64 encoded
 *      version of the concatenated <username> + ":" + <password> string.
 *      Eg. "Basic dXNlcm5hbWU6cGFzc3dvcmQ="
 *
 * The adapter expects requests with the following authData JSON:
 *
 * {
 *   "someadapter": {
 *     "id": "user's OAuth2 provider-specific id as a string",
 *     "access_token": "an authorized OAuth2 access token for the user",
 *   }
 * }
 */
const Parse = require('parse/node').Parse;

const url = require('url');

const querystring = require('querystring');

const httpsRequest = require('./httpsRequest');

const INVALID_ACCESS = 'OAuth2 access token is invalid for this user.';
const INVALID_ACCESS_APPID = "OAuth2: the access_token's appID is empty or is not in the list of permitted appIDs in the auth configuration.";
const MISSING_APPIDS = 'OAuth2 configuration is missing the client app IDs ("appIds" config parameter).';
const MISSING_URL = 'OAuth2 token introspection endpoint URL is missing from configuration!'; // Returns a promise that fulfills if this user id is valid.

function validateAuthData(authData, options) {
  return requestTokenInfo(options, authData.access_token).then(response => {
    if (!response || !response.active || options.useridField && authData.id !== response[options.useridField]) {
      throw new Parse.Error(Parse.Error.OBJECT_NOT_FOUND, INVALID_ACCESS);
    }
  });
}

function validateAppId(appIds, authData, options) {
  if (!options || !options.appidField) {
    return Promise.resolve();
  }

  if (!appIds || appIds.length === 0) {
    throw new Parse.Error(Parse.Error.OBJECT_NOT_FOUND, MISSING_APPIDS);
  }

  return requestTokenInfo(options, authData.access_token).then(response => {
    if (!response || !response.active) {
      throw new Parse.Error(Parse.Error.OBJECT_NOT_FOUND, INVALID_ACCESS);
    }

    const appidField = options.appidField;

    if (!response[appidField]) {
      throw new Parse.Error(Parse.Error.OBJECT_NOT_FOUND, INVALID_ACCESS_APPID);
    }

    const responseValue = response[appidField];

    if (!Array.isArray(responseValue) && appIds.includes(responseValue)) {
      return;
    } else if (Array.isArray(responseValue) && responseValue.some(appId => appIds.includes(appId))) {
      return;
    } else {
      throw new Parse.Error(Parse.Error.OBJECT_NOT_FOUND, INVALID_ACCESS_APPID);
    }
  });
} // A promise wrapper for requests to the OAuth2 token introspection endpoint.


function requestTokenInfo(options, access_token) {
  if (!options || !options.tokenIntrospectionEndpointUrl) {
    throw new Parse.Error(Parse.Error.OBJECT_NOT_FOUND, MISSING_URL);
  }

  const parsedUrl = url.parse(options.tokenIntrospectionEndpointUrl);
  const postData = querystring.stringify({
    token: access_token
  });
  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Content-Length': Buffer.byteLength(postData)
  };

  if (options.authorizationHeader) {
    headers['Authorization'] = options.authorizationHeader;
  }

  const postOptions = {
    hostname: parsedUrl.hostname,
    path: parsedUrl.pathname,
    method: 'POST',
    headers: headers
  };
  return httpsRequest.request(postOptions, postData);
}

module.exports = {
  validateAppId: validateAppId,
  validateAuthData: validateAuthData
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9BZGFwdGVycy9BdXRoL29hdXRoMi5qcyJdLCJuYW1lcyI6WyJQYXJzZSIsInJlcXVpcmUiLCJ1cmwiLCJxdWVyeXN0cmluZyIsImh0dHBzUmVxdWVzdCIsIklOVkFMSURfQUNDRVNTIiwiSU5WQUxJRF9BQ0NFU1NfQVBQSUQiLCJNSVNTSU5HX0FQUElEUyIsIk1JU1NJTkdfVVJMIiwidmFsaWRhdGVBdXRoRGF0YSIsImF1dGhEYXRhIiwib3B0aW9ucyIsInJlcXVlc3RUb2tlbkluZm8iLCJhY2Nlc3NfdG9rZW4iLCJ0aGVuIiwicmVzcG9uc2UiLCJhY3RpdmUiLCJ1c2VyaWRGaWVsZCIsImlkIiwiRXJyb3IiLCJPQkpFQ1RfTk9UX0ZPVU5EIiwidmFsaWRhdGVBcHBJZCIsImFwcElkcyIsImFwcGlkRmllbGQiLCJQcm9taXNlIiwicmVzb2x2ZSIsImxlbmd0aCIsInJlc3BvbnNlVmFsdWUiLCJBcnJheSIsImlzQXJyYXkiLCJpbmNsdWRlcyIsInNvbWUiLCJhcHBJZCIsInRva2VuSW50cm9zcGVjdGlvbkVuZHBvaW50VXJsIiwicGFyc2VkVXJsIiwicGFyc2UiLCJwb3N0RGF0YSIsInN0cmluZ2lmeSIsInRva2VuIiwiaGVhZGVycyIsIkJ1ZmZlciIsImJ5dGVMZW5ndGgiLCJhdXRob3JpemF0aW9uSGVhZGVyIiwicG9zdE9wdGlvbnMiLCJob3N0bmFtZSIsInBhdGgiLCJwYXRobmFtZSIsIm1ldGhvZCIsInJlcXVlc3QiLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtB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QUFxQkwsV0FBckIsRUFBa0NQLFFBQWxDLENBQVA7QUFDRDs7QUFFRGEsTUFBTSxDQUFDQyxPQUFQLEdBQWlCO0FBQ2Y3QixFQUFBQSxhQUFhLEVBQUVBLGFBREE7QUFFZlosRUFBQUEsZ0JBQWdCLEVBQUVBO0FBRkgsQ0FBakIiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogVGhpcyBhdXRoIGFkYXB0ZXIgaXMgYmFzZWQgb24gdGhlIE9BdXRoIDIuMCBUb2tlbiBJbnRyb3NwZWN0aW9uIHNwZWNpZmljYXRpb24uXG4gKiBTZWUgUkZDIDc2NjIgZm9yIGRldGFpbHMgKGh0dHBzOi8vdG9vbHMuaWV0Zi5vcmcvaHRtbC9yZmM3NjYyKS5cbiAqIEl0J3MgcHVycG9zZSBpcyB0byB2YWxpZGF0ZSBPQXV0aDIgYWNjZXNzIHRva2VucyB1c2luZyB0aGUgT0F1dGgyIHByb3ZpZGVyJ3NcbiAqIHRva2VuIGludHJvc3BlY3Rpb24gZW5kcG9pbnQgKGlmIGltcGxlbWVudGVkIGJ5IHRoZSBwcm92aWRlcikuXG4gKlxuICogVGhlIGFkYXB0ZXIgYWNjZXB0cyB0aGUgZm9sbG93aW5nIGNvbmZpZyBwYXJhbWV0ZXJzOlxuICpcbiAqIDEuIFwidG9rZW5JbnRyb3NwZWN0aW9uRW5kcG9pbnRVcmxcIiAoc3RyaW5nLCByZXF1aXJlZClcbiAqICAgICAgVGhlIFVSTCBvZiB0aGUgdG9rZW4gaW50cm9zcGVjdGlvbiBlbmRwb2ludCBvZiB0aGUgT0F1dGgyIHByb3ZpZGVyIHRoYXRcbiAqICAgICAgaXNzdWVkIHRoZSBhY2Nlc3MgdG9rZW4gdG8gdGhlIGNsaWVudCB0aGF0IGlzIHRvIGJlIHZhbGlkYXRlZC5cbiAqXG4gKiAyLiBcInVzZXJpZEZpZWxkXCIgKHN0cmluZywgb3B0aW9uYWwpXG4gKiAgICAgIFRoZSBuYW1lIG9mIHRoZSBmaWVsZCBpbiB0aGUgdG9rZW4gaW50cm9zcGVjdGlvbiByZXNwb25zZSB0aGF0IGNvbnRhaW5zXG4gKiAgICAgIHRoZSB1c2VyaWQuIElmIHNwZWNpZmllZCwgaXQgd2lsbCBiZSB1c2VkIHRvIHZlcmlmeSB0aGUgdmFsdWUgb2YgdGhlIFwiaWRcIlxuICogICAgICBmaWVsZCBpbiB0aGUgXCJhdXRoRGF0YVwiIEpTT04gdGhhdCBpcyBjb21pbmcgZnJvbSB0aGUgY2xpZW50LlxuICogICAgICBUaGlzIGNhbiBiZSB0aGUgXCJhdWRcIiAoaS5lLiBhdWRpZW5jZSksIHRoZSBcInN1YlwiIChpLmUuIHN1YmplY3QpIG9yIHRoZVxuICogICAgICBcInVzZXJuYW1lXCIgZmllbGQgaW4gdGhlIGludHJvc3BlY3Rpb24gcmVzcG9uc2UsIGJ1dCBzaW5jZSBvbmx5IHRoZVxuICogICAgICBcImFjdGl2ZVwiIGZpZWxkIGlzIHJlcXVpcmVkIGFuZCBhbGwgb3RoZXIgcmVwb25zZSBmaWVsZHMgYXJlIG9wdGlvbmFsXG4gKiAgICAgIGluIHRoZSBSRkMsIGl0IGhhcyB0byBiZSBvcHRpb25hbCBpbiB0aGlzIGFkYXB0ZXIgYXMgd2VsbC5cbiAqICAgICAgRGVmYXVsdDogLSAodW5kZWZpbmVkKVxuICpcbiAqIDMuIFwiYXBwaWRGaWVsZFwiIChzdHJpbmcsIG9wdGlvbmFsKVxuICogICAgICBUaGUgbmFtZSBvZiB0aGUgZmllbGQgaW4gdGhlIHRva2VuIGludHJvc3BlY3Rpb24gcmVzcG9uc2UgdGhhdCBjb250YWluc1xuICogICAgICB0aGUgYXBwSWQgb2YgdGhlIGNsaWVudC4gSWYgc3BlY2lmaWVkLCBpdCB3aWxsIGJlIHVzZWQgdG8gdmVyaWZ5IGl0J3NcbiAqICAgICAgdmFsdWUgYWdhaW5zdCB0aGUgc2V0IG9mIGFwcElkcyBpbiB0aGUgYWRhcHRlciBjb25maWcuIFRoZSBjb25jZXB0IG9mXG4gKiAgICAgIGFwcElkcyBjb21lcyBmcm9tIHRoZSB0d28gbWFqb3Igc29jaWFsIGxvZ2luIHByb3ZpZGVyc1xuICogICAgICAoR29vZ2xlIGFuZCBGYWNlYm9vaykuIFRoZXkgaGF2ZSBub3QgeWV0IGltcGxlbWVudGVkIHRoZSB0b2tlblxuICogICAgICBpbnRyb3NwZWN0aW9uIGVuZHBvaW50LCBidXQgdGhlIGNvbmNlcHQgY2FuIGJlIHZhbGlkIGZvciBhbnkgT0F1dGgyXG4gKiAgICAgIHByb3ZpZGVyLlxuICogICAgICBEZWZhdWx0OiAtICh1bmRlZmluZWQpXG4gKlxuICogNC4gXCJhcHBJZHNcIiAoYXJyYXkgb2Ygc3RyaW5ncywgcmVxdWlyZWQgaWYgYXBwaWRGaWVsZCBpcyBkZWZpbmVkKVxuICogICAgICBBIHNldCBvZiBhcHBJZHMgdGhhdCBhcmUgdXNlZCB0byByZXN0cmljdCBhY2NlcHRlZCBhY2Nlc3MgdG9rZW5zIGJhc2VkXG4gKiAgICAgIG9uIGEgc3BlY2lmaWMgZmllbGQncyB2YWx1ZSBpbiB0aGUgdG9rZW4gaW50cm9zcGVjdGlvbiByZXNwb25zZS5cbiAqICAgICAgRGVmYXVsdDogLSAodW5kZWZpbmVkKVxuICpcbiAqIDUuIFwiYXV0aG9yaXphdGlvbkhlYWRlclwiIChzdHJpbmcsIG9wdGlvbmFsKVxuICogICAgICBUaGUgdmFsdWUgb2YgdGhlIFwiQXV0aG9yaXphdGlvblwiIEhUVFAgaGVhZGVyIGluIHJlcXVlc3RzIHNlbnQgdG8gdGhlXG4gKiAgICAgIGludHJvc3BlY3Rpb24gZW5kcG9pbnQuIEl0IG11c3QgY29udGFpbiB0aGUgcmF3IHZhbHVlLlxuICogICAgICBUaHVzIGlmIEhUVFAgQmFzaWMgYXV0aG9yaXphdGlvbiBpcyB0byBiZSB1c2VkLCBpdCBtdXN0IGNvbnRhaW4gdGhlXG4gKiAgICAgIFwiQmFzaWNcIiBzdHJpbmcsIGZvbGxvd2VkIGJ5IHdoaXRlc3BhY2UsIHRoZW4gYnkgdGhlIGJhc2U2NCBlbmNvZGVkXG4gKiAgICAgIHZlcnNpb24gb2YgdGhlIGNvbmNhdGVuYXRlZCA8dXNlcm5hbWU+ICsgXCI6XCIgKyA8cGFzc3dvcmQ+IHN0cmluZy5cbiAqICAgICAgRWcuIFwiQmFzaWMgZFhObGNtNWhiV1U2Y0dGemMzZHZjbVE9XCJcbiAqXG4gKiBUaGUgYWRhcHRlciBleHBlY3RzIHJlcXVlc3RzIHdpdGggdGhlIGZvbGxvd2luZyBhdXRoRGF0YSBKU09OOlxuICpcbiAqIHtcbiAqICAgXCJzb21lYWRhcHRlclwiOiB7XG4gKiAgICAgXCJpZFwiOiBcInVzZXIncyBPQXV0aDIgcHJvdmlkZXItc3BlY2lmaWMgaWQgYXMgYSBzdHJpbmdcIixcbiAqICAgICBcImFjY2Vzc190b2tlblwiOiBcImFuIGF1dGhvcml6ZWQgT0F1dGgyIGFjY2VzcyB0b2tlbiBmb3IgdGhlIHVzZXJcIixcbiAqICAgfVxuICogfVxuICovXG5cbmNvbnN0IFBhcnNlID0gcmVxdWlyZSgncGFyc2Uvbm9kZScpLlBhcnNlO1xuY29uc3QgdXJsID0gcmVxdWlyZSgndXJsJyk7XG5jb25zdCBxdWVyeXN0cmluZyA9IHJlcXVpcmUoJ3F1ZXJ5c3RyaW5nJyk7XG5jb25zdCBodHRwc1JlcXVlc3QgPSByZXF1aXJlKCcuL2h0dHBzUmVxdWVzdCcpO1xuXG5jb25zdCBJTlZBTElEX0FDQ0VTUyA9ICdPQXV0aDIgYWNjZXNzIHRva2VuIGlzIGludmFsaWQgZm9yIHRoaXMgdXNlci4nO1xuY29uc3QgSU5WQUxJRF9BQ0NFU1NfQVBQSUQgPVxuICBcIk9BdXRoMjogdGhlIGFjY2Vzc190b2tlbidzIGFwcElEIGlzIGVtcHR5IG9yIGlzIG5vdCBpbiB0aGUgbGlzdCBvZiBwZXJtaXR0ZWQgYXBwSURzIGluIHRoZSBhdXRoIGNvbmZpZ3VyYXRpb24uXCI7XG5jb25zdCBNSVNTSU5HX0FQUElEUyA9XG4gICdPQXV0aDIgY29uZmlndXJhdGlvbiBpcyBtaXNzaW5nIHRoZSBjbGllbnQgYXBwIElEcyAoXCJhcHBJZHNcIiBjb25maWcgcGFyYW1ldGVyKS4nO1xuY29uc3QgTUlTU0lOR19VUkwgPSAnT0F1dGgyIHRva2VuIGludHJvc3BlY3Rpb24gZW5kcG9pbnQgVVJMIGlzIG1pc3NpbmcgZnJvbSBjb25maWd1cmF0aW9uISc7XG5cbi8vIFJldHVybnMgYSBwcm9taXNlIHRoYXQgZnVsZmlsbHMgaWYgdGhpcyB1c2VyIGlkIGlzIHZhbGlkLlxuZnVuY3Rpb24gdmFsaWRhdGVBdXRoRGF0YShhdXRoRGF0YSwgb3B0aW9ucykge1xuICByZXR1cm4gcmVxdWVzdFRva2VuSW5mbyhvcHRpb25zLCBhdXRoRGF0YS5hY2Nlc3NfdG9rZW4pLnRoZW4ocmVzcG9uc2UgPT4ge1xuICAgIGlmIChcbiAgICAgICFyZXNwb25zZSB8fFxuICAgICAgIXJlc3BvbnNlLmFjdGl2ZSB8fFxuICAgICAgKG9wdGlvbnMudXNlcmlkRmllbGQgJiYgYXV0aERhdGEuaWQgIT09IHJlc3BvbnNlW29wdGlvbnMudXNlcmlkRmllbGRdKVxuICAgICkge1xuICAgICAgdGhyb3cgbmV3IFBhcnNlLkVycm9yKFBhcnNlLkVycm9yLk9CSkVDVF9OT1RfRk9VTkQsIElOVkFMSURfQUNDRVNTKTtcbiAgICB9XG4gIH0pO1xufVxuXG5mdW5jdGlvbiB2YWxpZGF0ZUFwcElkKGFwcElkcywgYXV0aERhdGEsIG9wdGlvbnMpIHtcbiAgaWYgKCFvcHRpb25zIHx8ICFvcHRpb25zLmFwcGlkRmllbGQpIHtcbiAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG4gIH1cbiAgaWYgKCFhcHBJZHMgfHwgYXBwSWRzLmxlbmd0aCA9PT0gMCkge1xuICAgIHRocm93IG5ldyBQYXJzZS5FcnJvcihQYXJzZS5FcnJvci5PQkpFQ1RfTk9UX0ZPVU5ELCBNSVNTSU5HX0FQUElEUyk7XG4gIH1cbiAgcmV0dXJuIHJlcXVlc3RUb2tlbkluZm8ob3B0aW9ucywgYXV0aERhdGEuYWNjZXNzX3Rva2VuKS50aGVuKHJlc3BvbnNlID0+IHtcbiAgICBpZiAoIXJlc3BvbnNlIHx8ICFyZXNwb25zZS5hY3RpdmUpIHtcbiAgICAgIHRocm93IG5ldyBQYXJzZS5FcnJvcihQYXJzZS5FcnJvci5PQkpFQ1RfTk9UX0ZPVU5ELCBJTlZBTElEX0FDQ0VTUyk7XG4gICAgfVxuICAgIGNvbnN0IGFwcGlkRmllbGQgPSBvcHRpb25zLmFwcGlkRmllbGQ7XG4gICAgaWYgKCFyZXNwb25zZVthcHBpZEZpZWxkXSkge1xuICAgICAgdGhyb3cgbmV3IFBhcnNlLkVycm9yKFBhcnNlLkVycm9yLk9CSkVDVF9OT1RfRk9VTkQsIElOVkFMSURfQUNDRVNTX0FQUElEKTtcbiAgICB9XG4gICAgY29uc3QgcmVzcG9uc2VWYWx1ZSA9IHJlc3BvbnNlW2FwcGlkRmllbGRdO1xuICAgIGlmICghQXJyYXkuaXNBcnJheShyZXNwb25zZVZhbHVlKSAmJiBhcHBJZHMuaW5jbHVkZXMocmVzcG9uc2VWYWx1ZSkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9IGVsc2UgaWYgKFxuICAgICAgQXJyYXkuaXNBcnJheShyZXNwb25zZVZhbHVlKSAmJlxuICAgICAgcmVzcG9uc2VWYWx1ZS5zb21lKGFwcElkID0+IGFwcElkcy5pbmNsdWRlcyhhcHBJZCkpXG4gICAgKSB7XG4gICAgICByZXR1cm47XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBQYXJzZS5FcnJvcihQYXJzZS5FcnJvci5PQkpFQ1RfTk9UX0ZPVU5ELCBJTlZBTElEX0FDQ0VTU19BUFBJRCk7XG4gICAgfVxuICB9KTtcbn1cblxuLy8gQSBwcm9taXNlIHdyYXBwZXIgZm9yIHJlcXVlc3RzIHRvIHRoZSBPQXV0aDIgdG9rZW4gaW50cm9zcGVjdGlvbiBlbmRwb2ludC5cbmZ1bmN0aW9uIHJlcXVlc3RUb2tlbkluZm8ob3B0aW9ucywgYWNjZXNzX3Rva2VuKSB7XG4gIGlmICghb3B0aW9ucyB8fCAhb3B0aW9ucy50b2tlbkludHJvc3BlY3Rpb25FbmRwb2ludFVybCkge1xuICAgIHRocm93IG5ldyBQYXJzZS5FcnJvcihQYXJzZS5FcnJvci5PQkpFQ1RfTk9UX0ZPVU5ELCBNSVNTSU5HX1VSTCk7XG4gIH1cbiAgY29uc3QgcGFyc2VkVXJsID0gdXJsLnBhcnNlKG9wdGlvbnMudG9rZW5JbnRyb3NwZWN0aW9uRW5kcG9pbnRVcmwpO1xuICBjb25zdCBwb3N0RGF0YSA9IHF1ZXJ5c3RyaW5nLnN0cmluZ2lmeSh7XG4gICAgdG9rZW46IGFjY2Vzc190b2tlbixcbiAgfSk7XG4gIGNvbnN0IGhlYWRlcnMgPSB7XG4gICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnLFxuICAgICdDb250ZW50LUxlbmd0aCc6IEJ1ZmZlci5ieXRlTGVuZ3RoKHBvc3REYXRhKSxcbiAgfTtcbiAgaWYgKG9wdGlvbnMuYXV0aG9yaXphdGlvbkhlYWRlcikge1xuICAgIGhlYWRlcnNbJ0F1dGhvcml6YXRpb24nXSA9IG9wdGlvbnMuYXV0aG9yaXphdGlvbkhlYWRlcjtcbiAgfVxuICBjb25zdCBwb3N0T3B0aW9ucyA9IHtcbiAgICBob3N0bmFtZTogcGFyc2VkVXJsLmhvc3RuYW1lLFxuICAgIHBhdGg6IHBhcnNlZFVybC5wYXRobmFtZSxcbiAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICBoZWFkZXJzOiBoZWFkZXJzLFxuICB9O1xuICByZXR1cm4gaHR0cHNSZXF1ZXN0LnJlcXVlc3QocG9zdE9wdGlvbnMsIHBvc3REYXRhKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIHZhbGlkYXRlQXBwSWQ6IHZhbGlkYXRlQXBwSWQsXG4gIHZhbGlkYXRlQXV0aERhdGE6IHZhbGlkYXRlQXV0aERhdGEsXG59O1xuIl19