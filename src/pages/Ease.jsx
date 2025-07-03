import {
  ChatBubbleOvalLeftEllipsisIcon,
  UserIcon,
  HomeIcon,
} from "@heroicons/react/24/solid";
import { Scanner } from "@yudiel/react-qr-scanner";
import {
  Alert,
  Button,
  Card,
  Dropdown,
  DropdownItem,
  TextInput,
} from "flowbite-react";
import { useRef, useState } from "react";
import AskEase from "./AskEase";

const onboardingQuestions = [
  {
    key: "name",
    prompt: "🗣 What’s your name? I’ll personalise your experience.",
    type: "text",
  },
  {
    key: "language",
    prompt: "🌍 Which language do you prefer using?",
    type: "text",
  },
  {
    key: "accessibility",
    prompt: "♿ Do you need help with reading, hearing, or seeing?",
    type: "buttons",
    options: ["Yes", "No"],
  },
  // {
  //   key: "householdSize",
  //   prompt: "👨‍👩‍👧‍👦 How many people live in your home (including you)?",
  //   type: "number",
  //   dependsOn: { key: "householdStatus", value: "With others" },
  // },
  {
    key: "weeklyLoads",
    prompt: "🧺 How many loads of laundry do you usually do in a week?",
    type: "number",
  },
  {
    key: "sharedLaundry",
    prompt: "👨‍👩‍👧‍👦 Do other family members help with the laundry?",
    type: "buttons",
    options: ["Mostly me", "We share it"],
  },
];

