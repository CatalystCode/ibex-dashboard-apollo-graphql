import * as React from 'react';
import * as _ from 'lodash';
import Autocomplete from 'react-md/lib/Autocompletes';
import * as throttle from 'lodash.throttle';

import { DataSourceConnector, IDataSourceDictionary } from '../../../data-sources';
import ConfigurationsActions from '../../../actions/ConfigurationsActions';
import ConfigurationsStore from '../../../stores/ConfigurationsStore';

interface IDependencyProps {
  id: string;
  label?: string;
  defaultValue?: string;
}

interface IDependencyState {
  dataSources: IDataSourceDictionary;
  searchTerm: string;
  dependencies: string[];
}

export default class Dependency extends React.Component<IDependencyProps, IDependencyState> {

  state: IDependencyState = {
    dataSources: null,
    searchTerm: '',
    dependencies: []
  }

  constructor (props: IDependencyProps) {
    super(props);

    this.searchForDependencies = this.searchForDependencies.bind(this);

    this.throttledSearch = throttle(this.searchForDependencies, 250);
  }

  componentWillMount() {
    setInterval(() => {
      let dataSources = DataSourceConnector.getDataSources();
      this.setState({ dataSources });
    }, 3000);
  }

  throttledSearch() { }

  searchForDependencies(searchTerm) {

    if (!searchTerm || !this.state.dataSources) {
      searchTerm = '';
    }

    if (searchTerm.startsWith(':')) {
      this.setState({ searchTerm, dependencies: [ '::' ] });
      return;
    }

    let { dataSources } = this.state;
    let search = searchTerm.toLowerCase();
    let dependencies = [ '::' ];
    if (dataSources) {
      _.keys(dataSources).forEach((dataSourceKey) => {

        if (dataSourceKey.toLowerCase().indexOf(search) >= 0) {
          dependencies.push(dataSourceKey);
        }

        let dataSource = dataSources[dataSourceKey];
        let state = dataSource.store.getState()
        _.keys(state).forEach((stateKey) => {
          let value = dataSourceKey + ':' + stateKey;
          if (value.toLowerCase().indexOf(search) >= 0) {
            dependencies.push(value);
          }
        });
      });
    }
    
    this.setState({ searchTerm, dependencies });
    return;
  }

  render() {

    let { id, label, defaultValue } = this.props;

    let { dataSources, searchTerm, dependencies } = this.state;

    return (
      <Autocomplete
        id={id}
        type="search"
        label={label}
        className="md-cell"
        placeholder="Artist"

        defaultValue={defaultValue}
        lineDirection="center"

        data={dependencies}
        filter={null}
        onChange={this.throttledSearch}
        clearOnAutocomplete
      />
    );
  }
}