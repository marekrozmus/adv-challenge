import { fireEvent, render, screen } from '@testing-library/react';

import ControlPanel from './ControlPanel';

const setup = ({
  campaigns = ['a', 'b', 'c'],
  dataSources = ['1', '2', '3'],
  onCampaignsChanged = jest.fn(),
  onDataSourcesChanged = jest.fn(),
}: {
  campaigns?: Array<string>;
  dataSources?: Array<string>;
  onCampaignsChanged?: () => void;
  onDataSourcesChanged?: () => void;
} = {}) => {
  render(
    <ControlPanel
      dataSources={['1', '2', '3']}
      campaigns={['a', 'b', 'c']}
      onCampaignsChanged={onCampaignsChanged}
      onDataSourcesChanged={onDataSourcesChanged}
    />
  );
};

describe('ControlPanel component', () => {
  it('should have Apply button disabled if nothing was changed', () => {
    setup();

    const applyButton = screen.getByRole('button', { name: /apply/i });
    expect(applyButton).toBeDisabled();
  });

  it('should have Apply button enabled if something was changed', async () => {
    setup();

    const applyButton = screen.getByRole('button', { name: /apply/i });
    expect(applyButton).toBeDisabled();

    const selectField = screen.getByLabelText('Datasource');
    fireEvent.keyDown(selectField, { key: 'ArrowDown' });
    const optionItem = await screen.findByText('1');
    fireEvent.click(optionItem);

    expect(applyButton).not.toBeDisabled();
  });

  it('should trigger onChange handlers when Apply button clicked', async () => {
    const onCampaignsChangedMock = jest.fn();
    const onDataSourcesChangedMock = jest.fn();
    setup({
      onCampaignsChanged: onCampaignsChangedMock,
      onDataSourcesChanged: onDataSourcesChangedMock,
    });

    const applyButton = screen.getByRole('button', { name: /apply/i });
    expect(applyButton).toBeDisabled();

    const selectField = screen.getByLabelText('Datasource');
    fireEvent.keyDown(selectField, { key: 'ArrowDown' });
    const optionItem = await screen.findByText('1');
    fireEvent.click(optionItem);

    expect(onCampaignsChangedMock).toHaveBeenCalledTimes(0);
    expect(onDataSourcesChangedMock).toHaveBeenCalledTimes(0);

    fireEvent.click(applyButton);

    expect(onCampaignsChangedMock).toHaveBeenCalledTimes(1);
    expect(onDataSourcesChangedMock).toHaveBeenCalledTimes(1);
  });
});
