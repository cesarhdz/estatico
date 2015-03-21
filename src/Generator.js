var
Metalsmith = require('metalsmith'),
Promise = require('node-promise').Promise,
path = require('path')

function Generator(cwd){
	this.cwd = cwd
}


/**
 * Reads contents of site and applies parser and plugins
 * finally files are saved in site destinatino dir
 * @param  {Site} site site
 * @param {Theme} theme Theme used to build the site
 * @param {Parser} parser Parser used to read files
 * @param {Array} plugins Plugins registerd
 * @return {promise}      
 */
Generator.prototype.build = function(source, destination,  site, theme, parser, plugins){

	var 
	promise = new Promise,
	metal = this.forge(source, destination)


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


Generator.prototype.forge = function(source, destination){
	var metalsmith = new Metalsmith(this.cwd)

	metalsmith.source(source)
	metalsmith.destination(destination)

	return metalsmith
}


module.exports = Generator