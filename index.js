#!/usr/bin/env node

const settings = require('./package.json');
const uuid = require('uuid');
const path = require('path');
const _ = require('lodash');
const colors = require('colors');
const commands = process.argv;
/*REQUIRED_START*/
const { Transform } = require('stream');
const tty = require('tty');
/*NEW CODE HERE*/

/*END NEW CODE*/
/*REQUIRED_END*/
/**
 * @type{object}
 *
 * */

const defaults = {} || settings.union_station_module_system.defaults;

/**
 * @type{string}
 *
 * */
defaults.nodeModulesPath = "node_modules";

/**
 * @type{string}
 *
 * */
defaults.prefix = "union_station";

/**
 * @type{string}
 *
 * */
defaults.description = "empty_module";

/**
 * @type{string}
 *
 * */
defaults.name = "empty_module";

/**
 * @type{string}
 *
 * */
defaults.version = "0.0.0";

/**
 * @type{string}
 *
 * */
defaults.author = "union_station_module_system";

/**
 * @type{string}
 *
 * */
defaults.license = "ISC";

/**
 * @type{object}
 *
 **/

defaults.packageJSON = {
  "name": defaults.name,
  "version": defaults.version,
  "description": defaults.description,
  "main": "index.js",
  "scripts": {
    "test": "test"
  },
  "author": defaults.author,
  "license": defaults.license
};

/*REQUIRED_START*/
/**
 * Main export from this module.
 * It returns a class with a constructor that inherits
 * from stream.Transform.
 * (https://nodejs.org/api/stream.html#stream_class_stream_transform).
 * 
 * Methods other than piping through _transform can be called by
 * passing the --method flag with arguments, ex:
 * 
 * ./index.js  --method {method} --key1 {val1} --key2 {val2} ...
 * 
 * @method exports
 *
 * @param    {object}    argv - Input arguments (from cmdline -key value)
 * @property {string}    argv.method - Method to call with arguments
 *
 * @returns {object}
 **/

module.exports = class union_station_module extends Transform {
  constructor(argv) {

    super(argv);

    this.argv = argv;

    /* Add properties from module */
    for (var _prop in module) {
      this[_prop] = module[_prop];
    }

    /*Registry Checking Code */

    if(!process.hasOwnProperty('union-station-registry')){
      process['union-station-registry'] = {};
    }

    process['union-station-registry'][this.id] = module.exports;

    if (require.main === module) {

      if (argv) {

        if (argv.method && argv.method in module && typeof module[argv.method] === 'function') {

          return module[argv.method](argv);

        } else {

          if (argv.method) {

            throw Error("\n Method '" + argv.method + "' does not exist.\nChoose method parameter '-method {method}' from options below:");

          }

          if (!process.stdin.isTTY) {
            process.stdin.pipe(this).pipe(process.stdout);
          } else {

            module.genDoc();
          }

        }
      } else {

        throw Error('missing arguments object');
      }
    } else {

      
    }
  }
  
  /**
 * Returns module.
 * @method getModule
 *
 * @returns {object}
 **/

  getModule() { return module };

  /**
   * Transform method
   * @function _transform
   *
   * @returns {null}
   **/

  _transform(data, encoding, cb) {
    let error = null;
    cb(error, data);
  };

  /**
   * Flush method
   * @function _flush
   *
   * @returns {null}
 **/

  _flush (cb) {
    this.push();
    cb();
  
  };

};  /* End Class */

/**
 * Unique Identifier.
 * @property id
 *
 * @returns {id}
 **/

module.id = /*ID*/'0';

/**
 * JSDoc3 compliant tag-parser method.
 * @function genDoc
 *
 * @returns {string}
 **/

