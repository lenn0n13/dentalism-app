import React, { useCallback } from 'react';

const Select = React.forwardRef((props: any, ref: any) => {
    const {
      wrapperClassName,
      id,
      label,
      name,
      value,
      isValid,
      error,
      placeholder,
      options = [],
      valueField,
      labelField,
      onChange,
      disable,
      customLabel,
      help,
      isLoading,
      loadingMessage = '',
      addAllOption = false,
      allOptionLabel = 'All',
      noPlaceholder = false,
      selectClass = '',
      wrapInDiv = true,
      allOptionValue= ''
    }: any = props;

    const ConditionalWrapper = useCallback(({ children }: { children: React.ReactNode}) => {
      return wrapInDiv ? <div className={wrapperClassName}>{children}</div> : children;
    }, [id]);
    
    return (
      <ConditionalWrapper>
        {label && 
          <label 
            htmlFor={id} 
            className="form-label"
          >
            {label}
          </label>
        }
        <select 
          name={name} 
          id={id}
          className={`form-select${selectClass ? ` ${selectClass}`: ``}${isValid === false ? ` is-invalid`: ``}`}
          value={value} 
          onChange={onChange}
          disabled={disable}
          ref={ref}
        >
          {(!addAllOption && !noPlaceholder) && <option value={allOptionValue} disabled>{placeholder}</option>}
          {(addAllOption && !noPlaceholder) && <option value="">{placeholder}</option>}
          {/* {addAllOption && <option value="">{allOptionLabel}</option>} */}
          {options.map((each: any, key: any) => (
            <option 
              key={`${name}-option-${key}`}
              value={each[valueField]}
            >
              {!customLabel ? 
                each[labelField] : 
                customLabel(each)
              }
            </option>
          ))}
        </select>
        {help && 
          <div 
            id={`${id}Help`} 
            className="form-text"
          >
            {help}
          </div>
        }
        {isLoading && 
          <div className="d-flex align-items-center mt-2">
            <strong className='text-primary'>{loadingMessage ? loadingMessage : <>Loading...</>}</strong>
            <div className="spinner-border spinner-border-sm ms-auto text-primary" role="status" aria-hidden="true"></div>
          </div>
        }
        {(isValid === false && error) &&
          <div 
            id={id} 
            className="invalid-feedback"
          >
            {error}
          </div>
        }
      </ConditionalWrapper>
    );
  }
);
 
export default Select;