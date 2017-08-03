const localFileResolvers = require('./localFile.js');
const aiResolvers = require('./ai.js');

const runQueryGeneric = (method, source, query, appId, apiKey, filterKey, filterValues) => {
  var prefix = 'file::';
  var fileNameIndex = source.indexOf(prefix) + prefix.length;
  if (source === 'AI') {
    return aiResolvers[method](query, appId, apiKey, filterKey, filterValues);
  } else if (fileNameIndex > -1) {
    var fileName = source.substr(fileNameIndex);
    console.log('Using local file as DB: ' + fileName);
    return localFileResolvers.getDataFromFile(fileName, query, filterKey, filterValues);
  }
};

const channelsQuery = (root, { source, query, appId, apiKey, filterKey, filterValues }) => {
  return runQueryGeneric('channelsQuery', source, query, appId, apiKey, filterKey, filterValues);
};

const lineChartQuery = (root, { source, query, appId, apiKey, filterKey, filterValues }) => {
  return runQueryGeneric('lineChartQuery', source, query, appId, apiKey, filterKey, filterValues);
};

const pieChartQuery = (root, { source, query, appId, apiKey, filterKey, filterValues }) => {
  return runQueryGeneric('pieChartQuery', source, query, appId, apiKey, filterKey, filterValues);
};

const barChartQuery = (root, { source, query, appId, apiKey, filterKey, filterValues }) => {
  return runQueryGeneric('barChartQuery', source, query, appId, apiKey, filterKey, filterValues);
};

module.exports = {
  channelsQuery,
  lineChartQuery,
  pieChartQuery,
  barChartQuery,
};
