"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.IAPValidationRouter = void 0;

var _PromiseRouter = _interopRequireDefault(require("../PromiseRouter"));

var _node = _interopRequireDefault(require("parse/node"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const request = require('../request');

const rest = require('../rest');

// TODO move validation logic in IAPValidationController
const IAP_SANDBOX_URL = 'https://sandbox.itunes.apple.com/verifyReceipt';
const IAP_PRODUCTION_URL = 'https://buy.itunes.apple.com/verifyReceipt';
const APP_STORE_ERRORS = {
  21000: 'The App Store could not read the JSON object you provided.',
  21002: 'The data in the receipt-data property was malformed or missing.',
  21003: 'The receipt could not be authenticated.',
  21004: 'The shared secret you provided does not match the shared secret on file for your account.',
  21005: 'The receipt server is not currently available.',
  21006: 'This receipt is valid but the subscription has expired.',
  21007: 'This receipt is from the test environment, but it was sent to the production environment for verification. Send it to the test environment instead.',
  21008: 'This receipt is from the production environment, but it was sent to the test environment for verification. Send it to the production environment instead.'
};

function appStoreError(status) {
  status = parseInt(status);
  var errorString = APP_STORE_ERRORS[status] || 'unknown error.';
  return {
    status: status,
    error: errorString
  };
}

function validateWithAppStore(url, receipt) {
  return request({
    url: url,
    method: 'POST',
    body: {
      'receipt-data': receipt
    },
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(httpResponse => {
    const body = httpResponse.data;

    if (body && body.status === 0) {
      // No need to pass anything, status is OK
      return;
    } // receipt is from test and should go to test


    throw body;
  });
}

function getFileForProductIdentifier(productIdentifier, req) {
  return rest.find(req.config, req.auth, '_Product', {
    productIdentifier: productIdentifier
  }, undefined, req.info.clientSDK, req.info.context).then(function (result) {
    const products = result.results;

    if (!products || products.length != 1) {
      // Error not found or too many
      throw new _node.default.Error(_node.default.Error.OBJECT_NOT_FOUND, 'Object not found.');
    }

    var download = products[0].download;
    return Promise.resolve({
      response: download
    });
  });
}

class IAPValidationRouter extends _PromiseRouter.default {
  handleRequest(req) {
    let receipt = req.body.receipt;
    const productIdentifier = req.body.productIdentifier;

    if (!receipt || !productIdentifier) {
      // TODO: Error, malformed request
      throw new _node.default.Error(_node.default.Error.INVALID_JSON, 'missing receipt or productIdentifier');
    } // Transform the object if there
    // otherwise assume it's in Base64 already


    if (typeof receipt == 'object') {
      if (receipt['__type'] == 'Bytes') {
        receipt = receipt.base64;
      }
    }

    if (process.env.TESTING == '1' && req.body.bypassAppStoreValidation) {
      return getFileForProductIdentifier(productIdentifier, req);
    }

    function successCallback() {
      return getFileForProductIdentifier(productIdentifier, req);
    }

    function errorCallback(error) {
      return Promise.resolve({
        response: appStoreError(error.status)
      });
    }

    return validateWithAppStore(IAP_PRODUCTION_URL, receipt).then(() => {
      return successCallback();
    }, error => {
      if (error.status == 21007) {
        return validateWithAppStore(IAP_SANDBOX_URL, receipt).then(() => {
          return successCallback();
        }, error => {
          return errorCallback(error);
        });
      }

      return errorCallback(error);
    });
  }

  mountRoutes() {
    this.route('POST', '/validate_purchase', this.handleRequest);
  }

}

exports.IAPValidationRouter = IAPValidationRouter;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9Sb3V0ZXJzL0lBUFZhbGlkYXRpb25Sb3V0ZXIuanMiXSwibmFtZXMiOlsicmVxdWVzdCIsInJlcXVpcmUiLCJyZXN0IiwiSUFQX1NBTkRCT1hfVVJMIiwiSUFQX1BST0RVQ1RJT05fVVJMIiwiQVBQX1NUT1JFX0VSUk9SUyIsImFwcFN0b3JlRXJyb3IiLCJzdGF0dXMiLCJwYXJzZUludCIsImVycm9yU3RyaW5nIiwiZXJyb3IiLCJ2YWxpZGF0ZVdpdGhBcHBTdG9yZSIsInVybCIsInJlY2VpcHQiLCJtZXRob2QiLCJib2R5IiwiaGVhZGVycyIsInRoZW4iLCJodHRwUmVzcG9uc2UiLCJkYXRhIiwiZ2V0RmlsZUZvclByb2R1Y3RJZGVudGlmaWVyIiwicHJvZHVjdElkZW50aWZpZXIiLCJyZXEiLCJmaW5kIiwiY29uZmlnIiwiYXV0aCIsInVuZGVmaW5lZCIsImluZm8iLCJjbGllbnRTREsiLCJjb250ZXh0IiwicmVzdWx0IiwicHJvZHVjdHMiLCJyZXN1bHRzIiwibGVuZ3RoIiwiUGFyc2UiLCJFcnJvciIsIk9CSkVDVF9OT1RfRk9VTkQiLCJkb3dubG9hZCIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVzcG9uc2UiLCJJQVBWYWxpZGF0aW9uUm91dGVyIiwiUHJvbWlzZVJvdXRlciIsImhhbmRsZVJlcXVlc3QiLCJJTlZBTElEX0pTT04iLCJiYXNlNjQiLCJwcm9jZXNzIiwiZW52IiwiVEVTVElORyIsImJ5cGFzc0FwcFN0b3JlVmFsaWRhdGlvbiIsInN1Y2Nlc3NDYWxsYmFjayIsImVycm9yQ2FsbGJhY2siLCJtb3VudFJvdXRlcyIsInJvdXRlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBR0E7Ozs7QUFGQSxNQUFNQSxPQUFPLEdBQUdDLE9BQU8sQ0FBQyxZQUFELENBQXZCOztBQUNBLE1BQU1DLElBQUksR0FBR0QsT0FBTyxDQUFDLFNBQUQsQ0FBcEI7O0FBR0E7QUFDQSxNQUFNRSxlQUFlLEdBQUcsZ0RBQXhCO0FBQ0EsTUFB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O0FBbUJEOztBQUVEMEMsRUFBQUEsV0FBVyxHQUFHO0FBQ1osU0FBS0MsS0FBTCxDQUFXLE1BQVgsRUFBbUIsb0JBQW5CLEVBQXlDLEtBQUtWLGFBQTlDO0FBQ0Q7O0FBckRvRCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBQcm9taXNlUm91dGVyIGZyb20gJy4uL1Byb21pc2VSb3V0ZXInO1xuY29uc3QgcmVxdWVzdCA9IHJlcXVpcmUoJy4uL3JlcXVlc3QnKTtcbmNvbnN0IHJlc3QgPSByZXF1aXJlKCcuLi9yZXN0Jyk7XG5pbXBvcnQgUGFyc2UgZnJvbSAncGFyc2Uvbm9kZSc7XG5cbi8vIFRPRE8gbW92ZSB2YWxpZGF0aW9uIGxvZ2ljIGluIElBUFZhbGlkYXRpb25Db250cm9sbGVyXG5jb25zdCBJQVBfU0FOREJPWF9VUkwgPSAnaHR0cHM6Ly9zYW5kYm94Lml0dW5lcy5hcHBsZS5jb20vdmVyaWZ5UmVjZWlwdCc7XG5jb25zdCBJQVBfUFJPRFVDVElPTl9VUkwgPSAnaHR0cHM6Ly9idXkuaXR1bmVzLmFwcGxlLmNvbS92ZXJpZnlSZWNlaXB0JztcblxuY29uc3QgQVBQX1NUT1JFX0VSUk9SUyA9IHtcbiAgMjEwMDA6ICdUaGUgQXBwIFN0b3JlIGNvdWxkIG5vdCByZWFkIHRoZSBKU09OIG9iamVjdCB5b3UgcHJvdmlkZWQuJyxcbiAgMjEwMDI6ICdUaGUgZGF0YSBpbiB0aGUgcmVjZWlwdC1kYXRhIHByb3BlcnR5IHdhcyBtYWxmb3JtZWQgb3IgbWlzc2luZy4nLFxuICAyMTAwMzogJ1RoZSByZWNlaXB0IGNvdWxkIG5vdCBiZSBhdXRoZW50aWNhdGVkLicsXG4gIDIxMDA0OiAnVGhlIHNoYXJlZCBzZWNyZXQgeW91IHByb3ZpZGVkIGRvZXMgbm90IG1hdGNoIHRoZSBzaGFyZWQgc2VjcmV0IG9uIGZpbGUgZm9yIHlvdXIgYWNjb3VudC4nLFxuICAyMTAwNTogJ1RoZSByZWNlaXB0IHNlcnZlciBpcyBub3QgY3VycmVudGx5IGF2YWlsYWJsZS4nLFxuICAyMTAwNjogJ1RoaXMgcmVjZWlwdCBpcyB2YWxpZCBidXQgdGhlIHN1YnNjcmlwdGlvbiBoYXMgZXhwaXJlZC4nLFxuICAyMTAwNzogJ1RoaXMgcmVjZWlwdCBpcyBmcm9tIHRoZSB0ZXN0IGVudmlyb25tZW50LCBidXQgaXQgd2FzIHNlbnQgdG8gdGhlIHByb2R1Y3Rpb24gZW52aXJvbm1lbnQgZm9yIHZlcmlmaWNhdGlvbi4gU2VuZCBpdCB0byB0aGUgdGVzdCBlbnZpcm9ubWVudCBpbnN0ZWFkLicsXG4gIDIxMDA4OiAnVGhpcyByZWNlaXB0IGlzIGZyb20gdGhlIHByb2R1Y3Rpb24gZW52aXJvbm1lbnQsIGJ1dCBpdCB3YXMgc2VudCB0byB0aGUgdGVzdCBlbnZpcm9ubWVudCBmb3IgdmVyaWZpY2F0aW9uLiBTZW5kIGl0IHRvIHRoZSBwcm9kdWN0aW9uIGVudmlyb25tZW50IGluc3RlYWQuJyxcbn07XG5cbmZ1bmN0aW9uIGFwcFN0b3JlRXJyb3Ioc3RhdHVzKSB7XG4gIHN0YXR1cyA9IHBhcnNlSW50KHN0YXR1cyk7XG4gIHZhciBlcnJvclN0cmluZyA9IEFQUF9TVE9SRV9FUlJPUlNbc3RhdHVzXSB8fCAndW5rbm93biBlcnJvci4nO1xuICByZXR1cm4geyBzdGF0dXM6IHN0YXR1cywgZXJyb3I6IGVycm9yU3RyaW5nIH07XG59XG5cbmZ1bmN0aW9uIHZhbGlkYXRlV2l0aEFwcFN0b3JlKHVybCwgcmVjZWlwdCkge1xuICByZXR1cm4gcmVxdWVzdCh7XG4gICAgdXJsOiB1cmwsXG4gICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgYm9keTogeyAncmVjZWlwdC1kYXRhJzogcmVjZWlwdCB9LFxuICAgIGhlYWRlcnM6IHtcbiAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicsXG4gICAgfSxcbiAgfSkudGhlbihodHRwUmVzcG9uc2UgPT4ge1xuICAgIGNvbnN0IGJvZHkgPSBodHRwUmVzcG9uc2UuZGF0YTtcbiAgICBpZiAoYm9keSAmJiBib2R5LnN0YXR1cyA9PT0gMCkge1xuICAgICAgLy8gTm8gbmVlZCB0byBwYXNzIGFueXRoaW5nLCBzdGF0dXMgaXMgT0tcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgLy8gcmVjZWlwdCBpcyBmcm9tIHRlc3QgYW5kIHNob3VsZCBnbyB0byB0ZXN0XG4gICAgdGhyb3cgYm9keTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGdldEZpbGVGb3JQcm9kdWN0SWRlbnRpZmllcihwcm9kdWN0SWRlbnRpZmllciwgcmVxKSB7XG4gIHJldHVybiByZXN0XG4gICAgLmZpbmQoXG4gICAgICByZXEuY29uZmlnLFxuICAgICAgcmVxLmF1dGgsXG4gICAgICAnX1Byb2R1Y3QnLFxuICAgICAgeyBwcm9kdWN0SWRlbnRpZmllcjogcHJvZHVjdElkZW50aWZpZXIgfSxcbiAgICAgIHVuZGVmaW5lZCxcbiAgICAgIHJlcS5pbmZvLmNsaWVudFNESyxcbiAgICAgIHJlcS5pbmZvLmNvbnRleHRcbiAgICApXG4gICAgLnRoZW4oZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgY29uc3QgcHJvZHVjdHMgPSByZXN1bHQucmVzdWx0cztcbiAgICAgIGlmICghcHJvZHVjdHMgfHwgcHJvZHVjdHMubGVuZ3RoICE9IDEpIHtcbiAgICAgICAgLy8gRXJyb3Igbm90IGZvdW5kIG9yIHRvbyBtYW55XG4gICAgICAgIHRocm93IG5ldyBQYXJzZS5FcnJvcihQYXJzZS5FcnJvci5PQkpFQ1RfTk9UX0ZPVU5ELCAnT2JqZWN0IG5vdCBmb3VuZC4nKTtcbiAgICAgIH1cblxuICAgICAgdmFyIGRvd25sb2FkID0gcHJvZHVjdHNbMF0uZG93bmxvYWQ7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHsgcmVzcG9uc2U6IGRvd25sb2FkIH0pO1xuICAgIH0pO1xufVxuXG5leHBvcnQgY2xhc3MgSUFQVmFsaWRhdGlvblJvdXRlciBleHRlbmRzIFByb21pc2VSb3V0ZXIge1xuICBoYW5kbGVSZXF1ZXN0KHJlcSkge1xuICAgIGxldCByZWNlaXB0ID0gcmVxLmJvZHkucmVjZWlwdDtcbiAgICBjb25zdCBwcm9kdWN0SWRlbnRpZmllciA9IHJlcS5ib2R5LnByb2R1Y3RJZGVudGlmaWVyO1xuXG4gICAgaWYgKCFyZWNlaXB0IHx8ICFwcm9kdWN0SWRlbnRpZmllcikge1xuICAgICAgLy8gVE9ETzogRXJyb3IsIG1hbGZvcm1lZCByZXF1ZXN0XG4gICAgICB0aHJvdyBuZXcgUGFyc2UuRXJyb3IoUGFyc2UuRXJyb3IuSU5WQUxJRF9KU09OLCAnbWlzc2luZyByZWNlaXB0IG9yIHByb2R1Y3RJZGVudGlmaWVyJyk7XG4gICAgfVxuXG4gICAgLy8gVHJhbnNmb3JtIHRoZSBvYmplY3QgaWYgdGhlcmVcbiAgICAvLyBvdGhlcndpc2UgYXNzdW1lIGl0J3MgaW4gQmFzZTY0IGFscmVhZHlcbiAgICBpZiAodHlwZW9mIHJlY2VpcHQgPT0gJ29iamVjdCcpIHtcbiAgICAgIGlmIChyZWNlaXB0WydfX3R5cGUnXSA9PSAnQnl0ZXMnKSB7XG4gICAgICAgIHJlY2VpcHQgPSByZWNlaXB0LmJhc2U2NDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAocHJvY2Vzcy5lbnYuVEVTVElORyA9PSAnMScgJiYgcmVxLmJvZHkuYnlwYXNzQXBwU3RvcmVWYWxpZGF0aW9uKSB7XG4gICAgICByZXR1cm4gZ2V0RmlsZUZvclByb2R1Y3RJZGVudGlmaWVyKHByb2R1Y3RJZGVudGlmaWVyLCByZXEpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHN1Y2Nlc3NDYWxsYmFjaygpIHtcbiAgICAgIHJldHVybiBnZXRGaWxlRm9yUHJvZHVjdElkZW50aWZpZXIocHJvZHVjdElkZW50aWZpZXIsIHJlcSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZXJyb3JDYWxsYmFjayhlcnJvcikge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh7IHJlc3BvbnNlOiBhcHBTdG9yZUVycm9yKGVycm9yLnN0YXR1cykgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHZhbGlkYXRlV2l0aEFwcFN0b3JlKElBUF9QUk9EVUNUSU9OX1VSTCwgcmVjZWlwdCkudGhlbihcbiAgICAgICgpID0+IHtcbiAgICAgICAgcmV0dXJuIHN1Y2Nlc3NDYWxsYmFjaygpO1xuICAgICAgfSxcbiAgICAgIGVycm9yID0+IHtcbiAgICAgICAgaWYgKGVycm9yLnN0YXR1cyA9PSAyMTAwNykge1xuICAgICAgICAgIHJldHVybiB2YWxpZGF0ZVdpdGhBcHBTdG9yZShJQVBfU0FOREJPWF9VUkwsIHJlY2VpcHQpLnRoZW4oXG4gICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgIHJldHVybiBzdWNjZXNzQ2FsbGJhY2soKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBlcnJvciA9PiB7XG4gICAgICAgICAgICAgIHJldHVybiBlcnJvckNhbGxiYWNrKGVycm9yKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGVycm9yQ2FsbGJhY2soZXJyb3IpO1xuICAgICAgfVxuICAgICk7XG4gIH1cblxuICBtb3VudFJvdXRlcygpIHtcbiAgICB0aGlzLnJvdXRlKCdQT1NUJywgJy92YWxpZGF0ZV9wdXJjaGFzZScsIHRoaXMuaGFuZGxlUmVxdWVzdCk7XG4gIH1cbn1cbiJdfQ==