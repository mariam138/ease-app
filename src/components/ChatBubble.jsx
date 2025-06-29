const ChatBubble = ({ sender, text, isTyping }) => {
  const isUser = sender === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-2`}>
      <div
        className={`px-4 py-2 rounded-lg max-w-xs break-words shadow-sm
          ${isUser ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"}
          text-base leading-snug font-normal`}
      >
        {isTyping ? (
          <div className="flex space-x-1">
            <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></span>
            <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-100"></span>
            <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200"></span>
          </div>
        ) : (
          text
        )}
      </div>
    </div>
  );
};

export default ChatBubble;