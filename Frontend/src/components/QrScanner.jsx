// components/QrScanner.jsx
import { Html5QrcodeScanner } from "html5-qrcode";

export default function QrScanner({ onDetected }) {
  useEffect(() => {
    const scanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: 250 });
    scanner.render(
      (decoded) => {
        onDetected(decoded);
      },
      (err) => {
        /* ignore scan errors */
      }
    );
    return () => scanner.clear();
  }, []);
  return <div id="reader" style={{ width: "300px" }}></div>;
}
