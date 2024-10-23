

import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQueryStack } from '@hooks/useTanStack'
import useCookie from "@hooks/useCookie"
import Button from '@components/Button/Button'
import Trash from "@assets/images/trash.png"
const Login = () => {
  const navigate = useNavigate()
  const { setCookie } = useCookie()
  const searchParams = new URLSearchParams(window.location.search)

  const { data, isFetching } = useQueryStack({
    queryKey: "login-gen-token",
    url: "/generate-token",
    method: "POST",
    body: { hash: searchParams.get("hash") },
    runOnLoad: true
  })

  useEffect(() => {
    if (data?.status === 200) {
      // STORE TOKEN
      setCookie({ name: 'token', value: data?.token, domain: window.location.hostname })
      navigate("/dashboard")
    }
  }, [data])

  return (
    <div>
      <div className="flex items-center justify-center h-screen w-screen flex-col">
        <div className="flex items-center justify-center">
          {!isFetching && <img src={Trash} alt="" className='h-12 me-4' />}
          <div className="">
            <div className="font-bold">{data?.message || 'Validating Account Hash...'}</div>
            <div className="text-[12px]">
              {JSON.stringify(data)}
            </div>
          </div>
        </div>
        <div className="mt-7"> <Button
          type="button"
          
          onClick={() => { window.location.href = '/' }}
          className="w-[100%] text-sm"
          isLoading={false}
          isDefault={true}
        >Back To Home</Button></div>
      </div>
    </div>
  )
}

export default Login