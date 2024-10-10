import React, {useRef, useEffect, useState } from 'react'
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { auth, db, storage} from '../firebase';
import { useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {
  getDownloadURL,
  ref,
  ref as storageRef,
  uploadBytes,
} from "firebase/storage";
import firebase from 'firebase/compat/app';
import 'firebase/firestore'
import { serverTimestamp } from 'firebase/firestore';
import { faPenRuler, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


export const CreatePost = ({isAuth}) => {
  let navigate = useNavigate();

  const [loading, setLoading] = useState(true);


  const [title,setTitle] = useState('');
  const [bodytext,setBodytext] = useState('');
  const [subtitle,setSubtitle] = useState('');
  const [summary,setSummary] = useState(''); 

  const [featuredImage,setFeaturedImage] = useState('');





  const draftsRef = collection(db, "drafts");
  const [drafts,setDrafts] = useState('');





  const handleTitleChange = (event) => {
      setTitle(event.target.value);
  };


  const handleSummaryChange= (event) => {
    setSummary(event.target.value);
  }

  const handleSubtitleChange= (event) => {
    setSubtitle(event.target.value);
  }

  function handleChange(e) {
    if (e.target.files[0]) {
      setFeaturedImage(e.target.files[0])
    }
  }


  const SubmitPost =  async () =>{
      if(auth.currentUser === null) {
        alert("Not logged in");
        return;
      };

      setLoading(true);
      const fileRef = ref(storage,"UserImages/postimages/" + title + "_featuredImage"+ '.png');

      const snapshot = await uploadBytes(fileRef, featuredImage);
      const newphotoURL = await getDownloadURL(fileRef);
      const timestamp = Date.now();
      await addDoc(collection(db,"posts"),{
          summary:summary,
          tags: [],
          featured_image: newphotoURL,
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
    getDrafts();

  }, [isAuth])


  //#region draftHandling
  const SaveDraft =  async () =>{
    if(auth.currentUser === null) return;
    const timestamp = Date.now();
    await addDoc(collection(db,"drafts"),{
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
    setBodytext("");
    setSummary("");
    setSubtitle("");
    setTitle("");
    getDrafts();
  }
  const getDrafts = async () =>{
    if(auth.currentUser === null) return;

    const q = query(draftsRef, where("author.id", "==", auth.currentUser.uid));
    setLoading(true);
    const data = await getDocs(q);
    const postsData = data.docs.map((doc) => ({...doc.data(),id:doc.id}));
    setDrafts(postsData);
    setLoading(false);
  };

  const LoadDraft =  async (id) =>{
    if(auth.currentUser === null) return;
    const postDoc = doc(db,"drafts",id);
    const docSnap = await getDoc(postDoc);
    
    if (docSnap.exists()) {
        console.log(docSnap.data());
      } else {
        console.log("No such document!");
    }

    setBodytext(docSnap.data().body);
    setSummary(docSnap.data().summary);
    setSubtitle(docSnap.data().subtitle);
    setTitle(docSnap.data().title);
    getDrafts();

  }

  const DeleteDraft =  async (id) =>{
    if(auth.currentUser === null) return;
    const postDoc = doc(db,"drafts",id);
    
    deleteDoc(postDoc);
    getDrafts();

  }
  //#endregion


  return (
    <div className='flex flex-row justify-between'>
      <div class="w-1/3 mr-10" >

      </div>

      <div>
        <div class="w-[48em] min-h-96 flex  flex-col gap-4">
            <h2 class="">Create A Post</h2>
            <input required class="w-full p-2 rounded-md bg-gray-100" type='text' onChange={handleTitleChange} value={title} placeholder='Title...'/>

            <input class="w-full p-2 rounded-md bg-gray-100" type='text' onChange={handleSubtitleChange} value={subtitle} placeholder='Subtitle...'/>
            <textarea  maxLength={300} class="resize-none w-full p-2 rounded-md bg-gray-100" type='text' onChange={handleSummaryChange} value={summary} placeholder='Summary...'/>
            <div class="mt-4">
              <div class="flex items-center justify-between">
                  <label for="password_confirm" class="block text-sm text-gray-800 dark:text-gray-200">Featured Image</label>
              </div>
              <input 
                  type="file" 
                  class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-lg dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
                  onChange={handleChange} 
              />
                              
            </div>
        
            <ReactQuill 
              theme={'snow'}
              onChange={setBodytext}
              value={bodytext}
              modules={CreatePost.modules}
              formats={CreatePost.formats}
              bounds={'.app'}
            />
          <div id="draft-submit-buttons" class="ml-auto">
              <button disabled={loading} onClick={SaveDraft} class="text-black hover:text-white border border-gray-800 bg-gray-100 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-bold rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-gray-600 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-800">Save to Draft</button>
              <button disabled={loading} onClick={SubmitPost} class="text-black hover:text-white border border-gray-800 bg-gray-100 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-bold rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-gray-600 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-800">Submit</button>
          </div>
        </div>
      </div>

      <div class="w-1/3 m-4 ml-10 flex flex-col gap-4">
      {loading ? 
        <>
        </>
        :
        
        <>        
        <h2>Drafts</h2>
        {drafts.map((draft) => {
          return  (
              <div  class="w-full flex flex-row justify-between items-center p-4 bg-slate-400 rounded-md ">
                <h3>{draft.title}</h3>
                <div className='flex flex-row gap-4'>
                  <button onClick={() => DeleteDraft(draft.id)} class="text-2xl text-red-500" >
                    <FontAwesomeIcon  icon={faTrash} />
                  </button>
                  <button onClick={() => LoadDraft(draft.id)} class="text-2xl text-[#FFD43B]" >
                    <FontAwesomeIcon  icon={faPenRuler} />
                  </button>
                </div>
      
              </div>
            )
            
        })}
        </>
      }
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