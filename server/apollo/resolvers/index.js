const { channelsQuery, pieChartQuery, lineChartQuery, barChartQuery } = require('./queries/resolversRedirect');

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
