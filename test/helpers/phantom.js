var binPath = require('phantomjs-prebuilt').path;
module.exports = function(url, code) {
  var phantomTest = "var page = require('webpage').create();\n" +
                    "var system = require('system');\n" +
                    "page.onConsoleMessage = function(msg) {system.stdout.write(msg);};\n" +
                    "page.open('" + url  + "', function(status) {\n" +
                    "  if (status == 'error') {return console.log('error');}\n" +
                    "  page.evaluate(function() {setTimeout(function(){\n" + code + "\n}, 100)});\n" +
                    "})";
  var scriptPath = require('path').resolve(__dirname, '..', '.tmp', 'phantom.js');
  require('fs-extra').outputFileSync(scriptPath, phantomTest);
  var child = require('child_process').spawn(binPath, [scriptPath]);
  return child;
};
