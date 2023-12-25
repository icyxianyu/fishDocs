import SwitchComponent from 'rc-switch';
import { useEffect, useState } from 'react';

export const Switch = () => {
  const classList = document.documentElement.classList;

  const [checked, setChecked] = useState(
    localStorage.getItem('theme') === 'dark'
  );

  useEffect(() => {
    onChange(checked);
  }, []);

  const onChange = (checked: boolean) => {
    setChecked(checked);
    if (checked) {
      classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };
  return (
    <SwitchComponent
      onChange={onChange}
      defaultChecked={checked}
      checkedChildren="开"
      unCheckedChildren="关"
    />
  );
};
