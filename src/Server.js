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

	server.use(serveStatic(site.app.destinationDir, {'index': ['index.html']}))

	// @TODO Add paths dynamically
	server.use('/assets/', serveStatic(site.theme.assetsDir))

	//@TODO Add not found

	return server.listen(Site.Convention.port);
}


/**
 * Watch content and reload changes
 * It ma be more useful to embed in Gulpfile 
 * 
 * @param  {[type]} app [description]
 * @return {watcher]
 */
Server.prototype.watch = function(app, site){

	var 
	pattern = [
		path.join(app.dir, 'content/'),
		site.theme.viewsDir
	],

	// Avoid initial events to be triggered
	opts = {ignoreInitial:  true};


	log('Watching ' + chalk.cyan(pattern) + '...')

	return watch(pattern, opts)
		.on('add', reload(app, 'added'))
		.on('change', reload(app, 'updated'))
		.on('unlink', reload(app, 'deleted'))
}






module.exports = Server