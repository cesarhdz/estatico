var
Metalsmith = require('metalsmith'),
Promise = require('node-promise').Promise,
path = require('path'),
Validator = require('./Validator'),
Site = require('./Site')

function Generator(){}


Generator.prototype.validator = new Validator()

/**
 * Validate cwd has required files by convention
 * @param  {Object} convention Files thath must be available
 * @return {Mixed}            True is dir is valid, Arra<Errors> if its invalid
 */
Generator.prototype.validateDir = function(dir, convention){
	var paths = this.getRequiredPaths(dir, convention)

	return this.validator.paths(paths, true)
}


Generator.prototype.getRequiredPaths = function(dir, convention){
	return ['content', 'config'].reduce(function(paths, key){
		paths[key] = path.join(dir, convention[key])

		return paths
	}, {})
}


/**
 * Reads contents of site and applies parser and plugins
 * finally files are saved in site destinatino dir
 * 
 * @param  {Site} 				site site
 * @param {Theme} 				theme Theme used to build the site
 * @param {Parser} 				parser Parser used to read files
 * @param {Array} 				plugins Plugins registerd
 * @param {Object<String, fn>} helpers Helpers that will be added to template engine
 * @return {promise}      
 */
Generator.prototype.build = function(dir, source, destination, site, theme, parser, plugins, helpers){

	var 
	promise = new Promise,
	metal = this.forge(dir, source, destination)


	this.bindPlugins(metal, plugins, 'beforeParser')

	// Add generators
	parser.bind(metal, site)


	this.bindPlugins(metal, plugins, 'beforeTemplates')
	
	/**
	 * Add generator to selected theme
	 */
	theme.bind(metal, site, helpers)


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


Generator.prototype.forge = function(dir, source, destination){
	var metalsmith = new Metalsmith(dir)

	metalsmith.source(source)
	metalsmith.destination(destination)

	return metalsmith
}


module.exports = Generator