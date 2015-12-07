var dashboard = {
  get: function() { browser.get('/'); },
  heading: element(by.css('h3'))
};


describe('app', function() {
  it('should display the dashboard', function() {
    dashboard.get();
    expect(dashboard.heading.getText()).toEqual('Projects info');
  })
});