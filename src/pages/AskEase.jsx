import { useEffect, useRef, useState } from "react";
import ChatBubble from "../components/ChatBubble";
import ChatWindow from "../components/ChatWindow";
import FakeInputBar from "../components/FakeInputBar";

const conversation = [
  { sender: "ease", text: "Morning! 👋 Noticing a bit of a gap in your usual laundry rhythm — need a hand figuring out what’s next?" },
  { sender: "ease", text: "Your smart meter shows the cheapest time to run a load is overnight. Let's set up a delayed start so you don’t have to stay up late." },

  { sender: "user", text: "I can’t decide what to wash next." },
  { sender: "ease", text: "No worries. You usually wash bedding on Thursdays, but I noticed you skipped uniforms yesterday." },
  { sender: "ease", text: "Want to do uniforms now and shift bedding to the weekend?" },
  { sender: "user", text: "Yes, that works." },
  { sender: "ease", text: "Great choice. I’ll keep an eye on your smart plug and remind you when the cycle finishes." },

  { sender: "user", text: "I sometimes forget what each wash setting does." },
  { sender: "ease", text: "Would you like me to show a short guide whenever you open the app?" },
  { sender: "user", text: "Yes please." },
  { sender: "ease", text: "Done. I’ll keep things easy to follow every time you start a wash." }
];

export default function AskEase() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [step, setStep] = useState(0);
  const [easeTyping, setEaseTyping] = useState(false);
  const chatEndRef = useRef(null);
  const typingIntervalRef = useRef(null);

  const hasStarted = useRef(false);

  useEffect(() => {
    if (!hasStarted.current && step === 0) {
      hasStarted.current = true;
      handleNextStep(conversation[0]);
    }
  }, [step]);

  useEffect(() => {
    if (step > 0 && step < conversation.length) {
      handleNextStep(conversation[step]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  const handleNextStep = (next) => {
    if (!next || !next.text) return;

    if (next.sender === "user") {
      setTyping(true);
      setInput("");

      let i = 0;
      const userText = next.text;
      clearInterval(typingIntervalRef.current);
      typingIntervalRef.current = setInterval(() => {
        setInput(userText.slice(0, i + 1));
        i++;
        if (i >= userText.length) {
          clearInterval(typingIntervalRef.current);
          setTimeout(() => {
            setTyping(false);
            setMessages((prev) => [...prev, { sender: "user", text: userText }]);
            setInput("");
            setStep((s) => s + 1);
          }, 1000);
        }
      }, 100);
    } else {
      setEaseTyping(true);
      setTimeout(() => {
        setEaseTyping(false);
        setMessages((prev) => [...prev, next]);
        setStep((s) => s + 1);
      }, 2000);
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, easeTyping]);

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-full max-w-sm flex flex-col bg-white shadow-md rounded-lg overflow-hidden">
        <ChatWindow>
          {messages.map((msg, i) => (
            <ChatBubble key={i} sender={msg.sender} text={msg.text} />
          ))}
          {easeTyping && <ChatBubble sender="ease" text="typing..." isTyping />}
          <div ref={chatEndRef} />
        </ChatWindow>
        <FakeInputBar text={input} typing={typing} />
      </div>
    </div>
  );
}