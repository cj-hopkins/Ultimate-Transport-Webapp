module.exports = {
    before : function(client) {
      // see https://github.com/nightwatchjs/nightwatch/blob/master/examples/globalsModule.js#L12
      client.globals.waitForConditionTimeout = 5000;
    },
  
  'click option from drop down list' : function (client) {
  
  client
    .url('https://www.w3.org/')
    .waitForElementVisible('#region_form')
    .click('#region_form select')
    .click('#region_form select option[value="all"]')
    .click('input[type=submit]', function(result) {
      this.assert.strictEqual(result.status, 0);
    });
  
  
  },
  
  after : function(client) {
  client.end();
  }
  };
  