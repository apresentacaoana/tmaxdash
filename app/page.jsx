'use client'
import Image from 'next/image'
import Login from './screens/Login'
import { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie'
import Painel from './screens/Painel'

export default function Home() {
  const [user, setUser] = useState({})
  const [cookies, setCookie] = useCookies(['user'])
  return (
    <div className="">
      {cookies.user || Object.values(user).length > 1 ? (
        <Painel />
      ) : (
        <Login setUser={setUser} />
      )}
    </div>
  )
}
