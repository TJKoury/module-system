#!/usr/bin/env node

const settings = require('./package.json')
const uuid = require('uuid')
const path = require('path')
const _ = require('lodash')
const commands = process.argv
const union_station_module_class = require('./union_station_module.class')

/*REQUIRED_START*/

const _package = require('./package.json')
const tty = require('tty')

/*REQUIRED_END*/

/**
 * @type{object}
 *
 * */

const defaults = {} || settings.union_station_module_system.defaults

/**
 * @type{string}
 *
 * */
defaults.nodeModulesPath = "node_modules"

/**
 * @type{string}
 *
 * */
defaults.prefix = "union_station"

/**
 * @type{string}
 *
 * */
defaults.description = "empty_module"

/**
 * @type{string}
 *
 * */
defaults.name = "empty_module"

/**
 * @type{string}
 *
 * */
defaults.version = "0.0.0"

/**
 * @type{string}
 *
 * */
defaults.author = "union_station_module_system"

/**
 * @type{string}
 *
 * */
defaults.license = "ISC"

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
  "license": defaults.license,
  "union-station": "1.0.0"
}

/*REQUIRED_START*/
/**
 * Main export from module.
 * It returns a class with a constructor that inherits
 * from union_station_module_class.
 * 
 * Methods can be called from the command line by
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

this.exports = class union_station_module extends union_station_module_class {
  constructor(argv) {

    super(argv)

    /**
     * Returns this.
     * @method getModule
     *
     * @returns {object}
     **/

    this.getModule = function () { console.log('module'); return module }

    /**
     * @type  {string}
     * 
     **/

    this.name = /*NAME*/'union_station__module_creator'

    /*REQUIRED_END*/
    var fs = require('fs');

    /**
     * Creates New this.
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
    
    this.generate = function (argv) {

      // Extends arguments with defaults
      argv = _.extend(defaults, argv);

      _.assign(argv.packageJSON, _.pick(defaults, _.keys(argv.packageJSON)));

      // Time-based UUID generated for module
      var module_uuid = uuid.v4().replace(/\-/g, "");

      argv.packageJSON.id = module_uuid;

      var _filename = [argv.prefix, argv.name];

      for (var _f = 0; _f < _filename.length; _f++) {

        _filename[_f] = _filename[_f].replace(new RegExp(this.delimiter, 'gi'), "").replace(/\s/g, "");

      }

      argv.packageJSON.name = _filename.join(this.delimiter);

      if (!fs.existsSync(argv.nodeModulesPath)) {

        fs.mkdirSync(argv.nodeModulesPath);

      }

      // Path to put the module
      var modulePath = path.join(argv.nodeModulesPath, argv.packageJSON.name);

      if (!fs.existsSync(modulePath)) {

        // JS code to put in new module
        _filename.push(module_uuid);

        var indexJS = "#!/usr/bin/env node\n\n" +

          fs.readFileSync(this.filename, { encoding: 'utf8' })
            .match(/(\/\*REQUIRED_START\*\/)[^~]*?(\/\*REQUIRED_END\*\/)/g)
            .join("")
            .replace(/\/\*REQUIRED_((START)|(END))\*\//g, "")
            .replace("union_station_module", _filename.join(this.delimiter))
            .replace(/\|'generate'.*\)}}/g, ")}}")
            .replace(/\/\*ID\*\/'0'/g, "'" + module_uuid + "'")
            .replace(/\/\*NAME\*\/'union_station__module_creator'/g, "'" + [argv.prefix, argv.name].join(this.delimiter) + "'");

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
  }

}  /* End Class */


/*
  TODO:
  The test suite to see if this is a valid module will call it from the
  commandline and see if all publicly accessible methods are callable.
*/

if (require.main == module) {

  if (process.argv.length % 2 !== 0) {

    throw Error("Argument Missing or unmatched: " + process.argv.slice(2))

  } else {

    var _arguments = {}

    for (var i = 2; i < process.argv.length; i++) {

      if (i % 2 == 0) {

        if (process.argv[i].indexOf("-") == 0) {

          _arguments[process.argv[i].replace(/^-{1,2}/g, '')] = process.argv[i + 1]

        } else {

          throw Error("Option misconfigured: " + process.argv[i])

        }

      }

    }
    //Check for stdin and stdout
    _arguments.isRequireMain = true
    new this.exports(_arguments)

  }

}
/*REQUIRED_END*/
