var
Metalsmith = require('metalsmith'),
markdown = require('metalsmith-markdown'),
collections = require('metalsmith-collections'),
path = require('path'),


DEFAULT_COLLECTION = 'root'


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
GeneratorService.prototype.addParser = function(generator, site){

	var self = this

	generator.use(function(files, metal, next){
		Object.keys(files).forEach(function(page){
			// {collection}/{name}.{ext}
			files[page].slug = self.getSlug(page)
			files[page].collection = self.getCollection(page, files[page].slug)
		})
		next()
	})

	generator.use(collections(site.config.collections))
	generator.use(markdown())
}


GeneratorService.prototype.getSlug = function(file){
	var base = path.basename(file),
	ext = path.extname(base)

	return path.basename(base, ext)
}


GeneratorService.prototype.getCollection = function(file, uri){
	var separator = '/',
	parts = file.split(separator)


	if(parts.length > 1 && uri !== 'index'){
	 	return parts[0]
	}
}


module.exports = GeneratorService