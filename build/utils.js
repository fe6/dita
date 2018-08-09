var path = require('path');
var pkg = require('../package.json');

module.exports = {
  outname() {
    var name = pkg.name.split('/');
    name = name && name.length > 1 ? name[1] : name;
    return name;
  },
};
