import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';
import { groupBy, mapValues, get } from 'lodash';

import ControlPanel from 'components/ControlPanel';
import Chart, { ChartData } from 'components/Chart';
import { DashboardContent } from './DashboardStyles';

type Data = {
  Date: string;
  Datasource: string;
  Campaign: string;
  Clicks: number;
  Impressions: number;
};

const Dashboard = () => {
  const [data, setData] = useState<Array<Data>>([]);
  const [groupedData, setGroupedData] = useState({});
  const [dataSources, setDataSources] = useState<Array<string>>([]);
  const [selectedDataSources, setSelectedDataSources] = useState<Array<string>>(
    []
  );
  const [campaigns, setCampaigns] = useState<Array<string>>([]);
  const [selectedCampaigns, setSelectedCampaigns] = useState<Array<string>>([]);
  const [chartData, setChartData] = useState<Array<ChartData>>([]);

  useEffect(() => {
    const prepareData = async () => {
      const csvData = await fetchCsv();
      if (csvData) {
        Papa.parse(csvData, {
          dynamicTyping: true,
          header: true,
          complete: onCompleteParsing,
          worker: true,
        });
      }
    };

    prepareData();
  }, []);

  useEffect(() => {
    const groupedByDataSource = groupBy(data, 'Datasource');
    const groupedByDataSourceAndCampaign = mapValues(groupedByDataSource, val =>
      groupBy(val, 'Campaign')
    );
    setGroupedData(groupedByDataSourceAndCampaign);
  }, [data]);

  useEffect(() => {
    const dataSources = Object.keys(groupedData);
    setDataSources(Object.keys(groupedData));

    // should we show only campaigns that are for selected data sources?
    const campaigns = dataSources.reduce((memo, dataSourceKey) => {
      const dataSourceData = get(groupedData, dataSourceKey);
      return memo.concat(Object.keys(dataSourceData));
    }, [] as Array<string>);

    setCampaigns(campaigns);
  }, [groupedData]);

  useEffect(() => {
    const filteredData = [];
    const dataSourcesToShow =
      selectedDataSources.length > 0 ? selectedDataSources : dataSources;
    const campaignsToShow =
      selectedCampaigns.length > 0 ? selectedCampaigns : campaigns;

    for (let i = 0; i < dataSourcesToShow.length; i++) {
      for (let j = 0; j < campaignsToShow.length; j++) {
        const data = getByDataSourceAndCampaign(
          groupedData,
          dataSourcesToShow[i],
          campaignsToShow[j]
        );
        if (data) {
          filteredData.push(data);
        }
      }
    }

    const filteredDataFlatten = filteredData.flat();
    const filteredDataGroupedByDate = groupBy(filteredDataFlatten, 'Date');

    const dataForChart = Object.keys(filteredDataGroupedByDate).reduce(
      (memo, date) => {
        memo.push({
          date,
          clicks: filteredDataGroupedByDate[date].reduce(
            (sum, value) => sum + value.Clicks,
            0
          ),
          impressions: filteredDataGroupedByDate[date].reduce(
            (sum, value) => sum + value.Impressions,
            0
          ),
        });

        return memo;
      },
      [] as Array<ChartData>
    );

    setChartData(dataForChart);
  }, [selectedDataSources, selectedCampaigns, groupedData]);

  const getByDataSourceAndCampaign = (
    dataGroupedByDataSourceAndCampaign: object,
    dataSource: string,
    campaign: string
  ): Array<{ Date: string; Clicks: number; Impressions: number }> => {
    return get(dataGroupedByDataSourceAndCampaign, [dataSource, campaign]);
  };

  const onCompleteParsing = (results: Papa.ParseResult<Data>) => {
    const { data, errors } = results;
    if (errors.length) {
      // not in scope of this task
      console.error('Parsing error', errors);
    }
    setData(data);
  };

  const fetchCsv = async () =>
    fetch(process.env.PUBLIC_URL + '/data/data.csv').then(response =>
      response.text()
    );

  const handleCampaignsChanged = (selected: Array<string>) =>
    setSelectedCampaigns(selected);
  const handleDataSourcesChanged = (selected: Array<string>) =>
    setSelectedDataSources(selected);

  return (
    <DashboardContent>
      <ControlPanel
        dataSources={dataSources}
        campaigns={campaigns}
        onCampaignsChanged={handleCampaignsChanged}
        onDataSourcesChanged={handleDataSourcesChanged}
      />
      <Chart data={chartData} />
    </DashboardContent>
  );
};

export default Dashboard;
