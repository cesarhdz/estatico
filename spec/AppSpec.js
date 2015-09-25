var 
estatico = require('../index'),
should = require('chai').should()



describe('App', function(){

	var app

	describe('#constructor', function(){

		var generator = estatico.App.prototype.generator;

		beforeEach(function(){
			estatico.App.prototype.generator = {validateDir: function(){}}
		})
		
		it('Should be constructed with dir, environment and dir with default values', function(){
			// when
			app = new estatico.App()

			//then
			app.dir.should.equal(process.cwd())
			app.env.should.equal('dev')
			app.destinationDir.should.equal(process.cwd() + '/target/work');

		})

		it('Should be constructed with dir, environment and dir with custom values', function(){
			// when
			app = new estatico.App({baseDir: '/custom/dir', env: 'prod'})

			//then
			app.dir.should.equal('/custom/dir')
			app.env.should.equal('prod')
		})


		it('Should now the URL by default', function(){

			//expect
			new estatico.App().url.should.equal('http://localhost:3000/')

		})


		it('Should be able to use a custom URL', function(){
			//given
			var customUrl = 'http://estatico.com/'

			//when
			app = new estatico.App({url: customUrl})

			//then
			app.url.should.equal(customUrl)

		})

		afterEach(function(){
			estatico.App.prototype.generator = generator;
		})


	})



	describe('#build', function(){

		xit('Should build source dir', function(){
			app.build()
		})

	})

})
