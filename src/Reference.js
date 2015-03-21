var path = require('path')


function Reference(){
	return this
}


Reference.prototype.getSlug = function(file){
	var base = path.basename(file),
	ext = path.extname(base)

	return path.basename(base, ext)
}


Reference.prototype.getCollection = function(file, uri){
	var separator = '/',
	parts = file.split(separator)


	if(parts.length > 1 && uri !== 'index'){
	 	return parts[0]
	}
}


Reference.prototype.getUri = function(file){
	return file.split('.')[0] + '.html'
}


module.exports = Reference