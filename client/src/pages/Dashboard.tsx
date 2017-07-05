import * as React from 'react';

import DashboardComponent from '../components/Dashboard';
import { SetupDashboard } from '../components/Settings';

import ConfigurationsActions from '../actions/ConfigurationsActions';
import ConfigurationsStore from '../stores/ConfigurationsStore';

import { ApolloClient, ApolloProvider, createNetworkInterface, createBatchingNetworkInterface} from 'react-apollo';
import { makeExecutableSchema } from 'graphql-tools';
import { typeDefs } from '../apollo/typeDefs';

interface IDashboardState {
  dashboard?: IDashboardConfig;
  connections?: IConnections;
  connectionsMissing?: boolean;
}

makeExecutableSchema({ typeDefs });
 
 const batchingNetworkInterface = createBatchingNetworkInterface({
  uri: 'http://localhost:4000/apollo',
  batchInterval: 10,
  opts: {
    // Options to pass along to `fetch`
  }
});

// const networkInterface = createNetworkInterface({ uri: 'http://localhost:4000/apollo' });
// const client = new ApolloClient({ networkInterface: networkInterface });
const client = new ApolloClient({ networkInterface: batchingNetworkInterface });

export default class Dashboard extends React.Component<any, IDashboardState> {

  state: IDashboardState = {
    dashboard: null,
    connections: {},
    connectionsMissing: false
  };

  constructor(props: any) {
    super(props);

    this.updateConfiguration = this.updateConfiguration.bind(this);
  }

  updateConfiguration(newState: IDashboardState) {
    this.setState(newState);
  }

  componentDidMount() {

    this.setState(ConfigurationsStore.getState());
    ConfigurationsStore.listen(this.updateConfiguration);
  }

  componentWillUnmount() {
    ConfigurationsStore.unlisten(this.updateConfiguration);
  }

  render() {

    var { dashboard, connections, connectionsMissing } = this.state;

    if (!dashboard) {
      return null;
    }

    if (connectionsMissing) {
      return (
        <SetupDashboard dashboard={dashboard} connections={connections} />
      );
    }

    return (
      <ApolloProvider client={client}>
      <DashboardComponent dashboard={dashboard} />
      </ApolloProvider>
    );
  }
}
