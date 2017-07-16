const { channelsQuery, pieChartQuery, sentimentChartQuery, intentsQuery, lineChartQuery, barChartQuery } = require('./queries/ai');

const resolvers = {
  Query: {
    lineCharts: lineChartQuery,
    pieCharts: pieChartQuery,
    channels: channelsQuery,
    intents: intentsQuery,
    sentiments: sentimentChartQuery,
    barCharts: barChartQuery,
  },
};

module.exports = {
  resolvers,
};
