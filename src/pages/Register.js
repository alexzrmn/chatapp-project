import React, { useState } from "react";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc, Timestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const Register = () => {

    const [data, setData] = useState({
        name: "",
        firstname: "",
        email: "",
        password: "",
        confirmPassword: "",
        error: null,
        loading: false,
    });

    const navigate = useNavigate();
    const { name, firstname, email, password, confirmPassword, error, loading } = data;

    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setData({ ...data, error: null, loading: true });
        if (!name || !email || !password) {
          setData({ ...data, error: "Tous les champs sont requis" });
        } else if (password !== confirmPassword) {
            setData({...data, error: "Les mots de passe ne sont pas identique"});
        } else {
            try {
                const result = await createUserWithEmailAndPassword(
                  auth,
                  email,
                  password
                );
                await setDoc(doc(db, "users", result.user.uid), {
                  uid: result.user.uid,
                  name,
                  firstname,
                  email,
                  createdAt: Timestamp.fromDate(new Date()),
                  isOnline: true,
                });
                setData({
                  name: "",
                  email: "",
                  firstname: "",
                  password: "",
                  error: null,
                  loading: false,
                });
                navigate('/login');
              } catch (err) {
                switch(err.code) {
                    case "auth/email-already-use":
                        err.message =  "Erreur : L'adresse email est déjà utilisé";
                        break;
                    case "auth/invalid-email":
                        err.message = "Erreur : L'adresse email est invalide";
                        break;
                    case "auth/weak-password":
                        err.message = "Erreur:  Le mot de passe dois faire au minimun 6 caractères";
                        break;
                    default:
                        console.log(`error`);
                }
                setData({ ...data, error: err.message, loading: false });
              }
        }
        
    };

    return (
        <section>
            <h3>Créer un compte</h3>
            <form className="form" onSubmit={handleSubmit}>
                <div className="input_container">
                    <label htmlFor="name">Nom</label>
                    <input type="text" name="name" value={name} onChange={handleChange}/>
                </div>
                <div className="input_container">
                    <label htmlFor="firstname">Prénom</label>
                    <input type="text" name="firstname" value={firstname} onChange={handleChange}/>
                </div>
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
                <div className="input_container">
                    <label htmlFor="password">Confirmer Mot de passe</label>
                    <input
                        type="password"
                        name="confirmPassword"
                        value={confirmPassword}
                        onChange={handleChange}
                    />
                </div>
                {error ? <p className="error">{error}</p> : null}
                <div className="btn_container">
                    <button className="btn" disabled={loading}>
                        {loading ? "Création de votre compte..." : "Inscription"}
                    </button>
                </div>
            </form>
        </section>
    )
}

export default Register
