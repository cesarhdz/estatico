var
markdown = require('metalsmith-markdown'),
collections = require('metalsmith-collections'),


Reference = require('./Reference'),
reference = new Reference()


function Parser(){}


/**
 * Add markdown files
 * @param {Metalsmith} generator 
 * @param {Object} config    
 */
Parser.prototype.bind = function(generator, site){

	// Permalinks gioes here, before adding slug, uri 

	generator.use(function(files, metal, next){
		Object.keys(files).forEach(function(page){
			// {collection}/{name}.{ext}
			files[page].uri = reference.getUri(page)
			files[page].slug = reference.getSlug(page)
			files[page].collection = reference.getCollection(page, files[page].slug)
		})
		next()
	})

	generator.use(collections(site.config.collections))
	generator.use(markdown())
}



module.exports = Parser