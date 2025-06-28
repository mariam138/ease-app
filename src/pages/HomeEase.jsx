import React, { useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

function HomeEase() {
  function onScanSuccess(decodedText, decodedResult) {
    // handle the scanned code as you like, for example:
    console.log(`Code matched = ${decodedText}`, decodedResult);
  }

  function onScanFailure(error) {
    // handle scan failure, usually better to ignore and keep scanning.
    // for example:
    console.warn(`Code scan error = ${error}`);
  }

  // Create new QR code scanner when page mounts
  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "reader",
      { fps: 10, qrbox: { width: 250, height: 250 } },
      /* verbose= */ false,
    );

    scanner.render(onScanSuccess, onScanFailure);

    // Optional cleanup
    return () => {
      scanner
        .clear()
        .catch((error) => console.error("Failed to clear scanner:", error));
    };
  }, []);
  return (
    <>
      <p className="text-xl">Scan QR Code</p>
      <br />
      <p className="text-sm text-gray-500">Please scan the machine QR code</p>

      {/* QR Code Scanner Container */}
      <div id="reader" className="w-[600px]"></div>
    </>
  );
}

export default HomeEase;
