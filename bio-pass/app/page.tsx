"use client";

import { useState, useEffect, useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";

export default function Home() {
  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const [duration, setDuration] = useState(30); // Editable timer
  const [pass, setPass] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [verifyInput, setVerifyInput] = useState("");
  const [verifyResult, setVerifyResult] = useState("");

  const passContainerRef = useRef<HTMLDivElement>(null);

  const generateToken = () => {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return btoa(String.fromCharCode(...array));
  };

  const generatePass = () => {
    if (!name || !id || !duration) return alert("Veuillez remplir Nom, ID et Durée");

    const token = generateToken();
    const expiresAt = Date.now() + duration * 1000;

    const newPass = { name, id, token, expiresAt, duration };

    localStorage.setItem("bioPass", JSON.stringify(newPass));
    setPass(newPass);
    setTimeLeft(duration);
  };

  useEffect(() => {
    if (!pass) return;

    const interval = setInterval(() => {
      const remaining = Math.floor((pass.expiresAt - Date.now()) / 1000);
      setTimeLeft(remaining);

      if (remaining <= 0) {
        clearInterval(interval);
        destroyPass();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [pass]);

  const destroyPass = () => {
    if (passContainerRef.current) {
      passContainerRef.current.classList.add(
        "opacity-0",
        "transition",
        "duration-1000",
        "glitch"
      );
      setTimeout(() => {
        localStorage.removeItem("bioPass");
        setPass(null);
      }, 1000);
    } else {
      localStorage.removeItem("bioPass");
      setPass(null);
    }
  };

  useEffect(() => {
    const savedPass = localStorage.getItem("bioPass");
    if (savedPass) {
      const parsedPass = JSON.parse(savedPass);
      if (Date.now() < parsedPass.expiresAt) {
        setPass(parsedPass);
        setTimeLeft(Math.floor((parsedPass.expiresAt - Date.now()) / 1000));
      } else {
        localStorage.removeItem("bioPass");
      }
    }
  }, []);

  const verifyToken = () => {
    if (!pass) return setVerifyResult("Pas de pass actif");

    if (Date.now() > pass.expiresAt) {
      destroyPass();
      return setVerifyResult("Expiré");
    }

    if (verifyInput === pass.token) {
      destroyPass();
      return setVerifyResult("Valide");
    }

    return setVerifyResult("Invalide");
  };

  // Circular countdown variables
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const progress = ((pass?.duration ?? duration) - timeLeft) / (pass?.duration ?? duration);
  const strokeDashoffset = circumference * progress;

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 gap-6">
      <h1 className="text-3xl font-bold text-red-500 mb-4">
        Bio-Pass: Identité Numérique Éphémère
      </h1>

      {/* Form Section */}
      {!pass && (
        <div className="bg-gray-900 p-6 rounded-xl w-full max-w-md flex flex-col gap-4">
          <input
            type="text"
            placeholder="Nom"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="p-2 rounded bg-black border border-gray-700"
          />
          <input
            type="text"
            placeholder="ID"
            value={id}
            onChange={(e) => setId(e.target.value)}
            className="p-2 rounded bg-black border border-gray-700"
          />
          <input
            type="number"
            placeholder="Durée (s)"
            value={duration}
            min={5}
            onChange={(e) => setDuration(parseInt(e.target.value))}
            className="p-2 rounded bg-black border border-gray-700"
          />
          <button
            onClick={generatePass}
            className="bg-red-600 hover:bg-red-700 p-2 rounded font-semibold"
          >
            Générer Bio-Pass
          </button>
        </div>
      )}

      {/* Pass Display */}
      {pass && (
        <div
          ref={passContainerRef}
          className="bg-gray-900 bg-opacity-80 backdrop-blur-md p-6 rounded-xl w-full max-w-md flex flex-col gap-4 items-center border-2 border-red-500 shadow-lg transition duration-500"
        >
          <h2 className="text-xl font-bold text-green-400 tracking-widest">
            PASS ACTIF
          </h2>
          <p>
            <strong>Nom:</strong> {pass.name}
          </p>
          <p>
            <strong>ID:</strong> {pass.id}
          </p>

          {/* Timer numeric display above QR code */}
          <div
            className={`text-4xl font-bold mt-2 ${
              timeLeft <= 5 ? "text-red-500 animate-pulse" : "text-red-400"
            }`}
          >
            {timeLeft}s
          </div>

          {/* QR code with circular countdown */}
          <div className="relative w-[160px] h-[160px] flex items-center justify-center mt-2">
            <svg className="absolute top-0 left-0" width={160} height={160}>
              <circle
                cx={80}
                cy={80}
                r={radius}
                stroke="#555"
                strokeWidth={8}
                fill="none"
              />
              <circle
                cx={80}
                cy={80}
                r={radius}
                stroke="#f00"
                strokeWidth={8}
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={circumference - strokeDashoffset}
                strokeLinecap="round"
                transform="rotate(-90 80 80)"
                className="transition-all duration-500"
              />
            </svg>
            <QRCodeCanvas value={pass.token} size={100} />
          </div>

          <button
            onClick={destroyPass}
            className="bg-gray-700 hover:bg-gray-800 p-2 rounded mt-2"
          >
            Détruire Pass
          </button>
        </div>
      )}

      {/* Verification Section */}
      <div className="bg-gray-900 p-6 rounded-xl w-full max-w-md flex flex-col gap-4">
        <h2 className="text-lg font-bold">Vérification</h2>
        <input
          type="text"
          placeholder="Entrer le token"
          value={verifyInput}
          onChange={(e) => setVerifyInput(e.target.value)}
          className="p-2 rounded bg-black border border-gray-700"
        />
        <button
          onClick={verifyToken}
          className="bg-blue-600 hover:bg-blue-700 p-2 rounded"
        >
          Vérifier
        </button>
        {verifyResult && <p className="font-bold">{verifyResult}</p>}
      </div>

      {/* Glitch Animation */}
      <style jsx global>{`
        @keyframes glitch {
          0% { transform: translate(0); }
          20% { transform: translate(-2px, 2px); }
          40% { transform: translate(2px, -2px); }
          60% { transform: translate(-2px, -2px); }
          80% { transform: translate(2px, 2px); }
          100% { transform: translate(0); }
        }
        .glitch {
          animation: glitch 0.3s infinite;
        }
      `}</style>
    </main>
  );
}

