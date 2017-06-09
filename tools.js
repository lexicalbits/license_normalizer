var _ = require('lodash')
  , q = require('q')
  , fs = require('fs')
  ;
module.exports = {
  load: (names) => {
    if (!_.isArray(names)) names = [names];
    return _.map(names, (name) => { return JSON.parse(fs.readFileSync(name, 'utf8')); });
  }
  , flatten: (json) => {
    return _.reduce(json, function (out, record, key) {
      out[key.split('@')[0]] = {repo: record.repository || 'unknown', license: record.licenses || 'unknown'};
      return out;
    }, {});
  }
  , merge: (data) => {
    return _.reduce(data, (merged, datum) => { return _.extend(merged, datum); }, {});
  }
  , normalizeLicense: (license) => {
    var testLicense = license.toLowerCase();
    if (testLicense.indexOf('mit') >= 0) {
      return 'MIT';
    }
    if (testLicense.indexOf('apache') >= 0) {
      return 'Apache';
    }
    if (testLicense.match(/bsd[^\w]*2/i)) {
      return 'BSD 2';
    }
    if (testLicense.match(/bsd[^\w]*3/i)) {
      return 'BSD 3';
    }
    if (testLicense.indexOf('bsd') >= 0) {
      return 'BSD';
    }
    return license;
  }
  , byLicense: (data) => {
    // Do some normalization
    return _.reduce(data, (grouped, record, key) => {
      var license = module.exports.normalizeLicense(record.license);
      if (!_.isArray(grouped[license])) grouped[license] = [];
      record.name = key;
      grouped[license].push(record);
      return grouped;
    }, {});
  }
  , dump: (groupedData) => {
    _.each(groupedData, (records, license) => {
      _.each(records, (record, name) => {
        console.log(
          _.padEnd(license, 16)
          + _.padEnd(_.truncate(record.name, {length: 28}), 32)
          + '(' + record.repo + ')'
        );
      });
    });
  }
};
