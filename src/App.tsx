import { useState } from "react";
import "./App.css";

import classes from "./App.module.css";
import fetchData from "./fetchData";

interface ChatMessage {
  role: string;
  content: string;
}

interface ChatResponse {
  output: ChatMessage;
}

function App() {
  const [message, setMessage] = useState<string>("");
  const [chats, setChats] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);

  const chat = async (e: React.FormEvent) => {
    e.preventDefault();

    const oldChats = [...chats];

    const newUserMessage: ChatMessage = {
      role: "user",
      content: message,
    };

    const newChats: ChatMessage[] = [...chats, newUserMessage];

    setIsTyping(true);
    setIsError(false);
    setChats(newChats);

    const chatBotUrl = import.meta.env.VITE_CHAT_BOT_API_URL;

    try {
      const result = await fetchData<ChatResponse>(chatBotUrl, {
        method: "POST",
        body: JSON.stringify({ chats: newChats }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      setChats([...newChats, result.output]);
    } catch (error) {
      setChats(oldChats);
      setIsError(true);
      console.log(error);
    } finally {
      setIsTyping(false);
      setMessage("");
    }
  };

  return (
    <main>
      <h1>React Chatbot connected with ChatGPT</h1>

      <div className={classes.chatContainer}>
        {chats &&
          chats.length > 0 &&
          chats.map((chat, index) => (
            <p
              key={index}
              className={
                chat.role === "assistant"
                  ? classes.assistantMessage
                  : classes.userMessage
              }
            >
              <span className={classes.roleText}>{chat.role}</span>
              <span>: </span>
              <span>{chat.content as string}</span>
            </p>
          ))}

        {isTyping && (
          <div className={classes.typingNotificationWrapper}>
            <p>
              <i>Typing...</i>
            </p>
          </div>
        )}

        {isError && (
          <div className={classes.errorNotificationWrapper}>
            <p>Error while getting an answer - please try again</p>
          </div>
        )}
        <form onSubmit={(e) => chat(e)}>
          <input
            type="text"
            name="message"
            value={message}
            placeholder="Type a message and hit enter"
            onChange={(e) => setMessage(e.target.value)}
            className={classes.chatTextInput}
          />
        </form>
      </div>
    </main>
  );
}

export default App;
