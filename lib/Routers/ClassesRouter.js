"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.ClassesRouter = void 0;

var _PromiseRouter = _interopRequireDefault(require("../PromiseRouter"));

var _rest = _interopRequireDefault(require("../rest"));

var _lodash = _interopRequireDefault(require("lodash"));

var _node = _interopRequireDefault(require("parse/node"));

var _middlewares = require("../middlewares");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const ALLOWED_GET_QUERY_KEYS = ['keys', 'include', 'excludeKeys', 'readPreference', 'includeReadPreference', 'subqueryReadPreference'];

class ClassesRouter extends _PromiseRouter.default {
  className(req) {
    return req.params.className;
  }

  handleFind(req) {
    const body = Object.assign(req.body, ClassesRouter.JSONFromQuery(req.query));
    const options = ClassesRouter.optionsFromBody(body);

    if (req.config.maxLimit && body.limit > req.config.maxLimit) {
      // Silently replace the limit on the query with the max configured
      options.limit = Number(req.config.maxLimit);
    }

    if (body.redirectClassNameForKey) {
      options.redirectClassNameForKey = String(body.redirectClassNameForKey);
    }

    if (typeof body.where === 'string') {
      body.where = JSON.parse(body.where);
    }

    return _rest.default.find(req.config, req.auth, this.className(req), body.where, options, req.info.clientSDK, req.info.context).then(response => {
      return {
        response: response
      };
    });
  } // Returns a promise for a {response} object.


  handleGet(req) {
    const body = Object.assign(req.body, ClassesRouter.JSONFromQuery(req.query));
    const options = {};

    for (const key of Object.keys(body)) {
      if (ALLOWED_GET_QUERY_KEYS.indexOf(key) === -1) {
        throw new _node.default.Error(_node.default.Error.INVALID_QUERY, 'Improper encode of parameter');
      }
    }

    if (typeof body.keys === 'string') {
      options.keys = body.keys;
    }

    if (body.include) {
      options.include = String(body.include);
    }

    if (typeof body.excludeKeys == 'string') {
      options.excludeKeys = body.excludeKeys;
    }

    if (typeof body.readPreference === 'string') {
      options.readPreference = body.readPreference;
    }

    if (typeof body.includeReadPreference === 'string') {
      options.includeReadPreference = body.includeReadPreference;
    }

    if (typeof body.subqueryReadPreference === 'string') {
      options.subqueryReadPreference = body.subqueryReadPreference;
    }

    return _rest.default.get(req.config, req.auth, this.className(req), req.params.objectId, options, req.info.clientSDK).then(response => {
      if (!response.results || response.results.length == 0) {
        throw new _node.default.Error(_node.default.Error.OBJECT_NOT_FOUND, 'Object not found.');
      }

      if (this.className(req) === '_User') {
        delete response.results[0].sessionToken;
        const user = response.results[0];

        if (req.auth.user && user.objectId == req.auth.user.id) {
          // Force the session token
          response.results[0].sessionToken = req.info.sessionToken;
        }
      }

      return {
        response: response.results[0]
      };
    });
  }

  handleCreate(req) {
    return _rest.default.create(req.config, req.auth, this.className(req), req.body, req.info.clientSDK, req.info.context);
  }

  handleUpdate(req) {
    const where = {
      objectId: req.params.objectId
    };
    return _rest.default.update(req.config, req.auth, this.className(req), where, req.body, req.info.clientSDK, req.info.context);
  }

  handleDelete(req) {
    return _rest.default.del(req.config, req.auth, this.className(req), req.params.objectId, req.info.context).then(() => {
      return {
        response: {}
      };
    });
  }

  static JSONFromQuery(query) {
    const json = {};

    for (const [key, value] of _lodash.default.entries(query)) {
      try {
        json[key] = JSON.parse(value);
      } catch (e) {
        json[key] = value;
      }
    }

    return json;
  }

