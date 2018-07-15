// module.exports = {
//     /**
//      * After all the tests are run, evaluate if there were errors and exit appropriately.
//      *
//      * If there were failures or errors, exit 1, else exit 0.
//      *
//      * @param results
//      */
//     reporter: function(results) {
//         if ((typeof(results.failed) === 'undefined' || results.failed === 0) &&
//         (typeof(results.error) === 'undefined' || results.error === 0)) {
//             process.exit(0);
//         } else {
//             process.exit(1);
//         }
//     }
// };

module.exports = {
    'default': {
      isLocal: true
    },
    'integration': {
      isLocal: false
    },
  
    // External before hook is ran at the beginning of the tests run, before creating the Selenium session
    before: function (done) {
      // chromedriver.start();
      // run this only for the local-env
      if (this.isLocal) {
        // start the local server
        App.startServer(function () {
          // server listening
          done();
        });
      } else {
        done();
      }
    },
  
    // External after hook is ran at the very end of the tests run, after closing the Selenium session
    after: function (done) {
      //   chromedriver.stop()
      // run this only for the local-env
      if (this.isLocal) {
        // start the local server
        App.stopServer(function () {
          // shutting down
          process.exit(1)
          done();
        });
      } else {
        process.exit(1)
        done();
      }
    },
  
    // This will be run before each test suite is started
    beforeEach: function (browser, done) {
      // getting the session info
      browser.status(function (result) {
        console.log(result.value);
        done();
      });
    },
  
    // This will be run after each test suite is finished
    afterEach: function (browser, done) {
      console.log(browser.currentTest);
      done();
    }
  };
  