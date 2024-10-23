import React from 'react';

type FormTypes = {
  className?: string,
  onSubmit?: React.FormEventHandler<HTMLFormElement>,
  disable?: boolean,
  children: React.ReactNode
}

const FormWrapper = (props: FormTypes) => {
  const {
    className,
    onSubmit,
    disable,
    children,
  } = props;


  const handleFormSubmit = (event: any) => {
    event.preventDefault()
    if (onSubmit) {
      onSubmit(event)
    }
  }

  return (
    <>
      {onSubmit ?
        <form
          className={className}
          onSubmit={handleFormSubmit}
        >
          <fieldset disabled={disable}>
            {children}
          </fieldset>
        </form> :
        <form
          className={className}
        >
          <fieldset disabled={disable}>
            {children}
          </fieldset>
        </form>
      }
    </>
  );
}

export default FormWrapper;