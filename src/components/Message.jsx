import React, { useRef, useEffect } from "react";
import Moment from "react-moment";
import 'moment/locale/fr';

const Message = ({ msg, user1 }) => {
  
  const scrollRef = useRef();

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  });

  return (
    <div
      className={`message_wrapper ${msg.from === user1 ? "own" : ""}`}
      ref={scrollRef}
    >
      <p className={msg.from === user1 ? "friend" : "me"}>
        {msg.media ? <img src={msg.media} alt={msg.text} /> : null}
        {msg.text}
        <br />
        <small>
          <Moment locale="fr" fromNow>{msg.createdAt.toDate()}</Moment>
        </small>
      </p>
    </div>
  );
};

export default Message;