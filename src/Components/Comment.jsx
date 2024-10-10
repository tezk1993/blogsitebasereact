import React from 'react'

export const Comment = ({name,commentText,created_at,photourl}) => {


  return (
    <div class="flex flex-row justify-start items-center">
        <img class="size-16 rounded-full bg-gray-300"  src={photourl}/>
        <div class="m-4">
            <h2>{name}</h2>
            <p class="text-gray-600 ">{created_at}</p>
            <div dangerouslySetInnerHTML={{ __html: `${commentText}` }}/>
        </div>
    </div>
  )
}
