const FakeInputBar = ({ text, typing }) => {
  return (
    <div className="p-4 border-t border-gray-200 bg-white">
      <div className="flex items-center bg-gray-100 rounded-full px-4 py-2">
        <button
          title="Toggle voice mode"
          className="text-gray-500 hover:text-gray-700 focus:outline-none mr-2"
        >
          <i className="fas fa-microphone-alt text-lg" />
        </button>
        <div className="flex-1 text-sm text-gray-800 truncate">
          {typing ? text : <span className="text-gray-400">Type a message</span>}
        </div>
        <i className="fa-solid fa-paper-plane text-blue-500 ml-2"></i>
      </div>
    </div>
  );
};

export default FakeInputBar;