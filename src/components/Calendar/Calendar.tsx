import React, { useRef } from 'react'
import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'
import { EventClickArg } from '@fullcalendar/core'
import { useQueryStack } from '@hooks/useTanStack'
import useCookie from '@hooks/useCookie'
import Manage from '@pages/Appointment/Manage/Manage'

interface ManageInterface {
  manageAppointment: any
}


const Calendar = () => {
  const manageRef = useRef() as React.RefObject<ManageInterface>
  const { getCookie } = useCookie()

  const { isPending, error, data, isFetching, refetch } = useQueryStack({
    queryKey: ['appointments', "calendar-dashboard"],
    url: "/appointment",
    method: "GET",
    authorization: getCookie("token"),
    runOnLoad: true
  })

  function renderEventContent(eventInfo: any) {
    return (
      <div className='relative'>
        <div className="pt-1">
          <div className="flex items-center justify-center">
            <label htmlFor="" className='text-[12px] ms-1 text-white font-bold'>
              <span className=''> {JSON.stringify(eventInfo?.event.extendedProps?.start_time)}:00 - </span>
              <span className=''> {JSON.stringify(eventInfo?.event.extendedProps?.end_time)}:00 </span>
            </label>
          </div>
        </div>
        <div className="w-full flex pb-1 justify-center items-center text-[12px]">
          {eventInfo.event.title}
        </div>
      </div>
    )
  }

  const handleDayClick = (e: EventClickArg) => {
    manageRef?.current?.manageAppointment(e.event._def.extendedProps)
  }

  return (
    <>
    <Manage ref={manageRef}/>
      <FullCalendar
        plugins={[timeGridPlugin]}
        initialView='timeGridWeek'
        weekends={true}
        editable
        eventClick={handleDayClick}
        height={'64vh'}
        events={data?.list}
        allDayClassNames={'hidden'}
        eventContent={renderEventContent}
      />
    </>
  )
}

export default Calendar