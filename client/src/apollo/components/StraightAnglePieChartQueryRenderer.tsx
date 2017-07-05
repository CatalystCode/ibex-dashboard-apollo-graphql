import * as React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Pie, PieChart } from
  'recharts';

export interface IStraightAnglePieChartQueryRendererProps {
  results: any;
}

export default class StraightAnglePieChartQueryRenderer extends
  React.PureComponent<IStraightAnglePieChartQueryRendererProps, void> {
  render() {
    const data = [{ name: 'Group A', value: 400 }, { name: 'Group B', value: 300 },
    { name: 'Group C', value: 300 }, { name: 'Group D', value: 200 },
    { name: 'Group E', value: 278 }, { name: 'Group F', value: 189 }];

    return (
      <div className="StraightAnglePieChartQueryRenderer">
        <PieChart width={800} height={400}>
          <Pie startAngle={180} endAngle={0} data={data} cx={200} cy={200} outerRadius={80} fill="#8884d8" label />
        </PieChart>
      </div>
    );
  }
}