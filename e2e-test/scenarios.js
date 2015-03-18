'use strict';
//For protactor API doc: see: https://github.com/angular/protractor/blob/master/docs/tutorial.md

describe('End to end tests (e2e) for HSU', function() {

    browser.get('/');
    it('should automatically redirect to /login when location hash/fragment is empty', function() {
        expect(browser.getLocationAbsUrl()).toMatch("/login");
    });


    describe('login', function() {
	    beforeEach(function() {
	        browser.get('/');
	    });
	    it('should render login view', function() {
	        expect(element.all(by.css('h3.text-center')).first().getText()).
				toMatch(/Control de acceso/);
	    });
	});

	describe('enter with no login', function() {
		beforeEach(function() {
		    browser.get('/#/publico');
		});
	    it('should render public part for citizens', function() {
	        expect(element.all(by.css('h3')).first().getText()).
	        toMatch(/Atención al ciudadano/);
	    });
    });

	describe('log-in', function() {
		beforeEach(function() {
		    browser.get('/');
		    element.all(by.id('inputApikey')).first().sendKeys('hsu01');
			element.all(by.css('button.btn.btn-primary')).first().click();
		});
	    it('should be inside dashboard page', function() {
	    	expect(browser.getLocationAbsUrl()).toMatch("/");
	        expect(element.all(by.css('h3')).first().getText()).
	        toMatch(/Historia Social Única/);
	    });
    });


});