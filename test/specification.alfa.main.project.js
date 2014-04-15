describe('The module exposes muliple public member', function(){

    it('The module follows the expected namespacing', function(){

        expect( alfa ).to.be.a('object');
        expect( alfa.main ).to.be.a('object');
        expect( alfa.main.project ).to.be.a('object');
    });

    it('Module exposes the "init" method', function (done){

        expect(alfa.main.project.init).to.be.a('function');

        done();
    });

});