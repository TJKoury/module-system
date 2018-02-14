#!/usr/bin/env node



const { Transform, Writable, Readable, Duplex } = require('stream');
const _package = require('./package.json');
const tty = require('tty');


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

module.exports = class test__test__d6807e2a4bb44c5ab26fb1203274d691 extends Transform {
  constructor(argv) {

    super(argv);

    this.argv = argv;

    /* Add properties from module */
    for (var _prop in module) {

      this[_prop] = module[_prop];

    }

    if (require.main === module) {

      if (argv) {

        if (argv.method && argv.method in module && typeof module[argv.method] === 'function') {

          module[argv.method](argv);

        } else {

          if (argv.method) {

            throw Error("\n Method '" + argv.method + "' does not exist.\nChoose method parameter '-method {method}' from options below:");
            this.genDoc();
          }

          if (!process.stdin.isTTY) {

            process.stdin.pipe(this).pipe(process.stdout);

          }else{

            this.genDoc();
          
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

  _flush(cb) {

    this.push();

    cb();

  };

};  /* End Class */

/**
 * @type  {string}
 * 
 **/

module.id = 'd6807e2a4bb44c5ab26fb1203274d691';

/**
 * @type  {string}
 * 
 **/

module.name = 'test__test';

/**
 * Name delimiter.
 * @type {string} delimiter
 * 
 **/

module.delimiter = '__';

/**
 * JSDoc3 compliant tag-parser method.
 * @function genDoc
 *
 * @returns {string|null}
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

  let documentation = docsFinal.join("\n");

  if (require.main === module) {

    console.log(documentation);

  } else {

    return documentation;

  }

};

/**
 * Checks for Union-Station Registry
 * in the current process
 * @function registerModule
 *
 * @returns {boolean}
 **/

module.registerModule = function () {

  if (!global.registry) {

    global.registry = {};

  }

  global.registry[module.name] = module.exports;
  global.registry[module.name].package = _package;
  global.registry[module.id] = global.registry[module.name];
  return global.registry[module.name].id === this.id;

};

/*Add Module to current process Registry*/
module.registerModule();



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
