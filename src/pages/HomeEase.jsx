import React, { useEffect, useState } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import { Dropdown, DropdownItem } from "flowbite-react";

function HomeEase() {
  const [selectedModel, setSelectedModel] = useState("Select your model");
  const handleSelect = (model) => {
    setSelectedModel(model);
  };

  return (
    <>
      <p className="text-xl">Scan QR Code</p>
      <br />
      <p className="text-sm text-gray-500">Please scan the machine QR code</p>

      {/* QR Code Scanner Container */}
      <Scanner onScan={(result) => console.log(result)} />
      <p className="text-sm text-gray-500">or search below for your model:</p>
      <div className="flex justify-center">
        <Dropdown label={selectedModel} dismissOnClick={false}>
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
      </div>
    </>
  );
}

export default HomeEase;
