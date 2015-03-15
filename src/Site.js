var
path = require('path'),
Validator = require('./Validator')



var configRules = {
	name: [Validator.required]
}



function Site(dir, env){

	// Check is a valid app
	this.validator.paths(this.getRequiredPaths(dir), true)

	// Bootstrap dir
	this.config = this.configService.load(dir, env)

	// Validate config
	this.validator.config(this.config, configRules, true)


	// Add useful vars
	this.dir = dir
	this.destinationDir = path.join(dir, Site.Convention.destination)


	this.name = this.config.name
	this.url = this.config.url || this.getDefaultUrl()
}

Site.Convention = {
	content: 'content',
	destination: 'target/work',
	config: 'config.yml',
	port: 3000
}


Site.prototype.fs = require('fs')
Site.prototype.configService = new (require('./ConfigService'))
Site.prototype.validator = new Validator()

/**
 * Validate working dirs has required dirs
 * 		
 * @return {Object} Validation object
 * @param {Boolean} [valid] Whether dir is valid or not
 * @param {Array} [errors] Errors found in validation
 */
Site.prototype.validate = function(){
	var 
	self = this,

	// Content and destination folder must exists
	errors = ['content'].reduce(function(e, key){

		var dir = self.dir(key)

		if(! self.fs.existsSync(dir)){
			e.push('['+ key +'] dir is missing, it must be located at [' + App.Convention[key] + ']') 
		}

		return e

	}, [])


	return {
		valid: errors.length === 0,
		errors: errors 
	}
}


Site.prototype.getDefaultUrl = function(){
	return 'http://localhost:' + Site.Convention.port
}


Site.prototype.getRequiredPaths = function(dir){
	return ['content', 'config'].reduce(function(paths, key){

		paths[key] = path.join(dir, Site.Convention[key])

		return paths

	}, {})
}


module.exports = Site