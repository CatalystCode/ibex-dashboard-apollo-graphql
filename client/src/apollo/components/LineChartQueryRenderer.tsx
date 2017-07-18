import * as React from 'react';
import Card from '../../components/Card';
import * as moment from 'moment';

import filterStore from '../../stores/FilterStore';
import dialogActions from '../../components/generic/Dialogs/DialogsActions';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

import colors from '../../components/colors';
var { ThemeColors } = colors;

export interface ILineChartQueryRendererProps {
  results: any;
  dialog: string;
  filter: string;
  title: string;
  subtitle: string;
  id: string;
}

export default class LineChartQueryRenderer extends React.PureComponent<ILineChartQueryRendererProps, any> {

  constructor(props: any) {
    super(props);

    this.state = {channels: []};
    filterStore.listen((state) => {
      var channelsArray = state.filterState[this.props.filter];
      if (channelsArray) {
        this.setState({channels: channelsArray});
      }
    });

    this.onDialogOpen = this.onDialogOpen.bind(this);
  }

  dateFormat(time: string) {
    return moment(time).format('MMM-DD');
  }

  hourFormat(time: string) {
    return moment(time).format('HH:mm');
  }

  onDialogOpen() {
    var dialogId = this.props.dialog;
    if (!dialogId) {
      return;
    }

    dialogActions.openDialog(dialogId, {});

    // this.setState({ dialogId });
  }

  // This method extracts from the data all the unique series names. not efficient at the moment
  // and should be updated
  naiveGetAllDifferentLines(data: any, channels: any[]) {
    var lines = [];
    var saw = [];
    var ind = 0;
    for (var i = 0; i < data.length; i++) {
      for (var key in data[i]) {
        if (data[i].hasOwnProperty(key)) {
          if ((channels.find((x) => { return x === key; }) == undefined) && (this.props.filter)) {
            continue;
          }

          if (!saw[key] && key !== 'name') {
            saw[key] = {};

            lines.push(
              <Line type="monotone"
                dataKey={key}
                key={'line' + i + key}
                stroke={ThemeColors[ind % ThemeColors.length]}
                dot={false}
                ticksCount={5}
              />
            );
            ind++;
          }
        }
      }
    }

    return lines;
  }

  render() {
    
    const { channels } = this.state;
    var format = this.dateFormat;
    var lines = this.naiveGetAllDifferentLines(this.props.results, channels);

    return (
      <div className="LineChartQueryRenderer">
        <Card title={this.props.title} subtitle={this.props.subtitle}>
          <ResponsiveContainer minHeight={300}>
            <LineChart id={this.props.id} data={this.props.results} onClick={this.onDialogOpen}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <XAxis dataKey="name" tickFormatter={format} minTickGap={20} />
              <YAxis type="number" domain={['dataMin', 'dataMax']} />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Legend />
              {lines}
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>
    );
  }
}