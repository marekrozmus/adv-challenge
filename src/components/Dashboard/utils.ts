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
