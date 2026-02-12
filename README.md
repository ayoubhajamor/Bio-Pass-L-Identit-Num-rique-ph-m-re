# Bio-Pass: L'Identité Numérique Éphémère

**Bio-Pass** is a client-side digital identity system that generates a **temporary, one-time-use pass**. Each pass has a unique token, an editable timer, and an ephemeral QR code that automatically expires, making it perfect for secure, temporary identity verification.

---

## Features

- **Editable Timer** – Set the pass duration before generating (default: 30 seconds).  
- **Unique Token** – Secure random token generated via **Web Crypto API**.  
- **One-Time QR Code** – Each pass displays a QR code representing the token.  
- **Circular Countdown** – Visual circular countdown around QR code.  
- **Numeric Countdown** – Timer displayed above QR code, clearly visible.  
- **Automatic Expiry** – Pass self-destructs when the timer reaches zero.  
- **Verification** – Input the token to verify the pass validity.  
- **Persistent Storage** – Pass survives page reloads using **LocalStorage**.  
- **Visual Effects** – Pulse effect for last 5 seconds, fade and glitch animation on destruction.  
- **Responsive Design** – Cyberpunk-style UI, fully mobile and desktop compatible.  

---

## Technologies Used

- **Next.js (App Router)** – React framework for client-side rendering.  
- **React Hooks** – `useState` and `useEffect` for state and timer management.  
- **Web Crypto API** – Secure random token generation.  
- **qrcode.react** – QR code generation.  
- **LocalStorage** – Persistence across page reloads.  
- **Tailwind CSS** – Rapid, responsive UI styling.  

---

## How It Works

1. User fills in **Name**, **ID**, and **Duration (seconds)**.  
2. Click **Generate Bio-Pass**.  
3. A **unique token** is generated and stored in LocalStorage.  
4. The **QR code** appears with:
   - Circular countdown animation
   - Numeric timer above
5. The pass **self-destructs** when the timer ends.  
6. Users can verify the token using the verification section.  

---

## Usage

1. Clone the repository:  
```bash
   git clone https://github.com/ayoubhajamor/Bio-Pass-L-Identit-Num-rique-ph-m-re.git
   cd Bio-Pass-L-Identit-Num-rique-ph-m-re/bio-pass
   npm install
   npm run dev
```

