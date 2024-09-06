'use client';

import CreateableSelect from 'react-select/creatable';
import { SingleValue } from 'react-select';
import { useMemo } from 'react';

type Props = {
  onChange: (value?: string) => void;
  onCreate?: (value: string) => void;
  options?: { label: string; value: string }[];
  value?: string | null | undefined;
  placeholder?: string;
  disabled?: boolean;
};

export const Select = ({
  onChange,
  onCreate,
  options = [],
  value,
  placeholder,
  disabled = false,
}: Props) => {
  const onSelect = (option: SingleValue<{ label: string; value: string }>) => {
    onChange(option?.value);
  };

  const formattedValue = useMemo(() => {
    return options.find((option) => option.value === value);
  }, [options, value]);
  return (
    <CreateableSelect
      placeholder={placeholder}
      className="text-sm h-10"
      options={options}
      value={formattedValue}
      onChange={onSelect}
      onCreateOption={onCreate}
      isDisabled={disabled}
      styles={{
        control: (provided) => ({
          ...provided,
          borderColor: '#e2e8f0',
          ':hover': {
            borderColor: '#e2e8f0',
          },
        }),
      }}
    />
  );
};
