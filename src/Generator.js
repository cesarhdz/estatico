var
Metalsmith = require('metalsmith'),
Promise = require('node-promise').Promise,
path = require('path'),

Site = require('./Site')

function Generator(){}


/**
 * Reads contents of site and applies parser and plugins
 * finally files are saved in site destinatino dir
 * @param  {Site} site site
 * @param {Theme} theme Theme used to build the site
 * @param {Parser} parser Parser used to read files
 * @param {Array} plugins Plugins registerd
 * @return {promise}      
 */
Generator.prototype.build = function(site, theme, parser, plugins){

	var 
	promise = new Promise,
	metal = this.forge({
		cwd: site.dir,
		source: Site.Convention.content,
		destination: Site.Convention.destination
	})


	this.bindPlugins(metal, plugins, 'beforeParser')

	// Add generators
	parser.bind(metal, site)


	this.bindPlugins(metal, plugins, 'beforeTemplates')
	
	/**
	 * Add generator to selected theme
	 */
	theme.bind(metal, site)


	this.bindPlugins(metal, plugins, 'afterTemplates')


	metal.build(function(err){
	  if (err){
	  	console.log(err.message, err.stack);
	  	promise.reject(err)
	  }

	  else{
	  	site.theme = theme
	  	promise.resolve(site)
	  }
	})

	return promise
}


Generator.prototype.bindPlugins = function(metal, plugins, stage){
	plugins[stage].forEach(function(p){
		 p.bind(metal)
	})
}


Generator.prototype.forge = function(config){
	var metalsmith = new Metalsmith(config.cwd)

	metalsmith.source(config.source)
	metalsmith.destination(config.destination)

	return metalsmith
}


module.exports = Generator