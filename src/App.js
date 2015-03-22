var
path = require('path'),
Promise = require('node-promise').Promise,
Theme = require('./Theme'),
Parser = require('./Parser'),
Generator = require('./Generator'),
ConfigService = require('./ConfigService'),
Server = require('./Server'),
Site = require('./Site')


function App(baseDir, env){

	this.dir = baseDir || process.cwd()
	this.env = env || App.DEFAULT_ENVIRONMENT
	this.destinationDir = path.join(this.dir, Site.Convention.destination)

	this.getBaseDir = function(){ 
		return baseDir || process.cwd()
	}

	this.getEnv = function(){
		return env || App.DEFAULT_ENVIRONMENT
	}

	// Validate we are working with an estatico sites
	this.generator.validateDir(this.dir, Site.Convention)
}


App.DEFAULT_ENVIRONMENT = 'dev'

// Dependencies can be mocked
App.prototype.server = new Server

App.prototype.log = console.log
App.prototype.generator = new Generator()
App.prototype.configService = new ConfigService()


/**
 * Bootstrap
 * @return {Site} A site ready to be built
 */
App.prototype.bootstrap = function(){
	var 
	config  = this.configService.load(this.dir, this.env),
	site = new Site(config, this)

	site.theme = Theme.resolve(this.dir, site.theme)
	
	//@TODO Add plugin loader
	site.plugins = {
		beforeParser: [],
		beforeTemplates: [],
		afterTemplates: []
	}

	return site
}


/**
 * Load dependencias and build app using site config
 *
 * @return {Promise} 
 */
App.prototype.build = function(site){

	var parser = new Parser()

	// Build using generator
	return this.generator.build(
		this.dir,
		Site.Convention.content,
		Site.Convention.destination,
		site, 
		site.theme, 
		parser, 
		site.plugins
	)
}


module.exports = App