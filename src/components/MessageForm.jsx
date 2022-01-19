import React from "react";
import { FiSend, FiUpload } from 'react-icons/fi'

const MessageForm = ({ handleSubmit, handleUpload, text, setText, setImg }) => {
  return (
    <form id="form" className="message_form" onSubmit={handleSubmit}>
      <label className="btn_nobg" htmlFor="img">
        <FiUpload />
      </label>
      
      <input
        onChange={(e) => { 
          e.preventDefault();
          setImg(e.target.files[0]);
          handleUpload()
        }}
        type="file"
        id="img"
        accept="image/*"
        style={{ display: "none" }}
      />
      <div>
        <input
          type="text"
          placeholder="Entrer un message"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>
      <div>
        <button id="submit" className="btn" type="submit"><FiSend /></button>
      </div>
    </form>
  );
};

export default MessageForm;