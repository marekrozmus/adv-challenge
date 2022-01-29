import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';
import { uniq, groupBy, mapValues, get } from 'lodash';

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
  const [campaigns, setCampaigns] = React.useState<Array<string>>([]);
  const [dataSources, setDataSources] = React.useState<Array<string>>([]);
  const [chartData, setChartData] = React.useState<Array<ChartData>>([]);

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
    setDataSources(uniq(data.map(item => item.Datasource)));
    setCampaigns(uniq(data.map(item => item.Campaign)));
    console.log(data);
    console.log(groupBy(data, 'Datasource'));
    const grouped = groupBy(data, 'Datasource');
    const doubleGrouped = mapValues(grouped, val => groupBy(val, 'Campaign'));
    console.log(doubleGrouped);

    if (data.length) {
      // console.log(doubleGrouped['Facebook Ads']['Like Ads']);
      // console.log(get(doubleGrouped, ['Facebook Ads', 'Like Ads']));

      // console.log(
      //   getByDataSourceAndCampaign(doubleGrouped, 'Facebook Ads', 'Like Ads')
      // );
      // console.log(
      //   getByDataSourceAndCampaign(
      //     doubleGrouped,
      //     'Facebook Ads',
      //     'Offer Messenger Campaigns'
      //   )
      // );
      const set1 = getByDataSourceAndCampaign(
        doubleGrouped,
        'Facebook Ads',
        'Offer Messenger Campaigns'
      );
      const set2 = getByDataSourceAndCampaign(
        doubleGrouped,
        'Facebook Ads',
        '60 Second 13032019'
      );

      console.log('SETY', set1, set2);
      console.log(groupBy([...set1, ...set2], 'Date'));

      // we got two tables:
      // ds: ['Facebook Ads', 'Google Adwords']
      // campaigns: ['Offer Messenger Campaigns', '60 Second 13032019', 'GDN - Pocus Push']
      const inputDataSources = ['Facebook Ads', 'Google Adwords'];
      const inputCampaigns = [
        'Offer Messenger Campaigns',
        '60 Second 13032019',
        'GDN - Pocus Push',
      ];

      // weź wszystko co leży pod tymi scieżkam i wrzuć do jednej tablicy
      // potem groupBy 'Date'
      // dla każdej daty pododawaj wszystkie kliki i impresje

      let filteredData = [];

      for (let i = 0; i < inputDataSources.length; i++) {
        for (let j = 0; j < inputCampaigns.length; j++) {
          const data = getByDataSourceAndCampaign(
            doubleGrouped,
            inputDataSources[i],
            inputCampaigns[j]
          );
          if (data) {
            filteredData.push(data);
          }
        }
      }

      const filteredDataFlatten = filteredData.flat();

      const filteredDataGroupedByDate = groupBy(filteredDataFlatten, 'Date');

      console.log(filteredDataGroupedByDate);

      const dataForChart = Object.keys(filteredDataGroupedByDate).reduce(
        (memo, date) => {
          // filteredDataGroupedByDate[date]
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

      console.log('???', dataForChart);

      setChartData(dataForChart);

      // we want to have object { Date: '', Clicks: 0, Impressions: 0 }
      // const result = inputDataSources.reduce((memo, dataSource) => {
      //   const resultInner = inputCampaigns.reduce((memo, campaign) => {
      //     const set = getByDataSourceAndCampaign(
      //       doubleGrouped,
      //       dataSource,
      //       campaign
      //     );

      //     return memo;
      //   }, {});
      // }, {});
    }
  }, [data]);

  ///// UTILS
  const getByDataSourceAndCampaign = (
    dataGroupedByDataSourceAndCampaign: object,
    dataSource: string,
    campaign: string
  ): Array<{ Date: string; Clicks: number; Impressions: number }> => {
    return get(dataGroupedByDataSourceAndCampaign, [dataSource, campaign]);
  };

  //////////////

  const onCompleteParsing = (results: Papa.ParseResult<Data>) => {
    const { data, errors } = results;
    if (errors.length) {
      console.error('Parsing error', errors); // jakoś obłużyć
    }
    setData(data);
  };

  const fetchCsv = async () =>
    fetch(process.env.PUBLIC_URL + '/data/data.csv').then(response =>
      response.text()
    );

  // selected data sources
  // selected campaigns

  // we need: clicks, impressions and time span?

  return (
    <DashboardContent>
      <ControlPanel dataSources={dataSources} campaigns={campaigns} />
      <Chart data={chartData} />
    </DashboardContent>
  );
};

export default Dashboard;
