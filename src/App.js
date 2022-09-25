import React, { useState, useEffect, useRef } from "react";
import socketIOClient from "socket.io-client";
import "./App.css";
// const host = "http://localhost:3000";
const host = "https://chat-api-server-nodejs.herokuapp.com/";

function App() {
  const [mess, setMess] = useState([]);
  const [message, setMessage] = useState("");
  const [id, setId] = useState();

  console.log("id", id);
  const socketRef = useRef();
  const messagesEnd = useRef();

  useEffect(() => {
    socketRef.current = socketIOClient.connect(host); //Kết nối tời server

    socketRef.current.on("getId", (data) => {
      //On nhận về 1 id
      console.log("data id", data);
      setId(data);
    });

    socketRef.current.on("sendDataServer", (dataGot) => {
      //On nhận nội dung tin nhắn và id
      console.log("dataGot", dataGot);
      setMess((oldMsgs) => [...oldMsgs, dataGot.data]);
    });

    return () => {
      socketRef.current.disconnect(); //ngắt kết nối
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [mess]);

  const sendMessage = () => {
    if (message !== null) {
      const msg = {
        content: message,
        id: id,
      };
      console.log("msg", msg);
      socketRef.current.emit("sendDataClient", msg); //emit phát tín hiệu (gửi đi) tới server tin nhắn và ID
      setMessage("");
    }
  };

  const scrollToBottom = () => {
    messagesEnd.current.scrollIntoView({ behavior: "smooth", bottom: 0 });
  };

  const handleChange = (e) => {
    setMessage(e.target.value);
  };

  const onEnterPress = (e) => {
    if (e.keyCode === 13 && e.shiftKey === false) {
      sendMessage();
    }
  };

  const renderMess = mess.map((m, index) => {
    return (
      <div>
        <div
          key={index}
          className={`${
            m.id === id ? "your-message" : "other-people"
          } chat-item`}
        >
          {m.id !== id ? (
            <div>
              <span style={{ color: "#54ea54" }}>Người gửi</span> {m.id}
            </div>
          ) : null}
          {m.id !== id ? (
            <span style={{ color: "rgb(125 37 227)" }}>Nội dung:</span>
          ) : null}{" "}
          {m.content}
        </div>
      </div>
    );
  });

  return (
    <div className="box-chat">
      <h1>DŨNG THỢ CODE</h1>
      <div className="box-chat_message">
        {renderMess}
        <div style={{ float: "left", clear: "both" }} ref={messagesEnd}></div>
      </div>

      <div className="send-box">
        <input
          type=""
          name=""
          value={message}
          onKeyDown={onEnterPress}
          onChange={handleChange}
          placeholder="Nhập tin nhắn ..."
        />
        <button onClick={sendMessage}>Gửi</button>
      </div>
      <br />
    </div>
  );
}

export default App;
