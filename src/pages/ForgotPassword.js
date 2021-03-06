import { sendPasswordResetEmail } from "firebase/auth";
import React, { useState, useRef } from "react"
import { auth } from '../firebase';

const ForgotPassword = () => {
    const emailRef = useRef()
    const [error, setError] = useState("")
    const [message, setMessage] = useState("")
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("")
        setError("")
        setLoading(true)
        await sendPasswordResetEmail(auth, emailRef.current.value)
            .then(() => {
                setMessage('Un lien de rénitialisation de mot de passe vous a été envoyé sur votre boite email')
            })
            .catch(() => {
                setError("Erreur lors de la rénitialisation du mot de passe, cet email n'existe pas ou n'est pas valide")
            })
            .finally(() => {
                setLoading(false)
            })
    }

    return (
        <section>
            <h3>Rénitialiser le mot de passe</h3>
            <form className="form" onSubmit={handleSubmit}>
                <div className="input_container">
                <label htmlFor="email">Email</label>
                <input
                    type="text"
                    name="email"
                    ref={emailRef}
                    required
                />
                </div>
                
                <div className="input_container">
                    <div className="btn_container">
                        <button className="btn" disabled={loading}>
                            Rénitialiser le mot de passe
                        </button>
                    </div>
                </div>
                {message ? <p className="error">{message}</p> : null}
                {error ? <p className="error">{error}</p> : null}
            </form>
        </section>
    )
}

export default ForgotPassword
