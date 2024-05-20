import ReceiveFile from "@/components/ReceiveFile";
import SendFile from "@/components/Sendfile";

function MyApp({}) {
  return (
    <div>
      <h1>File Transfer with WebTorrent and WebRTC</h1>
      <SendFile />
      <ReceiveFile />
    </div>
  );
}

export default MyApp;
