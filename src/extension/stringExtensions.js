const jsdiff = require('diff');

String.prototype.compare = function(value) {
  const diff = jsdiff.diffChars(this, value);
  return diff.filter(x => !!x.removed == false)
    .map(part => { return { 
        'value': part.value,
        'diff': !!part.added
      }
    });
}