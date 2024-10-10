import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react'

export const Pagination = ({postsPerPage,totalPosts,currentPage,paginate}) => {
    const pageNumbers = [];

    for(let i = 1; i <= Math.ceil(totalPosts/postsPerPage); i++){
        pageNumbers.push(i);
    }

  return (
    <nav aria-label="Page navigation example" className='w-1/4 flex flex-row justify-evenly'>
        <button disabled={currentPage === 1} 
            class="disabled:text-gray-400 disabled:pointer-events-none px-3 h-8 leading-tight rounded-md  border-2 border-transparent hover:bg-gray-100 dark:hover:bg-gray-700 hover:border-gray-400 hover:cursor-pointer " 
            onClick={() => paginate(currentPage - 1)}>
            <FontAwesomeIcon icon={faChevronLeft}/> 
            <span className='ml-2'>Previous</span> 
        </button>
        <ul class="inline-flex -space-x-px text-sm gap-1">
            {pageNumbers.map(number => (
                <li onClick={() => paginate(number)} class={`flex items-center justify-center px-3 h-8 leading-tight rounded-md  border-2 border-transparent
                ${currentPage === number ?
                ' border-gray-300  bg-blue-500 text-gray-50 font-bold  ' 
                : 
                ' text-blue-800 hover:bg-gray-100 dark:hover:bg-gray-700 hover:border-gray-400 hover:cursor-pointer '}`
                }>
                    <p>
                        {number}
                    </p>
                </li>
            ))}
        </ul>
        <button disabled={currentPage === pageNumbers.length} 
            class="disabled:text-gray-400 disabled:pointer-events-none px-3 h-8 leading-tight rounded-md  border-2 border-transparent hover:bg-gray-100 dark:hover:bg-gray-700 hover:border-gray-400 hover:cursor-pointer " 
            onClick={() => paginate(currentPage + 1)}>
            <span className='mr-2'>Next</span>
            <FontAwesomeIcon icon={faChevronRight}/>
        </button>
    </nav>
  )
}
