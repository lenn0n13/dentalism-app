import React from 'react'
import AlertModal from '@components/Modal/AlertModal'
import Header from '@components/Header/Header'
import GuestCreate from '@pages/Appointment/Create/GuestCreate'

const Landing = () => {
  return (
    <div>
      <AlertModal />
      <Header />
      <div className="bg-landing w-full h-[90vh] bg-cover text-center sm:text-start pt-[90px] animated">
        <div className="page-wrapper grid grid-cols-2">
          <div className="col-span-2 sm:col-span-1">
            <div className="pt-[10%] px-3">
              <div className="text-primary uppercase font-bold">Your Smile, Our Passion</div>
              <div className="text-primary text-[30px] md:text-[50px] font-bold">Bringing Confidence
              </div>
              <div className="text-slate-500 text-[30px] md:text-[50px] font-extrabold">Smiles Everyday
              </div>
            </div>
            <div className="pt-10">
              <div className="frozen-wrapper lg:w-[75%] text-[14px]">
                <div className="text-primary uppercase font-bold mb-4 text-center sm:text-start">Schedule Appointment</div>
                <GuestCreate/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Landing