import React from 'react'
import { NavLink } from 'react-router-dom';

export const Pagination = ({postsPerPage,totalPosts,currentPage,paginate}) => {
    const pageNumbers = [];

    for(let i = 1; i <= Math.ceil(totalPosts/postsPerPage); i++){
        pageNumbers.push(i);
    }

  return (
    <nav aria-label="Page navigation example">
        <ul class="inline-flex -space-x-px text-sm">
            {pageNumbers.map(number => (
                <li class={`flex items-center justify-center px-3 h-8 leading-tight  bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700  dark:border-gray-300    dark:hover:bg-gray-700 dark:hover:text-white ${currentPage === number ?'bg-gray-700 text-white' : 'dark:bg-gray-200 dark:text-blue-800'}`}>
                    <button onClick={() => paginate(number)}>
                        {number}
                    </button>
                </li>
            ))}
        </ul>
    </nav>
  )
}
