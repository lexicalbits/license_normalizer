var _ = require('lodash')
  , q = require('q')
  , tools = require('./tools')
  , [fe, be] = _.map(tools.load(['./fe.json', './be.json']), tools.flatten)
  , all = tools.merge([fe, be])
  , grouped = tools.byLicense(all)
  ;
tools.dump(grouped);
