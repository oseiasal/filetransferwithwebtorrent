"use client";
import { useState } from "react";
import WebTorrent from "webtorrent/dist/webtorrent.min.js";
import SimplePeer from "simple-peer";

const Receiver = () => {
  const [magnetURI, setMagnetURI] = useState("");
  const [connections, setConnections] = useState([]);
  const [downloadSpeed, setDownloadSpeed] = useState(0);
  const [progress, setProgress] = useState(0);
  const [fileSize, setFileSize] = useState(0);

  const handleMagnetURIChange = (event) => {
    setMagnetURI(event.target.value);
  };

  const handleDownload = () => {
    if (!magnetURI) {
      alert("Por favor, insira o Magnet URI.");
      return;
    }

    const client = new WebTorrent();
    console.log("Adicionando torrent com Magnet URI:", magnetURI);
    client.add(magnetURI, (torrent) => {
      console.log("Torrent adicionado:", torrent);

      setFileSize(torrent.length);

      torrent.on("download", (bytes) => {
        setDownloadSpeed(client.downloadSpeed);
        setProgress(torrent.progress * 100);
      });

      torrent.on("done", () => {
        console.log("Download do torrent concluído");
        torrent.files.forEach((file) => {
          const stream = file.createReadStream();
          const chunks = [];

          stream.on("data", (chunk) => {
            chunks.push(chunk);
          });

          stream.on("end", () => {
            const blob = new Blob(chunks);
            const url = URL.createObjectURL(blob);
            console.log("Baixando arquivo:", file.name);
            const a = document.createElement("a");
            a.href = url;
            a.download = file.name;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
          });

          stream.on("error", (err) => {
            console.error("Erro ao obter Blob:", err);
          });
        });
      });

      torrent.on("error", (err) => {
        console.error("Erro no torrent:", err);
      });

      torrent.on("wire", (wire, addr) => {
        console.log("Conectado ao peer", addr);
        setConnections((prevConnections) => [...prevConnections, addr]);

        // Detectando handshake do peer
        wire.on("extended", (handshake) => {
          if (handshake.connected) {
            console.log("Peer se conectou:", addr);
            setConnections((prevConnections) => [...prevConnections, addr]);
          }
        });
      });
    });
  };

  return (
    <div>
      <h2>Receber Arquivo</h2>
      <input
        type="text"
        value={magnetURI}
        onChange={handleMagnetURIChange}
        placeholder="Insira o Magnet URI"
      />
      <button onClick={handleDownload}>Baixar</button>
      <div>
        <h3>Conexões Estabelecidas:</h3>
        <ul>
          {connections.map((connection, index) => (
            <li key={index}>{connection}</li>
          ))}
        </ul>
        <p>Velocidade de Download: {(downloadSpeed / 1024).toFixed(2)} KB/s</p>
        <p>Tamanho do Arquivo: {(fileSize / 1024 / 1024).toFixed(2)} MB</p>
        <p>Progresso do Download: {progress.toFixed(2)}%</p>
      </div>
    </div>
  );
};

export default Receiver;
