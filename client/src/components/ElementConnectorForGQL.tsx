import * as React from 'react';
import * as _ from 'lodash';
import plugins from './generic/plugins';

import { DataSourceConnector } from '../data-sources/DataSourceConnector';
import VisibilityActions from '../actions/VisibilityActions';
import VisibilityStore from '../stores/VisibilityStore';

import ListItemControl from 'react-md/lib/Lists/ListItemControl';
import Checkbox from 'react-md/lib/SelectionControls/Checkbox';

import Button from 'react-md/lib/Buttons/Button';

import { ApolloClient, ApolloProvider, createNetworkInterface } from 'react-apollo';
import { makeExecutableSchema } from 'graphql-tools';
import { typeDefs } from '../apollo/typeDefs';
import { gql, graphql } from 'react-apollo';
import { appId, apiKey } from '../data-sources/plugins/ApplicationInsights/common';

import LineChartQueryRenderer, { ILineChartQueryRendererProps } from '../apollo/components/LineChartQueryRenderer';
import StraightAnglePieChartQueryRenderer, { IStraightAnglePieChartQueryRendererProps } from
  '../apollo/components/StraightAnglePieChartQueryRenderer';
import DropDownQueryRenderer, { IDropDownQueryRendererProps } from '../apollo/components/DropDownQueryRenderer';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

import graphqlResultsTransformUtils from '../utils/graphqlResultsUtils';

const queryLineCharts = gql`
query ($query:String!, $appId:String!, $apiKey:String!) {
  lineCharts(query:$query, appId:$appId, apiKey:$apiKey) {
    seriesData {
      label
      x_values
      y_values
    }
  }
}
`;

const queryChannels = gql`
query ($query:String!, $appId:String!, $apiKey:String!) {
  channels(query:$query, appId:$appId, apiKey:$apiKey) {
    id
    name
  }
}
`;

interface ILineChartQueryResults {
  lineCharts: { seriesData: [{ label: any, x_values: any, y_values: any }] };
}

interface IChannelsQueryResults {
  channels: { ids: any, values: any };
}

interface IQueryRendererWithDataProps {
  query: string;
  id: string;
  title: string;
  subtitle: string;
  dialog: string;
}

const LineChartRendererGQL =
  graphql<ILineChartQueryResults, IQueryRendererWithDataProps, ILineChartQueryRendererProps>(queryLineCharts, {
    options: (ownProps) => { return { variables: { query: ownProps.query, appId, apiKey } }; },
    props: ({ ownProps, data }) => {
      return {
        loading: data.loading,
        error: data.error && data.error.message,
        query: ownProps.query,
        id: ownProps.id,
        results: graphqlResultsTransformUtils.lineChartsDataTransform(data.lineCharts),
        title: ownProps.title,
        subtitle: ownProps.subtitle,
        dialog: ownProps.dialog,
      } as ILineChartQueryRendererProps;
    },
  })(LineChartQueryRenderer);

const StraightAnglePieChartRendererGQL =
  graphql<IQueryResults, IQueryRendererWithDataProps, IStraightAnglePieChartQueryRendererProps>(queryLineCharts, {
    options: (ownProps) => { return { variables: { query: ownProps.query, appId, apiKey } }; },
    props: ({ ownProps, data }) => {
      return {
        loading: data.loading,
        error: data.error && data.error.message,
        query: ownProps.query,
        results: graphqlResultsTransformUtils.pieChartsDataTransform(),
        title: ownProps.title,
        subtitle: ownProps.subtitle,
      } as IStraightAnglePieChartQueryRendererProps;
    },
  })(StraightAnglePieChartQueryRenderer);

const DropDownRendererGQL =
  graphql<IChannelsQueryResults, IQueryRendererWithDataProps, IDropDownQueryRendererProps>(queryChannels, {
    options: (ownProps) => { return { variables: { query: ownProps.query, appId, apiKey } }; },
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

export default class ElementConnectorForGQL {

  static loadGraphqlElementsFromDashboard(visual: IVisualElement[], layout: ILayout[]): React.Component<any, any>[] {
    var types = {
      'LineChart': LineChartRendererGQL,
      'PieData': StraightAnglePieChartRendererGQL,
      'DropDown': DropDownRendererGQL
    };

    var elementsgql = [];
    if (!visual) {
      return elementsgql;
    }

    for (var i = 0; i < visual.length; i++) {
      var ReactElement = types[visual[i].Type];
      var key = '' + i + visual[i].Type;
      elementsgql.push(
        <div key={key}>
          <ReactElement
            query={visual[i].query}
            id={visual[i].id}
            title={visual[i].title}
            subtitle={visual[i].subtitle}
            dialog={visual[i].dialog} />
        </div>
      );
    }

    return elementsgql;
  }
}