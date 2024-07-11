import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const SearchOrder = () => {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')

  const handleOrder = (e) => {
    e.preventDefault()
    if (!query) return

    navigate(`/order/${query}`)
    setQuery('')
  }

  return (
    <form onSubmit={handleOrder}>
      <input
        placeholder="Search order #"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-28 rounded-full px-4 py-2 text-sm transition-all duration-300 placeholder:text-stone-400 focus:w-40 focus:outline-none focus:ring focus:ring-yellow-500 focus:ring-opacity-50 sm:w-64 sm:focus:w-80"
      />
    </form>
  )
}

export default SearchOrder
