import { useState, useRef } from 'react';
import { Combobox, InputBase, Loader, useCombobox } from '@mantine/core';
import { useUncontrolled, useDebouncedValue } from '@mantine/hooks';

import { ApiResponse, Breed } from '@/types';
import axios from '@/lib/axios';
import { useQuery } from '@tanstack/react-query';

interface DogBreedSelectProps {
  withAsterisk?: boolean;
  label?: string;
  placeholder?: string;
  value?: string;
  error?: React.ReactNode;
  onChange?: (value: string | null) => void;
}

function useGetBreeds(query: string) {
  return useQuery<Breed[]>({
    queryKey: ['breeds', query],
    queryFn: ({ signal }) =>
      axios
        .get<ApiResponse<Breed[]>>(`/pets/breeds?name=${query}`, { signal })
        .then((res) => {
          const breeds = res.data.data;
          return breeds;
        }),
    enabled: !!query,
    staleTime: Infinity,
  });
}

export default function DogBreedSelect(props: DogBreedSelectProps) {
  const { withAsterisk, label, placeholder, value, error, onChange } = props;

  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  const [_value, setValue] = useUncontrolled({
    value,
    onChange,
  });

  const [search, setSearch] = useState(value);

  const [debounced] = useDebouncedValue(search, 500);

  const { data, isFetching } = useGetBreeds(debounced || '');

  const options = (data || []).map((breed) => (
    <Combobox.Option value={breed.name} key={breed.id}>
      {breed.name}
    </Combobox.Option>
  ));

  return (
    <Combobox
      store={combobox}
      withinPortal={false}
      onOptionSubmit={(val) => {
        setValue(val);
        setSearch(val);
        combobox.closeDropdown();
      }}
    >
      <Combobox.Target>
        <InputBase
          withAsterisk={withAsterisk}
          label={label}
          placeholder={placeholder}
          error={error}
          rightSection={
            isFetching ? <Loader size={18} /> : <Combobox.Chevron />
          }
          value={search || _value}
          onChange={(event) => {
            combobox.openDropdown();
            combobox.updateSelectedOptionIndex();
            setSearch(event.currentTarget.value);
          }}
          onClick={() => combobox.openDropdown()}
          onFocus={() => combobox.openDropdown()}
          onBlur={() => {
            combobox.closeDropdown();
            setSearch(_value || '');
          }}
          rightSectionPointerEvents="none"
        />
      </Combobox.Target>

      <Combobox.Dropdown hidden={data === undefined}>
        <Combobox.Options mah={200} style={{ overflowY: 'auto' }}>
          {options.length > 0 ? (
            options
          ) : (
            <Combobox.Empty>Nothing found</Combobox.Empty>
          )}
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
}
