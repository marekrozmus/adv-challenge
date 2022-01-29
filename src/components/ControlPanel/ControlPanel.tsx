import React, { useEffect } from 'react';
import { camelCase } from 'lodash';
import {
  Actions,
  ControlPanelBox,
  Content,
  Filters,
  Title,
} from './ControlPanelStyles';

import Selector, { Option } from 'components/Selector';

interface ControlPanelProps {
  dataSources: Array<string>;
  campaigns: Array<string>;
}

const ControlPanel = ({ campaigns, dataSources }: ControlPanelProps) => {
  const [selectedDatasources, setSelectedDatasources] = React.useState<
    Array<string>
  >([]);
  const [selectedCampaigns, setSelectedCampaigns] = React.useState<
    Array<string>
  >([]);

  const [campaignsOptions, setCampaignsOptions] = React.useState<Array<Option>>(
    []
  );
  const [dataSourcesOptions, setDataSourcesOptions] = React.useState<
    Array<Option>
  >([]);

  useEffect(() => {
    const dataSourcesOptions = dataSources.map(name => ({
      label: name,
      value: camelCase(name),
    }));
    setDataSourcesOptions(dataSourcesOptions);
  }, [dataSources]);

  useEffect(() => {
    const campaignsOptions = campaigns.map(name => ({
      label: name,
      value: camelCase(name),
    }));
    setCampaignsOptions(campaignsOptions);
  }, [selectedDatasources, campaigns]);

  const handleDataSourcesChanged = (selectedDataSources: Array<string>) => {
    setSelectedDatasources(selectedDataSources);
  };

  const handleCampaignsChanged = (selectedCampaigns: Array<string>) => {
    setSelectedCampaigns(selectedCampaigns);
  };

  return (
    <ControlPanelBox>
      <Title>Filter dimension values</Title>
      <Content>
        <Filters>
          <Selector
            title="Datasource"
            options={dataSourcesOptions}
            onChange={handleDataSourcesChanged}
          />
          <Selector
            title="Campaign"
            options={campaignsOptions}
            onChange={handleCampaignsChanged}
          />
        </Filters>
        <Actions>
          <button>Apply</button>
        </Actions>
      </Content>
    </ControlPanelBox>
  );
};

export default ControlPanel;
