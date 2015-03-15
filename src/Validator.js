var
fs = require('fs')


function Validator(){}


function ValidationObject(errors){
	this.isValid = errors.length === 0
	this.errors = errors
}


function validationResult(errors, failOnError){
	var validation = new ValidationObject(errors)


	if(failOnError && ! validation.isValid){
		throw new Error('Validation errors found:\n\t' + errors.join('\n\t'))
	}


	return validation
}


/**
 * Validate path exists
 * @param  {Object<String, String>} paths Name and path
 * @return {ValidationObject}       
 */
Validator.prototype.paths = function(paths, failOnError){
	
	// Content and destination folder must exists
	var errors = Object.keys(paths).reduce(function(e, key){
		if(! fs.existsSync(paths[key])){
			var msg = '['+ key +'] is missing, it must be located at [' + paths[key] + ']'
			e.push(msg)
		}

		return e
	}, [])


	return validationResult(errors, failOnError)
}


Validator.prototype.config = function(target, rules, failOnError){
	
	var errors = Object.keys(rules).reduce(function(acc, key){

		var val = target[key]
		
		// Iterate until one errors is found
		for (var i = rules[key].length - 1; i >= 0; i--) {
			
			var 
			error,
			fn = rules[key][i],
			isValid = fn(val)

			if(isValid !== true){
				error = 'name: ' + isValid
				break
			}
		}

		if(error){ acc.push(error) }

		return acc

	}, [])


	return validationResult(errors, failOnError)
}


Validator.required = function(val){
	return (val) ? true : ['required but got null']
}


module.exports = Validator