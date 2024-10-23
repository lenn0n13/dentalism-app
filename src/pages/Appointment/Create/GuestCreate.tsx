import React, { useReducer } from 'react';
import Button from '@components/Button/Button'
import Input from '@components/Input/Input'
import { AlertModalActions } from '@components/Modal/AlertModal'
import { useQueryStack, queryClient, useMutationStack } from '@hooks/useTanStack'
import Select from '@components/Select/Select'
import FormDatePicker from '@components/FormDatePicker/FormDatePicker'
import useDateFormatter from '@hooks/useDateFormatter'

interface State {
  email?: string,
  dentist_id?: string,
  appointment_date?: string,
  start_time?: string,
  end_time?: string,
  createPayload?: any,
}

type Action =
  | { type: 'UPDATE_EMAIL', payload: any }
  | { type: 'UPDATE_DENTIST', payload: any }
  | { type: 'UPDATE_DATE', payload: any }
  | { type: 'UPDATE_TIME', payload: any }
  | { type: 'SET_PAYLOAD', payload: any }
  | { type: 'SET_DATA', payload: any }
  | { type: 'CLEAR_DATA', payload?: any }
  | { type: 'SET_ERROR_MESSAGE', payload?: any }

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case 'UPDATE_EMAIL':
      return { ...state, email: action.payload };
    case 'UPDATE_DENTIST':
      return { ...state, dentist_id: action.payload };
    case 'UPDATE_DATE':
      return { ...state, appointment_date: action.payload };
    case 'UPDATE_TIME':
      return { ...state, start_time: action.payload.start_time, end_time: action.payload.end_time };
    case 'SET_PAYLOAD':
      return { ...state, createPayload: action.payload }
    case 'SET_DATA':
      return { ...state, ...action.payload };
    case 'SET_ERROR_MESSAGE':
      return { ...state, errorMessage: action.payload };
    case 'CLEAR_DATA':
      return {};

    default:
      return state;
  }
};

const GuestCreate = () => {
  const [state, dispatch] = useReducer(reducer, {});

  const qc = queryClient()
  const { setAlert } = AlertModalActions()
  const { data: dentistData } = useQueryStack({
    queryKey: ['dentists', "get-dentist"],
    url: "/dentist",
    method: "GET",
    runOnLoad: true
  })

  const onCreateSuccess = () => {
    console.log(data);

    showSuccessModal()
    dispatch({ type: "CLEAR_DATA" })
    qc.removeQueries({ queryKey: ['book-appointment'] });
  }

  const { data, isFetching, refetch } = useQueryStack({
    queryKey: ['get-dentists', "get-dentist-availability"],
    url: "/dentist-availability",
    query: {
      dentist_id: state?.dentist_id,
      date: state?.appointment_date
    },
    method: "GET",
    runOnLoad: false
  })

  const createAppointment = useMutationStack({
    queryKey: ['book-appointment'],
    url: "/book-appointment",
    body: {
      ...state.createPayload
    },
    method: "POST",
    runOnLoad: false,
    onSuccess: onCreateSuccess,
    onError: (err: string) => { dispatch({ type: "SET_ERROR_MESSAGE", payload: err }) }
  })


  const showSuccessModal = () => {
    setAlert({
      type: "success",
      title: 'Appointment Scheduled',
      titleClassName: 'text-primary font-bold',
      message: "Your appointment has been scheduled. You can now log in using your email address to view or manage your appointment details. ",
      showModal: true
    })
  }

  const handleOnEmailChange = async (e: any) => {
    dispatch({ type: "UPDATE_EMAIL", payload: e.target.value })
  }

  const handleOnDentistChange = async (e: any) => {
    const dentistId = e.target.value;
    const selectedDentist = dentistData?.list?.filter((dentist: any) => dentist._id == dentistId)[0]
    dispatch({ type: "SET_DATA", payload: { dentist_id: dentistId, dentist: selectedDentist } })
    setTimeout(() => {
      refetch()
    }, 100);
  }
  const handleOnDateChange = async (e: any) => {
    const date = useDateFormatter(e)
    dispatch({ type: "UPDATE_DATE", payload: `${date.year}-${date.pMonth}-${date.pDay}` })
    setTimeout(() => {
      refetch()
    }, 100);
  }
  const handleOnTimeChange = async (e: any) => {
    const time = e.target.value.split(",")
    dispatch({ type: "UPDATE_TIME", payload: { start_time: time[0], end_time: time[1] } })
  }
  const handleCreateAppointment = async () => {
    // GENERATE PAYLOAD FOR APPOINTMENT CHANGES
    let payload = {
      email: state?.email,
      dentist_id: state?.dentist_id,
      appointment_date: String(state?.appointment_date).split(" ")[0],
      start_time: Number(state?.start_time),
      end_time: Number(state?.end_time),
    }

    dispatch({ type: "SET_PAYLOAD", payload })
    setTimeout(() => {
      createAppointment.mutate()
    }, 100);
  }

  return (
    <div>
      {state.errorMessage && <div className='py-2 px-4 mb-4 font-sembold text-white border-[1px] rounded-md bg-[#42b9c7] bg-opacity-'>
      {state.errorMessage}
      </div>}
      <div className="grid sm:grid-cols-2 gap-2 ">
        <Input
          className="w-full"
          label="Email Address"
          name="email"
          type="email"
          value={state?.email ?? ""}
          placeholder="yourname@gmail.com"
          required
          handleInputChange={handleOnEmailChange}
        />
        <Select
          addAllOption={true}
          wrapperClassName="w-full"
          selectClass="w-full"
          label="Dentist"
          labelField="last_name"
          allOptionValue={''}
          valueField="_id"
          onChange={handleOnDentistChange}
          placeholder={`Select a dentist`}
          value={state?.dentist_id ?? ""}
          options={dentistData?.list}
        />
      </div>
      <div className={'flex gap-2'}>
        <FormDatePicker
          label="Date"
          value={state?.appointment_date ?? new Date()}
          onDateChange={handleOnDateChange}
          isDisabled={state?.dentist_id == null}
        />
        <Select
          addAllOption={true}
          wrapperClassName="w-full"
          selectClass="w-full"
          label="Time"
          labelField="name"
          valueField="value"
          disable={data?.list == 0 || data?.list == null}
          onChange={handleOnTimeChange}
          allOptionValue={[state?.start_time, state?.end_time].join(",")}
          placeholder={`Select Time`}
          value={[state?.start_time, state?.end_time].join(",")}
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
          Make Reservation
        </Button>
      </div>
    </div>
  )
}

export default GuestCreate