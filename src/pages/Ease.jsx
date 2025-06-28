import React, { useState } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import {
  Dropdown,
  DropdownItem,
  Button,
  TextInput,
  Navbar,
  Card,
  Alert,
} from "flowbite-react";
import {
  ChatBubbleOvalLeftEllipsisIcon,
  Cog6ToothIcon,
  UserIcon,
} from "@heroicons/react/24/solid";

const onboardingQuestions = [
  { key: "name", prompt: "🗣 What name should I call you by?" },
  {
    key: "language",
    prompt: "🌍 Which language do you feel most comfortable using?",
  },
  {
    key: "accessibility",
    prompt: "♿ Do you need help with reading, hearing, or seeing?",
  },
  {
    key: "household",
    prompt:
      "🏡 Do you live alone or with others? How many people wear clothes I should help wash?",
  },
];

function HomeEase() {
  const [view, setView] = useState("home"); // 'home' | 'onboarding' | 'dashboard' | 'profile'
  const [selectedModel, setSelectedModel] = useState("Select your model");
  const [disabledBtn, setDisabledBtn] = useState(true);
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [userResponses, setUserResponses] = useState({});
  const [inputValue, setInputValue] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [showCompleteAlert, setShowCompleteAlert] = useState(false);
  const [showValidationAlert, setShowValidationAlert] = useState(false);

  const handleSelect = (model) => {
    setSelectedModel(model);
    setDisabledBtn(false);
  };

  const handleInputSubmit = () => {
    const currentQuestion = onboardingQuestions[onboardingStep];
    if (inputValue.trim() === "") {
      setShowValidationAlert(true);
      return;
    }

    setShowValidationAlert(false);

    setUserResponses({
      ...userResponses,
      [currentQuestion.key]: inputValue,
    });

    setInputValue("");

    if (onboardingStep < onboardingQuestions.length - 1) {
      setOnboardingStep(onboardingStep + 1);
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
              <TextInput
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

              <div className="flex justify-center mt-2">
                <Button onClick={handleInputSubmit} className="mt-4">
                  Submit
                </Button>
              </div>
            </div>
          </>
        )}
      </>
    );
  }

  const Dashboard = () => (
    <div className="p-4 relative">
      <Navbar fluid>
        <span className="text-xl font-semibold">HomeEase</span>
        <div className="flex gap-4">
          <Button size="sm" onClick={() => setView("profile")}>
            <UserIcon className="h-4 w-4 mr-1" /> Profile
          </Button>
          <Button size="sm" color="gray">
            <Cog6ToothIcon className="h-4 w-4 mr-1" /> Settings
          </Button>
        </div>
      </Navbar>

      <div className="text-center mt-10">
        <h1 className="text-2xl font-bold">
          Hello {userResponses.name || "User"} 👋
        </h1>
        <p className="text-gray-600 mt-1 mb-6">
          You’re ready to use your washing machine!
        </p>

        <Card className="max-w-sm mx-auto">
          <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
            Start Washing
          </h5>
          <p className="font-normal text-gray-700 dark:text-gray-400">
            Placeholder for starting machine interface.
          </p>
          <Button color="blue">Go to Machine</Button>
        </Card>
      </div>

      {/* Chatbot Toggle Button */}
      <button
        onClick={() => setShowChat(!showChat)}
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition"
      >
        <ChatBubbleOvalLeftEllipsisIcon className="h-6 w-6" />
      </button>

      {showChat && (
        <div className="fixed bottom-20 right-6 w-72 p-4 bg-white rounded shadow-lg">
          <p className="font-semibold">🤖 Chatbot</p>
          <p className="text-sm text-gray-600">How can I assist you today?</p>
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