function HomeEase() {
  const [view, setView] = useState("profile"); // 'home' | 'onboarding' | 'dashboard' | 'profile' | 'machine'
  const [selectedModel, setSelectedModel] = useState("Select your model");
  const [disabledBtn, setDisabledBtn] = useState(true);
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [userResponses, setUserResponses] = useState({});
  const [inputValue, setInputValue] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [showCompleteAlert, setShowCompleteAlert] = useState(false);
  const [showValidationAlert, setShowValidationAlert] = useState(false);
  const [startChat, setStartChat] = useState(false);

  const inputRef = useRef(null);

  const handleSelect = (model) => {
    setSelectedModel(model);
    setDisabledBtn(false);
  };

  const handleInputSubmit = (overrideValue = null) => {
    const currentQuestion = onboardingQuestions[onboardingStep];
    const valueToStore = overrideValue ?? inputValue.trim();

    if (
      (currentQuestion.type === "text" || currentQuestion.type === "number") &&
      valueToStore === ""
    ) {
      setShowValidationAlert(true);
      inputRef.current?.focus();
      return;
    }

    setShowValidationAlert(false);

    const updatedResponses = {
      ...userResponses,
      [currentQuestion.key]: valueToStore,
    };
    setUserResponses(updatedResponses);
    setInputValue("");

    // Find next step, skipping questions that don't match `dependsOn`
    let nextStep = onboardingStep + 1;
    while (
      nextStep < onboardingQuestions.length &&
      onboardingQuestions[nextStep].dependsOn &&
      updatedResponses[onboardingQuestions[nextStep].dependsOn.key] !==
        onboardingQuestions[nextStep].dependsOn.value
    ) {
      nextStep++;
    }

    if (nextStep < onboardingQuestions.length) {
      setOnboardingStep(nextStep);
    } else {
      setShowCompleteAlert(true);
      setTimeout(() => {
        setShowCompleteAlert(false);
        setView("dashboard");
      }, 3000);
    }
  };

  // Initial scanner view when app loads
  if (view === "home") {
    return (
      <div className="flex flex-col items-center p-6">
        <p className="text-xl">Scan QR Code</p>
        <p className="text-sm text-gray-500 mb-4">
          Please scan the machine QR code
        </p>

        <Scanner onScan={(result) => console.log(result)} />
        <p className="text-sm text-gray-500 mb-4 mt-2">
          or search below for your machine model:
        </p>

        <Dropdown
          label={selectedModel}
          dismissOnClick={true}
          className="bg-neutral-100 text-black outline-neutral-150"
        >
          {[
            "LG WM4000HWA",
            "Samsung WF45T6000AW",
            "Whirlpool WTW5000DW",
            "Maytag MVWC565FW",
            "GE GTW840CSNWS",
          ].map((model) => (
            <DropdownItem key={model} onClick={() => handleSelect(model)}>
              {model}
            </DropdownItem>
          ))}
        </Dropdown>

        <Button
          disabled={disabledBtn}
          className="mt-4"
          onClick={() => setView("onboarding")}
        >
          Next{" "}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
            />
          </svg>
        </Button>
      </div>
    );
  }

  // Onboarding questions that appear after choosing machine model
  if (view === "onboarding") {
    const currentQuestion = onboardingQuestions[onboardingStep];
    return (
      <>
        {showCompleteAlert ? (
          <Alert color="success">✅ Onboarding complete!</Alert>
        ) : (
          <>
            <p>Just a few questions first to get you started...</p>
            <div className="max-w-md mx-auto mt-6 p-4 bg-white rounded shadow">
              <p className="text-lg mb-4">{currentQuestion.prompt}</p>
              {currentQuestion.type === "text" && (
                <>
                  <TextInput
                    ref={inputRef}
                    placeholder="Your answer..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleInputSubmit();
                    }}
                  />
                  {showValidationAlert && (
                    <Alert color="warning" className="mt-2">
                      ⚠️ This field cannot be empty.
                    </Alert>
                  )}
                </>
              )}

              {currentQuestion.type === "number" && (
                <>
                  <TextInput
                    ref={inputRef}
                    type="number"
                    placeholder="Enter a number"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleInputSubmit();
                    }}
                  />
                  {showValidationAlert && (
                    <Alert color="warning" className="mt-2">
                      ⚠️ This field cannot be empty.
                    </Alert>
                  )}
                </>
              )}

              {currentQuestion.type === "buttons" && (
                <div className="flex justify-center gap-4 mt-4">
                  {currentQuestion.options.map((option) => (
                    <Button
                      key={option}
                      onClick={() => {
                        handleInputSubmit(option);
                      }}
                    >
                      {option}
                    </Button>
                  ))}
                </div>
              )}

              {/* Show Submit button only for text/number types */}
              {(currentQuestion.type === "text" ||
                currentQuestion.type === "number") && (
                <>
                  <div className="flex justify-center">
                    <Button onClick={handleInputSubmit} className="mt-4">
                      Submit
                    </Button>
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </>
    );
  }

  // Dashboard view
  const Dashboard = () => (
    <div className="p-4 pb-24 relative">
      <div className="text-center mt-10">
        <h1 className="text-2xl font-bold">
          Hello{" "}
          {typeof userResponses.name === "string" ? userResponses.name : "User"}{" "}
          👋
        </h1>
        <p className="text-gray-600 mt-1 mb-6">
          You’re ready to use your washing machine!
        </p>

        <div className="grid grid-cols-2 gap-4 mt-6 max-w-sm mx-auto">
          {/* Appliance 1 */}
          <button
            onClick={() => setView("machine")}
            className="flex flex-col items-center p-4 bg-gray-100 rounded-lg shadow hover:bg-blue-100 transition"
          >
            <img
              src="/assets/washing-machine.png"
              alt="Washing Machine"
              className="w-10 h-10 mb-2"
            />
            <span className="text-sm font-medium">Washer</span>
          </button>

          {/* Appliance 2 */}
          <button className="flex flex-col items-center p-4 bg-gray-100 rounded-lg shadow hover:bg-blue-100 transition">
            <img
              src="/assets/washing-machine.png"
              alt="Dryer"
              className="w-10 h-10 mb-2"
            />
            <span className="text-sm font-medium">Dryer</span>
          </button>

          {/* Appliance 3 */}
          <button className="flex flex-col items-center p-4 bg-gray-100 rounded-lg shadow hover:bg-blue-100 transition">
            <img
              src="/assets/washing-machine.png"
              alt="Iron"
              className="w-10 h-10 mb-2"
            />
            <span className="text-sm font-medium">Iron</span>
          </button>

          {/* Appliance 4 */}
          <button className="flex flex-col items-center p-4 bg-gray-100 rounded-lg shadow hover:bg-blue-100 transition">
            <img
              src="/assets/washing-machine.png"
              alt="Steamer"
              className="w-10 h-10 mb-2"
            />
            <span className="text-sm font-medium">Steamer</span>
          </button>
          {/* Add appliance */}
          <button className="flex flex-col items-center p-4 bg-gray-100 rounded-lg shadow hover:bg-blue-100 transition">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="w-10 h-10 mb-2"
            >
              <path
                fillRule="evenodd"
                d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14Zm.75-10.25v2.5h2.5a.75.75 0 0 1 0 1.5h-2.5v2.5a.75.75 0 0 1-1.5 0v-2.5h-2.5a.75.75 0 0 1 0-1.5h2.5v-2.5a.75.75 0 0 1 1.5 0Z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-sm font-medium">Add new</span>
          </button>
        </div>
      </div>

      {/* Bottom navigation */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 shadow-md z-50">
        <div className="flex justify-around items-center py-2">
          <button
            onClick={() => setView("dashboard")}
            className="flex flex-col items-center text-sm"
          >
            <HomeIcon className="h-5 w-5" />
            <span>Home</span>
          </button>
          <button
            onClick={() => setView("profile")}
            className="flex flex-col items-center text-sm"
          >
            <UserIcon className="h-5 w-5" />
            <span>Profile</span>
          </button>
        </div>
      </div>

      {/* Chatbot Toggle Button */}
      <button
        onClick={() => setShowChat(!showChat)}
        className="fixed bottom-20 right-6 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition z-[60]"
      >
        <ChatBubbleOvalLeftEllipsisIcon className="h-6 w-6" />
      </button>

      {showChat && !startChat && (
        <div
          className="fixed bottom-20 right-6 w-72 p-4 bg-white rounded shadow-lg cursor-pointer"
          onClick={() => setStartChat(true)}
        >
          <p className="font-semibold">🤖 Ease AI</p>
          <p className="text-sm text-gray-600">Can I help?</p>
        </div>
      )}

      {showChat && startChat && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="relative w-full max-w-sm">
            <AskEase />
            <button
              onClick={() => setStartChat(false)}
              className="absolute top-2 right-2 text-white bg-black bg-opacity-50 p-1 rounded-full hover:bg-opacity-75"
            >
              ✖
            </button>
            {/* Voice Feature Indicator */}
            <button
              className="absolute top-12 right-2 bg-blue-500 text-white p-2 rounded-full shadow hover:bg-blue-600 transition"
              title="Voice assistant is available"
            >
              <i className="fas fa-volume-up text-lg" />
            </button>
          </div>
        </div>
      )}
    </div>
  );

  // Profile view
  const Profile = () => (
    <>
      {/* <div className="p-4">
        <Button color="gray" onClick={() => setView("dashboard")}>
          ← Back to Dashboard
        </Button>
        
        <ul className="text-gray-700 list-disc ml-6 space-y-1">
          <li>
            <strong>Name:</strong> {userResponses.name}
          </li>
          <li>
            <strong>Language:</strong> {userResponses.language}
          </li>
          <li>
            <strong>Accessibility:</strong> {userResponses.accessibility}
          </li>
          <li>
            <strong>Household:</strong> {userResponses.household}
          </li>
          <li>
            <strong>Model:</strong> {selectedModel}
          </li>
        </ul>
      </div> */}
      <Card className="max-w-sm">
        <h2 className="text-2xl font-bold mt-4 mb-2">Profile</h2>
        <div className="flex flex-col items-center pb-4">
          <img
            alt="Bonnie image"
            height="96"
            src="/assets/generic_profile_img.png"
            width="96"
            className="mb-3 rounded-full shadow-lg"
          />
          <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">
            {userResponses.name}
          </h5>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Language: {userResponses.language}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Accessibility needs? {userResponses.accessibility}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Washing Machine Model: {userResponses.selectedModel}
          </p>
          <div className="mt-4 flex space-x-3 lg:mt-6">
            <a
              href="#"
              className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-center text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
            >
              Sync calendar{" "}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
                />
              </svg>
            </a>
          </div>
          <div className="mt-4 flex space-x-3 lg:mt-6">
            <a
              href="#"
              className="inline-flex items-center rounded-lg bg-cyan-700 px-4 py-2 text-center text-sm font-medium text-white hover:bg-cyan-800 focus:outline-none focus:ring-4 focus:ring-cyan-300 dark:bg-cyan-600 dark:hover:bg-cyan-700 dark:focus:ring-cyan-800"
            >
              Sign out{" "}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15"
                />
              </svg>
            </a>
          </div>
        </div>
      </Card>
      {/* Bottom navigation */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 shadow-md z-50">
        <div className="flex justify-around items-center py-2">
          <button
            onClick={() => setView("dashboard")}
            className="flex flex-col items-center text-sm"
          >
            <HomeIcon className="h-5 w-5" />
            <span>Home</span>
          </button>
          <button
            onClick={() => setView("profile")}
            className="flex flex-col items-center text-sm"
          >
            <UserIcon className="h-5 w-5" />
            <span>Profile</span>
          </button>
        </div>
      </div>
    </>
  );

  const MachineView = () => (
    <div className="relative min-h-screen bg-white p-4">
      {/* Back Button */}
      <Button
        color="gray"
        className="absolute top-4 left-4 z-10"
        onClick={() => setView("dashboard")}
      >
        ← Back
      </Button>

      {/* Padding top added to push content below the back button */}
      <div className="pt-16">
        <h1 className="text-2xl font-bold text-center mb-6">What’s Next?</h1>

        <div className="max-w-md mx-auto space-y-4">
          <div className="p-4 bg-gray-100 rounded shadow">
            🧺 Wash school uniforms today — pre-treat stains first
          </div>
          <div className="p-4 bg-gray-100 rounded shadow">
            🛏 Bedding due this weekend — check available space in laundry
            basket
          </div>
        </div>
      </div>

      {/* Chatbot Toggle Button */}
      <button
        onClick={() => {
          setShowChat(true);
          setStartChat(true);
        }}
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition"
      >
        <ChatBubbleOvalLeftEllipsisIcon className="h-6 w-6" />
      </button>

      {showChat && startChat && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="relative w-full max-w-sm">
            <AskEase />
            <button
              onClick={() => setStartChat(false)}
              className="absolute top-2 right-2 text-white bg-black bg-opacity-50 p-1 rounded-full hover:bg-opacity-75"
            >
              ✖
            </button>
          </div>
        </div>
      )}
    </div>
  );

  return view === "dashboard" ? (
    <Dashboard />
  ) : view === "machine" ? (
    <MachineView />
  ) : (
    <Profile />
  );
}

export default HomeEase;
