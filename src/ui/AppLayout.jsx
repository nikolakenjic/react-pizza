import React from 'react'
import { Outlet, useNavigation } from 'react-router-dom'
import Header from './Header'
import CartOverview from '../features/cart/CartOverview'
import Loading from '../ui/Loading'

const AppLayout = () => {
  const navigation = useNavigation()
  const isLoading = navigation.state === 'loading'

  return (
    <div className="grid h-screen grid-rows-[auto_1fr_auto]">
      {isLoading && <Loading />}
      <Header />

      <div className="overflow-scroll">
        <main className="mx-auto max-w-3xl overflow-y-auto overflow-x-hidden">
          <Outlet />
        </main>
      </div>

      <CartOverview />
    </div>
  )
}

export default AppLayout
