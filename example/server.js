/**
 * To view this example, run `node server`,
 * then visit http://localhost:1337/example in your browser.
 */
require('sails').lift({
  paths: { public: '../' }
}, function (err) {
  if (err) throw err;

  console.log(
    '\n\n',
    'Please visit',
    'http://localhost:1337/example',
    'in your browser to run this example.');
});

