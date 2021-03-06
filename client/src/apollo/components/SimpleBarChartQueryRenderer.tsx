import * as React from 'react';
import Card from '../../components/Card';
import {BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from
  'recharts';

import dialogActions from '../../components/generic/Dialogs/DialogsActions';

import colors from '../../components/colors';
var { ThemeColors } = colors;

export interface ISimpleBarChartQueryRendererProps {
  results: any;
  dialog: string;
  title: string;
  subtitle: string;
  filterValues: [string];
  filterKey: string;
}

export default class SimpleBarChartQueryRenderer extends
  React.PureComponent<ISimpleBarChartQueryRendererProps, any> {

    constructor(props: any) {
    super(props);

    this.onDialogOpen = this.onDialogOpen.bind(this);
  }
 
  onDialogOpen(filterValues: any) {
    var dialogId = this.props.dialog;
    if (!dialogId) {
      return;
    }
    
    var customTitle = 'More info on \'' + filterValues + '\'';
    dialogActions.openDialog(
      dialogId, {
        title: customTitle, keyToFilterOn: this.props.filterKey, valuesToFilterOn: filterValues
      });
  }

  shouldComponentUpdate(nextProps: any, nextState: any) {
    return !nextProps.loading;
  }

  // This method extracts from the data all the unique series names. not efficient at the moment
  // and should be updated
  naiveGetAllDifferentBars(data: any) {
    var bars = [];
    var saw = [];
    var ind = 0;
    for (var i = 0; i < data.length; i++) {
      for (var key in data[i]) {
        if (data[i].hasOwnProperty(key)) {
          if (!saw[key] && key !== 'name') {
            saw[key] = {};

            bars.push(
              <Bar
                onClick={this.onDialogOpen.bind(this, key)}
                key={'bar' + i + key}
                dataKey={key}
                fill={ThemeColors[ind % ThemeColors.length]} />
            );
            ind++;
          }
        }
      }
    }

    return bars;
  }

  render() {
    var bars = this.naiveGetAllDifferentBars(this.props.results);

    return (
      <div className="SimpleBarChartQueryRenderer">
        <Card title={this.props.title} subtitle={this.props.subtitle}>
          <ResponsiveContainer minHeight={300}>
            <BarChart width={600} height={300} data={this.props.results}
            margin={{top: 5, right: 30, left: 20, bottom: 5}}>
       <XAxis dataKey="name"/>
       <YAxis/>
       <CartesianGrid strokeDasharray="3 3"/>
       <Tooltip/>
       <Legend />
       {bars}
      </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    );
  }
}