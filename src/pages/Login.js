import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { updateDoc, doc } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
    const [data, setData] = useState({
        email: "",
        password: "",
        error: null,
        loading: false,
    });
    
    const navigate = useNavigate();
    
    const { email, password, error, loading } = data;
    
    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setData({ ...data, error: null, loading: true });
        if (!email || !password) {
          setData({ ...data, error: "All fields are required" });
        }
        try {
          const result = await signInWithEmailAndPassword(auth, email, password);
          await updateDoc(doc(db, "users", result.user.uid), {
            isOnline: true,
          });
          setData({
            email: "",
            password: "",
            error: null,
            loading: false,
          });
          navigate("/")
        } catch (err) {
            switch(err.code) {
                case "auth/wrong-password":
                    err.message =  "Erreur : Le mot de passe lié à ce compte ne correspond pas"
                    break;
                case "auth/invalid-email":
                    err.message = "Erreur : L'adresse email est invalide"
                    break;
                case "auth/user-not-found":
                    err.message = "Erreur : Aucun uticonlisateur n'a été trouvé"
                    break;
                default:
                    console.log(`Sorry, we are out of`);
            }
          setData({ ...data, error: err.message, loading: false });
        }
    };

    return (
        <>
        <section>
            <h3>Connexion</h3>
            <form className="form" onSubmit={handleSubmit}>
                <div className="input_container">
                    <label htmlFor="email">Email</label>
                    <input
                        type="text"
                        name="email"
                        value={email}
                        onChange={handleChange}
                    />
                </div>
                <div className="input_container">
                    <label htmlFor="password">Mot de passe</label>
                    <input
                        type="password"
                        name="password"
                        value={password}
                        onChange={handleChange}
                    />
                </div>
                {error ? <p className="error">{error}</p> : null}
                <div className="btn_container">
                    <button className="btn" disabled={loading}>
                        {loading ? "Connexion en cours..." : "Connectez-vous !"}
                    </button>
                </div>
            </form>
        </section>
        <div>
            <Link to="/forgot-password" style={{ textDecoration: "none"}}>
                <p className="link_container">
                    Mot de passe oublié ?
                </p>
            </Link>
            <Link to="/register" style={{ textDecoration: 'none' }}>
                <p className="link_container">
                    Pas de compte ? Inscrivez-vous !
                </p>
            </Link>
        </div>
        </>
    )
}

export default Login
