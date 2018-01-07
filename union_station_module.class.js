#!/usr/bin/env node

const _package = require('./package.json')
const tty = require('tty')

/**
 * Main export from this module.
 * 
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

module.exports = class union_station_module {
  constructor(argv) {

    /* Add properties from module */
    for (var _prop in module) {

      this[_prop] = module[_prop]

    }

    /**
     * Checks for Union-Station Registry
     * in the current process
     * @function registerModule
     *
     * @returns {boolean}
     **/

    this.registerModule = function () {

      if (!global.registry) {

        global.registry = {}

      }

      global.registry[module.name] = module.exports
      global.registry[module.name].package = _package
      global.registry[module.id] = global.registry[module.name]
      return global.registry[module.name].id === this.id

    }

    /*Add Module to current process Registry*/
    this.registerModule()

    /**
     * Returns module.
     * @method getModule
     *
     * @returns {object}
     **/

    this.getModule = function () { console.log('module'); return module }

    /**
     * @type  {string}
     * 
     **/

    this.id = '804aa184e5e542aab925d0d130a43256'

    /**
     * @type  {string}
     * 
     **/

    this.name = 'union_station_module'

    /**
     * Name delimiter.
     * @type {string} delimiter
     * 
     **/

    this.delimiter = '__'

    /**
     * JSDoc3 compliant tag-parser method.
     * @function genDoc
     *
     * @returns {string|null}
     **/

    this.genDoc = function () {

      var this_file = require('fs').readFileSync(require.main.filename, { encoding: 'utf8' })

      var docs = this_file.match(/(\/\*\*([\s\S]*?)\*\/)$/gm)
      docs.forEach((row,i)=>{
      docs[i] = docs[i].replace(/\s\s/g, ' ')
      })
      var docsFinal = ["\n", "\n"]

      for (var doc = 0; doc < docs.length; doc++) {

        if (!docs[doc].match(/\@type/g)) {

          docsFinal.push(docs[doc]);

          if (docs[doc].match(/\*\*\//g)) {

            docsFinal.push("\n")

          }

        }

      }

      let documentation = docsFinal.join("\n");

      if (argv.isRequireMain) {

        console.log(documentation)

      } else {

        return documentation

      }

    }

    if (argv.isRequireMain) {

      if (argv) {

        if (argv.method && argv.method in this && typeof this[argv.method] === 'function') {
          
          return this[argv.method](argv)

        } else {

          if (argv.method) {

            throw Error("\n Method '" + argv.method + "' does not exist.\nChoose method parameter '-method {method}' from options below:");
            this.genDoc();
          }

          if (!process.stdin.isTTY) {

            process.stdin.pipe(this).pipe(process.stdout)

          } else {

            this.genDoc()

          }

        }

      } else {

        throw Error('missing arguments object')

      }

    }
  }

}