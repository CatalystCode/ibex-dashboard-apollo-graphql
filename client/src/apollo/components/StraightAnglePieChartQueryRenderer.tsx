import * as React from 'react';
import Card from '../../components/Card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Pie, PieChart } from
  'recharts';

export interface IStraightAnglePieChartQueryRendererProps {
  results: any;
  title: string;
  subtitle: string;
}

export default class StraightAnglePieChartQueryRenderer extends
  React.PureComponent<IStraightAnglePieChartQueryRendererProps, void> {
  render() {
    return (
      <div className="StraightAnglePieChartQueryRenderer">
        <Card title={this.props.title} subtitle={this.props.subtitle}>
          <ResponsiveContainer minHeight={300}>
            <PieChart width={800} height={400}>
              <Pie startAngle={180} endAngle={0} data={this.props.results} cx={200} cy={200} outerRadius={80} fill="#8884d8" label />
              <Legend layout="vertical" align="right" verticalAlign="top" wrapperStyle={{ right: 5 }} />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>
    );
  }
}