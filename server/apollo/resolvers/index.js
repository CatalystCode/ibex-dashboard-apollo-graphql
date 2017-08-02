const { channelsQuery, pieChartQuery, lineChartQuery, barChartQuery } = require('./queries/ai');

const resolvers = {
  Query: {
    lineCharts: lineChartQuery,
    pieCharts: pieChartQuery,
    channels: channelsQuery,
    barCharts: barChartQuery,
  },
};

module.exports = {
  resolvers,
};
