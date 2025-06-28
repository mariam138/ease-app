import React, { useEffect } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";

function HomeEase() {
  return (
    <>
      <p className="text-xl">Scan QR Code</p>
      <br />
      <p className="text-sm text-gray-500">Please scan the machine QR code</p>

      {/* QR Code Scanner Container */}
      <Scanner onScan={(result) => console.log(result)} />
    </>
  );
}

export default HomeEase;
