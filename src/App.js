var
path = require('path'),
Promise = require('node-promise').Promise


function App(baseDir, env){
	this.getBaseDir = function(){ 
		return baseDir || process.cwd()
	}

	this.getEnv = function(){
		return env || App.DEFAULT_ENVIRONMENT
	}
}


App.DEFAULT_ENVIRONMENT = 'dev'

// Dependencies can be mocked
App.Metalsmith = require('metalsmith')

App.prototype.fs = require('fs')
App.prototype.log = console.log


App.Convention = {
	content: 'content',
	destination: 'target/work'
}


/**
 * Validate working dirs has required dirs
 * 		
 * @return {Object} Validation object
 * @param {Boolean} [valid] Whether dir is valid or not
 * @param {Array} [errors] Errors found in validation
 */
App.prototype.validateBaseDir = function(){

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

/**
 * Return full qualified dir
 * 
 * @param  {String} file 
 * @return {String}      path
 */
App.prototype.dir = function(file){
	return path.join(this.getBaseDir(), App.Convention[file])
}


/**
 * Build app using middleware
 *
 * @throws {Error} If current working dir is not valid
 * @return {Promise} 
 */
App.prototype.build = function(){

	// Validate working dir
	var 
	self = this,
	promise = new Promise()
	validation = this.validateBaseDir()

	if(!validation.valid){
		this.log(validation.errors.join('\n'))
		throw new Error('Working dir is not valid')
	}

	// Bootstrap metalsmith
	var metalsmith = new App.Metalsmith(this.getBaseDir())

	metalsmith.destination(App.Convention.destination)
	metalsmith.source(App.Convention.content)


	// Add plugins before templates


	// Apply templates
	

	// Plugins after templates
	


	metalsmith.build(function(err){
	  if (err){
	  	self.log(err.message, err.stack);
	  	promise.reject(err)
	  }

	  else{
	  	promise.resolve()
	  }
	})


	return promise
}


/**
 * Serve files
 */
App.prototype.serve = function(){

	this.log('serving')

}



module.exports = App