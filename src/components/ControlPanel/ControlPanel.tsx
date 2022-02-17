import React, { useState } from 'react';
import { camelCase } from 'lodash';
import {
  Actions,
  ControlPanelBox,
  Content,
  Filters,
  Title,
} from './ControlPanelStyles';

import Selector from 'components/Selector';

interface ControlPanelProps {
  dataSources: Array<string>;
  campaigns: Array<string>;
  onCampaignsChanged: (campaigns: Array<string>) => void;
  onDataSourcesChanged: (dataSources: Array<string>) => void;
}

const prepareSelectData = (source: Array<string>) =>
  source.map(name => ({
    label: name,
    value: camelCase(name),
  }));

const ControlPanel = ({
  campaigns,
  dataSources,
  onCampaignsChanged,
  onDataSourcesChanged,
}: ControlPanelProps) => {
  const [applied, setApplied] = useState(true);
  const [selectedCampaigns, setSelectedCampaigns] = useState<Array<string>>([]);
  const [selectedDataSources, setSelectedDataSources] = useState<Array<string>>(
    []
  );

  const campaignsOptions = React.useMemo(
    () => prepareSelectData(campaigns),
    [campaigns]
  );
  const dataSourcesOptions = React.useMemo(
    () => prepareSelectData(dataSources),
    [dataSources]
  );

  const handleDataSourcesChanged = (selectedDataSources: Array<string>) => {
    setSelectedDataSources(selectedDataSources);
    setApplied(false);
  };

  const handleCampaignsChanged = (selectedCampaigns: Array<string>) => {
    setSelectedCampaigns(selectedCampaigns);
    setApplied(false);
  };

  const handleApplyClicked = () => {
    onDataSourcesChanged(selectedDataSources);
    onCampaignsChanged(selectedCampaigns);
    setApplied(true);
  };

  return (
    <ControlPanelBox>
      <Title>Filter dimension values</Title>
      <Content>
        <Filters>
          <Selector
            id="datasource"
            placeholder="All data sources"
            title="Datasource"
            options={dataSourcesOptions}
            onChange={handleDataSourcesChanged}
          />
          <Selector
            id="campaign"
            placeholder="All campaigns"
            title="Campaign"
            options={campaignsOptions}
            onChange={handleCampaignsChanged}
          />
        </Filters>
        <Actions>
          <button disabled={applied} onClick={handleApplyClicked}>
            Apply
          </button>
        </Actions>
      </Content>
    </ControlPanelBox>
  );
};

export default ControlPanel;
