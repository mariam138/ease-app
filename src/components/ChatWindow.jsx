
const ChatWindow = ({ children }) => {
  return (
    <div className="flex-1 p-4 overflow-y-auto space-y-2 h-[500px]">
      {children}
    </div>
  );
};

export default ChatWindow;