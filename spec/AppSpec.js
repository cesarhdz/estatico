var 
estatico = require('../index'),
should = require('chai').should()



describe('App', function(){

	var app


	describe('#constructor', function(){
		
		it('Should be constructed with a dir an environment', function(){
			// when
			app = new estatico.App()

			//then
			app.getBaseDir().should.equal(process.cwd())
			app.getEnv().should.equal('dev')


			/// when
			app = new estatico.App('/custom/dir', 'prod')

			//then
			app.getBaseDir().should.equal('/custom/dir')
			app.getEnv().should.equal('prod')
		})


	})

})
