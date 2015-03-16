var urlJoin = require('url-join')

/**
 * Permalink function constructor
 * @param  {Site} site Use site to getl full access
 * @return {function}      
 */
function permalink(site){

	/**
	 * Returns a permalink of a given page
	 * @param  {Page} page 
	 * @return {String}      Full url to resource
	 */
	return function(page){
		return urlJoin(site.baseUrl, page.uri) 
	}
}



module.exports = permalink