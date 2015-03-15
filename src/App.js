var
path = require('path'),
Promise = require('node-promise').Promise,
Theme = require('./Theme'),
Site = require('./Site')


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

App.prototype.fs = require('fs')
App.prototype.log = console.log


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
	promise = new Promise(),


	site = new Site(this.getBaseDir(), this.getEnv()),

	theme = Theme.resolve(this.getBaseDir(), site.config.theme),

	generator = this.generatorService.create({
		cwd: site.dir,
		source: Site.Convention.content,
		destination: Site.Convention.destination
	})


	// Add generators
	this.generatorService.addParser(generator, site)

	// @TODO this.generatorService.addPlugins(generator, config)
	
	/**
	 * Add generator to selected theme
	 */
	theme.bind(generator, site)

	// this.generatorService.addPlugins(generator, config)

	generator.build(function(err){
	  if (err){
	  	self.log(err.message, err.stack);
	  	promise.reject(err)
	  }

	  else{
	  	site.theme = theme
	  	promise.resolve(site)
	  }
	})


	return promise
}



/**
 * Serve files
 */
App.prototype.serve = function(site){

	var express = require('express')
	var serveStatic = require('serve-static')

	var server = express()

	server.use(serveStatic(site.destinationDir, {'index': ['index.html']}))
	server.use('/assets/', serveStatic(site.theme.assetsDir))

	// Add not found

	server.listen(Site.Convention.port)
}



module.exports = App