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
	this.url = this.config.url || this.getDefaultUrl()

	this.theme = null
	this.plugins = {}
}

Site.Convention = {
	content: 'content',
	destination: 'target/work',
	config: 'config.yml',
	port: 3000
}


Site.prototype.validator = new Validator()

Site.prototype.getDefaultUrl = function(){
	return 'http://localhost:' + Site.Convention.port
}


module.exports = Site