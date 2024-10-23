import React from 'react'
import { Modal } from "@hooks/useModal"
import { useAppDispatch, useAppSelector } from "@hooks/useRedux"
import { setAlertModal } from '@store/features/system/systemSlice'
import SendIcon from "@assets/images/send.png"

export type AlertModalProps = {
  showModal?: boolean,
  type?: string,
  hideHeader?: boolean,
  title?: string | React.ReactNode,
  message?: string | React.ReactNode,
  onClose?: Function,
  parentClassName?: string,
  titleClassName?: string,
  messageClassName?: string,
}

export const initialAlertModalState = {
  showModal: false,
  type: 'success',
  hideHeader: true,
  title: "Success",
  message: "...",
  onClose: () => { },
  parentClassName: "bg-[#f6f6f6] bg-opacity-80 text-primary flex flex-col rounded-md items-center justify-center p-5",
  titleClassName: "text-[21px] font-bold",
  messageClassName: "text-center text-[14px] mt-4",
}

const AlertModal = () => {
  const alert = useAppSelector((state) => state.system.alertModal) as AlertModalProps
  const { handleClose } = AlertModalActions()

  const returnPropsForModal = {
    showModal: alert.showModal,
    hideHeader: alert.hideHeader,
    onModalClose: alert.onClose
  }

  return (
    <Modal props={returnPropsForModal}>
      <div className={alert.parentClassName}>

        <img src={SendIcon} alt="" className='h-20 mb-2'/>
        <h3 className={alert.titleClassName}>
          {alert.title}
        </h3>
        <div className={alert.messageClassName}>
          {alert.message}
        </div>
        <div className="flex items-center justify-center mt-5">
          <button
            className='bg-subsecondary text-primary py-1 px-5 rounded-md'
            onClick={handleClose}>Close</button>
        </div>
      </div>
    </Modal>
  )
}

export const AlertModalActions = () => {
  const dispatch = useAppDispatch()

  const setAlert = (data: AlertModalProps) => {
    dispatch(setAlertModal(data))
  }

  const handleClose = () => {
    setAlert({ showModal: false })
  }

  const showAlertModal = () => {
    setAlert({ showModal: true })
  }

  const hideAlertModal = () => {
    setAlert({ showModal: false })
  }

  return {
    handleClose,
    showAlertModal,
    hideAlertModal,
    setAlert,
  }
}

export default AlertModal