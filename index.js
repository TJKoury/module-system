#!/usr/bin/env node

var settings = require('./package.json');

var uuid = require('uuid');

var path = require('path');
var _ = require('lodash');
var colors = require('colors');

var commands = process.argv;
/*REQUIRED_START*/
var fs = require('fs');

/**
 * JSDoc3 compliant tag-parser method.
 * @function genDoc
 *
 * @returns {string}
 **/

module.genDoc = function () {

  var this_file = fs.readFileSync(module.filename, {encoding: 'utf8'});
  var docs = this_file.match(/(\/\*\*([\s\S]*?)\*\/)$/gm);
  var docsFinal = ["\n","\n"];
  for(var doc= 0;doc<docs.length;doc++){

    if(!docs[doc].match(/\@type/g)) {
      docsFinal.push(docs[doc]);

      if (docs[doc].match(/\*\*\//g)) {
        docsFinal.push("\n");
      }

    }
  }
  console.log(docsFinal.join("\n"));

};

/**
 * @type{object}
 *
 * */

var defaults = {}||settings.union_station_module_system.defaults;

/*REQUIRED_END*/
/**
 * @type{string}
 *
 * */
defaults.nodeModulesPath = "node_modules";

/**
 * @type{string}
 *
 * */
defaults.prefix = "union-station";

/**
 * @type{string}
 *
 * */
defaults.description = "empty-module";

/**
 * @type{string}
 *
 * */
defaults.name = "empty-module";

/**
 * @type{string}
 *
 * */
defaults.version = "0.0.0";

/**
 * @type{string}
 *
 * */
defaults.author = "union-station-module-system";

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
 * @method exports
 *
 * @param    {object}    argv Input arguments (from cmdline -key value)
 * @property {string}    argv.method Method to call with arguments
 *
 * @returns {object}
 **/
module.exports = function (argv) {
  
  this.argv = argv;

  if(require.main === module){

    if(argv){

      if(argv.method
         && argv.method in module
         && argv.method!=='exports'){

           return module[argv.method](argv);

      }else if(argv.method === 'exports'){
          
          console.log(this);

      }else{

        if(argv.method){
          
          throw Error("\n Method '"+argv.method+"' does not exist.\nChoose method parameter '-method {method}' from options below:"");

        }

        module.genDoc();

      }
    }else{

      throw Error('missing arguments object');
    }

  }else{

    return module;

  }

}
/*REQUIRED_END*/
/**
 * Creates New Module.
 * @method generate
 *
 * @param    {object}    argv Input options (from cmdline -key value)
 * @property {string}    argv.prefix Prefix for module
 * @property {string}    argv.description
 * @property {string}    argv.nodeModulesPath Path to put module
 * @property {string}    argv.name
 * @property {string}    argv.version
 * @property {string}    argv.author
 * @property {string}    argv.license
 *
 * @returns {string}
 **/
module.generate = function(argv){

  // Extends arguments with defaults
  argv = _.extend(defaults, argv);
  _.assign(argv.packageJSON, _.pick(defaults, _.keys(argv.packageJSON)));

  // Time-based UUID generated for module
  var module_uuid = uuid.v4();
  
  argv.packageJSON.id = module_uuid;
  var _filename = [argv.prefix,argv.name,module_uuid];
  var _delimiter = "_";
  for(var _f=0;_f<_filename.length;_f++){
    _filename[_f] = _filename[_f].replace(_delimiter, "").replace(" ", "-");
  }
  argv.packageJSON.name = _filename.join(_delimiter);
  
  if (!fs.existsSync(argv.nodeModulesPath)) {
    fs.mkdirSync(argv.nodeModulesPath);
  }

  // Path to put the module
  var modulePath = path.join(argv.nodeModulesPath, argv.packageJSON.name);

  if (!fs.existsSync(modulePath)) {

    // JS code to put in new module
    var indexJS = "#!/usr/bin/env node\n\n"+
      fs.readFileSync(module.filename, {encoding: 'utf8'})
      .match(/(\/\*REQUIRED_START\*\/)[^~]*?(\/\*REQUIRED_END\*\/)/g)
      .join("").replace(/\/\*REQUIRED_((START)|(END))\*\//g, "");

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

    if(require.main == module){
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

    return false;
  }
}


/*REQUIRED_START*/

/*NEW CODE HERE*/

/*END NEW CODE*/

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
        if(process.argv[i].indexOf("-")==0 || process.argv[i].indexOf("node")>-1) {
          _arguments[process.argv[i].substr(1)] = process.argv[i + 1];
        }else{
          throw Error("Option misconfigured: " + process.argv[i]);
        }
      }
    }
    module.exports(_arguments);
  }

}
/*REQUIRED_END*/
