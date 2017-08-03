import * as React from 'react';
import * as _ from 'lodash';
import plugins from './generic/plugins';

import { DataSourceConnector } from '../data-sources/DataSourceConnector';
import VisibilityActions from '../actions/VisibilityActions';
import VisibilityStore from '../stores/VisibilityStore';

import filterStore from '../stores/FilterStore';

import ListItemControl from 'react-md/lib/Lists/ListItemControl';
import Checkbox from 'react-md/lib/SelectionControls/Checkbox';

import Button from 'react-md/lib/Buttons/Button';

import { ApolloClient, ApolloProvider, createNetworkInterface } from 'react-apollo';
import { makeExecutableSchema } from 'graphql-tools';
import { typeDefs } from '../apollo/typeDefs';
import { gql, graphql } from 'react-apollo';

import LineChartQueryRenderer, { ILineChartQueryRendererProps } from '../apollo/components/LineChartQueryRenderer';
import StraightAnglePieChartQueryRenderer, { IStraightAnglePieChartQueryRendererProps } from
  '../apollo/components/StraightAnglePieChartQueryRenderer';
import DropDownQueryRenderer, { IDropDownQueryRendererProps } from '../apollo/components/DropDownQueryRenderer';
import SimpleBarChartQueryRenderer, { ISimpleBarChartQueryRendererProps } from
  '../apollo/components/SimpleBarChartQueryRenderer';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

import graphqlResultsTransformUtils from '../utils/graphqlResultsUtils';

var channel = [];

const queryLineCharts = gql`
query ($source: String!, $query:String!, $appId:String!, $apiKey:String!, $filterKey:String, $filterValues:[String]) {
  lineCharts(source:$source, query:$query, appId:$appId, apiKey:$apiKey, filterKey:$filterKey, 
    filterValues:$filterValues) {
      seriesData {
        label
        x_values
        y_values
      }
  }
}
`;

const queryChannels = gql`
query ($source: String!, $query:String!, $appId:String!, $apiKey:String!) {
  channels(source:$source, query:$query, appId:$appId, apiKey:$apiKey) {
    id
    name
  }
}
`;

const queryPieCharts = gql`
query ($source: String!, $query:String!, $appId:String!, $apiKey:String!) {
  pieCharts(source:$source, query:$query, appId:$appId, apiKey:$apiKey ) {
    labels
    values
  }
}
`;

const queryBarCharts = gql`
query ($source: String!, $query:String!, $appId:String!, $apiKey:String!, $filterKey:String, $filterValues:[String]) {
  barCharts(source:$source, query:$query, appId:$appId, apiKey:$apiKey, filterKey:$filterKey, 
    filterValues:$filterValues) {
      seriesData {
        label
        x_values
        y_values
      }
  }
}
`;

interface ILineChartQueryResults {
  lineCharts: { seriesData: [{ label: any, x_values: any, y_values: any }] };
}

interface IPieChartQueryResults {
  pieCharts: { labels: any, values: any };
}

interface IChannelsQueryResults {
  channels: { ids: any, values: any };
}

interface IBarChartQueryResults {
  barCharts: { labels: any, values: any };
}

interface IQueryRendererWithDataProps {
  query: string;
  source: string;
  appInsightsAppId: string;
  appInsightsApiKey: string;
  id: string;
  title: string;
  subtitle: string;
  dialog: string;
  filterValues: [string];
  filterKey: string;
}

const LineChartRendererGQL =
  graphql<ILineChartQueryResults, IQueryRendererWithDataProps, ILineChartQueryRendererProps>(queryLineCharts, {
    options: (ownProps) => {
      return {
        variables: {
          query: ownProps.query,
          source: ownProps.source,
          appId: ownProps.appInsightsAppId,
          apiKey: ownProps.appInsightsApiKey,
          filterKey: ownProps.filterKey,
          filterValues: ownProps.filterValues
        }
      };
    },
    props: ({ ownProps, data }) => {
      return {
        loading: data.loading,
        error: data.error && data.error.message,
        query: ownProps.query,
        id: ownProps.id,
        results: graphqlResultsTransformUtils.lineChartsDataTransform(data.lineCharts, true),
        title: ownProps.title,
        subtitle: ownProps.subtitle,
        dialog: ownProps.dialog,
        filterValues: ownProps.filterValues,
        filterKey: ownProps.filterKey,
      } as ILineChartQueryRendererProps;
    },
  })(LineChartQueryRenderer);

