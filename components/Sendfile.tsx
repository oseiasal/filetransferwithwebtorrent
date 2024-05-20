"use client";
import { useState } from "react";
import WebTorrent from "webtorrent/dist/webtorrent.min.js";

const Sender = () => {
  const [file, setFile] = useState(null);
  const [magnetURI, setMagnetURI] = useState("");
  const [connections, setConnections] = useState([]);
  const [uploadSpeed, setUploadSpeed] = useState(0);
  const [fileSize, setFileSize] = useState(0);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSendFile = async () => {
    if (!file) {
      alert("Por favor, selecione um arquivo.");
      return;
    }

    setFileSize(file.size);

    const client = new WebTorrent();
    client.seed(file, (torrent) => {
      console.log("Magnet URI:", torrent.magnetURI);
      setMagnetURI(torrent.magnetURI);

      torrent.on("upload", () => {
        setUploadSpeed(client.uploadSpeed);
      });

      torrent.on("wire", (wire, addr) => {
        console.log("Conectado ao peer", addr);
        setConnections((prevConnections) => [...prevConnections, addr]);
        // Notifique o peer sobre a nova conexão
        wire.peerExtendedHandshake = { connected: true };
      });
    });
  };

  const handleCopyMagnetURI = () => {
    navigator.clipboard.writeText(magnetURI);
    alert("Magnet URI copiado!");
  };

  return (
    <div>
      <h2>Enviar Arquivo</h2>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleSendFile}>Enviar</button>
      {magnetURI && (
        <p
          onClick={handleCopyMagnetURI}
          style={{ cursor: "pointer", textDecoration: "underline" }}
        >
          Magnet URI: {magnetURI}
        </p>
      )}
      <div>
        <h3>Conexões Estabelecidas:</h3>
        <ul>
          {connections.map((connection, index) => (
            <li key={index}>{connection}</li>
          ))}
        </ul>
        <p>Velocidade de Upload: {(uploadSpeed / 1024).toFixed(2)} KB/s</p>
        <p>Tamanho do Arquivo: {(fileSize / 1024 / 1024).toFixed(2)} MB</p>
      </div>
    </div>
  );
};

export default Sender;
