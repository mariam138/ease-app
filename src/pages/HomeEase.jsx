import React, { useEffect } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import { Dropdown, DropdownItem } from "flowbite-react";

function HomeEase() {
  return (
    <>
      <p className="text-xl">Scan QR Code</p>
      <br />
      <p className="text-sm text-gray-500">Please scan the machine QR code</p>

      {/* QR Code Scanner Container */}
      <Scanner onScan={(result) => console.log(result)} />
      <p className="text-sm text-gray-500">or search below for your model:</p>
      <div className="flex justify-center">
        <Dropdown label="Select your model" dismissOnClick={false}>
          <DropdownItem>LG WM4000HWA</DropdownItem>
          <DropdownItem>Samsung WF45T6000AW</DropdownItem>
          <DropdownItem>Whirlpool WTW5000DW</DropdownItem>
          <DropdownItem>Maytag MVWC565FW</DropdownItem>
          <DropdownItem>GE GTW840CSNWS</DropdownItem>
        </Dropdown>
      </div>
    </>
  );
}

export default HomeEase;
