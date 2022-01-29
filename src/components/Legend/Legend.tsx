import React from 'react';
import { LegendBox, ExplanationLabel, SummaryLabel } from './LegendStyles';

const Legend = () => (
  <LegendBox>
    <div>
      - Select zero to N <i>Datasources</i>
    </div>
    <div>
      - Select zero to N <i>Campaigns</i>
    </div>
    <ExplanationLabel>
      (where "zero" means <i>All</i>)
    </ExplanationLabel>
    <SummaryLabel>
      Hitting <i>Apply</i>, filters the chart to show a timeseries for both{' '}
      <i>Clicks</i> and <i>Impressions</i> for given <i>Datasources</i> and{' '}
      <i>Campaigns</i> - logical AND
    </SummaryLabel>
  </LegendBox>
);

export default Legend;