  static optionsFromBody(body) {
    const allowConstraints = ['skip', 'limit', 'order', 'count', 'keys', 'excludeKeys', 'include', 'includeAll', 'redirectClassNameForKey', 'where', 'readPreference', 'includeReadPreference', 'subqueryReadPreference', 'hint', 'explain'];

    for (const key of Object.keys(body)) {
      if (allowConstraints.indexOf(key) === -1) {
        throw new _node.default.Error(_node.default.Error.INVALID_QUERY, `Invalid parameter for query: ${key}`);
      }
    }

    const options = {};

    if (body.skip) {
      options.skip = Number(body.skip);
    }

    if (body.limit || body.limit === 0) {
      options.limit = Number(body.limit);
    } else {
      options.limit = Number(100);
    }

    if (body.order) {
      options.order = String(body.order);
    }

    if (body.count) {
      options.count = true;
    }

    if (typeof body.keys == 'string') {
      options.keys = body.keys;
    }

    if (typeof body.excludeKeys == 'string') {
      options.excludeKeys = body.excludeKeys;
    }

    if (body.include) {
      options.include = String(body.include);
    }

    if (body.includeAll) {
      options.includeAll = true;
    }

    if (typeof body.readPreference === 'string') {
      options.readPreference = body.readPreference;
    }

    if (typeof body.includeReadPreference === 'string') {
      options.includeReadPreference = body.includeReadPreference;
    }

    if (typeof body.subqueryReadPreference === 'string') {
      options.subqueryReadPreference = body.subqueryReadPreference;
    }

    if (body.hint && (typeof body.hint === 'string' || typeof body.hint === 'object')) {
      options.hint = body.hint;
    }

    if (body.explain) {
      options.explain = body.explain;
    }

    return options;
  }

  mountRoutes() {
    this.route('GET', '/classes/:className', req => {
      return this.handleFind(req);
    });
    this.route('GET', '/classes/:className/:objectId', req => {
      return this.handleGet(req);
    });
    this.route('POST', '/classes/:className', _middlewares.promiseEnsureIdempotency, req => {
      return this.handleCreate(req);
    });
    this.route('PUT', '/classes/:className/:objectId', _middlewares.promiseEnsureIdempotency, req => {
      return this.handleUpdate(req);
    });
    this.route('DELETE', '/classes/:className/:objectId', req => {
      return this.handleDelete(req);
    });
  }

}

