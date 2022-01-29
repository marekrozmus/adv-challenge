import React from 'react';
import Select, { SelectInstance, MultiValue } from 'react-select';
import { BsCircleHalf, BsArrowCounterclockwise } from 'react-icons/bs';

import { ActionButton, Title, TitleWithActions } from './SelectorStyles';

export type Option = {
  label: string;
  value: string;
};

interface SelectorProps {
  placeholder: string;
  options: Array<Option>;
  title: string;
  onChange: (option: Array<string>) => void;
}

const Selector = ({ options, placeholder, onChange, title }: SelectorProps) => {
  const [disabled, setDisabled] = React.useState(false);
  const selectRef = React.useRef<SelectInstance<Option, true>>(null);
  const handleToggleSelectorClicked = () => setDisabled(!disabled);
  const handleResetClicked = () => {
    onChange([]);
    selectRef?.current?.clearValue();
  };
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
        ref={selectRef}
        isDisabled={disabled}
        isMulti
        options={options}
        placeholder={placeholder}
        onChange={handleSelectionChanged}
        isClearable={false}
      />
    </>
  );
};

export default Selector;
