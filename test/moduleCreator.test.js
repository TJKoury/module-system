var fs = require('fs');
var path = require('path');
var mC = require('../index.js');
const {execFileSync, execSync} = require('child_process');
const moduleCreator = (new mC());

describe('Module Creator', function () {
    var resultPath = moduleCreator.generate({ nodeModulesPath: 'test' });
    var testFiles = [
        path.join(resultPath, "package.json"),
        path.join(resultPath, "index.js")
    ];

    var cleanup = function (done) {
        console.log('Deleting ' + resultPath + '\n');
        testFiles.forEach(function (file) {
            try {
                fs.unlinkSync(file);
            } catch (e) { }
        });
        try {
            fs.rmdirSync(resultPath);
        } catch (e) { }
        done();
    };

    it('should create valid module in a new folder', function (done) {
        before(cleanup);
        console.log('Created: ' + resultPath + '\n');
        resultPath.should.not.be.false;
        (fs.existsSync(resultPath)).should.be.true;
        var test = this;
        testFiles.forEach(function (file, i) {
            (fs.existsSync(file)).should.be.true;
            //console.log(file);
            //console.log(fs.readFileSync(file).toString('utf8'));
            if (i) {
                fs.chmodSync(file, "777");
                (execFileSync(file).toString('utf8')).should.not.be.null;
                let pipeResult = execSync("echo 'pass this test'|node "+file+"|cat");
                pipeResult.toString('utf8').should.equal('pass this test\n');

                const testModuleClass = new require("./"+file.replace("test/", ""));
                let testModule = new testModuleClass();
                var Readable = require('stream').Readable;
                var s = new Readable();
                s._read = ()=> {}; 
                s.push('test');
                s.push(null);
                var _a = '';
                s.pipe(testModule.on('data', (d)=>{
                    _a+=d; 
                }).on('end', ()=>{
                    _a.should.equal('test');
                    setTimeout(done, 1000);
                })).pipe(process.stdout);

            }
        });
        this.timeout(10000);
       
    });
    after(cleanup);
});
