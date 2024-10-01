import React from 'react'
import { NavLink } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSquarePlus, faUser } from '@fortawesome/free-regular-svg-icons'
import { faRightFromBracket, faRightToBracket } from '@fortawesome/free-solid-svg-icons'

export const Header = ({signout,isAuth,userID}) => {
  return (
    <header class="flex items-center justify-between flex-row text-xl m-4 font-bold">
        <NavLink class="hover:underline m-4 md:m-6" to="/" >
            <img referrerpolicy="no-referrer" src='OpenBook_Logo.png' class="size-24" />
        </NavLink>
        <h1 class="text-5xl font-lora  tracking-wider underline underline-offset-[16px]">OPEN BOOK</h1>
        <nav class="text-4xl gap-6 flex " >
        {isAuth ? 
            <>
            <div class="group flex flex-row-reverse   items-center  transition-all  rounded-md">
                <NavLink to="/createpost"><FontAwesomeIcon icon={faSquarePlus}/></NavLink>
                <p class="text-lg mr-2 transition-all hidden group-hover:block">Create post</p>
            </div>
            <NavLink class=" " to={`/profile/${userID}`}><FontAwesomeIcon icon={faUser}/></NavLink>
            <button class=" " onClick={signout}><FontAwesomeIcon icon={faRightFromBracket}/></button> 
            </>
            : <NavLink class=" " to="/login" ><FontAwesomeIcon icon={faRightToBracket}/></NavLink>
        }
        </nav>
    </header>
  )
}
