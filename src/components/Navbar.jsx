import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { auth, db } from "../firebase";
import { signOut } from "firebase/auth";
import { updateDoc, doc } from "firebase/firestore";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { BsToggleOff, BsToggleOn } from 'react-icons/bs';
import { FaSignOutAlt, FaSignInAlt } from 'react-icons/fa';
import { CgProfile } from 'react-icons/cg';
import { ImUserPlus } from 'react-icons/im';

const Navbar = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme", 
      localStorage.getItem("theme")
    );

    setTheme(localStorage.getItem("theme"));
  }, []);

  const switchTheme = () => {
    if (theme === "light") {
      saveTheme('dark');
    } else {
      saveTheme('light');
    }
  }

  const saveTheme = (theme) => {
    setTheme(theme);
    localStorage.setItem("theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
  }

  const handleSignout = async () => {
    await updateDoc(doc(db, "users", auth.currentUser.uid), {
      isOnline: false,
    });
    await signOut(auth);
    navigate("/login");
  };

  return (
    <nav>
      <p className="navbar_brand">
        <Link to="/">Messenger</Link>
      </p>
      <div className="div_nav">
        {auth.currentUser !== null ? (
          <>
            <button className="btn_nav">
              <Link to="/profile">
                <CgProfile />
              </Link>
            </button>
            <button className="btn_nav" onClick={handleSignout}>
              <FaSignOutAlt />
            </button>
          </>
        ) : (
          <>
            <button className="btn_nav">
              <Link to="/register" className=""><ImUserPlus /></Link>
            </button>
            <button className="btn_nav">
              <Link to="/login"><FaSignInAlt /></Link>
            </button>
          </>
        )}
      </div>
      <button className="btn_nav" onClick={switchTheme}>
        {theme === "light" ? (
          <BsToggleOff />
        ) : (
          <BsToggleOn />
        )}
      </button>
    </nav>
  );
};

export default Navbar;
