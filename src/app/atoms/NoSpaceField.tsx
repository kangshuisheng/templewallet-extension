import React, { ComponentProps, forwardRef, useCallback } from 'react';

import { FormField } from './FormField';

type NoSpaceFieldProps = ComponentProps<typeof FormField> & {
  value?: string;
  onChange?: (v: string) => void;
};

export const NoSpaceField = forwardRef<HTMLTextAreaElement, NoSpaceFieldProps>(({ value, onChange, ...rest }, ref) => {
  const format = useCallback((val: string) => val.replace(/\s/g, ''), []);

  const handleChange = useCallback(
    (evt: React.ChangeEvent<HTMLInputElement> & React.ChangeEvent<HTMLTextAreaElement>) => {
      const formatted = format(evt.target.value);
      if (onChange) {
        onChange(formatted);
      }
    },
    [format, onChange]
  );

  return <FormField ref={ref} value={value} onChange={handleChange} {...rest} />;
});
