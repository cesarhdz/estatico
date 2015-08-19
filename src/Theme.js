var
path = require('path'),
fs = require('fs'),
extend = require('util')._extend

convention = {
	views: 'views',
	assets: 'assets',
	engine: 'jade',
	viewExtension: '.jade'
}


function Theme(dir){
	this.baseDir = dir
	this.viewsDir = path.join(dir, convention.views)
	this.assetsDir = path.join(dir, convention.assets)

	this.locals = []
}


Theme.prototype.engine = require(convention.engine)


/**
 * Returns a valid theme
 * 
 * @param  {[type]} theme [description]
 * @return {[type]}       [description]
 */
Theme.resolve = function(cwd, root){
	var 
	dir = (root) ? path.join(cwd, root) : path.join(__dirname, '../'),
	theme = new Theme(dir)

	// Validate theme
	if(! theme.validate()){
		console.log(theme.errors.join('\n'))
		throw new Error('Theme is invalid')
	}

	return theme
}



/**
 * Returns view paths
 * @return {Boolean}
 * @todo  merge with app.validateDirs
 */
Theme.prototype.validate = function(){ 
	
	var paths = {
		dir: this.baseDir,
		views: this.viewsDir
	}

	// Content and destination folder must exists
	this.errors = Object.keys(paths).reduce(function(errors, key){

		if(! fs.existsSync(paths[key])){
			errors.push('Theme ['+ key +'] dir is missing, it must be located at [' + paths[key] + ']') 
		}

		return errors

	}, [])


	return this.errors.length === 0
}




/**
 * Add theme to generator
 * @param  {Metalsmith} generator Current generator
 * @return {void}           
 */
Theme.prototype.bind = function(generator, site){


	var self = this

	this.locals = this.loadHelpers(site)

	generator.use(function(files, metal, next){
		// Only html files will be parsed
		Object.keys(files).forEach(function(k){
			// If its supported, then its parsed
			if(self.isFileSupported(k, files[k])){
				files[k].contents = new Buffer(self.parseFile(k, files[k], site, metal))
			}
		})


		next()
	})


	return generator

}


var supportedExt = ['.md', '.txt', '.html'];

/**
 * If File supported
 *
 * Only suported files are converted to html
 * @param  {String}  name Filename
 * @param  {String}  file File
 * @return {Boolean}      Only text files wtih markdown are supported
 */
Theme.prototype.isFileSupported = function(name, file){

	var ext = path.extname(name);

	return supportedExt.indexOf(ext) != -1;
}



Theme.prototype.parseFile = function(name, file, site, metal){
	var 
	template = this.getTemplateName(file),
	templatePath = this.getTemplatePath(template),
	model = this.buildViewModel(name, file, site, metal);

	// No template, throw a more meaningful error than fs
	if(! templatePath){
		throw new Error('Template [' + template  + '] for file [' + file.slug  + '] is missing.');
	}

	return this.engine.renderFile(templatePath, model)
}

Theme.prototype.buildViewModel = function(filename, file, site, metal){

	var model = extend({}, this.locals)

	model.filename = filename
	model.page = file
	model.site = site
	model.meta = metal._metadata

	return model
}

Theme.prototype.getTemplateName = function(file){
	
	var 
	DEFAULT_TEMPLATE = 'default',
	template = file.template

	if(! template){
		var collection = file.collection[0] || ''

		template = path.join(collection, DEFAULT_TEMPLATE)
	}

	return template;
}


/**
 * Find a readable template by its name from the theme folder
 * 
 * @param  {String} name Tempalte name
 * @return {String|null}      Path where template is located or null if it's not readable
 */
Theme.prototype.getTemplatePath = function(name){

	var file =  path.join(this.viewsDir, name + convention.viewExtension);

	// Return the file 
	return (fs.existsSync(file)) ? file : null;
}


/**
 * Load helpers
 * @param  {[type]} site [description]
 * @return {[type]}      [description]
 */
Theme.prototype.loadHelpers = function(site){

	var helpers = {
		permalink: '../helpers/permalink'
	}

	return Object.keys(helpers).reduce(function(map, key){

		map[key] = require(helpers[key])(site)

		return map

	}, [])

}


module.exports = Theme