module.genDoc = function () {

  var this_file = require('fs').readFileSync(module.filename, { encoding: 'utf8' });
  var docs = this_file.match(/(\/\*\*([\s\S]*?)\*\/)$/gm);
  var docsFinal = ["\n", "\n"];
  for (var doc = 0; doc < docs.length; doc++) {

    if (!docs[doc].match(/\@type/g)) {
      docsFinal.push(docs[doc]);

      if (docs[doc].match(/\*\*\//g)) {
        docsFinal.push("\n");
      }

    }
  }
  console.log(docsFinal.join("\n"));
};

/**
 * Checks for Union-Station Registry
 * in the current process
 * @function checkRegistry
 *
 * @returns {string}
 **/

module.checkRegistry = function () {
  
  var this_file = require('fs').readFileSync(module.filename, { encoding: 'utf8' });
  var docs = this_file.match(/(\/\*\*([\s\S]*?)\*\/)$/gm);
  var docsFinal = ["\n", "\n"];
  for (var doc = 0; doc < docs.length; doc++) {

    if (!docs[doc].match(/\@type/g)) {
      docsFinal.push(docs[doc]);

      if (docs[doc].match(/\*\*\//g)) {
        docsFinal.push("\n");
      }

    }
  }
  console.log(docsFinal.join("\n"));
};










/*REQUIRED_END*/
var fs = require('fs');

/**
 * Creates New Module.
 * @method generate
 *
 * @param    {object}    argv - Input options (from cmdline -key value)
 * @property {string}    argv.prefix - Prefix for module
 * @property {string}    argv.description
 * @property {string}    argv.nodeModulesPath - Path to put module
 * @property {string}    argv.name
 * @property {string}    argv.version
 * @property {string}    argv.author
 * @property {string}    argv.license
 *
 * @returns {string}
 **/
module.generate = function (argv) {

  // Extends arguments with defaults
  argv = _.extend(defaults, argv);
  _.assign(argv.packageJSON, _.pick(defaults, _.keys(argv.packageJSON)));

  // Time-based UUID generated for module
  var module_uuid = uuid.v4().replace(/\-/g, "");

  argv.packageJSON.id = module_uuid;
  var _filename = [argv.prefix, argv.name];
  var _delimiter = "__";
  for (var _f = 0; _f < _filename.length; _f++) {
    _filename[_f] = _filename[_f].replace(new RegExp(_delimiter, 'gi'), "").replace(/\s/g, "");
  }
  argv.packageJSON.name = _filename.join(_delimiter);

  if (!fs.existsSync(argv.nodeModulesPath)) {
    fs.mkdirSync(argv.nodeModulesPath);
  }

  // Path to put the module
  var modulePath = path.join(argv.nodeModulesPath, argv.packageJSON.name);

  if (!fs.existsSync(modulePath)) {

    // JS code to put in new module
    var indexJS = "#!/usr/bin/env node\n\n" +
      fs.readFileSync(module.filename, { encoding: 'utf8' })
        .match(/(\/\*REQUIRED_START\*\/)[^~]*?(\/\*REQUIRED_END\*\/)/g)
        .join("")
        .replace(/\/\*REQUIRED_((START)|(END))\*\//g, "")
        .replace("union_station_module", _filename.join(_delimiter) + "\u115F" + module_uuid)
        .replace(/\|'generate'.*\)}}/g, ")}}")
        .replace(/\/\*ID\*\/'0'/g, "'" + module_uuid + "'");

    fs.mkdirSync(modulePath);

    fs.writeFileSync(
      path.join(modulePath, "package.json"),
      JSON.stringify(argv.packageJSON,
        null,
        4)
    );

    fs.writeFileSync(
      path.join(modulePath, argv.packageJSON.main),
      indexJS
    );

    // output message

    argv.path = path.join(argv.nodeModulesPath, argv.packageJSON.name);

    if (require.main == module) {
      console.log(argv.path);
    }
    return argv.path;

  } else {
    var error = ["Cannot Create Module: ",
      argv.packageJSON.name,
      " in ",
      modulePath,
      ", Folder Already Exists."
    ].join(" ");

    throw Error(error);

  }
}


/*REQUIRED_START*/

/*
  TODO:
  The test suite to see if this is a valid module will call it from the
  commandline and see if all publicly accessible methods are callable.
*/

if (require.main == module) {

  if (process.argv.length % 2 !== 0) {

    throw Error("Argument Missing or unmatched: " + process.argv.slice(2));

  } else {

    var _arguments = {};
    for (var i = 2; i < process.argv.length; i++) {
      if (i % 2 == 0) {
        if (process.argv[i].indexOf("-") == 0) {
          _arguments[process.argv[i].replace(/^-{1,2}/g, '')] = process.argv[i + 1];
        } else {
          throw Error("Option misconfigured: " + process.argv[i]);
        }
      }
    }
    //Check for stdin and stdout

    new module.exports(_arguments);

  }

}
/*REQUIRED_END*/
