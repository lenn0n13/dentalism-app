import React from 'react'
import DatePicker from "react-datepicker";

const FormDatePicker = (props: any) => {

  const {
    name,
    value,
    onDateChange,
    label,
    isDisabled,
    className,
    labelClassName
  } = props

  return (
    <div className='w-full'>
      <div className="block">
        <label className={labelClassName}
          htmlFor={name + '_unique_id'}
        >{label}
        </label>
      </div>
      <DatePicker
        className={className}
        disabled={isDisabled}
        selected={value}
        popperPlacement='left'
        // onSelect={handleDateSelect} //when day is clicked
        onChange={onDateChange} //only when value has changed
      />
    </div>
  )
}

export default FormDatePicker