const StraightAnglePieChartRendererGQL =
  graphql<IPieChartQueryResults, IQueryRendererWithDataProps, IStraightAnglePieChartQueryRendererProps>(
    queryPieCharts, {
      options: (ownProps) => {
        return {
          variables: {
            source: ownProps.source,
            query: ownProps.query,
            appId: ownProps.appInsightsAppId,
            apiKey: ownProps.appInsightsApiKey
          }
        };
      },
      props: ({ ownProps, data }) => {
        return {
          loading: data.loading,
          error: data.error && data.error.message,
          query: ownProps.query,
          results: graphqlResultsTransformUtils.pieChartsDataTransform(data.pieCharts),
          title: ownProps.title,
          subtitle: ownProps.subtitle,
        } as IStraightAnglePieChartQueryRendererProps;
      },
    })(StraightAnglePieChartQueryRenderer);

const SimpleBarChartQueryRendererGQL =
  graphql<IBarChartQueryResults, IQueryRendererWithDataProps, ISimpleBarChartQueryRendererProps>(queryBarCharts, {
    options: (ownProps) => {
      return {
        variables: {
          source: ownProps.source,
          query: ownProps.query,
          appId: ownProps.appInsightsAppId,
          apiKey: ownProps.appInsightsApiKey,
          filterKey: ownProps.filterKey,
          filterValues: ownProps.filterValues
        }
      };
    },
    props: ({ ownProps, data }) => {
      return {
        loading: data.loading,
        error: data.error && data.error.message,
        query: ownProps.query,
        results: graphqlResultsTransformUtils.lineChartsDataTransform(data.barCharts, false),
        title: ownProps.title,
        subtitle: ownProps.subtitle,
        dialog: ownProps.dialog,
        filterValues: ownProps.filterValues,
        filterKey: ownProps.filterKey,
      } as ISimpleBarChartQueryRendererProps;
    },
  })(SimpleBarChartQueryRenderer);

const DropDownRendererGQL =
  graphql<IChannelsQueryResults, IQueryRendererWithDataProps, IDropDownQueryRendererProps>(queryChannels, {
    options: (ownProps) => {
      return {
        variables: {
          source: ownProps.source,
          query: ownProps.query,
          appId: ownProps.appInsightsAppId,
          apiKey: ownProps.appInsightsApiKey,
        }
      };
    },
    props: ({ ownProps, data }) => {
      return {
        loading: data.loading,
        error: data.error && data.error.message,
        query: ownProps.query,
        results: graphqlResultsTransformUtils.DropDownComponentDataTransform(data.channels),
        id: ownProps.id,
        title: ownProps.title,
        subtitle: ownProps.subtitle,
      } as IDropDownQueryRendererProps;
    },
  })(DropDownQueryRenderer);

var filtersData = {};

export default class ElementConnectorForGQL {

  static loadGraphqlElementsFromDashboardInternal(
    connections: IConnections,
    visual: IVisualElement[],
    layout: ILayout[],
    dialogFilterKey: string,
    dialogFilterValue: string): React.Component<any, any>[] {
    var types = {
      'LineChart': LineChartRendererGQL,
      'PieData': StraightAnglePieChartRendererGQL,
      'DropDown': DropDownRendererGQL,
      'BarChart': SimpleBarChartQueryRendererGQL,
    };

    var elementsgql = [];
    if (!visual) {
      return elementsgql;
    }

    for (var i = 0; i < visual.length; i++) {
      var ReactElement = types[visual[i].Type];
      var key = '' + i + visual[i].Type;

      let appInsightsApiKey = '';
      let appInsightsAppId = '';
      if (visual[i].source === 'AI') {
        appInsightsAppId = connections['application-insights'].appId;
        appInsightsApiKey = connections['application-insights'].apiKey;
      }

      elementsgql.push(
        <div key={key}>
          <ReactElement
            query={visual[i].query}
            source={visual[i].source}
            appInsightsAppId={appInsightsAppId}
            appInsightsApiKey={appInsightsApiKey}
            id={visual[i].id}
            title={visual[i].title}
            subtitle={visual[i].subtitle}
            dialog={visual[i].dialog}
            filterValues={dialogFilterValue || filtersData[visual[i].filterId]}
            filterKey={dialogFilterKey || visual[i].filterKey} />
        </div>
      );
    }

    return elementsgql;
  }

  static loadGraphqlElementsFromDashboardDialogs(
    connections: IConnections,
    visual: IVisualElement[],
    layout: ILayout[],
    dialogFilterKey: string,
    dialogFilterValue: string): React.Component<any, any>[] {
    return this.loadGraphqlElementsFromDashboardInternal(
      connections,
      visual, 
      layout, 
      dialogFilterKey, 
      dialogFilterValue);
  }

  static loadGraphqlElementsFromDashboard(
    connections: IConnections,
    visual: IVisualElement[],
    layout: ILayout[]): React.Component<any, any>[] {
    return this.loadGraphqlElementsFromDashboardInternal(connections, visual, layout, null, null);
  }

  constructor() {

    filterStore.listen((state) => {
      for (let i = 0; i < state.filterState.length; i++) {
        var filterValuesArray = state.filterState[i].values;
        filtersData[state.filterState[i].filterId] = filterValuesArray;
      }
    });
  }
}