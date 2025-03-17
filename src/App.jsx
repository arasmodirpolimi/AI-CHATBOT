import { useState } from "react";
import { Loader } from "./components/Loader/Loader";
import { Assistant } from "./assistants/googleai";
import { Chat } from "./components/Chat/Chat";
import { Controls } from "./components/Controls/Controls";
import styles from "./App.module.css";

function App() {
  const assistant = new Assistant();
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);

  function addMessage(message) {
    setMessages((prevMessages) => [...prevMessages, message]);
  }

  function updateLastMessageContent(content) {
    setMessages((prevMessages) =>
      prevMessages.map((message, index) =>
        index === prevMessages.length - 1
          ? { ...message, content: `${message.content}${content}` }
          : message
      )
    );
  }

  async function handleContentSend(content) {
    addMessage({
      role: "user",
      content,
    });
    setIsLoading(true);

    try {
      const result = await assistant.chatStream(content);
      let isFirstChunk = false;

      for await (const chunck of result) {
        if (!isFirstChunk) {
          isFirstChunk = true;
          addMessage({ content: "", role: "assistant" });
          setIsLoading(false);
          setIsStreaming(true); 
        }

        updateLastMessageContent(chunck)
      }

      setIsStreaming(false);
    } catch (error) {
      addMessage({
        role: "system",
        content: "Sorry, I couldn't process your request. Please try again!",
      });
      setIsLoading(false);  
      setIsStreaming(false);
      console.error("This is a system Error: ", error);
    }
  }
  return (
    <div className={styles.App}>
      {isLoading && <Loader />}
      <header className={styles.Header}>
        <img className={styles.Logo} src="/chat-bot.png" />
        <h2 className={styles.Title}>AI Chatbot</h2>
      </header>
      <div className={styles.ChatContainer}>
        <Chat messages={messages}></Chat>
      </div>
      <Controls isDisabled={isLoading || isStreaming} onSend={handleContentSend} />
    </div>
  );
}

export default App;
