import React, { forwardRef } from 'react'

const Input = forwardRef((props: any, ref: any) => {
  const {
    name,
    value,
    type,
    required,
    placeholder,
    handleInputChange,
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
      <input
        className={className}
        ref={ref}
        id={name + '_unique_id'}
        onChange={handleInputChange}
        value={value}
        name={name || 'text_default_name'}
        type={type || 'text'}
        placeholder={placeholder || ''}
        required={required || false}
        disabled={isDisabled}
      />
    </div>
  )
})

export default Input