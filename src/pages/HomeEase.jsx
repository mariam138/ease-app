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
        <Dropdown label="Dropdown button" dismissOnClick={false}>
          <DropdownItem>Dashboard</DropdownItem>
          <DropdownItem>Settings</DropdownItem>
          <DropdownItem>Earnings</DropdownItem>
          <DropdownItem>Sign out</DropdownItem>
        </Dropdown>
      </div>
    </>
  );
}

export default HomeEase;
