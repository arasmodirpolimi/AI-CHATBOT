import Markdown from 'react-markdown'
import styles from "./Chat.module.css";
import { useEffect, useRef } from 'react';

const WELCOME_MESSAGE = {
  role: 'assistant',
  content: 'Hello!, How can I assist you right now?',
}

export function Chat({ messages }) {
  const messegesEndRef = useRef(null)

  useEffect(() => {
    messegesEndRef.current?.scrollIntoView({ bahavior: "smooth"})
  }, [messages])

  return (
    <div className={styles.Chat}>
      {[WELCOME_MESSAGE, ...messages].map(({ role, content }, index) => (
        <div key={index} className={styles.Message} data-role={role}>
          <Markdown>{content}</Markdown>
        </div>
      ))} 
      <div ref={messegesEndRef} />
    </div>
  );
}
