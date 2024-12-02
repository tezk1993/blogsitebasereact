import React from "react";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquarePlus, faUser } from "@fortawesome/free-regular-svg-icons";
import {
  faCog,
  faRightFromBracket,
  faRightToBracket,
} from "@fortawesome/free-solid-svg-icons";
import { storage } from "../firebase";
import { getDownloadURL, ref } from "firebase/storage";

export const Header = ({ signout, isAuth, userID }) => {
  getDownloadURL(ref(storage, "SiteImages/OpenBook_Logo.png"))
    .then((url) => {
      // `url` is the download URL for 'images/stars.jpg'

      // This can be downloaded directly:
      const xhr = new XMLHttpRequest();
      xhr.responseType = "blob";
      xhr.onload = (event) => {
        const blob = xhr.response;
      };
      xhr.open("GET", url);
      xhr.send();

      // Or inserted into an <img> element
      const img = document.getElementById("logo");
      img.setAttribute("src", url);
    })
    .catch((error) => {
      // Handle any errors
    });

  return (
    <header class="flex items-center justify-between flex-row text-xl m-4 font-bold">
      <NavLink class="hover:underline m-4 md:m-6" to="/">
        <img
          id="logo"
          referrerpolicy="no-referrer"
          src={process.env.PUBLIC_URL + `/OpenBook_Logo.png`}
          class="size-24"
        />
      </NavLink>
      <nav class="text-4xl gap-6 flex ">
        {isAuth ? (
          <>
            <div class="group flex flex-row-reverse  items-center  transition-all rounded-md">
              <NavLink to="/createpost">
                <FontAwesomeIcon icon={faSquarePlus} />
              </NavLink>
              <p class="text-lg invisible group-hover:visible mr-2 transition-all ">
                Create post
              </p>
            </div>
            <NavLink class="" to={`/profile/${userID}`}>
              <FontAwesomeIcon icon={faUser} />
            </NavLink>
            <NavLink class="" to={`/profile/${userID}/settings`}>
              <FontAwesomeIcon icon={faCog} />
            </NavLink>
            <button class="" onClick={signout}>
              <FontAwesomeIcon icon={faRightFromBracket} />
            </button>
          </>
        ) : (
          <NavLink class=" " to="/login">
            <FontAwesomeIcon icon={faRightToBracket} />
          </NavLink>
        )}
      </nav>
      <h1 class="text-5xl font-lora absolute left-[50%] translate-x-[-50%] tracking-wider underline underline-offset-[16px]">
        OPEN BOOK
      </h1>
    </header>
  );
};