exports.ClassesRouter = ClassesRouter;
var _default = ClassesRouter;
exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9Sb3V0ZXJzL0NsYXNzZXNSb3V0ZXIuanMiXSwibmFtZXMiOlsiQUxMT1dFRF9HRVRfUVVFUllfS0VZUyIsIkNsYXNzZXNSb3V0ZXIiLCJQcm9taXNlUm91dGVyIiwiY2xhc3NOYW1lIiwicmVxIiwicGFyYW1zIiwiaGFuZGxlRmluZCIsImJvZHkiLCJPYmplY3QiLCJhc3NpZ24iLCJKU09ORnJvbVF1ZXJ5IiwicXVlcnkiLCJvcHRpb25zIiwib3B0aW9uc0Zyb21Cb2R5IiwiY29uZmlnIiwibWF4TGltaXQiLCJsaW1pdCIsIk51bWJlciIsInJlZGlyZWN0Q2xhc3NOYW1lRm9yS2V5IiwiU3RyaW5nIiwid2hlcmUiLCJKU09OIiwicGFyc2UiLCJyZXN0IiwiZmluZCIsImF1dGgiLCJpbmZvIiwiY2xpZW50U0RLIiwiY29udGV4dCIsInRoZW4iLCJyZXNwb25zZSIsImhhbmRsZUdldCIsImtleSIsImtleXMiLCJpbmRleE9mIiwiUGFyc2UiLCJFcnJvciIsIklOVkFMSURfUVVFUlkiLCJpbmNsdWRlIiwiZXhjbHVkZUtleXMiLCJyZWFkUHJlZmVyZW5jZSIsImluY2x1ZGVSZWFkUHJlZmVyZW5jZSIsInN1YnF1ZXJ5UmVhZFByZWZlcmVuY2UiLCJnZXQiLCJvYmplY3RJZCIsInJlc3VsdHMiLCJsZW5ndGgiLCJPQkpFQ1RfTk9UX0ZPVU5EIiwic2Vzc2lvblRva2VuIiwidXNlciIsImlkIiwiaGFuZGxlQ3JlYXRlIiwiY3JlYXRlIiwiaGFuZGxlVXBkYXRlIiwidXBkYXRlIiwiaGFuZGxlRGVsZXRlIiwiZGVsIiwianNvbiIsInZhbHVlIiwiXyIsImVudHJpZXMiLCJlIiwiYWxsb3dDb25zdHJhaW50cyIsInNraXAiLCJvcmRlciIsImNvdW50IiwiaW5jbHVkZUFsbCIsImhpbnQiLCJleHBsYWluIiwibW91bnRSb3V0ZXMiLCJyb3V0ZSIsInByb21pc2VFbnN1cmVJZGVtcG90ZW5jeSJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUNB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IHJlc3QgZnJvbSAnLi4vcmVzdCc7XG5pbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IFBhcnNlIGZyb20gJ3BhcnNlL25vZGUnO1xuaW1wb3J0IHsgcHJvbWlzZUVuc3VyZUlkZW1wb3RlbmN5IH0gZnJvbSAnLi4vbWlkZGxld2FyZXMnO1xuXG5jb25zdCBBTExPV0VEX0dFVF9RVUVSWV9LRVlTID0gW1xuICAna2V5cycsXG4gICdpbmNsdWRlJyxcbiAgJ2V4Y2x1ZGVLZXlzJyxcbiAgJ3JlYWRQcmVmZXJlbmNlJyxcbiAgJ2luY2x1ZGVSZWFkUHJlZmVyZW5jZScsXG4gICdzdWJxdWVyeVJlYWRQcmVmZXJlbmNlJyxcbl07XG5cbmV4cG9ydCBjbGFzcyBDbGFzc2VzUm91dGVyIGV4dGVuZHMgUHJvbWlzZVJvdXRlciB7XG4gIGNsYXNzTmFtZShyZXEpIHtcbiAgICByZXR1cm4gcmVxLnBhcmFtcy5jbGFzc05hbWU7XG4gIH1cblxuICBoYW5kbGVGaW5kKHJlcSkge1xuICAgIGNvbnN0IGJvZHkgPSBPYmplY3QuYXNzaWduKHJlcS5ib2R5LCBDbGFzc2VzUm91dGVyLkpTT05Gcm9tUXVlcnkocmVxLnF1ZXJ5KSk7XG4gICAgY29uc3Qgb3B0aW9ucyA9IENsYXNzZXNSb3V0ZXIub3B0aW9uc0Zyb21Cb2R5KGJvZHkpO1xuICAgIGlmIChyZXEuY29uZmlnLm1heExpbWl0ICYmIGJvZHkubGltaXQgPiByZXEuY29uZmlnLm1heExpbWl0KSB7XG4gICAgICAvLyBTaWxlbnRseSByZXBsYWNlIHRoZSBsaW1pdCBvbiB0aGUgcXVlcnkgd2l0aCB0aGUgbWF4IGNvbmZpZ3VyZWRcbiAgICAgIG9wdGlvbnMubGltaXQgPSBOdW1iZXIocmVxLmNvbmZpZy5tYXhMaW1pdCk7XG4gICAgfVxuICAgIGlmIChib2R5LnJlZGlyZWN0Q2xhc3NOYW1lRm9yS2V5KSB7XG4gICAgICBvcHRpb25zLnJlZGlyZWN0Q2xhc3NOYW1lRm9yS2V5ID0gU3RyaW5nKGJvZHkucmVkaXJlY3RDbGFzc05hbWVGb3JLZXkpO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIGJvZHkud2hlcmUgPT09ICdzdHJpbmcnKSB7XG4gICAgICBib2R5LndoZXJlID0gSlNPTi5wYXJzZShib2R5LndoZXJlKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3RcbiAgICAgIC5maW5kKFxuICAgICAgICByZXEuY29uZmlnLFxuICAgICAgICByZXEuYXV0aCxcbiAgICAgICAgdGhpcy5jbGFzc05hbWUocmVxKSxcbiAgICAgICAgYm9keS53aGVyZSxcbiAgICAgICAgb3B0aW9ucyxcbiAgICAgICAgcmVxLmluZm8uY2xpZW50U0RLLFxuICAgICAgICByZXEuaW5mby5jb250ZXh0XG4gICAgICApXG4gICAgICAudGhlbihyZXNwb25zZSA9PiB7XG4gICAgICAgIHJldHVybiB7IHJlc3BvbnNlOiByZXNwb25zZSB9O1xuICAgICAgfSk7XG4gIH1cblxuICAvLyBSZXR1cm5zIGEgcHJvbWlzZSBmb3IgYSB7cmVzcG9uc2V9IG9iamVjdC5cbiAgaGFuZGxlR2V0KHJlcSkge1xuICAgIGNvbnN0IGJvZHkgPSBPYmplY3QuYXNzaWduKHJlcS5ib2R5LCBDbGFzc2VzUm91dGVyLkpTT05Gcm9tUXVlcnkocmVxLnF1ZXJ5KSk7XG4gICAgY29uc3Qgb3B0aW9ucyA9IHt9O1xuXG4gICAgZm9yIChjb25zdCBrZXkgb2YgT2JqZWN0LmtleXMoYm9keSkpIHtcbiAgICAgIGlmIChBTExPV0VEX0dFVF9RVUVSWV9LRVlTLmluZGV4T2Yoa2V5KSA9PT0gLTEpIHtcbiAgICAgICAgdGhyb3cgbmV3IFBhcnNlLkVycm9yKFBhcnNlLkVycm9yLklOVkFMSURfUVVFUlksICdJbXByb3BlciBlbmNvZGUgb2YgcGFyYW1ldGVyJyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiBib2R5LmtleXMgPT09ICdzdHJpbmcnKSB7XG4gICAgICBvcHRpb25zLmtleXMgPSBib2R5LmtleXM7XG4gICAgfVxuICAgIGlmIChib2R5LmluY2x1ZGUpIHtcbiAgICAgIG9wdGlvbnMuaW5jbHVkZSA9IFN0cmluZyhib2R5LmluY2x1ZGUpO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIGJvZHkuZXhjbHVkZUtleXMgPT0gJ3N0cmluZycpIHtcbiAgICAgIG9wdGlvbnMuZXhjbHVkZUtleXMgPSBib2R5LmV4Y2x1ZGVLZXlzO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIGJvZHkucmVhZFByZWZlcmVuY2UgPT09ICdzdHJpbmcnKSB7XG4gICAgICBvcHRpb25zLnJlYWRQcmVmZXJlbmNlID0gYm9keS5yZWFkUHJlZmVyZW5jZTtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBib2R5LmluY2x1ZGVSZWFkUHJlZmVyZW5jZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIG9wdGlvbnMuaW5jbHVkZVJlYWRQcmVmZXJlbmNlID0gYm9keS5pbmNsdWRlUmVhZFByZWZlcmVuY2U7XG4gICAgfVxuICAgIGlmICh0eXBlb2YgYm9keS5zdWJxdWVyeVJlYWRQcmVmZXJlbmNlID09PSAnc3RyaW5nJykge1xuICAgICAgb3B0aW9ucy5zdWJxdWVyeVJlYWRQcmVmZXJlbmNlID0gYm9keS5zdWJxdWVyeVJlYWRQcmVmZXJlbmNlO1xuICAgIH1cblxuICAgIHJldHVybiByZXN0XG4gICAgICAuZ2V0KFxuICAgICAgICByZXEuY29uZmlnLFxuICAgICAgICByZXEuYXV0aCxcbiAgICAgICAgdGhpcy5jbGFzc05hbWUocmVxKSxcbiAgICAgICAgcmVxLnBhcmFtcy5vYmplY3RJZCxcbiAgICAgICAgb3B0aW9ucyxcbiAgICAgICAgcmVxLmluZm8uY2xpZW50U0RLXG4gICAgICApXG4gICAgICAudGhlbihyZXNwb25zZSA9PiB7XG4gICAgICAgIGlmICghcmVzcG9uc2UucmVzdWx0cyB8fCByZXNwb25zZS5yZXN1bHRzLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IFBhcnNlLkVycm9yKFBhcnNlLkVycm9yLk9CSkVDVF9OT1RfRk9VTkQsICdPYmplY3Qgbm90IGZvdW5kLicpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuY2xhc3NOYW1lKHJlcSkgPT09ICdfVXNlcicpIHtcbiAgICAgICAgICBkZWxldGUgcmVzcG9uc2UucmVzdWx0c1swXS5zZXNzaW9uVG9rZW47XG5cbiAgICAgICAgICBjb25zdCB1c2VyID0gcmVzcG9uc2UucmVzdWx0c1swXTtcblxuICAgICAgICAgIGlmIChyZXEuYXV0aC51c2VyICYmIHVzZXIub2JqZWN0SWQgPT0gcmVxLmF1dGgudXNlci5pZCkge1xuICAgICAgICAgICAgLy8gRm9yY2UgdGhlIHNlc3Npb24gdG9rZW5cbiAgICAgICAgICAgIHJlc3BvbnNlLnJlc3VsdHNbMF0uc2Vzc2lvblRva2VuID0gcmVxLmluZm8uc2Vzc2lvblRva2VuO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4geyByZXNwb25zZTogcmVzcG9uc2UucmVzdWx0c1swXSB9O1xuICAgICAgfSk7XG4gIH1cblxuICBoYW5kbGVDcmVhdGUocmVxKSB7XG4gICAgcmV0dXJuIHJlc3QuY3JlYXRlKFxuICAgICAgcmVxLmNvbmZpZyxcbiAgICAgIHJlcS5hdXRoLFxuICAgICAgdGhpcy5jbGFzc05hbWUocmVxKSxcbiAgICAgIHJlcS5ib2R5LFxuICAgICAgcmVxLmluZm8uY2xpZW50U0RLLFxuICAgICAgcmVxLmluZm8uY29udGV4dFxuICAgICk7XG4gIH1cblxuICBoYW5kbGVVcGRhdGUocmVxKSB7XG4gICAgY29uc3Qgd2hlcmUgPSB7IG9iamVjdElkOiByZXEucGFyYW1zLm9iamVjdElkIH07XG4gICAgcmV0dXJuIHJlc3QudXBkYXRlKFxuICAgICAgcmVxLmNvbmZpZyxcbiAgICAgIHJlcS5hdXRoLFxuICAgICAgdGhpcy5jbGFzc05hbWUocmVxKSxcbiAgICAgIHdoZXJlLFxuICAgICAgcmVxLmJvZHksXG4gICAgICByZXEuaW5mby5jbGllbnRTREssXG4gICAgICByZXEuaW5mby5jb250ZXh0XG4gICAgKTtcbiAgfVxuXG4gIGhhbmRsZURlbGV0ZShyZXEpIHtcbiAgICByZXR1cm4gcmVzdFxuICAgICAgLmRlbChyZXEuY29uZmlnLCByZXEuYXV0aCwgdGhpcy5jbGFzc05hbWUocmVxKSwgcmVxLnBhcmFtcy5vYmplY3RJZCwgcmVxLmluZm8uY29udGV4dClcbiAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgcmV0dXJuIHsgcmVzcG9uc2U6IHt9IH07XG4gICAgICB9KTtcbiAgfVxuXG4gIHN0YXRpYyBKU09ORnJvbVF1ZXJ5KHF1ZXJ5KSB7XG4gICAgY29uc3QganNvbiA9IHt9O1xuICAgIGZvciAoY29uc3QgW2tleSwgdmFsdWVdIG9mIF8uZW50cmllcyhxdWVyeSkpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGpzb25ba2V5XSA9IEpTT04ucGFyc2UodmFsdWUpO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBqc29uW2tleV0gPSB2YWx1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGpzb247XG4gIH1cblxuICBzdGF0aWMgb3B0aW9uc0Zyb21Cb2R5KGJvZHkpIHtcbiAgICBjb25zdCBhbGxvd0NvbnN0cmFpbnRzID0gW1xuICAgICAgJ3NraXAnLFxuICAgICAgJ2xpbWl0JyxcbiAgICAgICdvcmRlcicsXG4gICAgICAnY291bnQnLFxuICAgICAgJ2tleXMnLFxuICAgICAgJ2V4Y2x1ZGVLZXlzJyxcbiAgICAgICdpbmNsdWRlJyxcbiAgICAgICdpbmNsdWRlQWxsJyxcbiAgICAgICdyZWRpcmVjdENsYXNzTmFtZUZvcktleScsXG4gICAgICAnd2hlcmUnLFxuICAgICAgJ3JlYWRQcmVmZXJlbmNlJyxcbiAgICAgICdpbmNsdWRlUmVhZFByZWZlcmVuY2UnLFxuICAgICAgJ3N1YnF1ZXJ5UmVhZFByZWZlcmVuY2UnLFxuICAgICAgJ2hpbnQnLFxuICAgICAgJ2V4cGxhaW4nLFxuICAgIF07XG5cbiAgICBmb3IgKGNvbnN0IGtleSBvZiBPYmplY3Qua2V5cyhib2R5KSkge1xuICAgICAgaWYgKGFsbG93Q29uc3RyYWludHMuaW5kZXhPZihrZXkpID09PSAtMSkge1xuICAgICAgICB0aHJvdyBuZXcgUGFyc2UuRXJyb3IoUGFyc2UuRXJyb3IuSU5WQUxJRF9RVUVSWSwgYEludmFsaWQgcGFyYW1ldGVyIGZvciBxdWVyeTogJHtrZXl9YCk7XG4gICAgICB9XG4gICAgfVxuICAgIGNvbnN0IG9wdGlvbnMgPSB7fTtcbiAgICBpZiAoYm9keS5za2lwKSB7XG4gICAgICBvcHRpb25zLnNraXAgPSBOdW1iZXIoYm9keS5za2lwKTtcbiAgICB9XG4gICAgaWYgKGJvZHkubGltaXQgfHwgYm9keS5saW1pdCA9PT0gMCkge1xuICAgICAgb3B0aW9ucy5saW1pdCA9IE51bWJlcihib2R5LmxpbWl0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgb3B0aW9ucy5saW1pdCA9IE51bWJlcigxMDApO1xuICAgIH1cbiAgICBpZiAoYm9keS5vcmRlcikge1xuICAgICAgb3B0aW9ucy5vcmRlciA9IFN0cmluZyhib2R5Lm9yZGVyKTtcbiAgICB9XG4gICAgaWYgKGJvZHkuY291bnQpIHtcbiAgICAgIG9wdGlvbnMuY291bnQgPSB0cnVlO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIGJvZHkua2V5cyA9PSAnc3RyaW5nJykge1xuICAgICAgb3B0aW9ucy5rZXlzID0gYm9keS5rZXlzO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIGJvZHkuZXhjbHVkZUtleXMgPT0gJ3N0cmluZycpIHtcbiAgICAgIG9wdGlvbnMuZXhjbHVkZUtleXMgPSBib2R5LmV4Y2x1ZGVLZXlzO1xuICAgIH1cbiAgICBpZiAoYm9keS5pbmNsdWRlKSB7XG4gICAgICBvcHRpb25zLmluY2x1ZGUgPSBTdHJpbmcoYm9keS5pbmNsdWRlKTtcbiAgICB9XG4gICAgaWYgKGJvZHkuaW5jbHVkZUFsbCkge1xuICAgICAgb3B0aW9ucy5pbmNsdWRlQWxsID0gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBib2R5LnJlYWRQcmVmZXJlbmNlID09PSAnc3RyaW5nJykge1xuICAgICAgb3B0aW9ucy5yZWFkUHJlZmVyZW5jZSA9IGJvZHkucmVhZFByZWZlcmVuY2U7XG4gICAgfVxuICAgIGlmICh0eXBlb2YgYm9keS5pbmNsdWRlUmVhZFByZWZlcmVuY2UgPT09ICdzdHJpbmcnKSB7XG4gICAgICBvcHRpb25zLmluY2x1ZGVSZWFkUHJlZmVyZW5jZSA9IGJvZHkuaW5jbHVkZVJlYWRQcmVmZXJlbmNlO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIGJvZHkuc3VicXVlcnlSZWFkUHJlZmVyZW5jZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIG9wdGlvbnMuc3VicXVlcnlSZWFkUHJlZmVyZW5jZSA9IGJvZHkuc3VicXVlcnlSZWFkUHJlZmVyZW5jZTtcbiAgICB9XG4gICAgaWYgKGJvZHkuaGludCAmJiAodHlwZW9mIGJvZHkuaGludCA9PT0gJ3N0cmluZycgfHwgdHlwZW9mIGJvZHkuaGludCA9PT0gJ29iamVjdCcpKSB7XG4gICAgICBvcHRpb25zLmhpbnQgPSBib2R5LmhpbnQ7XG4gICAgfVxuICAgIGlmIChib2R5LmV4cGxhaW4pIHtcbiAgICAgIG9wdGlvbnMuZXhwbGFpbiA9IGJvZHkuZXhwbGFpbjtcbiAgICB9XG4gICAgcmV0dXJuIG9wdGlvbnM7XG4gIH1cblxuICBtb3VudFJvdXRlcygpIHtcbiAgICB0aGlzLnJvdXRlKCdHRVQnLCAnL2NsYXNzZXMvOmNsYXNzTmFtZScsIHJlcSA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5oYW5kbGVGaW5kKHJlcSk7XG4gICAgfSk7XG4gICAgdGhpcy5yb3V0ZSgnR0VUJywgJy9jbGFzc2VzLzpjbGFzc05hbWUvOm9iamVjdElkJywgcmVxID0+IHtcbiAgICAgIHJldHVybiB0aGlzLmhhbmRsZUdldChyZXEpO1xuICAgIH0pO1xuICAgIHRoaXMucm91dGUoJ1BPU1QnLCAnL2NsYXNzZXMvOmNsYXNzTmFtZScsIHByb21pc2VFbnN1cmVJZGVtcG90ZW5jeSwgcmVxID0+IHtcbiAgICAgIHJldHVybiB0aGlzLmhhbmRsZUNyZWF0ZShyZXEpO1xuICAgIH0pO1xuICAgIHRoaXMucm91dGUoJ1BVVCcsICcvY2xhc3Nlcy86Y2xhc3NOYW1lLzpvYmplY3RJZCcsIHByb21pc2VFbnN1cmVJZGVtcG90ZW5jeSwgcmVxID0+IHtcbiAgICAgIHJldHVybiB0aGlzLmhhbmRsZVVwZGF0ZShyZXEpO1xuICAgIH0pO1xuICAgIHRoaXMucm91dGUoJ0RFTEVURScsICcvY2xhc3Nlcy86Y2xhc3NOYW1lLzpvYmplY3RJZCcsIHJlcSA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5oYW5kbGVEZWxldGUocmVxKTtcbiAgICB9KTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBDbGFzc2VzUm91dGVyO1xuIl19