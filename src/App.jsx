import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes,Route,Link, NavLink } from 'react-router-dom';
import { Home } from './Pages/Home';
import {Login} from './Pages/Login';
import {CreatePost} from './Pages/CreatePost';
import { useState } from 'react';
import { auth } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { Profile } from './Pages/Profile/Profile';
import { Post } from './Pages/Post';
import { Header } from './Components/Header';
import { Footer } from './Components/Footer';
import { Register } from './Pages/Register';
import { Settings } from './Pages/Profile/Settings';



function App() {
  const [isAuth,setIsAuth] = useState(localStorage.getItem("isAuth"));
  const [userID,setUserID] = useState("")
  const signUserOut = () => {
    signOut(auth).then(() => {
      localStorage.setItem("isAuth",false);
      setIsAuth(false);

    }).catch((error) => {
      // An error happened.
    });
};


onAuthStateChanged(auth, (user) => {
  if (user) {
    setUserID(user.uid);
    localStorage.setItem("isAuth",true);
    setIsAuth(true);
  } else {
    localStorage.setItem("isAuth",false);
    setIsAuth(false);
  }
});

  return (
    <Router >
      <div class="flex flex-col  overflow-auto bg-slate-100">
      <Header userID={userID} isAuth={isAuth} signout={signUserOut}/>
      <section class="h-3/4 min-h-svh">
        <Routes> 
          <Route path="/" element={<Home  isAuth= {isAuth}/>}/>
          <Route path="/login" element={<Login setIsAuth= {setIsAuth}/>}/>
          <Route path="/register" element={<Register setIsAuth= {setIsAuth}/>}/>

          <Route path="/createpost" element={<CreatePost isAuth= {isAuth}/>}/>
          <Route path="/post/:postid" element={<Post isAuth= {isAuth}/>}/>
          <Route path="/profile/:userID" element={<Profile isAuth= {isAuth}/>}/>
          <Route path="/profile/:userID/settings" element={<Settings isAuth= {isAuth}/>}/>

        </Routes>
      </section>
      <Footer />
      </div>
      
    </Router>
  );
}

export default App;
