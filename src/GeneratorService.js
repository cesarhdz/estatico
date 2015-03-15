var
Metalsmith = require('metalsmith'),
markdown = require('metalsmith-markdown')


function GeneratorService(){}


GeneratorService.prototype.create = function(config){
	var metalsmith = new Metalsmith(config.cwd)

	metalsmith.source(config.source)
	metalsmith.destination(config.destination)

	return metalsmith
}


/**
 * Add plugins from config to metalsmith
 * @param {Metalsmith} generator 
 * @param {Object} config    Configure plugins 
 */
GeneratorService.prototype.addPlugins = function(generator, config){
	//@TODO
}


/**
 * Add markdown files
 * @param {Metalsmith} generator 
 * @param {Object} config    
 */
GeneratorService.prototype.addParser = function(generator, config){
	generator.use(markdown(config))
}



module.exports = GeneratorService