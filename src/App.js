var
path = require('path'),
Promise = require('node-promise').Promise,
Theme = require('./Theme'),
Parser = require('./Parser'),
Generator = require('./Generator'),
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
App.prototype.generator = new Generator

App.prototype.fs = require('fs')
App.prototype.log = console.log



/**
 * Bootstrap
 * @return {Site} A site ready to be built
 */
App.prototype.bootstrap = function(){

	var site = new Site(this.getBaseDir(), this.getEnv())

	site.theme = Theme.resolve(this.getBaseDir(), site.config.theme)

	site.parser = new Parser()

	//@TODO Add plugin loader
	site.plugins = {
		beforeParser: [],
		beforeTemplates: [],
		afterTemplates: []
	}

	return site

}


/**
 * Build app using middleware
 *
 * @throws {Error} If current working dir is not valid
 * @return {Promise} 
 */
App.prototype.build = function(site){

	console.log(this.generator)

	return this.generator.build(site, site.theme, site.parser, site.plugins)
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

	//@TODO Add not found

	server.listen(Site.Convention.port)
}



module.exports = App