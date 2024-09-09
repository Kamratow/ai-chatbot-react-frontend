import { useState } from "react";
import "./App.css";
import OpenAI from "openai";

import classes from "./App.module.css";

const openai = new OpenAI({
  organization: import.meta.env.VITE_OPENAI_ORGANIZATION_ID,
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

function App() {
  const [message, setMessage] = useState<string>("");
  const [chats, setChats] = useState<OpenAI.ChatCompletionMessageParam[]>([]);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);

  const chat = async (e: React.FormEvent) => {
    e.preventDefault();

    const oldChats = [...chats];

    const newUserMessage: OpenAI.ChatCompletionUserMessageParam = {
      role: "user",
      content: message,
    };

    const newChats: OpenAI.ChatCompletionMessageParam[] = [
      ...chats,
      newUserMessage,
    ];

    setIsTyping(true);
    setChats(newChats);

    await openai.chat.completions
      .create({
        messages: [
          {
            role: "system",
            content:
              "You are a helpful assistant. Try to be concise and straight to the point.",
          },
          ...newChats,
        ],
        model: "gpt-4o-mini",
      })
      .then((result) => {
        console.log(result.choices[0].message.content);
        setChats([...newChats, result.choices[0].message]);
      })
      .catch((error) => {
        setChats(oldChats);
        setIsError(true);
        console.log(error);
      })
      .finally(() => {
        setIsTyping(false);
        setMessage("");
      });
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
