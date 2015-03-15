var
path = require('path'),
Promise = require('node-promise').Promise,
Theme = require('./Theme')


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
App.prototype.generatorService = new (require('./GeneratorService'))
App.prototype.configService = new (require('./ConfigService'))

App.prototype.fs = require('fs')
App.prototype.log = console.log


App.Convention = {
	content: 'content',
	destination: 'target/work',

	templateDir: 'views',
	templateEngine: 'jade',

	port: 3000
}


App.prototype.getBaseUrl = function(){
	return 'http://localhost:' + App.Convention.port
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



	// Bootstrap metalsmith
	var 
	self = this,
	validation = this.validateBaseDir(),
	promise = new Promise(),
	config = this.configService.load(this.getBaseDir(), this.getEnv()),

	theme = Theme.resolve(this.getBaseDir(), config.theme),

	generator = this.generatorService.create({
		cwd: this.getBaseDir(),
		source: App.Convention.content,
		destination: App.Convention.destination
	})

	// Validate working dir
	if(!validation.valid){
		this.log(validation.errors.join('\n'))
		throw new Error('Working dir is not valid')
	}


	// Validate theme
	if(! theme.validate()){
		this.log(theme.errors.join('n'))
		throw new Error('Theme is invalid')
	}



	// Add generators
	this.generatorService.addParser(generator, config)

	// @TODO this.generatorService.addPlugins(generator, config)

	/**
	 * Add generator to selected theme
	 */
	theme.bind(generator)

	// this.generatorService.addPlugins(generator, config)

	generator.build(function(err){
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

	var express = require('express')
	var serveStatic = require('serve-static')

	var server = express()

	server.use(serveStatic(this.dir('destination'), {
		'index': ['default.html', 'default.htm']
	}))

	server.listen(App.Convention.port)
}



module.exports = App