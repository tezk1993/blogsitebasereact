import {arrayUnion, collection, doc, getDoc, getDocs, setDoc, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { NavLink, useParams } from 'react-router-dom';
import { auth, db } from '../firebase';
import ReactQuill from 'react-quill';
import { Comment } from '../Components/Comment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleUser, faComment, faThumbsDown, faThumbsUp } from '@fortawesome/free-regular-svg-icons';

export const Post = () => {
  
    let { postid } = useParams();
    const [post,setPost] = useState();
    const [commentText,setCommentText] = useState("");
    const postDoc = doc(db,"posts",postid);
    const votesCol= collection(db,"posts",postid,"voters");
    const [votes,setVotes] = useState([]);



    const getPost = async () =>{
        const docSnap = await getDoc(postDoc);
        if (docSnap.exists()) {
            setPost(docSnap.data());
          } else {
            console.log("No such document!");
        }
      };
    const getVotes = async () =>{
        const data = await getDocs(votesCol);
        const voteDocs = data.docs.map((doc) => ({...doc.data(),id:doc.id}));
        
        if (voteDocs !== null) {
          setVotes(voteDocs);
        } else {
            console.log("No such document!");
        }
      };

    const SubmitComment =  async () =>{
        if(auth.currentUser === null) return;
        const timestamp = Date.now();
        
        const createComment = await updateDoc(postDoc, {
          comments: arrayUnion({
            name: auth.currentUser.displayName,
            text: commentText,
            created_at: new Date(timestamp).toDateString(),
            edited_at: new Date(timestamp).toDateString(),
            userid: auth.currentUser.uid,
            userimage: auth.currentUser.photoURL,
          })
      });
      setCommentText("");
      getPost();

    }

    
    const submitVote =  async (voteType) =>{
      const voteDoc = doc(db,"posts",postid,"voters",auth.currentUser.uid);
      if(voteDoc){
        await setDoc(doc(db, "posts",postid,"voters", auth.currentUser.uid), {
          votetype: voteType
        });
      }else{
        await updateDoc(voteDoc, {
          votetype: voteType
        });
      }
      getVotes();
    }

    useEffect(() => {
        getPost();
        getVotes();
    },[]);

  return (

    <>
    
    {
      post ? 
      <div > 
        <div class="flex flex-col items-center w-1/2 m-auto mt-10">
          <h1>{post.title}</h1>
          <h2>{post.subtitle}</h2>
          <div id='profile' class="flex flex-row gap-2 bg-slate-50 p-2 rounded-lg transition-all duration-300 m-20">
            {post.author.image ?
              <img referrerpolicy="no-referrer" class="size-16 rounded-full bg-gray-300"  src={post.author.image}/>
              :
              <FontAwesomeIcon class="size-16 rounded-full bg-gray-300" icon={faCircleUser} />
            }
            <div class="text-left">
              <h2 class="text-[1.5em] font-bold font-inter tracking-wider">{post.author.name}</h2>
              <h4 class="text-[1.2em] font-normal font-inter">{new Date(post.created_at.seconds * 1000).toDateString()}</h4>
            </div>
          </div>
          <img  src={post.featured_image}/>
          <p class="italic text-lg m-10">{post.summary}</p>
          <hr class="h-1 w-full my-8 bg-gray-400 border-2 dark:bg-gray-400"/>
          <div dangerouslySetInnerHTML={{ __html: `${post.body}` }}/>
          <div class="flex flex-row gap-4 items-center mt-8">
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
                  <span>{post.comments.length}</span>
              </div>
          </div>
          <hr class="h-1 w-full my-8 bg-gray-400 border-2 dark:bg-gray-400"/>
        </div>
    
        {auth.currentUser !== null ?  
          <div class="w-1/2 flex flex-col m-auto ">
      
            <ReactQuill 
              theme={'snow'}
              onChange={setCommentText}
              value={commentText}
              modules={Post.modules}
              formats={Post.formats}
              bounds={'.app'}
              
            />
              <p class="mt-2 invisible peer-invalid:visible text-pink-600 text-sm">
                Character limit exceeded
              </p>
            <div id="draft-submit-buttons" class="ml-auto">
              <button onClick={SubmitComment} class="text-black hover:text-white border border-gray-800 bg-gray-100 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-bold rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-gray-600 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-800">Submit</button>
            </div>

            <div class="flex flex-col   w-full m-auto mt-10">
              {post.comments.map((comment) => {
                      if(comment.name === "") return;
                      return (

                        <Comment name={comment.name} commentText={comment.text} created_at={comment.created_at} photourl={auth.currentUser.photoURL} userid={auth.currentUser.uid}/>
                      )
                  })} 
            </div>
          </div>
          :
          <NavLink class="hover:underline m-4 md:m-6"  to="/login" >Login</NavLink>

          }
         
      </div> 
      
      : 

      <div>
        <h1>Loading</h1>
      </div>
    }

    </>
  )
}
Post.modules = {
  toolbar: [
    [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
    [{size: []}],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{'list': 'ordered'}, {'list': 'bullet'}, 
     {'indent': '-1'}, {'indent': '+1'}],

  ],
  clipboard: {
    // toggle to add extra line breaks when pasting HTML:
    matchVisual: false,
  }
}

Post.formats = [
  'header', 'font', 'size',
  'bold', 'italic', 'underline', 'strike', 'blockquote',
  'list', 'bullet', 'indent',
]