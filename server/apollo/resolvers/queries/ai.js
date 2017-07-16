const request = require('xhr-request');
const aiConvertors = require('../../appInsightsConvertors/ai-to-graph-ds');

const getPredefinedQuery = (queryId) => {
  const savedQueries = [];
  savedQueries['predefined_channels1'] = `customEvents | where name == 'Activity' | 
    extend channel=customDimensions.channel | 
    summarize channel_count=count() by tostring(channel) |
    order by channel_count`;
  savedQueries['predefined_intents1'] = `customEvents | extend intent=customDimensions.intent, cslen = customDimensions.callstack_length |
    where name startswith 'message.intent' and (cslen == 0 or strlen(cslen) == 0) and strlen(intent) > 0 |
    summarize intent_count=count() by tostring(intent) |
    order by intent_count`;
  savedQueries['predefined_users_timeline1'] = `customEvents | where name == 'Activity' |
    summarize count=dcount(tostring(customDimensions.from)) by bin(timestamp, 5m), name, channel=tostring(customDimensions.channel) |
    order by timestamp asc`;
  savedQueries['predefined_sentiment1'] = `customEvents | where name startswith 'MBFEvent.Sentiment' |
    extend score=customDimensions.score|
    summarize sentiment=avg(todouble(score))`;
  savedQueries['predefined_pie1'] = `customEvents | summarize count=dcount(tostring(customDimensions.from)), dcount(tostring(customDimensions.callstack_length)), dcount(tostring(customDimensions.channel))`;
  savedQueries['predefined_users_timeline2'] = `customEvents | where name == 'Activity' |
    summarize count=count(customDimensions.score) by bin(timestamp, 5m), name, channel=tostring(customDimensions.channel) |
    order by timestamp asc`;
  savedQueries['predefined_barchart1'] = `customEvents | where name == 'Activity' |
  summarize count() by client_City, name, channel=tostring(customDimensions.channel)`;

  var actualQuery = savedQueries[queryId];
  return actualQuery;
};

const executeAiQuery = (query, appId, apiKey) => {
  return new Promise((resolve, reject) => {
    request('http://localhost:4000/applicationinsights/query', {
      method: 'POST',
      json: true,
      body: { query, appId, apiKey },
    }, (err, result) => {
      if (err) {
        reject(err);
      }
      else {
        // take just table 0, this is the actual results, the rest are AI visualizers
        resolve({ body: JSON.stringify(result, null, 2) });
      }
    })
  });
}

const channelsQuery = (root, { query, appId, apiKey }) => {
  return new Promise((resolve, reject) => {
    var q = getPredefinedQuery(query);
    var queryToExecute = q ? q : query;
    var aiResultPromise = executeAiQuery(queryToExecute, appId, apiKey)
      .then((data) => {
        var res = aiConvertors.toIdsAndValuesArrays(data.body);
        resolve(res);
      });

  });
};

const intentsQuery = (root, { query, appId, apiKey }) => {
  return new Promise((resolve, reject) => {
    var q = getPredefinedQuery(query);
    var queryToExecute = q ? q : query;
    var aiResultPromise = executeAiQuery(queryToExecute, appId, apiKey)
      .then((data) => {
        var res = aiConvertors.toIdsAndValuesArrays(data.body);
        resolve(res);
      });

  });
};

const lineChartQuery = (root, { query, appId, apiKey }) => {
  return new Promise((resolve, reject) => {
    var q = getPredefinedQuery(query);
    var queryToExecute = q ? q : query;
    var aiResultPromise = executeAiQuery(queryToExecute, appId, apiKey)
      .then((data) => {
        var res = aiConvertors.toLineChart(data.body);
        resolve([res]);
      });

  });
};

const pieChartQuery = (root, { query, appId, apiKey }) => {
  return new Promise((resolve, reject) => {
    var q = getPredefinedQuery(query);
    var queryToExecute = q ? q : query;
    var aiResultPromise = executeAiQuery(queryToExecute, appId, apiKey)
      .then((data) => {
        var res = aiConvertors.toPieChartData(data.body);
        resolve([res]);
      });

  });
};

const barChartQuery = (root, { query, appId, apiKey }) => {
  return new Promise((resolve, reject) => {
    var q = getPredefinedQuery(query);
    var queryToExecute = q ? q : query;
    var aiResultPromise = executeAiQuery(queryToExecute, appId, apiKey)
      .then((data) => {
        var res = aiConvertors.toLineChart(data.body);
        resolve([res]);
      });

  });
};

const sentimentChartQuery = (root, { query, appId, apiKey }) => {
  return new Promise((resolve, reject) => {
    var q = getPredefinedQuery(query);
    var queryToExecute = q ? q : query;
    var aiResultPromise = executeAiQuery(queryToExecute, appId, apiKey)
      .then((data) => {
        var res = aiConvertors.toSentimentFormat(data.body);
        resolve(res);
      });

  });
};

module.exports = {
  channelsQuery,
  intentsQuery,
  sentimentChartQuery,
  lineChartQuery,
  pieChartQuery,
  barChartQuery,
};
