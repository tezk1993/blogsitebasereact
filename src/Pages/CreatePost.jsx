import React, {useRef, useEffect, useState } from 'react'
import { addDoc, collection } from 'firebase/firestore';
import { auth, db, storage} from '../firebase';
import { useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {
  getDownloadURL,
  ref as storageRef,
  uploadBytes,
} from "firebase/storage";
import firebase from 'firebase/compat/app';
import 'firebase/firestore'
import { serverTimestamp } from 'firebase/firestore';


export const CreatePost = ({isAuth}) => {
    const [title,setTitle] = useState('');
    const [bodytext,setBodytext] = useState('');
    const [subtitle,setSubtitle] = useState('');
    const [summary,setSummary] = useState('');

    const [featuredImage,setFeaturedImage] = useState('');

    let navigate = useNavigate();
    const handleTitleChange = (event) => {
        setTitle(event.target.value);
    };


    const handleSummaryChange= (event) => {
      setSummary(event.target.value);
    }

    const handleSubtitleChange= (event) => {
      setSubtitle(event.target.value);
    }

    const SubmitPost =  async () =>{
        if(auth.currentUser === null) return;
        const timestamp = Date.now();
        await addDoc(collection(db,"posts"),{
            summary:summary,
            tags: [],
            featured_image: "",
            created_at: serverTimestamp(),
            last_edit_at: serverTimestamp(),
            title: title,
            subtitle: subtitle,
            body: bodytext,
            author: {name: auth.currentUser.displayName, id: auth.currentUser.uid, image: auth.currentUser.photoURL},
            comments: [],
        });
        navigate("/");
    }

    useEffect(() => {
      if(!isAuth){
        navigate("/");
      }


    }, [isAuth])



  return (
    <div class="flex flex-col items-center">

      <div class="w-[48em] min-h-96 flex flex-col gap-4">
          <h2 class="">Create A Post</h2>
          <input required class="w-full p-2 rounded-md bg-gray-100" type='text' onChange={handleTitleChange} value={title} placeholder='Title...'/>

          <input class="w-full p-2 rounded-md bg-gray-100" type='text' onChange={handleSubtitleChange} value={subtitle} placeholder='Subtitle...'/>
          <textarea  maxLength={300} class="resize-none w-full p-2 rounded-md bg-gray-100" type='text' onChange={handleSummaryChange} value={summary} placeholder='Summary...'/>
          <ReactQuill 
            theme={'snow'}
            onChange={setBodytext}
            value={bodytext}
            modules={CreatePost.modules}
            formats={CreatePost.formats}
            bounds={'.app'}
          />
         <div id="draft-submit-buttons" class="ml-auto">
            <button class="text-black hover:text-white border border-gray-800 bg-gray-100 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-bold rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-gray-600 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-800">Save to Draft</button>
            <button onClick={SubmitPost} class="text-black hover:text-white border border-gray-800 bg-gray-100 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-bold rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-gray-600 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-800">Submit</button>
         </div>
        </div>
    </div>
  )
}

CreatePost.modules = {
  toolbar: [
    [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
    [{size: []}],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{'list': 'ordered'}, {'list': 'bullet'}, 
     {'indent': '-1'}, {'indent': '+1'}],
    ['link'],
    ['clean']
  ],
  clipboard: {
    // toggle to add extra line breaks when pasting HTML:
    matchVisual: false,
  }
}

CreatePost.formats = [
  'header', 'font', 'size',
  'bold', 'italic', 'underline', 'strike', 'blockquote',
  'list', 'bullet', 'indent',
  'link', 'image', 'video'
]