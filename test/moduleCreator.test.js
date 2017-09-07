var fs = require('fs');
var path = require('path');
var mC = require('../index.js');
var exec = require('child_process').execFileSync;
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
        testFiles.forEach(function (file, i) {
            (fs.existsSync(file)).should.be.true;
            console.log(file);
            if (i) {
                fs.chmodSync(file, "777")
                console.log(exec(file).toString('utf8'));
            }
        });
        this.timeout(10000);
        setTimeout(done, 5000);
    });
    after(cleanup);
});
