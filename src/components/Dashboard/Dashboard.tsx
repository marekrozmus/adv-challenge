import React, { useState } from 'react';
import { groupBy, mapValues, get, uniq } from 'lodash';

import ControlPanel from 'components/ControlPanel';
import Chart from 'components/Chart';
import { DashboardContent } from './DashboardStyles';
import {
  composeCampaignTitlePart,
  composeDataSourcesTitlePart,
  prepareChartData,
} from './utils';
import { Data } from 'utils/common';

interface DashboardProps {
  data: Array<Data>;
}

const Dashboard = ({ data }: DashboardProps) => {
  const [selectedCampaigns, setSelectedCampaigns] = useState<Array<string>>([]);
  const [selectedDataSources, setSelectedDataSources] = useState<Array<string>>(
    []
  );

  const groupedData = React.useMemo(() => {
    const groupedByDataSource = groupBy(data, 'Datasource');
    return mapValues(groupedByDataSource, val => groupBy(val, 'Campaign'));
  }, [data]);

  const allDataSources = React.useMemo(
    () => Object.keys(groupedData),
    [groupedData]
  );
  const allCampaigns = React.useMemo(() => {
    const result = allDataSources.reduce((memo, dataSourceKey) => {
      const dataSourceData = get(groupedData, dataSourceKey);
      return memo.concat(Object.keys(dataSourceData));
    }, [] as Array<string>);

    // some campaign names are duplicated between data sources
    return uniq(result);
  }, [groupedData, allDataSources]);

  const dataSourcesToShow =
    selectedDataSources.length > 0 ? selectedDataSources : allDataSources;
  const campaignsToShow =
    selectedCampaigns.length > 0 ? selectedCampaigns : allCampaigns;

  const chartData = React.useMemo(() => {
    // start preparing data when all data is ready
    if (
      groupedData &&
      dataSourcesToShow.length > 0 &&
      campaignsToShow.length > 0
    ) {
      return prepareChartData(groupedData, dataSourcesToShow, campaignsToShow);
    }

    return [];
  }, [groupedData, dataSourcesToShow, campaignsToShow]);

  const handleCampaignsChanged = (selected: Array<string>) =>
    setSelectedCampaigns(selected);
  const handleDataSourcesChanged = (selected: Array<string>) =>
    setSelectedDataSources(selected);

  const composeChartTitle = () =>
    `${composeDataSourcesTitlePart(
      selectedDataSources
    )}; ${composeCampaignTitlePart(selectedCampaigns)}`;

  return (
    <DashboardContent>
      <ControlPanel
        dataSources={allDataSources}
        campaigns={allCampaigns}
        onCampaignsChanged={handleCampaignsChanged}
        onDataSourcesChanged={handleDataSourcesChanged}
      />
      <Chart data={chartData} title={composeChartTitle()} />
    </DashboardContent>
  );
};

export default Dashboard;
