import React, { useState } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import { Dropdown, DropdownItem, Button } from "flowbite-react";

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
  {
    key: "schedule",
    prompt: "📅 Can I look at your calendar to understand your usual days?",
  },
];

function HomeEase() {
  const [selectedModel, setSelectedModel] = useState("Select your model");
  const [disabledBtn, setDisabledBtn] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [userResponses, setUserResponses] = useState({});
  const [inputValue, setInputValue] = useState("");

  const handleSelect = (model) => {
    setSelectedModel(model);
    setDisabledBtn(false);
  };

  const handleNextClick = () => {
    setShowOnboarding(true);
  };

  return (
    <>
      <p className="text-xl">Scan QR Code</p>
      <br />
      <p className="text-sm text-gray-500">Please scan the machine QR code</p>

      {/* QR Code Scanner Container */}
      <Scanner onScan={(result) => console.log(result)} />
      <p className="text-sm text-gray-500 mb-4">
        or search below for your model:
      </p>
      <div className="flex flex-col gap-2 items-center">
        <Dropdown label={selectedModel} dismissOnClick={true}>
          <DropdownItem onClick={() => handleSelect("LG WM4000HWA")}>
            LG WM4000HWA
          </DropdownItem>
          <DropdownItem onClick={() => handleSelect("Samsung WF45T6000AW")}>
            Samsung WF45T6000AW
          </DropdownItem>
          <DropdownItem onClick={() => handleSelect("Whirlpool WTW5000DW")}>
            Whirlpool WTW5000DW
          </DropdownItem>
          <DropdownItem onClick={() => handleSelect("Maytag MVWC565FW")}>
            Maytag MVWC565FW
          </DropdownItem>
          <DropdownItem onClick={() => handleSelect("GE GTW840CSNWS")}>
            GE GTW840CSNWS
          </DropdownItem>
        </Dropdown>
        <Button disabled={disabledBtn}>
          Next <i className="fa-solid fa-arrow-right"></i>
        </Button>
      </div>
    </>
  );
}

export default HomeEase;
