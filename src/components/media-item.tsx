'use client';
import { Checkbox, BackgroundImage, CheckboxProps } from '@mantine/core';
import classes from './media-item.module.css';
import { useState } from 'react';
import { Icons } from './icons';

interface MediaItemProps {
  src: string;
  onCheck: (checked: boolean, value: string) => void;
}

export default function MediaItem({ src, onCheck }: MediaItemProps) {
  const [checked, setChecked] = useState(false);
  const CheckboxIcon: CheckboxProps['icon'] = ({
    indeterminate,
    ...others
  }) => <Icons.trash {...others} />;
  return (
    <div className={classes.root}>
      <Checkbox
        classNames={{
          root: classes.checkboxWrapper,
          input: classes.checkbox,
        }}
        tabIndex={-1}
        size="md"
        color="red.6"
        icon={CheckboxIcon}
        checked={checked}
        onChange={(event) => setChecked(event.currentTarget.checked)}
      />
      <BackgroundImage
        className={classes.control}
        h="128"
        w="100%"
        radius="md"
        src={src}
        data-checked={checked || undefined}
        onClick={() => {
          setChecked((c) => !c);
          onCheck(checked, src);
        }}
      />
    </div>
  );
}
