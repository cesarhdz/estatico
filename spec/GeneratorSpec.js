var 
estatico = require('../index'),
should = require('chai').should()



describe('Generator', function(){

	var gen

	beforeEach(function(){
		gen = new estatico.Generator()
	})


	describe('#constructor', function(){
		
		it('Should be constructed with a dir and environment', function(){
			// when
			gen = new estatico.Generator()

			//then
			gen.getBaseDir().should.equal(process.cwd())
			gen.getEnv().should.equal('dev')


			/// when
			gen = new estatico.Generator('/custom/dir', 'prod')

			//then
			gen.getBaseDir().should.equal('/custom/dir')
			gen.getEnv().should.equal('prod')
		})


	})



})
