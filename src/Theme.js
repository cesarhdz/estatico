var
path = require('path'),
fs = require('fs')


convention = {
	views: 'views',
	assets: 'assets'
}


function Theme(dir){
	this.baseDir = dir
	this.viewsDir = path.join(dir, convention.views)
	this.assetsDir = path.join(dir, convention.assets)
	
	this.errors = []
}


/**
 * Resolve path
 * @param  {[type]} theme [description]
 * @return {[type]}       [description]
 */
Theme.resolve = function(cwd, theme){
	var dir = (theme) ? path.join(cwd, theme) : path.join(__dirname, '../')

	return new Theme(dir)
}



/**
 * Returns view paths
 * @return {Boolean}
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
Theme.prototype.bind = function(generator, app){

	

}


module.exports = Theme