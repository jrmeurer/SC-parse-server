"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _commander = require("commander");

var _path = _interopRequireDefault(require("path"));

var _Deprecator = _interopRequireDefault(require("../../Deprecator/Deprecator"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable no-console */
let _definitions;

let _reverseDefinitions;

let _defaults;

_commander.Command.prototype.loadDefinitions = function (definitions) {
  _definitions = definitions;
  Object.keys(definitions).reduce((program, opt) => {
    if (typeof definitions[opt] == 'object') {
      const additionalOptions = definitions[opt];

      if (additionalOptions.required === true) {
        return program.option(`--${opt} <${opt}>`, additionalOptions.help, additionalOptions.action);
      } else {
        return program.option(`--${opt} [${opt}]`, additionalOptions.help, additionalOptions.action);
      }
    }

    return program.option(`--${opt} [${opt}]`);
  }, this);
  _reverseDefinitions = Object.keys(definitions).reduce((object, key) => {
    let value = definitions[key];

    if (typeof value == 'object') {
      value = value.env;
    }

    if (value) {
      object[value] = key;
    }

    return object;
  }, {});
  _defaults = Object.keys(definitions).reduce((defs, opt) => {
    if (_definitions[opt].default !== undefined) {
      defs[opt] = _definitions[opt].default;
    }

    return defs;
  }, {});
  /* istanbul ignore next */

  this.on('--help', function () {
    console.log('  Configure From Environment:');
    console.log('');
    Object.keys(_reverseDefinitions).forEach(key => {
      console.log(`    $ ${key}='${_reverseDefinitions[key]}'`);
    });
    console.log('');
  });
};

function parseEnvironment(env = {}) {
  return Object.keys(_reverseDefinitions).reduce((options, key) => {
    if (env[key]) {
      const originalKey = _reverseDefinitions[key];

      let action = option => option;

      if (typeof _definitions[originalKey] === 'object') {
        action = _definitions[originalKey].action || action;
      }

      options[_reverseDefinitions[key]] = action(env[key]);
    }

    return options;
  }, {});
}

function parseConfigFile(program) {
  let options = {};

  if (program.args.length > 0) {
    let jsonPath = program.args[0];
    jsonPath = _path.default.resolve(jsonPath);

    const jsonConfig = require(jsonPath);

    if (jsonConfig.apps) {
      if (jsonConfig.apps.length > 1) {
        throw 'Multiple apps are not supported';
      }

      options = jsonConfig.apps[0];
    } else {
      options = jsonConfig;
    }

    Object.keys(options).forEach(key => {
      const value = options[key];

      if (!_definitions[key]) {
        throw `error: unknown option ${key}`;
      }

      const action = _definitions[key].action;

      if (action) {
        options[key] = action(value);
      }
    });
    console.log(`Configuration loaded from ${jsonPath}`);
  }

  return options;
}

_commander.Command.prototype.setValuesIfNeeded = function (options) {
  Object.keys(options).forEach(key => {
    if (!Object.prototype.hasOwnProperty.call(this, key)) {
      this[key] = options[key];
    }
  });
};

_commander.Command.prototype._parse = _commander.Command.prototype.parse;

_commander.Command.prototype.parse = function (args, env) {
  this._parse(args); // Parse the environment first


  const envOptions = parseEnvironment(env);
  const fromFile = parseConfigFile(this); // Load the env if not passed from command line

  this.setValuesIfNeeded(envOptions); // Load from file to override

  this.setValuesIfNeeded(fromFile); // Scan for deprecated Parse Server options

  _Deprecator.default.scanParseServerOptions(this); // Last set the defaults


  this.setValuesIfNeeded(_defaults);
};

_commander.Command.prototype.getOptions = function () {
  return Object.keys(_definitions).reduce((options, key) => {
    if (typeof this[key] !== 'undefined') {
      options[key] = this[key];
    }

    return options;
  }, {});
};

var _default = new _commander.Command();
/* eslint-enable no-console */


exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jbGkvdXRpbHMvY29tbWFuZGVyLmpzIl0sIm5hbWVzIjpbIl9kZWZpbml0aW9ucyIsIl9yZXZlcnNlRGVmaW5pdGlvbnMiLCJfZGVmYXVsdHMiLCJDb21tYW5kIiwicHJvdG90eXBlIiwibG9hZERlZmluaXRpb25zIiwiZGVmaW5pdGlvbnMiLCJPYmplY3QiLCJrZXlzIiwicmVkdWNlIiwicHJvZ3JhbSIsIm9wdCIsImFkZGl0aW9uYWxPcHRpb25zIiwicmVxdWlyZWQiLCJvcHRpb24iLCJoZWxwIiwiYWN0aW9uIiwib2JqZWN0Iiwia2V5IiwidmFsdWUiLCJlbnYiLCJkZWZzIiwiZGVmYXVsdCIsInVuZGVmaW5lZCIsIm9uIiwiY29uc29sZSIsImxvZyIsImZvckVhY2giLCJwYXJzZUVudmlyb25tZW50Iiwib3B0aW9ucyIsIm9yaWdpbmFsS2V5IiwicGFyc2VDb25maWdGaWxlIiwiYXJncyIsImxlbmd0aCIsImpzb25QYXRoIiwicGF0aCIsInJlc29sdmUiLCJqc29uQ29uZmlnIiwicmVxdWlyZSIsImFwcHMiLCJzZXRWYWx1ZXNJZk5lZWRlZCIsImhhc093blByb3BlcnR5IiwiY2FsbCIsIl9wYXJzZSIsInBhcnNlIiwiZW52T3B0aW9ucyIsImZyb21GaWxlIiwiRGVwcmVjYXRvciIsInNjYW5QYXJzZVNlcnZlck9wdGlvbnMiLCJnZXRPcHRpb25zIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7QUFIQTtBQUtBLElBQUlBLFlBQUo7O0FBQ0EsSUFBSUMsbUJBQUo7O0FBQ0EsSUFBSUMsU0FBSjs7QUFFQUMsbUJBQVFDLFNBQVIsQ0FBa0JDLGVBQWxCLEdBQW9DLFVBQVVDLFdBQVYsRUFBdUI7QUFDekROLEVBQUFBLFlBQVksR0FBR00sV0FBZjtBQUVBQyxFQUFBQSxNQUFNLENBQUNDLElBQVAsQ0FBWUYsV0FBWixFQUF5QkcsTUFBekIsQ0FBZ0MsQ0FBQ0MsT0FBRCxFQUFVQyxHQUFWLEtBQWtCO0FB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RUFSNkMsQ0FTN0M7O0FBQ0FDLHNCQUFXQyxzQkFBWCxDQUFrQyxJQUFsQyxFQVY2QyxDQVc3Qzs7O0FBQ0EsT0FBS1IsaUJBQUwsQ0FBdUJ0QyxTQUF2QjtBQUNELENBYkQ7O0FBZUFDLG1CQUFRQyxTQUFSLENBQWtCNkMsVUFBbEIsR0FBK0IsWUFBWTtBQUN6QyxTQUFPMUMsTUFBTSxDQUFDQyxJQUFQLENBQVlSLFlBQVosRUFBMEJTLE1BQTFCLENBQWlDLENBQUNvQixPQUFELEVBQVVYLEdBQVYsS0FBa0I7QUFDeEQsUUFBSSxPQUFPLEtBQUtBLEdBQUwsQ0FBUCxLQUFxQixXQUF6QixFQUFzQztBQUNwQ1csTUFBQUEsT0FBTyxDQUFDWCxHQUFELENBQVAsR0FBZSxLQUFLQSxHQUFMLENBQWY7QUFDRDs7QUFDRCxXQUFPVyxPQUFQO0FBQ0QsR0FMTSxFQUtKLEVBTEksQ0FBUDtBQU1ELENBUEQ7O2VBU2UsSUFBSTFCLGtCQUFKLEU7QUFDZiIsInNvdXJjZXNDb250ZW50IjpbIi8qIGVzbGludC1kaXNhYmxlIG5vLWNvbnNvbGUgKi9cbmltcG9ydCB7IENvbW1hbmQgfSBmcm9tICdjb21tYW5kZXInO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgRGVwcmVjYXRvciBmcm9tICcuLi8uLi9EZXByZWNhdG9yL0RlcHJlY2F0b3InO1xuXG5sZXQgX2RlZmluaXRpb25zO1xubGV0IF9yZXZlcnNlRGVmaW5pdGlvbnM7XG5sZXQgX2RlZmF1bHRzO1xuXG5Db21tYW5kLnByb3RvdHlwZS5sb2FkRGVmaW5pdGlvbnMgPSBmdW5jdGlvbiAoZGVmaW5pdGlvbnMpIHtcbiAgX2RlZmluaXRpb25zID0gZGVmaW5pdGlvbnM7XG5cbiAgT2JqZWN0LmtleXMoZGVmaW5pdGlvbnMpLnJlZHVjZSgocHJvZ3JhbSwgb3B0KSA9PiB7XG4gICAgaWYgKHR5cGVvZiBkZWZpbml0aW9uc1tvcHRdID09ICdvYmplY3QnKSB7XG4gICAgICBjb25zdCBhZGRpdGlvbmFsT3B0aW9ucyA9IGRlZmluaXRpb25zW29wdF07XG4gICAgICBpZiAoYWRkaXRpb25hbE9wdGlvbnMucmVxdWlyZWQgPT09IHRydWUpIHtcbiAgICAgICAgcmV0dXJuIHByb2dyYW0ub3B0aW9uKFxuICAgICAgICAgIGAtLSR7b3B0fSA8JHtvcHR9PmAsXG4gICAgICAgICAgYWRkaXRpb25hbE9wdGlvbnMuaGVscCxcbiAgICAgICAgICBhZGRpdGlvbmFsT3B0aW9ucy5hY3Rpb25cbiAgICAgICAgKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBwcm9ncmFtLm9wdGlvbihcbiAgICAgICAgICBgLS0ke29wdH0gWyR7b3B0fV1gLFxuICAgICAgICAgIGFkZGl0aW9uYWxPcHRpb25zLmhlbHAsXG4gICAgICAgICAgYWRkaXRpb25hbE9wdGlvbnMuYWN0aW9uXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBwcm9ncmFtLm9wdGlvbihgLS0ke29wdH0gWyR7b3B0fV1gKTtcbiAgfSwgdGhpcyk7XG5cbiAgX3JldmVyc2VEZWZpbml0aW9ucyA9IE9iamVjdC5rZXlzKGRlZmluaXRpb25zKS5yZWR1Y2UoKG9iamVjdCwga2V5KSA9PiB7XG4gICAgbGV0IHZhbHVlID0gZGVmaW5pdGlvbnNba2V5XTtcbiAgICBpZiAodHlwZW9mIHZhbHVlID09ICdvYmplY3QnKSB7XG4gICAgICB2YWx1ZSA9IHZhbHVlLmVudjtcbiAgICB9XG4gICAgaWYgKHZhbHVlKSB7XG4gICAgICBvYmplY3RbdmFsdWVdID0ga2V5O1xuICAgIH1cbiAgICByZXR1cm4gb2JqZWN0O1xuICB9LCB7fSk7XG5cbiAgX2RlZmF1bHRzID0gT2JqZWN0LmtleXMoZGVmaW5pdGlvbnMpLnJlZHVjZSgoZGVmcywgb3B0KSA9PiB7XG4gICAgaWYgKF9kZWZpbml0aW9uc1tvcHRdLmRlZmF1bHQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgZGVmc1tvcHRdID0gX2RlZmluaXRpb25zW29wdF0uZGVmYXVsdDtcbiAgICB9XG4gICAgcmV0dXJuIGRlZnM7XG4gIH0sIHt9KTtcblxuICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICB0aGlzLm9uKCctLWhlbHAnLCBmdW5jdGlvbiAoKSB7XG4gICAgY29uc29sZS5sb2coJyAgQ29uZmlndXJlIEZyb20gRW52aXJvbm1lbnQ6Jyk7XG4gICAgY29uc29sZS5sb2coJycpO1xuICAgIE9iamVjdC5rZXlzKF9yZXZlcnNlRGVmaW5pdGlvbnMpLmZvckVhY2goa2V5ID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKGAgICAgJCAke2tleX09JyR7X3JldmVyc2VEZWZpbml0aW9uc1trZXldfSdgKTtcbiAgICB9KTtcbiAgICBjb25zb2xlLmxvZygnJyk7XG4gIH0pO1xufTtcblxuZnVuY3Rpb24gcGFyc2VFbnZpcm9ubWVudChlbnYgPSB7fSkge1xuICByZXR1cm4gT2JqZWN0LmtleXMoX3JldmVyc2VEZWZpbml0aW9ucykucmVkdWNlKChvcHRpb25zLCBrZXkpID0+IHtcbiAgICBpZiAoZW52W2tleV0pIHtcbiAgICAgIGNvbnN0IG9yaWdpbmFsS2V5ID0gX3JldmVyc2VEZWZpbml0aW9uc1trZXldO1xuICAgICAgbGV0IGFjdGlvbiA9IG9wdGlvbiA9PiBvcHRpb247XG4gICAgICBpZiAodHlwZW9mIF9kZWZpbml0aW9uc1tvcmlnaW5hbEtleV0gPT09ICdvYmplY3QnKSB7XG4gICAgICAgIGFjdGlvbiA9IF9kZWZpbml0aW9uc1tvcmlnaW5hbEtleV0uYWN0aW9uIHx8IGFjdGlvbjtcbiAgICAgIH1cbiAgICAgIG9wdGlvbnNbX3JldmVyc2VEZWZpbml0aW9uc1trZXldXSA9IGFjdGlvbihlbnZba2V5XSk7XG4gICAgfVxuICAgIHJldHVybiBvcHRpb25zO1xuICB9LCB7fSk7XG59XG5cbmZ1bmN0aW9uIHBhcnNlQ29uZmlnRmlsZShwcm9ncmFtKSB7XG4gIGxldCBvcHRpb25zID0ge307XG4gIGlmIChwcm9ncmFtLmFyZ3MubGVuZ3RoID4gMCkge1xuICAgIGxldCBqc29uUGF0aCA9IHByb2dyYW0uYXJnc1swXTtcbiAgICBqc29uUGF0aCA9IHBhdGgucmVzb2x2ZShqc29uUGF0aCk7XG4gICAgY29uc3QganNvbkNvbmZpZyA9IHJlcXVpcmUoanNvblBhdGgpO1xuICAgIGlmIChqc29uQ29uZmlnLmFwcHMpIHtcbiAgICAgIGlmIChqc29uQ29uZmlnLmFwcHMubGVuZ3RoID4gMSkge1xuICAgICAgICB0aHJvdyAnTXVsdGlwbGUgYXBwcyBhcmUgbm90IHN1cHBvcnRlZCc7XG4gICAgICB9XG4gICAgICBvcHRpb25zID0ganNvbkNvbmZpZy5hcHBzWzBdO1xuICAgIH0gZWxzZSB7XG4gICAgICBvcHRpb25zID0ganNvbkNvbmZpZztcbiAgICB9XG4gICAgT2JqZWN0LmtleXMob3B0aW9ucykuZm9yRWFjaChrZXkgPT4ge1xuICAgICAgY29uc3QgdmFsdWUgPSBvcHRpb25zW2tleV07XG4gICAgICBpZiAoIV9kZWZpbml0aW9uc1trZXldKSB7XG4gICAgICAgIHRocm93IGBlcnJvcjogdW5rbm93biBvcHRpb24gJHtrZXl9YDtcbiAgICAgIH1cbiAgICAgIGNvbnN0IGFjdGlvbiA9IF9kZWZpbml0aW9uc1trZXldLmFjdGlvbjtcbiAgICAgIGlmIChhY3Rpb24pIHtcbiAgICAgICAgb3B0aW9uc1trZXldID0gYWN0aW9uKHZhbHVlKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBjb25zb2xlLmxvZyhgQ29uZmlndXJhdGlvbiBsb2FkZWQgZnJvbSAke2pzb25QYXRofWApO1xuICB9XG4gIHJldHVybiBvcHRpb25zO1xufVxuXG5Db21tYW5kLnByb3RvdHlwZS5zZXRWYWx1ZXNJZk5lZWRlZCA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gIE9iamVjdC5rZXlzKG9wdGlvbnMpLmZvckVhY2goa2V5ID0+IHtcbiAgICBpZiAoIU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbCh0aGlzLCBrZXkpKSB7XG4gICAgICB0aGlzW2tleV0gPSBvcHRpb25zW2tleV07XG4gICAgfVxuICB9KTtcbn07XG5cbkNvbW1hbmQucHJvdG90eXBlLl9wYXJzZSA9IENvbW1hbmQucHJvdG90eXBlLnBhcnNlO1xuXG5Db21tYW5kLnByb3RvdHlwZS5wYXJzZSA9IGZ1bmN0aW9uIChhcmdzLCBlbnYpIHtcbiAgdGhpcy5fcGFyc2UoYXJncyk7XG4gIC8vIFBhcnNlIHRoZSBlbnZpcm9ubWVudCBmaXJzdFxuICBjb25zdCBlbnZPcHRpb25zID0gcGFyc2VFbnZpcm9ubWVudChlbnYpO1xuICBjb25zdCBmcm9tRmlsZSA9IHBhcnNlQ29uZmlnRmlsZSh0aGlzKTtcbiAgLy8gTG9hZCB0aGUgZW52IGlmIG5vdCBwYXNzZWQgZnJvbSBjb21tYW5kIGxpbmVcbiAgdGhpcy5zZXRWYWx1ZXNJZk5lZWRlZChlbnZPcHRpb25zKTtcbiAgLy8gTG9hZCBmcm9tIGZpbGUgdG8gb3ZlcnJpZGVcbiAgdGhpcy5zZXRWYWx1ZXNJZk5lZWRlZChmcm9tRmlsZSk7XG4gIC8vIFNjYW4gZm9yIGRlcHJlY2F0ZWQgUGFyc2UgU2VydmVyIG9wdGlvbnNcbiAgRGVwcmVjYXRvci5zY2FuUGFyc2VTZXJ2ZXJPcHRpb25zKHRoaXMpO1xuICAvLyBMYXN0IHNldCB0aGUgZGVmYXVsdHNcbiAgdGhpcy5zZXRWYWx1ZXNJZk5lZWRlZChfZGVmYXVsdHMpO1xufTtcblxuQ29tbWFuZC5wcm90b3R5cGUuZ2V0T3B0aW9ucyA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIE9iamVjdC5rZXlzKF9kZWZpbml0aW9ucykucmVkdWNlKChvcHRpb25zLCBrZXkpID0+IHtcbiAgICBpZiAodHlwZW9mIHRoaXNba2V5XSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIG9wdGlvbnNba2V5XSA9IHRoaXNba2V5XTtcbiAgICB9XG4gICAgcmV0dXJuIG9wdGlvbnM7XG4gIH0sIHt9KTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IG5ldyBDb21tYW5kKCk7XG4vKiBlc2xpbnQtZW5hYmxlIG5vLWNvbnNvbGUgKi9cbiJdfQ==