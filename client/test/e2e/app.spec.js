describe('app', function() {
	it('should display the dashboard', function() {
		browser.get('/');
		expect(element(by.css('h3')).getText()).toEqual('Projects info');
	})
});