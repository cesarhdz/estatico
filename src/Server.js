var
log = require('gulp-util').log,
express = require('express'),
serveStatic = require('serve-static'),
watch = require('chokidar').watch,
chalk = require('chalk'),

path = require('path'),

Site = require('./Site')



function reload(app, event){
	return function(file){
		var 
		pattern = path.join(app.getBaseDir(), 'content/'),
		rel = path.relative(pattern, file)

		console.log('\n')
		log('File [' + chalk.cyan(rel) + '] ' + event +'.' )
		
		build(app)
	}
}


/**
 * Build app + log proccess
 * @param  {App} app application to build
 * @return {Promise}     promise taht will be resolved when site is built
 */
function build(app){

	log('Building site...')

	var site = app.bootstrap()
	
	promise = app.build(site)

	promise.then(function(){
		log('Site successfully built to ' + chalk.green(site.destinationDir))
	})

	return promise
}


function Server(){}


/**
 * Serve files
 */
Server.prototype.start = function(site){

	var server = express()

	server.use(serveStatic(site.destinationDir, {'index': ['index.html']}))
	server.use('/assets/', serveStatic(site.theme.assetsDir))

	//@TODO Add not found

	server.listen(Site.Convention.port)
}



Server.prototype.watch = function(app){

	var 
	pattern = path.join(app.getBaseDir(), 'content/'),

	// Avoid initial events to be triggered
	opts = {ignoreInitial:  true}

	log('Watching ' + chalk.cyan(pattern) + '...')


	watch(pattern, opts).on('change', reload(app, 'updated'))
	watch(pattern, opts).on('add', reload(app, 'added'))
	watch(pattern, opts).on('unlink', reload(app, 'deleted'))
}






module.exports = Server