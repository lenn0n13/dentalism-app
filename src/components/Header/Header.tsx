import React, { useEffect, useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQueryStack, queryClient } from '@hooks/useTanStack'
import useModal, { Modal } from "@hooks/useModal"
import useCookie from '@hooks/useCookie'
import { AuthContextProvider } from '@pages/Contexts/AuthContext'

import AlertModal, { AlertModalActions } from '@components/Modal/AlertModal'
import Button from '@components/Button/Button'
import Input from '@components/Input/Input'
import FormWrapper from '@components/FormWrapper/FormWrapper'

const Header = () => {
  const navigate = useNavigate()
  const { removeCookie } = useCookie()
  const qc = queryClient()
  const { setAlert, hideAlertModal } = AlertModalActions()
  const { openModal, closeModal, modalProps, setModalProps } = useModal()
  const [email, setEmail] = useState<string>("")
  const { authentication, updateAuthentication } = useContext(AuthContextProvider)

  const { data, isFetching, refetch } = useQueryStack({
    url: "/login",
    method: "POST",
    body: { email },
    queryKey: ['loginWithEmail']
  })

  useEffect(() => {
    setModalProps({
      size: 'sm',
      title: "Login via Email",
      className: 'bg-[#f6f6f6] text-primary',
      headerClassName: 'text-primary font-bold',
      onModalOpen: () => {
        hideAlertModal()
      },
      onModalClose: () => { }
    })
  }, [])

  useEffect(() => {
    if (data?.status === 200 && data?.trace == 'loginWithEmail') {
      setModalProps({
        onModalClose: () => {
          setAlert({
            type: "success",
            title: 'Looking Good!',
            titleClassName: 'text-primary font-bold',
            message: `Your login link was successfully sent to ${email}. 
            Please check your inbox (and your spam/junk folder, just in case).`,
            onClose: () => {
              setModalProps({
                onModalClose: () => { hideAlertModal() }
              })
            },
            showModal: true
          })
        }
      })
      closeModal()
      setEmail('')
      qc.removeQueries({ queryKey: ['loginWithEmail'] });
    }
  }, [data])

  const handleSendLink = async () => {
    await refetch();
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value)
  }


  const handleLogout = () => {
    updateAuthentication({ token: null })
    removeCookie({ name: 'token', domain: window.location.hostname })
    navigate("/")
  }
  return (
    <>
      <AlertModal />
      <Modal props={modalProps} handleClose={closeModal}>
        <div className="px-4 py-4">
          <div className="text-[12px] pb-4">
            Your login link will be sent to the email address associated with your account.
            Please check your inbox (and your spam/junk folder, just in case).
          </div>
          <FormWrapper onSubmit={handleSendLink}>
            <Input
              className="w-full text-primary"
              label="Email Address"
              name="email"
              value={email}
              handleInputChange={handleInputChange}
              type="email"
              placeholder="email@address.com"
              required
              isDisabled={isFetching}
            />
            <div className="flex justify-center w-full">
              <Button
                type="submit"
                isLoading={isFetching}
                className=" text-[14px] w-full"
              >
                Send Me Login Link
              </Button>
            </div>
          </FormWrapper>
          <div className="text-[12px] pt-4">
            Once received, never share the link to anyone.
          </div>
        </div>
      </Modal>
      <div className="mt-[90px]"></div>
      <div className="fixed top-0 w-screen z-40 animated">
        <div className="bg-primary lg:bg-transparent landing-header ">
          <div className="page-wrapper">
            <div className="grid grid-cols-4">
              <div className="col-span-1 text-primary text-[40px] items-center leading-[1.2]  hidden lg:flex" role='button'
                onClick={() => { navigate('/dashboard') }}>
                <span className='text-[80px] font-bold'>:D</span>entalism
              </div>
              <div className="col-span-4 lg:col-span-3 bg-primary flex items-center text-white">
                <div className=" justify-between items-center mx-4 my-2 w-full text-[14px] flex">
                  <div className="street-address lg:ms-10 hidden sm:block">
                    <div className="">Fort Santiago Mechon</div>
                    <div className="">Tanza, Cavite</div>
                  </div>
                  <div className="time-sched">
                    <div className="">8AM - 5PM</div>
                    <div className="">Monday to Friday</div>
                  </div>
                  <div className="time-sched">
                    <div className="">support@dentalista.com</div>
                    <div className="">+89 113-8031</div>
                  </div>
                  {authentication?.token ? <Button
                    type="button"
                    isLoading={false}
                    className="font-bold bg-subsecondary !text-primary hidden md:block"
                    onClick={handleLogout}
                  >Logout</Button> :
                    <Button
                      type="button"
                      isLoading={false}
                      className="font-bold bg-subsecondary !text-primary hidden md:block"
                      onClick={openModal}
                    >Login</Button>}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-subsecondary p-2 md:p-4 animated">
          <div className="page-wrapper">
            <div className="flex text-[14px] gap-3 sm:gap-10 font-bold uppercase md:ms-[-10px] px-2 justify-center sm:justify-start">
              <div className="text-primary" role="button" onClick={() => { navigate("/dashboard") }}>Home</div>
              <div className="text-secondary">Service</div>
              <div className="text-secondary">Doctor</div>
              {authentication?.token ? <div className="text-primary" role="button" onClick={handleLogout}>Logout</div> :
                <div className="text-primary" role="button" onClick={openModal}>Login</div>}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Header