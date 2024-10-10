import React, { useRef, useState } from 'react'
import { auth,googleProvider, storage } from '../firebase'
import { createUserWithEmailAndPassword, signInWithPopup, updateProfile } from 'firebase/auth'
import { NavLink, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGoogle } from '@fortawesome/free-brands-svg-icons'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
export const Register = ({setIsAuth}) => {

    let navigate = useNavigate();
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

      
    const signInWithGoogle = () => {
        
        signInWithPopup(auth,googleProvider)
        .then((result) => {
            localStorage.setItem("isAuth",true);
            setIsAuth(true);
            navigate("/");
        });
    }
    async function SetupProfile(currentUser) {
      
        setLoading(true);
        const fileRef = ref(storage,"UserImages/profileimages/" + currentUser.uid + '.png');

        const snapshot = await uploadBytes(fileRef, photo);
        const newphotoURL = await getDownloadURL(fileRef);


        updateProfile(currentUser, {
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

    const authRegister =  (event) => {
        event.preventDefault();

        if (passwordRef.current.value !== passwordConfirmRef.current.value) {
            return setError("Passwords do not match")
        }
      
        setLoading(true);

         createUserWithEmailAndPassword(auth, emailRef.current.value, passwordRef.current.value)
        .then((userCredential) => {
          // Signed in 
            const user = userCredential.user;
            localStorage.setItem("isAuth",true);
            setIsAuth(true);
            SetupProfile(user);
          
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          alert(errorMessage);
        });
        setLoading(false);


    }

    
  return (
    <div class="h-full flex">

                <div class="w-full max-w-sm p-6 m-auto mx-auto rounded-lg shadow-md bg-white dark:bg-white">
                <div class="flex justify-center mx-auto">
                    <img referrerpolicy="no-referrer" src='OpenBook_Logo.png' class="size-24" />
                </div>

                <form class="mt-6" name='registerForm' onSubmit={ authRegister}>
                    <div>
                        <label  for="email" class="block text-sm text-gray-800 dark:text-gray-200">Email</label>
                        <input
                            type="email"
                            name="email"
                            ref={emailRef}
                            data-message-required="Please enter your email address"
                            data-message-email="Please enter a VALID email address"
                            required={true}
                            class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-lg dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
                        />
                    </div>

                    <div>
                        <label  for="displayname" class="block text-sm text-gray-800 dark:text-gray-200">Display Name</label>
                        <input
                            type="text"
                            name="displayname"
                            ref={displaynameRef}
                            required={true}
                            class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-lg dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
                        />
                    </div>

                    <div class="mt-4">
                        <div class="flex items-center justify-between">
                            <label for="password" class="block text-sm text-gray-800 dark:text-gray-200">Password</label>
                        </div>

                        <input
                            type="password"
                            name="password"
                            ref={passwordRef}
                            data-minlength="6"
                            class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-lg dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
                            data-maxnlength="20"
                            required={true}
                            data-message="Please enter your password"
                        />                    
                    </div>
                    <div class="mt-4">
                        <div class="flex items-center justify-between">
                            <label for="password_confirm" class="block text-sm text-gray-800 dark:text-gray-200">Password confirmation</label>
                        </div>

                        <input
                            type="password"
                            name="password_confirm"
                            ref={passwordConfirmRef}
                            class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-lg dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
                            data-minlength="6"
                            data-maxnlength="20"
                            required={true}
                            data-message="Please enter your password"
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
                        {/* <button disabled={loading || !photo} onClick={handleClick} class="w-full px-6 py-2.5 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-gray-800 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-50">Upload</button> */}
                              
                    </div>


                    <div class="mt-6">
                        <input value="Sign Up" disabled={loading} type='submit' class="w-full px-6 py-2.5 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-gray-800 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-50" />
                            
                    </div>
                </form>

                <div class="flex items-center justify-between mt-4">
                    <span class="w-1/5 border-b dark:border-gray-600 lg:w-1/5"></span>

                    <a href="#" class="text-xs text-center text-gray-500 uppercase dark:text-gray-400 hover:underline">
                        or Sign up with Social Media
                    </a>

                    <span class="w-1/5 border-b dark:border-gray-400 lg:w-1/5"></span>
                </div>

                <div class="flex items-center mt-6 -mx-2">
                    <button  onClick={signInWithGoogle}  type="button" class="flex items-center justify-center w-full px-6 py-2 mx-2 text-sm font-medium text-white transition-colors duration-300 transform bg-blue-500 rounded-lg hover:bg-blue-400 focus:bg-blue-400 focus:outline-none">
                        <FontAwesomeIcon icon={faGoogle}/>
                        <span class="hidden mx-2 sm:inline">Sign up with Google</span>
                    </button>

                </div>
                <p class="mt-8 text-xs font-light text-center text-gray-700 dark:text-gray-400"> Already have an account ? <NavLink to={"/login"} class="font-medium text-gray-800 dark:text-gray-800 hover:underline">Sign in</NavLink></p>

            </div>
    </div>
  )
}
