import React from 'react';
import Select, { MultiValue } from 'react-select';
import { BsCircleHalf, BsArrowCounterclockwise } from 'react-icons/bs';

import { ActionButton, Title, TitleWithActions } from './SelectorStyles';

export type Option = {
  label: string;
  value: string;
};

interface SelectorProps {
  options: Array<Option>;
  title: string;
  onChange: (option: Array<string>) => void;
}

const Selector = ({ options, onChange, title }: SelectorProps) => {
  const [disabled, setDisabled] = React.useState(false);

  const handleToggleSelectorClicked = () => setDisabled(!disabled);
  const handleResetClicked = () => {};
  const handleSelectionChanged = (selected: MultiValue<Option>) => {
    onChange(selected.map(({ label }) => label));
  };

  return (
    <>
      <TitleWithActions>
        <Title>{title}</Title>
        <ActionButton onClick={handleToggleSelectorClicked}>
          <BsCircleHalf />
        </ActionButton>
        <ActionButton onClick={handleResetClicked}>
          <BsArrowCounterclockwise />
        </ActionButton>
      </TitleWithActions>
      <Select
        isDisabled={disabled}
        options={options}
        isMulti
        onChange={handleSelectionChanged}
      />
    </>
  );
};

export default Selector;
