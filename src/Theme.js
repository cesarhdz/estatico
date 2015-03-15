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
}


Theme.prototype.engine = require(convention.engine)


/**
 * Returns a valid theme
 * 
 * @param  {[type]} theme [description]
 * @return {[type]}       [description]
 */
Theme.resolve = function(cwd, theme){
	var 
	dir = (theme) ? path.join(cwd, theme) : path.join(__dirname, '../'),
	theme = new Theme(dir)

	// Validate theme
	if(! theme.validate()){
		this.log(theme.errors.join('n'))
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
Theme.prototype.bind = function(generator, locals){


	var self = this

	generator.use(function(files, mt, next){
		// Only html files will be parsed
		Object.keys(files).forEach(function(k){
			// If its supported, then its parsed
			if(self.isFileSupported(k, files[k])){
				files[k].contents = new Buffer(self.parseFile(k, files[k]), locals)
			}
		})


		next()
	})


	return generator

}



Theme.prototype.isFileSupported = function(name, file){
	return true
}



Theme.prototype.parseFile = function(name, file, locals){
	var 
	template = this.findTemplate(name, file),
	model = this.buildViewModel(name, file, locals)

	return this.engine.renderFile(template, model)
}

Theme.prototype.buildViewModel = function(filename, file, locals){

	var model = extend({}, locals)

	model.filename = filename
	model.page = file //@TODO enchande file?

	return model
}

Theme.prototype.findTemplate = function(name, file){
	//@TODO resolve template

	return path.join(this.viewsDir, 'index' + convention.viewExtension)
}


module.exports = Theme