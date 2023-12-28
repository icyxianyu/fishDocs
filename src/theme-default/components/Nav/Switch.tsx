import SwitchComponent from 'rc-switch';
import { useEffect, useState } from 'react';

export const Switch = () => {
  let value;
  if (typeof localStorage !== 'undefined') {
    value = localStorage.getItem('theme') === 'dark';
  }
  const [checked, setChecked] = useState(value);

  useEffect(() => {
    onChange(checked);
  }, []);

  const onChange = (checked: boolean) => {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      const classList = document.documentElement.classList;
      setChecked(checked);
      if (checked) {
        classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
    }
  };
  return (
    <SwitchComponent
      onChange={onChange}
      defaultChecked={checked}
      checkedChildren="☀"
      unCheckedChildren="🌙"
    />
  );
};
