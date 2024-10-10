import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {arrayUnion, collection, deleteDoc, doc, getDoc, getDocs, query, setDoc, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import {Link, NavLink, useParams } from 'react-router-dom';
import { auth, db } from '../firebase';
import { faCircleUser, faComment, faThumbsDown, faThumbsUp } from '@fortawesome/free-regular-svg-icons';
import { getAuth } from 'firebase/auth';
import { faAnglesRight } from '@fortawesome/free-solid-svg-icons';

export const PostPreview = ({authorName,authorID,authorImage,date,title,subtitle,summary,comments,postImage,id}) => {
  const convertedSummary = { __html: `${summary}` };
  const [post,setPost] = useState();
  const postDoc = doc(db,"posts",id);
  const votesCol= collection(db,"posts",id,"voters");
  const [votes,setVotes] = useState([]);



  
  const submitVote =  async (voteType) =>{
    if(auth.currentUser === null) return;

    const voteDoc = doc(db,"posts",id,"voters",auth.currentUser.uid);
    if(voteDoc){
      await setDoc(doc(db, "posts",id,"voters", auth.currentUser.uid), {
        votetype: voteType
      });
    }else{
      await updateDoc(voteDoc, {
        votetype: voteType
      });
    }
    getVotes();
  }
  const getVotes = async () =>{
    const data = await getDocs(votesCol);
    const voteDocs = data.docs.map((doc) => ({...doc.data(),id:doc.id}));
    
    if (voteDocs !== null) {
      setVotes(voteDocs);
    } else {
        console.log("No such document!");
    }
  };
  useEffect(() => {
    getVotes();
},[]);


  return (
    <>
      {postImage ? 
         <div class="w-[64rem] m-4  bg-slate-200 rounded-xl shadow-xl flex flex-row">

         <div class="ml-4 mt-4 mb-4 mr-4 flex flex-col justify-between w-1/2  ">

           <div class="flex flex-row gap-2  p-2 rounded-lg transition-all duration-300 hover:bg-slate-50">
              
             <NavLink to={`/profile/${authorID}`} id='profile' class="">
               {authorImage ?
                 <img referrerpolicy="no-referrer" class="size-16 rounded-full bg-gray-300"  src={authorImage}/>
                 :
                 <FontAwesomeIcon class="size-16" icon={faCircleUser} />
               }
               <div class="text-left">
                 <h2 class="text-[1.5em] font-bold font-inter tracking-wider">{authorName}</h2>
                 <h4 class="text-[1.2em] font-normal font-inter">{date}</h4>
               </div>
             </NavLink>
           </div>
 
          <div class="w-1/2 mr-4 mt-2 mb-2 ">
            <h2 class="font-bold font-inter mb-1">{title.length > 40 ? title.substring(0,40) + "..." : title}</h2>
            <h3 class="italic font-inter mb-1">{subtitle}</h3>
            {summary !== undefined ? <div dangerouslySetInnerHTML={convertedSummary}/>: <div></div>}
          </div>
 
           <div class="flex flex-row gap-4 items-center">
             <button onClick={() => submitVote("upvote")} class="py-1.5 px-4 hover:text-green-600 hover:scale-105 hover:shadow text-center border border-gray-300 rounded-md  h-12 text-sm flex items-center gap-1 lg:gap-2">
                   <FontAwesomeIcon icon={faThumbsUp}/>
 
                   <span>{votes.filter(vote => vote.votetype === "upvote").length}</span>
               </button>
 
               <button onClick={() => submitVote("downvote")} class="py-1.5 px-4 hover:text-red-600 hover:scale-105 hover:shadow text-center border border-gray-300 rounded-md h-12 text-sm flex items-center gap-1 lg:gap-2">
                   <FontAwesomeIcon icon={faThumbsDown}/>
                   <span>{votes.filter(vote => vote.votetype === "downvote").length}</span>
               </button>
               <div class="py-1.5 px-4 hover:text-blue-600 hover:scale-105 hover:shadow text-center border border-gray-300 rounded-md h-12 text-sm flex items-center gap-1 lg:gap-2">
                   <FontAwesomeIcon icon={faComment}/>
                   <span>{comments}</span>
               </div>

               <Link to={`/post/${id}`} class="py-1.5 px-4 hover:text-blue-600 hover:scale-105 hover:shadow text-center border border-gray-300 rounded-md h-12 text-sm flex items-center gap-1 lg:gap-2">
                  <span>Read More </span>
                  <FontAwesomeIcon icon={faAnglesRight}/>
               </Link>

           </div>
         </div>
 
         <div class="w-1/2 mr-4 mt-2 mb-2 ">
          <img referrerpolicy="no-referrer" class="w-full rounded-md h-full aspect-video bg-gray-300"  src={postImage}/>
         </div>
       </div> 
      :
      <div class="w-[64rem] m-4 h-[256px] bg-slate-200 rounded-xl shadow-xl flex flex-row">

        <div class="ml-4 mt-4 mb-4 mr-4 flex flex-col justify-between w-1/2  ">

          <div class="flex flex-row gap-2  p-2 rounded-lg transition-all duration-300 hover:bg-slate-50">
            <NavLink to={`/profile/${authorID}`} id='profile' class="">
              {authorImage ?
                <img referrerpolicy="no-referrer" class="size-16 rounded-full bg-gray-300"  src={authorImage}/>
                :
                <FontAwesomeIcon class="size-16" icon={faCircleUser} />
              }
              <div class="text-left">
                <h2 class="text-[1.5em] font-bold font-inter tracking-wider">{authorName}</h2>
                <h4 class="text-[1.2em] font-normal font-inter">{date}</h4>
              </div>
            </NavLink>
          </div>


          <div class="flex flex-row gap-4 items-center">
            <button onClick={() => submitVote("upvote")} class="py-1.5 px-4 hover:text-green-600 hover:scale-105 hover:shadow text-center border border-gray-300 rounded-md  h-12 text-sm flex items-center gap-1 lg:gap-2">
                  <FontAwesomeIcon icon={faThumbsUp}/>

                  <span>{votes.filter(vote => vote.votetype === "upvote").length}</span>
              </button>

              <button onClick={() => submitVote("downvote")} class="py-1.5 px-4 hover:text-red-600 hover:scale-105 hover:shadow text-center border border-gray-300 rounded-md h-12 text-sm flex items-center gap-1 lg:gap-2">
                  <FontAwesomeIcon icon={faThumbsDown}/>
                  <span>{votes.filter(vote => vote.votetype === "downvote").length}</span>
              </button>
              <div class="py-1.5 px-4 hover:text-blue-600 hover:scale-105 hover:shadow text-center border border-gray-300 rounded-md h-12 text-sm flex items-center gap-1 lg:gap-2">
                  <FontAwesomeIcon icon={faComment}/>
                  <span>{comments}</span>
              </div>
              <Link to={`/post/${id}`} class="py-1.5 px-4 hover:text-blue-600 hover:scale-105 hover:shadow text-center border border-gray-300 rounded-md h-12 text-sm flex items-center gap-1 lg:gap-2">
                  <span>Read More </span>
                  <FontAwesomeIcon icon={faAnglesRight}/>
               </Link>
          </div>
        </div>

        <div class="w-1/2 mr-4 mt-2 mb-2 ">
          <h2 class="font-bold font-inter mb-1">{title.length > 40 ? title.substring(0,40) + "..." : title}</h2>
          <h3 class="italic font-inter mb-1">{subtitle}</h3>
          {summary !== undefined ? <div dangerouslySetInnerHTML={convertedSummary}/>: <div></div>}
        </div>
      </div> 
      }
    </>
  
  )
}
