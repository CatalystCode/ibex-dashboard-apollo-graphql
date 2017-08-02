// todo: this could be extracted to a module shared between client and server

const typeDefs = `

type Query {
  channels(query:String!, appId:String!, apiKey:String!): [Channel]
  lineCharts(query:String!,  appId:String!, apiKey:String!, filterKey:String, filterValues:[String]): [LineChart]
  pieCharts(query:String!, source:String!, appId:String!, apiKey:String!): [PieChart]
  barCharts(query:String!, source:String!, appId:String!, apiKey:String!, filterKey:String, filterValues:[String]): [BarChart]
}

type Channel {
  name: String
  id: Int
}

type LineChart {
  id: String
  seriesData : [Series]
}

type PieChart {
  id: String
  labels: [String]
  values: [Int]
}

type BarChart {
  id: String
  seriesData : [Series]
}

type Series {
  label: String
  x_values: [String]
  y_values: [Int]
}
`;

module.exports = {
  typeDefs,
};
