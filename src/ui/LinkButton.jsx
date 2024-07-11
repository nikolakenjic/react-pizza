import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

const LinkButton = ({ children, to }) => {
  const navigate = useNavigate()
  const className = 'text-sm text-blue-700 hover:text-blue-400'

  if (to === '-1')
    return (
      <button className={className} onClick={() => navigate(-1)}>
        &larr; Go back
      </button>
    )

  return (
    <Link to={to} className={className}>
      {children}
    </Link>
  )
}

export default LinkButton
