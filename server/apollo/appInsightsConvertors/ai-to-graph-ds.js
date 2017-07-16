// Transformation layer: Transforms the heavy AI json results to graphql return types

const toIdsAndValuesArrays = (appInsightsQueryResult) => {
  var jsonObj = JSON.parse(appInsightsQueryResult);
  var ids = [];
  var values = [];
  var res = []
  for (var i = 0; i < jsonObj.Tables[0].Rows.length; i++) {
    res.push({ id: jsonObj.Tables[0].Rows[i][1], name: jsonObj.Tables[0].Rows[i][0] });
  }
  return res;
};

const toLineChart = (appInsightsQueryResult) => {
  var countColumn = 3;
  var timeColumn = 0;
  var channelColumn = 2;
  var nameColumn = 1;
  var jsonObj = JSON.parse(appInsightsQueryResult);

  var seriesArray = {};
  for (var i = 0; i < jsonObj.Tables[0].Rows.length; i++) {
    var channelName = jsonObj.Tables[0].Rows[i][channelColumn];
    if (!seriesArray[channelName]) {
      seriesArray[channelName] = {};
      seriesArray[channelName] = { label: channelName, x_values: [], y_values: [] };
    }

    seriesArray[channelName].x_values.push(jsonObj.Tables[0].Rows[i][timeColumn]);
    seriesArray[channelName].y_values.push(jsonObj.Tables[0].Rows[i][countColumn]);

  }

  var allSeries = []
  for (var key in seriesArray) {
    allSeries.push(seriesArray[key]);
  }

  return { seriesData: allSeries }
};

const toBarChart = (appInsightsQueryResult) => {
  var countColumn = 3;
  var groupColumn = 0;
  var channelColumn = 2;
  var nameColumn = 1;
  var jsonObj = JSON.parse(appInsightsQueryResult);
  var seriesArray = {};
  for (var i = 0; i < jsonObj.Tables[0].Rows.length; i++) {
    var channelName = jsonObj.Tables[0].Rows[i][channelColumn];
    if (!seriesArray[channelName]) {
      seriesArray[channelName] = {};
      seriesArray[channelName] = { label: channelName, x_values: [], y_values: [] };
    }

    seriesArray[channelName].x_values.push(jsonObj.Tables[0].Rows[i][groupColumn]);
    seriesArray[channelName].y_values.push(jsonObj.Tables[0].Rows[i][countColumn]);

  }

  var allSeries = [];
  for (var key in seriesArray) {
    allSeries.push(seriesArray[key]);
  }

  return { seriesData: allSeries }
};

const toSentimentFormat = (appInsightsQueryResult) => {

  var jsonObj = JSON.parse(appInsightsQueryResult);
  var sentiments = [];
  sentiments.push({ label: 'Positive', value: Math.round(jsonObj.Tables[0].Rows[0] * 100) });
  sentiments.push({ label: 'Negative', value: Math.round((1 - jsonObj.Tables[0].Rows[0]) * 100) });

  return sentiments;
};

const toPieChartData = (appInsightsQueryResult) => {
  var jsonObj = JSON.parse(appInsightsQueryResult);

  var labels = [];
  var values = [];
  for (var i = 0; i < jsonObj.Tables[0].Columns.length; i++) {

    values.push(jsonObj.Tables[0].Rows[0][i]);
    labels.push(jsonObj.Tables[0].Columns[i].ColumnName);

  }

  var countColumn = 3;
  var timeColumn = 0;
  var channelColumn = 2;
  var nameColumn = 1;

  return { labels: labels, values: values };
};

module.exports = {
  toIdsAndValuesArrays,
  toLineChart,
  toSentimentFormat,
  toPieChartData,
  toBarChart,
};