var fs = require('fs');
var path = require('path');
var moduleCreator = require('../index.js')();

describe('Module Creator', function(){
    
    var resultPath = moduleCreator.generate({nodeModulesPath:'test'});
    var testFiles = [
        path.join(resultPath, "package.json"),
        path.join(resultPath, "index.js")
    ];
    it('should create valid module in a new folder', function(done){
        console.log('Created: '+resultPath+'\n');
        
        resultPath.should.not.be.false;        
        
        (fs.existsSync(resultPath)).should.be.true;
        
        testFiles.forEach(function(file){
            (fs.existsSync(file)).should.be.true;
                
        });
        this.timeout(10000);
        setTimeout(done, 5000);
  
    });

    after(function(done){
        console.log('Deleting '+resultPath+'\n');
        
        testFiles.forEach(function(file){
            fs.unlinkSync(file);
        });

        fs.rmdirSync(resultPath);
        done();    
    });
        
});
