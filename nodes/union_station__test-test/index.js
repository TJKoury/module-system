#!/usr/bin/env node


/*NEW CODE HERE*/

/*END NEW CODE*/

/**
 * Main export from this module.
 * @method exports
 *
 * @param    {object}    argv Input arguments (from cmdline -key value)
 * @property {string}    argv.method Method to call with arguments
 *
 * @returns {object}
 **/

module.exports = function union_station__test-testᅟ383dd06d5bc34817b559dbda6e453f23(argv) {
  
  this.argv = argv;

  if(require.main === module){

    if(argv){

      if(argv.method&& argv.method in module){
        
        return module[argv.method](argv);
      
      }else{

        if(argv.method){
          
          throw Error("\n Method '"+argv.method+"' does not exist.\nChoose method parameter '-method {method}' from options below:");

        }

        module.genDoc();

      }
    }else{

      throw Error('missing arguments object');
    }
  }else{
    for(var _method in module){
      this[_method] = module[_method];
    }
  }
};

/**
 * Unique Identifier.
 * @property id
 *
 * @returns {id}
 **/

module.id = '383dd06d5bc34817b559dbda6e453f23';

/**
 * Returns module.
 * @method getModule
 *
 * @returns {object}
 **/

module.getModule = ()=>module;

/**
 * JSDoc3 compliant tag-parser method.
 * @function genDoc
 *
 * @returns {string}
 **/

module.genDoc = function () {

  var this_file = require('fs').readFileSync(module.filename, {encoding: 'utf8'});
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
