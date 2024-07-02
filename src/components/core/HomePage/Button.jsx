import React from 'react'
import { Link } from 'react-router-dom'

const  Button = ({active, linkto, children}) => {
  return (
    <Link to={linkto}>
        <div className={`text-center text-[16px] px-7 py-3 rounded-md font-bold ${active ? " bg-yellow-50 text-black" : " bg-richblack-800"}
        hover:scale-95 hover:shadow-none transition-all duration-200 shadow-[2px_2px_0px_0px_rgba(255,255,255,0.18)]`}>
            {children}
        </div>
    </Link>
  )
}

export default  Button