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

const Create = (props: any, ref: Ref<any>) => {
  const qc = queryClient()
  const { setAlert, hideAlertModal } = AlertModalActions()
  const { openModal, closeModal, modalProps, setModalProps } = useModal()
  const { getCookie } = useCookie()

  useImperativeHandle(
    ref,
    () => {
      return {
        openCreateAppointment
      }
    },
    [],
  )

  const openCreateAppointment = (data: any) => {
    const date = useDateFormatter(new Date())
    setModalProps({ appointment_date: `${date.year}-${date.pMonth}-${date.pDay}` })
    setModalProps(data)
    openModal()
  }

  const onCreateSuccess = () => {
    setModalProps({
      onModalClose: () => {
        setAlert({
          type: "success",
          title: 'Booked',
          titleClassName: 'text-primary font-bold',
          message: `Your appointment was successfully booked.`,
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
    qc.removeQueries({ queryKey: ['create-appointment'] });
    qc.invalidateQueries({ queryKey: ['appointments', "calendar-dashboard"] })
    setModalProps({ dentist_id: null, start_time: null, end_time: null, appointment_date: new Date(), dentist: null })
  }

  const { data: dentistData } = useQueryStack({
    queryKey: ['dentists', "get-dentist"],
    url: "/dentist",
    method: "GET",
    authorization: getCookie("token"),
    runOnLoad: true
  })

  const { data, isFetching, refetch } = useQueryStack({
    queryKey: ['get-dentists', "get-dentist-availability"],
    url: "/dentist-availability",
    query: {
      dentist_id: modalProps?.dentist_id,
      date: modalProps?.appointment_date
    },
    method: "GET",
    authorization: getCookie("token"),
    runOnLoad: false
  })


  const createAppointment = useMutationStack({
    queryKey: ['create-appointment'],
    url: "/appointment",
    body: {
      ...modalProps.createPayload
    },
    method: "POST",
    authorization: getCookie("token"),
    runOnLoad: false,
    onSuccess: onCreateSuccess
  })


  const handleOnDateChange = (e: Date) => {
    const date = useDateFormatter(e)
    setModalProps({ appointment_date: `${date.year}-${date.pMonth}-${date.pDay}` })
    setTimeout(() => {
      refetch()
    }, 100);
  }

  const handleOnTimeChange = (e: any) => {
    const time = e.target.value.split(",")
    setModalProps({ start_time: time[0], end_time: time[1] })
  }

  const handleOnDentistChange = (e: any) => {
    const dentistId = e.target.value;
    const selectedDentist = dentistData?.list?.filter((dentist: any) => dentist._id == dentistId)[0]
    setModalProps({ dentist_id: dentistId, dentist: selectedDentist })
    setTimeout(() => {
      refetch()
    }, 100);
  }

  const handleCreateAppointment = () => {
    // GENERATE PAYLOAD FOR APPOINTMENT CHANGES
    let payload = {
      dentist_id: modalProps?.dentist_id,
      appointment_date: String(modalProps?.appointment_date).split(" ")[0],
      start_time: Number(modalProps?.start_time),
      end_time: Number(modalProps?.end_time),
    }

    setModalProps({ createPayload: payload })
    setTimeout(() => {
      createAppointment.mutate()
    }, 100);
  }

  useEffect(() => {
    setModalProps({
      size: 'sm',
      title: "Create Appointment",
      className: 'bg-[#f6f6f6] text-primary',
      headerClassName: 'text-primary font-bold',
      onModalOpen: () => { },
      onModalClose: () => {
        setModalProps({ dentist_id: null, start_time: null, end_time: null, appointment_date: new Date(), dentist: null })
        qc.invalidateQueries({ queryKey: ['get-dentists', "get-dentist-availability"] })
      }
    })
  }, [])


  return (
    <>
      <Modal props={modalProps} handleClose={closeModal}>
        <div className="px-4 py-4">
          <div className="flex items-center justify-center">
            <img src={modalProps?.dentist?.image || 'https://i.postimg.cc/ncgtG9Wc/default.jpg'}
              alt='' className=" rounded-full px-5 py-5 w-[200px]" />
          </div>
          <FormWrapper onSubmit={() => { }}>
            <Select
              addAllOption={true}
              wrapperClassName="w-full"
              selectClass="w-full"
              label="Dentist"
              labelField="last_name"
              allOptionValue={'null'}
              valueField="_id"
              onChange={handleOnDentistChange}
              placeholder={`Select a dentist`}
              value={modalProps?.dentist_id}
              options={dentistData?.list}
            />
            <div className={'flex gap-2'}>
              <FormDatePicker
                label="Date"
                value={modalProps?.appointment_date ?? new Date()}
                onDateChange={handleOnDateChange}
                isDisabled={!modalProps?.dentist_id}
              />
              <Select
                addAllOption={true}
                wrapperClassName="w-full"
                selectClass="w-full"
                label="Time"
                labelField="name"
                valueField="value"
                isDisabled={!modalProps?.appointment_date}
                onChange={handleOnTimeChange}
                allOptionValue={[modalProps?.start_time, modalProps?.end_time].join(",")}
                placeholder={`Select Time`}
                value={[modalProps?.start_time, modalProps?.end_time].join(",")}
                options={data?.list}
              />
            </div>
            <div className="flex justify-center w-full flex-col">
              <Button
                type="submit"
                isLoading={createAppointment.isPending}
                className={`text-[14px] w-full`}
                onClick={handleCreateAppointment}
              >
                Create
              </Button>
            </div>
          </FormWrapper>
          <div className="text-[12px] pt-2 text-gray-600 text-center">

          </div>
        </div>
      </Modal>
    </>
  )
}

export default forwardRef(Create)