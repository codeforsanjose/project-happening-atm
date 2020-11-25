import React from 'react'
import { UncheckedCheckboxIcon, CheckedCheckboxIcon } from '../../utils/_icons'
export default function CustomCheckbox(props) {
  const { checked } = props
  return (
    <div>{checked ? <CheckedCheckboxIcon /> : <UncheckedCheckboxIcon />}</div>
  )
}
