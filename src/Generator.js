var
Metalsmith = require('metalsmith'),
path = require('path')


Generator.DEFAULT_ENVIRONMENT = 'dev'


function Generator(baseDir, env){
	this.getBaseDir = function(){ 
		return baseDir || process.cwd()
	}

	this.getEnv = function(){
		return env || Generator.DEFAULT_ENVIRONMENT
	}
}



Generator.prototype.create = function(config){
	var metalsmith = new Metalsmith(config.cwd)

	metalsmith.source(config.source)
	metalsmith.destination(config.destination)

	return metalsmith
}


module.exports = Generator