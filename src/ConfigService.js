
var 
fs = require('fs'),
path = require('path'),
yaml = require('js-yaml')

function ConfigService(){}

// Use nconf to enhance and merge
// https://github.com/flatiron/nconf

/**
 * Load config from dir (usually project dir)
 * Supports only yaml configuration
 * 
 * @param  {String} dir project dir
 * @param  {String} env environmen to load
 * @return {Object}     Config Object
 */
ConfigService.prototype.load = function(dir, env){

	// Check file exists
	var file = path.join(dir, 'config.yml')

	return (fs.existsSync(file)) ? this.parseFile(file) : {}

}



/**
 * Parse Yaml file
 *
 * @throws {YAMLException} If file has invalid syntax
 * @param  {[type]} file [description]
 * @return {[type]}      [description]
 */
ConfigService.prototype.parseFile = function(file){
	try {
	  var config = yaml.safeLoad(fs.readFileSync(file, 'utf8'));
	} catch (e) {
	  console.log(e);
	}

	return config
}


module.exports = ConfigService