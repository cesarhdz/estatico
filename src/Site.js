var
path = require('path'),
Validator = require('./Validator')


var configRules = {
	name: [Validator.required]
}


/**
 * Site, data object that saves state of the current site
 * 
 * @param {Object} config Configuration
 * @param {App} app    App, so it can be referenced in views
 */
function Site(config, app, helpers){
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


/**
 * Funtion to add template engine helpers to site
 * @param {Object<String, fn} helpers 
 * @return {Object<String, fn} helpers with a reference to the site
 */
Site.prototype.addHelpers = function(helpers){

	var site = this;

	this.helpers = Object.keys(helpers).reduce(function(acc, key){
		acc[key] = helpers[key](site)

		return acc;
	}, {})

	return this.helpers
}


Site.prototype.validator = new Validator()



module.exports = Site