import React, { useEffect, useState } from "react";
import { db, auth, storage } from "../firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  Timestamp,
  orderBy,
  setDoc,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import User from "../components/User";
import MessageForm from "../components/MessageForm";
import Message from "../components/Message";

const Home = () => {
  const [users, setUsers] = useState([]);
  const [chat, setChat] = useState("");
  const [text, setText] = useState("");
  const [img, setImg] = useState("");
  const [msgs, setMsgs] = useState([]);

  const user1 = auth.currentUser.uid;

  useEffect(() => {
    // Récupére la collection users
    const usersRef = collection(db, "users");
    // Créé la requête permettant de récupérer tous les users
    const q = query(usersRef, where("uid", "not-in", [user1]));
    // Execute la requête
    const unsub = onSnapshot(q, (querySnapshot) => {
      let users = [];
      querySnapshot.forEach((doc) => {
        users.push(doc.data());
      });
      setUsers(users);
    });
    return () => unsub();
  });

  const selectUser = async (user) => {
    setChat(user);
    const user2 = user.uid;

    // id de la conversation
    const id = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`;

    // Créer une collection messages,
    const msgsRef = collection(db, "messages", id, "chat");
    // Créer la requête permettant la création du chat entre les deux users
    const q = query(msgsRef, orderBy("createdAt", "asc"));

    onSnapshot(q, (querySnapshot) => {
      let msgs = [];
      querySnapshot.forEach((doc) => {
        msgs.push(doc.data());
      });
      setMsgs(msgs);
    });

    // Récupére le dernier message envoyé
    const docSnap = await getDoc(doc(db, "lastMsg", id));
    // si le dernier message existe et que l'utilisateur à lu le message
    if (docSnap.data() && docSnap.data().from !== user1) {
      // on update le champ unread à false
      await updateDoc(doc(db, "lastMsg", id), { unread: false });
    }
  };

  const handleUpload = async (e) => {
    const user2 = chat.uid;
    const id = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`;
    let url;
    if (img) {
      const imgRef = ref(
        storage,
        `images/${new Date().getTime()} - ${img.name}`
      );
      const snap = await uploadBytes(imgRef, img);
      const dlUrl = await getDownloadURL(ref(storage, snap.ref.fullPath));
      url = dlUrl;
      setImg("")
      
      if(url) {
        await addDoc(collection(db, "messages", id, "chat"), {
          from: user1,
          to: user2,
          media: url,
          createdAt: Timestamp.fromDate(new Date()),
        });
      }
    }
  }


  const handleSubmit = async (e) => {
    e.preventDefault();
    const user2 = chat.uid;
    const id = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`;
    let url;
    if (img) {
      const imgRef = ref(
        storage,
        `images/${new Date().getTime()} - ${img.name}`
      );
      const snap = await uploadBytes(imgRef, img);
      const dlUrl = await getDownloadURL(ref(storage, snap.ref.fullPath));
      url = dlUrl;
    }

    if(text.length > 0) {
      text.trim();
      await addDoc(collection(db, "messages", id, "chat"), {
        text: text || "",
        from: user1,
        to: user2,
        media: url || "",
        createdAt: Timestamp.fromDate(new Date()),
      });
      await setDoc(doc(db, "lastMsg", id), {
        text: text || "",
        from: user1,
        to: user2,
        media: url || "",
        createdAt: Timestamp.fromDate(new Date()),
        unread: true,
      });
      setText("");
    }
  };

  return (
    <div className="home_container">
      <div className="users_container">
        {users.map((user) => (
          <User
            key={user.uid}
            user={user}
            selectUser={selectUser}
            user1={user1}
            chat={chat}
          />
        ))}
      </div>
      <div className="messages_container">
        {chat ? (
          <>
            <div className="messages_user">
              <h3>{chat.firstname} {chat.name}</h3>
            </div>
            <div className="messages">
              {msgs.length
                ? msgs.map((msg, i) => (
                    <Message key={i} msg={msg} user1={user1} />
                  ))
                : null}
            </div>
            <MessageForm
              handleSubmit={handleSubmit}
              handleUpload={handleUpload}
              text={text}
              setText={setText}
              setImg={setImg}
            />
          </>
        ) : (
          <h3 className="no_conv">Selectionner un utilisateur pour démarrer une conversation</h3>
        )}
      </div>
    </div>
  );
};

export default Home;
