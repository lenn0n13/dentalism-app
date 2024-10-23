import React, { useRef, useContext } from 'react'
import { useQueryStack } from '@hooks/useTanStack'
import Calendar from '@components/Calendar/Calendar'
import Header from '@components/Header/Header'
import Button from '@components/Button/Button'
import Tooth from "@assets/images/tooth.png"
import useCookie from '@hooks/useCookie'
import Create from '@pages/Appointment/Create/Create'
import { AuthContextProvider } from '@pages/Contexts/AuthContext'

interface ManageInterface {
  openCreateAppointment: any
}

const Dashboard = () => {
  const createAppointmentRef = useRef() as React.RefObject<ManageInterface>
  const { authentication, updateAuthentication } = useContext(AuthContextProvider)
  const { getCookie } = useCookie()
  const { data, isFetching } = useQueryStack({
    queryKey: ['appointments', "calendar-dashboard"],
    url: "/appointment",
    method: "GET",
    authorization: getCookie("token"),
    runOnLoad: true
  })

  return (
    <div>
      <Create ref={createAppointmentRef} />
      <Header />
      <div className="page-wrapper pt-[90px] animated">
        <div className="flex justify-between items-center flex-col md:flex-row">
          <div className="flex items-center">
            <img src={Tooth} alt="" className='h-[50px] sm:h-[70px] md:h-[80px]' />
            <div className="ms-3">
              <div className="text-[16px] sm:text-[21px]">Welcome</div>
              <div className="text-[14px] text-primary">{authentication?.email}</div>
              <div className="text-[14px] mt-1 ">
                You have <span className='font-bold'>{data?.list?.length || 0}</span> appointment{data?.list?.length > 1 ? 's' : ''} created.</div>
            </div>
          </div>
          <div className="flex items-center flex-col">
            {/* <div>Let the doctor know more about you.</div> */}
            <Button
              type="button"
              isLoading={false}
              className="text-sm mt-3 md:mt-0"
              onClick={()=> { createAppointmentRef?.current?.openCreateAppointment()}}

            >Create Appointment</Button>
          </div>
        </div>
      </div>
      <div className="mb-7"></div>
      <div className="page-wrapper overflow-y-hidden pb-4 ps-3 sm:ps-0 animated">
        My Calendar
        <Calendar />
      </div>



    </div>
  )
}

export default Dashboard