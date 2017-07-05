const { channelsQuery, pieChartQuery, sentimentChartQuery, intentsQuery, lineChartQuery } = require('./queries/ai');

const resolvers = {
  Query: {
    lineCharts: lineChartQuery,
    pieCharts: pieChartQuery,
    channels: channelsQuery,
    intents: intentsQuery,
    sentiments: sentimentChartQuery,
  },
};

module.exports = {
  resolvers,
};
