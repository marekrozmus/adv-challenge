import { get, groupBy } from 'lodash';

import { ChartData } from 'components/Chart';

const composeTitlePart = (data: Array<String>, prefix: string) => {
  const [first, second, ...rest] = data;

  let result = `${prefix} '${first}'`;
  if (second) {
    result += ` and '${second}'`;
  }

  if (rest.length) {
    result += ` and ${rest.length} more`;
  }

  return result;
};

export const composeDataSourcesTitlePart = (dataSources: Array<string>) => {
  if (dataSources.length === 0) {
    return 'All Data Sources';
  }

  return composeTitlePart(dataSources, 'Datasources');
};

export const composeCampaignTitlePart = (campaigns: Array<string>) => {
  if (campaigns.length === 0) {
    return 'All Campaigns';
  }

  return composeTitlePart(campaigns, 'Campaigns');
};

export const getMetricsByDataSourceAndCampaign = (
  dataGroupedByDataSourceAndCampaign: object,
  dataSource: string,
  campaign: string
): Array<{ Date: string; Clicks: number; Impressions: number }> =>
  get(dataGroupedByDataSourceAndCampaign, [dataSource, campaign]);

export const prepareChartData = (
  groupedData: {},
  selectedDataSources: Array<string>,
  selectedCampaigns: Array<string>
) => {
  const filteredData = [];

  console.log('cooking chart data...');

  for (let i = 0; i < selectedDataSources.length; i++) {
    for (let j = 0; j < selectedCampaigns.length; j++) {
      const data = getMetricsByDataSourceAndCampaign(
        groupedData,
        selectedDataSources[i],
        selectedCampaigns[j]
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

  return dataForChart;
};
