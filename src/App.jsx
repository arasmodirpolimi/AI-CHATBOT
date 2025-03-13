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

  function addMessage(message) {
    setMessages((prevMessages) => [...prevMessages, message]);
  }

  async function handleContentSend(content) {
    addMessage({
      role: "user",
      content,
    });
    setIsLoading(true);

    try {
      const result = await assistant.chat(content);
      addMessage({
        role: "assistant",
        content: result,
      });
    } catch (error) {
      addMessage({
        role: "system",
        content: "Sorry, I couldn't process your request. Please try again!",
      });
    } finally {
      setIsLoading(false);
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
      <Controls onSend={handleContentSend} />
    </div>
  );
}

export default App;
