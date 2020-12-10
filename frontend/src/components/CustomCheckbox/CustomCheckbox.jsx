import React from 'react';
import './CustomCheckbox.scss';
import { UncheckedCheckboxIcon, CheckedCheckboxIcon } from '../../utils/_icons';

export default function CustomCheckbox({
  checked,
  onClick,
}) {
  return (
    <div className="checkbox">
      { checked
        ? <CheckedCheckboxIcon onClick={onClick} />
        : <UncheckedCheckboxIcon onClick={onClick} />}
    </div>
  );
}
