import React, { useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { auth } from "../firebase";
import { updateEmail, updatePassword } from "firebase/auth";

const ProfileUpdate = () => {

    const emailRef = useRef();
    const passwordRef = useRef();
    const passwordConfirmRef = useRef();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if(passwordRef.current.value !== passwordConfirmRef.current.value) {
            return setError("Erreur : Les mots de passe ne sont pas identiques");
        }

        if(passwordRef.current.value < 6 || passwordConfirmRef.current.value < 6) {
            return setError("Erreur : Un mot de passe doit faire au minimum 6 caractères");
        }

        const promises = [];
        setLoading(true);
        setError("");
        
        if(emailRef.current.value !== auth.currentUser.email) {
            promises.push(updateEmail(auth.currentUser, emailRef.current.value));
        }

        if(passwordRef.current.value !== auth.currentUser.password) {
            promises.push(updatePassword(auth.currentUser, passwordRef.current.value));
        }

        Promise.all(promises)
            .then(() => {
                navigate("/");
            })
            .catch(() => {
                setError("Echec de la mise à jour");
            })
            .finally(() => {
                setLoading(false);
            })
    }
    return (
        <section>
            <h3>Modifier mes informations</h3>
            <form className="form" onSubmit={handleSubmit}>
                <div className="input_container">
                    <label htmlFor="email">Email</label>
                    <input
                        type="text"
                        name="email"
                        ref={emailRef}
                        required
                        defaultValue={auth.currentUser.email}
                    />
                </div>
                <div className="input_container">
                    <label htmlFor="password">Mot de passe</label>
                    <input
                        type="password"
                        name="password"
                        ref={passwordRef}
                    />
                </div>
                <div className="input_container">
                    <label htmlFor="password">Confirmer Mot de passe</label>
                    <input
                        type="password"
                        name="confirmPassword"
                        ref={passwordConfirmRef}
                    />
                </div>
                <div className="btn_container">
                    <button className="btn" disabled={loading} type="submit">
                        Mettre à jour mon profil
                    </button>
                </div>
                {error ? <p>{error}</p> : null}
            </form>
        </section>
    )
}

export default ProfileUpdate
