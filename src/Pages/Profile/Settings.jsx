import React, { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useNavigate, useParams } from 'react-router-dom'
import { auth, db, storage } from '../../firebase';
import { updateProfile } from 'firebase/auth';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'

export const Settings = ({isAuth}) => {

  let { userID } = useParams();
  let navigate = useNavigate();

  const user = auth.currentUser;

  const emailRef = useRef();
  const displaynameRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  
  const [error,setError] = useState("");
  const [loading,setLoading] = useState(false);
  const [photo, setPhoto] = useState(null);

  function handleChange(e) {
    if (e.target.files[0]) {
      setPhoto(e.target.files[0])
    }
  }


  async function UpdateProfile() {
      
    setLoading(true);
    const fileRef = ref(storage,"UserImages/profileimages/" + userID + '.png');

    const snapshot = await uploadBytes(fileRef, photo);
    const newphotoURL = await getDownloadURL(fileRef);


    updateProfile(user, {
        displayName: displaynameRef.current.value,
        photoURL: newphotoURL,

        }).then(() => {
        // Profile updated!
        // ...
        }).catch((error) => {
        // An error occurred
        // ...
    });
    setLoading(false);
    navigate("/");
}


  return (
  <>
    {isAuth ? 
      <>
        <h1> Loading </h1>
      </>
      :

      <div class="h-full flex">

      <div class="w-full max-w-sm p-6 m-auto mx-auto rounded-lg shadow-md bg-white dark:bg-white">
       
  
            <form class="mt-6 " name='registerForm' onSubmit={ UpdateProfile}>
              <div className='mb-4'>
                  <label  for="email" class="block text-sm text-gray-800 dark:text-gray-200">Email</label>
                  <input
                      type="email"
                      name="email"
                      placeholder={user.email}
                      data-message-required="Please enter your email address"
                      data-message-email="Please enter a VALID email address"
                      class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-lg dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
                  />
              </div>
  
              <div className='mb-4'>
                  <label  for="displayname" class="block text-sm text-gray-800 dark:text-gray-200">Display Name</label>
                  <input
                      type="text"
                      name="displayname"
                      placeholder={user.displayName}
                      data-message-required="Please enter your email address"
                      data-message-email="Please enter a VALID email address"
                      class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-lg dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
                  />
              </div>
              <div class="mt-4">
                        <div class="flex items-center justify-between">
                            <label for="password_confirm" class="block text-sm text-gray-800 dark:text-gray-200">Profile Image</label>
                        </div>
                        <input 
                            type="file" 
                            class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-lg dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
  
                            onChange={handleChange} 
                        />
                              
                    </div>
  
                <div class="mt-6">
                    <input 
                      value="Update Info"  
                      type='submit' 
                      class="w-full px-6 py-2.5 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-gray-800 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-50" 
                    />
                        
                </div>
            </form>
        </div>
    </div>
    }
</>



    
  )
}
