// todo: this could be extracted to a module shared between client and server

const typeDefs = `

type Query {
  channels(query:String!, appId:String!, apiKey:String!): [Channel]
  intents(query:String!, appId:String!, apiKey:String!): [Intent]
  lineCharts(query:String!,  appId:String!, apiKey:String!, filterKey:String, filterValues:[String]): [LineChart]
  sentiments(query:String!, source:String!, appId:String!, apiKey:String!): [Sentiment]
  pieCharts(query:String!, source:String!, appId:String!, apiKey:String!): [PieChart]
  barCharts(query:String!, source:String!, appId:String!, apiKey:String!, filterKey:String, filterValues:[String]): [BarChart]
}

type Channel {
  name: String
  id: Int
}

type Intent {
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

type Sentiment {
  label: String
  value: Int
}
`;

module.exports = {
  typeDefs,
};
