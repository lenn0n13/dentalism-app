import React, { forwardRef, Ref, useImperativeHandle, useEffect, useState } from 'react'
import { useQueryStack, queryClient, useMutationStack } from '@hooks/useTanStack'
import useModal, { Modal } from "@hooks/useModal"
import { AlertModalActions } from '@components/Modal/AlertModal'
import Button from '@components/Button/Button'
import FormWrapper from '@components/FormWrapper/FormWrapper'
import Select from '@components/Select/Select'
import useCookie from '@hooks/useCookie'
import FormDatePicker from '@components/FormDatePicker/FormDatePicker'
import useDateFormatter from '@hooks/useDateFormatter'

const Manage = (props: any, ref: Ref<any>) => {
  const qc = queryClient()
  const { setAlert, hideAlertModal } = AlertModalActions()
  const { openModal, closeModal, modalProps, setModalProps } = useModal()
  const [displayCancelConfirmation, setDisplayCancelConfirmation] = useState<boolean>(false);
  const { getCookie } = useCookie()

  useImperativeHandle(
    ref,
    () => {
      return {
        manageAppointment
      }
    },
    [],
  )

  const manageAppointment = (data: any) => {
    setModalProps(data)
    openModal()
    // Delay the callstack for state mutation in progress
    setTimeout(() => {
      refetch()
    }, 1);
  }

  const onUpdateSuccess = () => {
    setModalProps({
      onModalClose: () => {
        setAlert({
          type: "success",
          title: 'All Set',
          titleClassName: 'text-primary font-bold',
          message: `Your appointment was successfully updated.`,
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
    qc.removeQueries({ queryKey: ['update-appointment'] });
    qc.invalidateQueries({ queryKey: ['appointments', "calendar-dashboard"] })
  }


  const onRemoveSuccess = () => {
    setModalProps({
      onModalClose: () => {
        setAlert({
          type: "success",
          title: 'Cancelled',
          titleClassName: 'text-primary font-bold',
          message: `Your appointment was successfully cancelled.`,
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
    setDisplayCancelConfirmation(false)
    qc.removeQueries({ queryKey: ['delete-appointment'] });
    qc.invalidateQueries({ queryKey: ['appointments', "calendar-dashboard"] })
  }

  const { data, isFetching, refetch } = useQueryStack({
    queryKey: ['dentist-availability'],
    url: "/dentist-availability",
    query: {
      dentist_id: modalProps?.dentist_id,
      date: modalProps?.appointment_date
    },
    method: "GET",
    authorization: getCookie("token"),
    runOnLoad: false
  })

  const updateAppointment = useMutationStack({
    queryKey: ['update-appointment'],
    url: "/appointment",
    body: {
      id: modalProps?._id,
      fields: modalProps?.updatePayload
    },
    method: "PUT",
    authorization: getCookie("token"),
    runOnLoad: false,
    onSuccess: onUpdateSuccess
  })

  const deleteAppointment = useMutationStack({
    queryKey: ['delete-appointment'],
    url: "/appointment",
    body: {
      id: modalProps?._id
    },
    method: "DELETE",
    authorization: getCookie("token"),
    runOnLoad: false,
    onSuccess: onRemoveSuccess
  })


  const handleOnDateChange = (e: Date) => {
    const date = useDateFormatter(e)
    setModalProps({ appointment_date: `${date.year}-${date.pMonth}-${date.pDay}` })
    refetch()
  }

  const handleOnTimeChange = (e: any) => {
    const time = e.target.value.split(",")
    setModalProps({ start_time: time[0], end_time: time[1] })
  }

  const handleUpdateAppointment = () => {
    // GENERATE PAYLOAD FOR APPOINTMENT CHANGES
    let payload = {
      appointment_date: modalProps?.appointment_date,
      start_time: Number(modalProps?.start_time),
      end_time: Number(modalProps?.end_time),
    }

    setModalProps({ updatePayload: payload })
    setTimeout(() => {
      updateAppointment.mutate()
    }, 1);
  }

  const handleCancelAppointment = () => {
    deleteAppointment.mutate()
  }

  useEffect(() => {
    setModalProps({
      size: 'sm',
      title: "Appointment Details",
      className: 'bg-[#f6f6f6] text-primary',
      headerClassName: 'text-primary font-bold',
      onModalOpen: () => {
        setDisplayCancelConfirmation(false)
       },
      onModalClose: () => {
        setDisplayCancelConfirmation(false)
      }
    })
  }, [])


  return (
    <>
      <Modal props={modalProps} handleClose={closeModal}>
        <div className="px-4 py-4">
          <div className="flex items-center justify-center">
            <img src={modalProps?.dentist?.image} alt='' className=" rounded-full px-5 py-5 w-[200px]" />
          </div>
          <div className="border-b-2 p-3 pt-0 text-center mb-5">
            Dr. {modalProps?.dentist?.first_name} {modalProps?.dentist?.last_name}
          </div>
          <FormWrapper onSubmit={() => { }}>
            <div className={displayCancelConfirmation ? 'hidden animated gap-2' : ' flex animated gap-2'}>
              <FormDatePicker
                label="Date"
                value={modalProps?.appointment_date}
                onDateChange={handleOnDateChange}
              />
              <Select
                addAllOption={true}
                wrapperClassName="w-full"
                selectClass="w-full"
                label="Time"
                labelField="name"
                valueField="value"
                onChange={handleOnTimeChange}
                allOptionValue={[modalProps?.start_time, modalProps?.end_time].join(",")}
                placeholder={[modalProps?.start_time + ':00', modalProps?.end_time + ':00'].join(" ")}
                value={[modalProps?.start_time, modalProps?.end_time].join(",")}
                options={data?.list}
              />
            </div>
            <div className="flex justify-center w-full flex-col">
              <Button
                type="submit"
                isLoading={updateAppointment.isPending}
                className={displayCancelConfirmation ? 'hidden animated text-[14px] w-full' : ' animated text-[14px] w-full'}
                onClick={handleUpdateAppointment}
              >
                Reschedule
              </Button>
              {displayCancelConfirmation ? <div className={`${displayCancelConfirmation ? 'block' : 'hidden'} animated`}>
                <div className="p-2 text-[14px] border-[1px] text-center mt-4 mb-5">
                  <div className="font-bold">Cancel Appointment?</div>
                  <span className='text-gray-500'>Are you sure you would like to cancel this appointment?</span>
                  <div className="flex gap-3">
                    <Button
                      type="button"
                      onClick={() => { setDisplayCancelConfirmation(false) }}
                      className="bg-slate-200 !text-primary text-[14px] w-full mt-3"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="button"
                      onClick={handleCancelAppointment}
                      className=" text-[14px] w-full mt-3 bg-red-700"
                    >
                      Yes
                    </Button>
                  </div>
                </div>
              </div> : <>
                <Button
                  type="button"
                  isLoading={deleteAppointment.isPending}
                  onClick={() => { setDisplayCancelConfirmation(true) }}
                  className="bg-slate-200 !text-primary text-[14px] w-full mt-3"
                >
                  Cancel Appointment
                </Button>
              </>}
            </div>
          </FormWrapper>
          <div className="text-[12px] pt-2 text-gray-600 text-center">
            You cannot change the date or dentist. It's either you attend or cancel it here.
          </div>
        </div>
      </Modal>
    </>
  )
}

export default forwardRef(Manage)