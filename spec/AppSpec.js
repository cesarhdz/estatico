var 
estatico = require('../index'),
should = require('chai').should()



describe('App', function(){

	var app

	beforeEach(function(){
		app = new estatico.App()
	})


	describe('#constructor', function(){
		
		xit('Should be constructed with dir and environment', function(){
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



	describe('#build', function(){

		xit('Should build source dir', function(){
			app.build()
		})

	})

})
