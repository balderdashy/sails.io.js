require('child_process').exec('git status --porcelain', function(err, result) {
  if (err) {throw err;}
  if (/^([ADRM?]| [ADRM?])/m.test(result)) {
    throw 'There are uncommitted changes in the working tree.';
  }
  process.exit(0);
});
