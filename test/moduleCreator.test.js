'use strict';

var fs = require('fs');
var path = require('path');
var mC = require('../index.js');
const { execFileSync, execSync } = require('child_process');
const moduleCreator = (new mC());
const moduleOptions = {
    nodeModulesPath: 'test',
    name: 'test_module'
};
let resultPath;
const moduleFolderName = "union_station__" + moduleOptions.name;

describe('Module Creator', function () {
    let fullPath = path.join(moduleOptions.nodeModulesPath, moduleFolderName);
    var testFiles = [
        path.join(fullPath, "package.json"),
        path.join(fullPath, "index.js")
    ];

    var cleanup = function (done) {
        console.log('Deleting ' + fullPath + '\n');
        testFiles.forEach(function (file) {
            try {
                fs.unlinkSync(file);
            } catch (e) { }
        });
        try {
            fs.rmdirSync(fullPath);
        } catch (e) { }
        done();
    };
    cleanup(function () {})
    it('should create valid module in a new folder', function (done) {
        before(cleanup);
        resultPath = (new process.registry[0]).generate(moduleOptions);
        console.log('Created: ' + resultPath + '\n');
        resultPath.should.not.be.false;
        var testModule = require('./'+moduleFolderName);
        var tM = new testModule();
        tM.genDoc().length.should.be.above(0);
        done();
    });

    it('should pipe data correctly', function (done) {
        (fs.existsSync(resultPath)).should.be.true;
        var test = this;
        testFiles.forEach(function (file, i) {
            (fs.existsSync(file)).should.be.true;
            if (i) {
                let _file = path.resolve(file);
                
                (execSync("echo |node " + _file).toString('utf8')).should.not.be.null;
                
                let pipeResult = execSync("echo pass this test|node " + _file + "|cat");
                pipeResult.toString('utf8').indexOf('pass this test').should.equal(0);

                const testModuleClass = require(_file);
                let testModule = new testModuleClass();
                
                console.log('\n', 'Registered Classes: ', (process.registry));
                Object.keys(process.registry).length.should.not.be.below(1);
                
                var Readable = require('stream').Readable;
                var s = new Readable();
                s._read = () => { };
                s.push('pipe test');
                s.push(null);
                var _a = '';
                s.pipe(testModule.on('data', (d) => {
                    console.log(d)
                    _a += d;
                }).on('end', () => {
                    _a.should.equal('pipe test');
                    setTimeout(done, 1000);
                })).pipe(process.stdout);

            }
        });
        this.timeout(10000);
    });
    it('should execute command line arguments correctly', function (done) {
        (fs.existsSync(resultPath)).should.be.true;
        var test = this;
        testFiles.forEach(function (file, i) {
            (fs.existsSync(file)).should.be.true;
            if (i) {
                let _file = path.resolve(file);
                fs.chmodSync(_file, "777");
                (execSync("node " + _file + " --method genDoc").toString('utf8')).should.not.be.null;
                done();

            }
        });

        this.timeout(10000);
    });

    //after(cleanup);
});
