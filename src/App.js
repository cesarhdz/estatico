var
path = require('path'),
Promise = require('node-promise').Promise,
Theme = require('./Theme'),
Parser = require('./Parser'),
Generator = require('./Generator'),
ConfigService = require('./ConfigService'),
Server = require('./Server'),
Site = require('./Site')


/**
 * Main application object
 * @param {Object} config Configuration required to generate a working App
 */
function App(config){

	config = config || {};

	this.dir = config.baseDir || process.cwd();
	this.env = config.env || App.DEFAULT_ENVIRONMENT;
	this.destinationDir = path.join(this.dir, config.targetDir || Site.Convention.destination);
	this.url = config.url || this.getDefaultUrl()

	this.getBaseDir = function(){ 
		return this.dir;
	}

	this.getEnv = function(){
		return this.env;
	}

	//@TODO Move generator to own method
	// Validate we are working with an estatico sites
	this.generator.validateDir(this.dir, Site.Convention)
}


App.DEFAULT_ENVIRONMENT = 'dev'


App.prototype.getDefaultUrl = function(){
	return 'http://localhost:' + Site.Convention.port + '/';
}

// Dependencies can be mocked
App.prototype.server = new Server

App.prototype.log = console.log
App.prototype.generator = new Generator()
App.prototype.configService = new ConfigService()


/**
 * Bootstrap
 * @return {Site} A site ready to be built
 */
App.prototype.bootstrap = function(helpers){
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

	site.addHelpers(helpers)

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
		site.plugins,
		site.helpers
	)
}


module.exports = App