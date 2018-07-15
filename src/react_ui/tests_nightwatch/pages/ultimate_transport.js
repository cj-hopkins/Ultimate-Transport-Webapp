// Pages require the old syntax for anonymous functions for some reason
// i.e use `function (param) {block}` rather than `(param) => {block}`
const mapCommands = {
    checkPageLoad: function () {
        return this.waitForElementVisible('@reactContainer', 3000)
            .waitForElementVisible('@map', 3000);
    },
    selectRoute: function (route) {
        return this.waitForElementVisible('@routeSelect', 3000)
            .setValue('@routeSelect', route)
    },
    selectStart: function (start) {
        return this.waitForElementVisible('@startSelect', 3000)
            .setValue('@startSelect', start);
    },
    selectFinish: function (finish) {
        return this.waitForElementVisible('@finishSelect', 3000)
            .setValue('@startSelect', finish)
            .click('@reactContainer');
    },
    getPrediction: function () {
        return this.click('@goButton')
            .waitForElementVisible('@predictionContainer', 3000);
    }
}

module.exports = {
  url: function () {
    return this.api.launch_url;
  },
  commands: [mapCommands],
  elements: {
      reactContainer: 'div[id="reactify-django-ui"]',
      map: 'iframe[src="about:blank"]',
      routeSelect: 'input[id="routeSelect"]',
      routeClear: 'span[id="react-select-2--value"]+span',
      startSelect: 'input[id="startSelect"]',
      finishSelect: 'input[id="finishSelect"]',
      goButton: 'button[class="btn btn-lg btn-primary btn-block"]',
      predictionContainer: 'button[class="btn btn-lg btn-primary btn-block"]+p',

  }
};