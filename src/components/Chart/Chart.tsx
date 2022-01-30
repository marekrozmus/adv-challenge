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

import { ChartBox, ChartWrapper, Title } from './ChartStyles';

export type ChartData = {
  date: string;
  clicks: number;
  impressions: number;
};

interface ChartProps {
  data: Array<ChartData>;
  title?: string;
}

const Chart = ({ data, title }: ChartProps) => (
  <ChartBox>
    {title && <Title>{title}</Title>}
    <ChartWrapper>
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
    </ChartWrapper>
  </ChartBox>
);

export default Chart;
