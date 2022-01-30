import { fireEvent, render, screen } from '@testing-library/react';

import Selector from './Selector';

const setup = ({
  title = '',
  onChange = jest.fn(),
}: {
  title?: string;
  onChange?: () => void;
}) => {
  render(
    <Selector
      id="test"
      placeholder="test_placeholder"
      title={title}
      options={[{ value: 'value', label: 'name' }]}
      onChange={onChange}
    />
  );
};

describe('Selector component', () => {
  it('Should render title', () => {
    const testTitle = 'Test title';
    setup({ title: testTitle });

    expect(screen.getByText(testTitle)).toBeInTheDocument();
  });

  it('Should call onChange method with list of names', async () => {
    const onChangeMock = jest.fn();
    const testTitle = 'Test title';
    setup({ onChange: onChangeMock, title: testTitle });

    const selectField = screen.getByLabelText(testTitle);
    fireEvent.keyDown(selectField, { key: 'ArrowDown' });
    const optionItem = await screen.findByText('name');
    fireEvent.click(optionItem);

    expect(onChangeMock).toHaveBeenCalledTimes(1);
    expect(onChangeMock).toHaveBeenLastCalledWith(['name']);
  });

  it('Should call onChange with empty list when clear button is clicked', async () => {
    const onChangeMock = jest.fn();
    const testTitle = 'Test title';
    setup({ onChange: onChangeMock, title: testTitle });

    const selectField = screen.getByLabelText(testTitle);
    fireEvent.keyDown(selectField, { key: 'ArrowDown' });
    const optionItem = await screen.findByText('name');
    fireEvent.click(optionItem);

    expect(onChangeMock).toHaveBeenCalledTimes(1);
    expect(onChangeMock).toHaveBeenLastCalledWith(['name']);

    const clearButton = screen.getByRole('button', {
      name: /clear selection/i,
    });
    fireEvent.click(clearButton);

    expect(onChangeMock).toHaveBeenCalledTimes(2);
    expect(onChangeMock).toHaveBeenLastCalledWith([]);
  });
});
