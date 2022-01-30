import {
  composeCampaignTitlePart,
  composeDataSourcesTitlePart,
  prepareChartData,
} from './utils';

describe('Dashboard utils', () => {
  describe('Title part for data sources', () => {
    it('should compose "All Data Sources" when input list is empty', () => {
      const result = composeDataSourcesTitlePart([]);
      expect(result).toEqual('All Data Sources');
    });

    it('should compose correct title when input list has one item', () => {
      const result = composeDataSourcesTitlePart(['one']);
      expect(result).toEqual("Datasources 'one'");
    });

    it('should compose correct title when input list has two items', () => {
      const result = composeDataSourcesTitlePart(['one', 'two']);
      expect(result).toEqual("Datasources 'one' and 'two'");
    });

    it('should compose correct title when input list has more than two items', () => {
      const result = composeDataSourcesTitlePart(['one', 'two', 'three']);
      expect(result).toEqual("Datasources 'one' and 'two' and 1 more");
    });
  });

  describe('Title part for campaigns', () => {
    it.each([
      [[], 'All Campaigns'],
      [['one'], "Campaigns 'one'"],
      [['one', 'two'], "Campaigns 'one' and 'two'"],
      [['one', 'two', 'three'], "Campaigns 'one' and 'two' and 1 more"],
    ])('should compose correct title for %s', (input, expected) => {
      const result = composeCampaignTitlePart(input);
      expect(result).toEqual(expected);
    });
  });

  describe('Test chart data preparation', () => {
    it('should return correct data', () => {
      const selectedDataSources = ['source 1'];
      const selectedCampaigns = ['campaign 1'];
      const metricsData = { Date: '1', Clicks: 1, Impressions: 1 };
      const otherMetricsData = { Date: '2', Clicks: 0, Impressions: 0 };

      const data = {
        'source 1': {
          'campaign 1': [metricsData],
          'campaign 2': [otherMetricsData],
        },
        'source 2': {
          'campaign 1': [otherMetricsData],
        },
      };

      const result = prepareChartData(
        data,
        selectedDataSources,
        selectedCampaigns
      );
      expect(result).toEqual([
        {
          date: metricsData.Date,
          clicks: metricsData.Clicks,
          impressions: metricsData.Impressions,
        },
      ]);
    });

    it('should sum clicks and impressions from same date', () => {
      const selectedDataSources = ['source 1'];
      const selectedCampaigns = ['campaign 1', 'campaign 2'];
      const metricsData = { Date: '1', Clicks: 1, Impressions: 1 };
      const otherMetricsData = { Date: '2', Clicks: 42, Impressions: 42 };

      const data = {
        'source 1': {
          'campaign 1': [metricsData],
          'campaign 2': [otherMetricsData, metricsData],
        },
        'source 2': {
          'campaign 1': [otherMetricsData],
        },
      };

      const result = prepareChartData(
        data,
        selectedDataSources,
        selectedCampaigns
      );
      expect(result).toEqual([
        {
          date: metricsData.Date,
          clicks: 2,
          impressions: 2,
        },
        {
          date: otherMetricsData.Date,
          clicks: 42,
          impressions: 42,
        },
      ]);
    });
  });
});
