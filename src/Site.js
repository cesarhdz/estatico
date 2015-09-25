var
path = require('path'),
Validator = require('./Validator')


var configRules = {
	name: [Validator.required]
}


/**
 * Site
 * 
 * @param {Object} config Configuration
 * @param {App} app    App, so it can be referenced in views
 */
function Site(config, app){
	// Validate config
	this.validator.config(config, configRules, true)

	this.config = config
	this.app = app

	// Common vars
	this.name = this.config.name

	//@deprecated Use app.url
	this.url = app.url

	this.theme = config.theme
	this.plugins = {}
}

Site.Convention = {
	content: 'content',
	destination: 'target/work',
	config: 'config.yml',
	port: 3000
}


Site.prototype.validator = new Validator()



module.exports = Site