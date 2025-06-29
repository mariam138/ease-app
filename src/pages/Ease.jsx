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
  {
    key: "householdSize",
    prompt: "👨‍👩‍👧‍👦 How many people live in your home (including you)?",
    type: "number",
    dependsOn: { key: "householdStatus", value: "With others" },
  },
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
  const [view, setView] = useState("dashboard"); // 'home' | 'onboarding' | 'dashboard' | 'profile' | 'machine'
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

  const Dashboard = () => (
    <div className="p-4 pb-24 relative">
      <div className="text-center mt-10">
        <h1 className="text-2xl font-bold">
          Hello {userResponses.name || "User"} 👋
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
              src="src/assets/washing-machine.png"
              alt="Washing Machine"
              className="w-10 h-10 mb-2"
            />
            <span className="text-sm font-medium">Washer</span>
          </button>

          {/* Appliance 2 */}
          <button className="flex flex-col items-center p-4 bg-gray-100 rounded-lg shadow hover:bg-blue-100 transition">
            <img
              src="src/assets/washing-machine.png"
              alt="Dryer"
              className="w-10 h-10 mb-2"
            />
            <span className="text-sm font-medium">Dryer</span>
          </button>

          {/* Appliance 3 */}
          <button className="flex flex-col items-center p-4 bg-gray-100 rounded-lg shadow hover:bg-blue-100 transition">
            <img
              src="src/assets/washing-machine.png"
              alt="Iron"
              className="w-10 h-10 mb-2"
            />
            <span className="text-sm font-medium">Iron</span>
          </button>

          {/* Appliance 4 */}
          <button className="flex flex-col items-center p-4 bg-gray-100 rounded-lg shadow hover:bg-blue-100 transition">
            <img
              src="src/assets/washing-machine.png"
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

  const Profile = () => (
    <div className="p-4">
      <Button color="gray" onClick={() => setView("dashboard")}>
        ← Back to Dashboard
      </Button>
      <h2 className="text-2xl font-bold mt-4 mb-2">Profile Info</h2>
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
    </div>
  );

  return view === "dashboard" ? <Dashboard /> : <Profile />;
}

export default HomeEase;
