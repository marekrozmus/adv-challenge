import React from 'react';
import {
  Label,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

import { ChartBox } from './ChartStyles';

const data = [
  {
    name: 'Page A',
    uv: 4000,
    pv: 2400,
  },
  {
    name: 'Page B',
    uv: 3000,
    pv: 1398,
  },
  {
    name: 'Page C',
    uv: 2000,
    pv: 9800,
  },
  {
    name: 'Page D',
    uv: 2780,
    pv: 3908,
  },
  {
    name: 'Page E',
    uv: 1890,
    pv: 4800,
  },
  {
    name: 'Page F',
    uv: 2390,
    pv: 3800,
  },
  {
    name: 'Page G',
    uv: 3490,
    pv: 4300,
  },
];

export type ChartData = {
  date: string;
  clicks: number;
  impressions: number;
};

interface ChartProps {
  data: Array<ChartData>;
}

const Chart = ({ data }: ChartProps) => (
  <ChartBox>
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        width={500}
        height={300}
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis yAxisId="left">
          <Label value="Clicks" angle={-90} position="insideLeft" dy={20} />
        </YAxis>
        <YAxis yAxisId="right" orientation="right">
          <Label
            value="Impressions"
            angle={-90}
            position="insideRight"
            dy={-30}
          />
        </YAxis>
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="clicks"
          stroke="#8884d8"
          activeDot={{ r: 8 }}
          yAxisId="left"
        />
        <Line
          type="monotone"
          dataKey="impressions"
          stroke="#82ca9d"
          yAxisId="right"
        />
      </LineChart>
    </ResponsiveContainer>
  </ChartBox>
);

export default Chart;
