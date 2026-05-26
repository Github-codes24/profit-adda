import React, { useState, useEffect, useRef } from "react";
import { GU, SU, sheetsAPI } from "../database";

export default function Onboarding({
  viewType, // "login", "register", "success"
  goTo,
  preFilledPhone,
  onLoginSuccess,
  generatedUid,
  setGeneratedUid,
}) {
  // Common states
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // --- LOGIN STATES ---
  const [loginIdentifier, setLoginIdentifier] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginTab, setLoginTab] = useState("login"); // "login" or "forgot"

  // --- FORGOT PASSWORD STATES ---
  const [forgotIdentifier, setForgotIdentifier] = useState("");
  const [forgotStep, setForgotStep] = useState(1); // 1: identify, 2: reset
  const [forgotUserId, setForgotUserId] = useState("");
  const [forgotNewPassword, setForgotNewPassword] = useState("");
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState("");

  // --- REGISTRATION STATES ---
  const [regFirstName, setRegFirstName] = useState("");
  const [regLastName, setRegLastName] = useState("");
  const [regPhone, setRegPhone] = useState(preFilledPhone || "");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regPasswordConfirm, setRegPasswordConfirm] = useState("");
  const [regDob, setRegDob] = useState("");
  const [regGender, setRegGender] = useState("");
  const [regCity, setRegCity] = useState("");
  const [regState, setRegState] = useState("");
  const [regReferral, setRegReferral] = useState(
    sessionStorage.getItem("pa_referral_code") || ""
  );
  const [selfieB64, setSelfieB64] = useState(null);

  // --- WEBCAM STATES ---
  const [webcamOpen, setWebcamOpen] = useState(false);
  const [webcamStream, setWebcamStream] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (preFilledPhone) {
      setRegPhone(preFilledPhone);
    }
  }, [preFilledPhone]);

  // Clean error messages on switch
  useEffect(() => {
    setErrorMsg("");
  }, [viewType, loginTab]);

  // ======= HANDLERS =======

  // Image compressor helper
  const compress = (src, cb) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const maxDim = 400;
      let w = img.width;
      let h = img.height;
      if (w > maxDim || h > maxDim) {
        if (w > h) {
          h = h * (maxDim / w);
          w = maxDim;
        } else {
          w = w * (maxDim / h);
          h = maxDim;
        }
      }
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, w, h);
      cb(canvas.toDataURL("image/jpeg", 0.6));
    };
    img.src = src;
  };

  // Selfie Upload from disk
  const handleSelfieUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      compress(ev.target.result, (compressedB64) => {
        setSelfieB64(compressedB64);
      });
    };
    reader.readAsDataURL(file);
  };

  // Webcam controls
  const openWebcam = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert("Camera API not supported on this browser.");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
      });
      setWebcamStream(stream);
      setWebcamOpen(true);
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }, 100);
    } catch (err) {
      alert("Camera access denied. Local gallery se upload karein.");
    }
  };

  const closeWebcam = () => {
    if (webcamStream) {
      webcamStream.getTracks().forEach((track) => track.stop());
      setWebcamStream(null);
    }
    setWebcamOpen(false);
  };

  const captureWebcamPhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);
    const rawB64 = canvas.toDataURL("image/jpeg", 0.6);
    compress(rawB64, (compressedB64) => {
      setSelfieB64(compressedB64);
      closeWebcam();
    });
  };

  // USER REGISTRATION
  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!regFirstName.trim()) return setErrorMsg("❌ First Name enter karein");
    if (!regLastName.trim()) return setErrorMsg("❌ Last Name enter karein");
    if (!/^\d{10}$/.test(regPhone.trim()))
      return setErrorMsg("❌ Valid 10-digit phone number enter karein");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(regEmail.trim()))
      return setErrorMsg("❌ Valid email ID enter karein");
    if (!regPassword || regPassword.length < 6)
      return setErrorMsg("❌ Password minimum 6 characters ka hona chahiye");
    if (regPassword !== regPasswordConfirm)
      return setErrorMsg("❌ Dono passwords match nahi karte");
    if (!regDob) return setErrorMsg("❌ Date of Birth select karein");
    if (!regGender) return setErrorMsg("❌ Gender select karein");
    if (!regCity.trim()) return setErrorMsg("❌ City enter karein");
    if (!regState) return setErrorMsg("❌ State select karein");

    setLoading(true);

    const now = new Date();
    const createdAt =
      now.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }) +
      " " +
      now.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });

    const payload = {
      firstName: regFirstName.trim(),
      lastName: regLastName.trim(),
      phone: regPhone.trim(),
      email: regEmail.trim(),
      password: regPassword,
      dob: regDob,
      gender: regGender,
      city: regCity.trim(),
      state: regState,
      referral: regReferral.trim().toUpperCase() || null,
      selfie: selfieB64 || null,
      createdAt,
    };

    try {
      const res = await sheetsAPI("register", payload);
      if (!res.ok) {
        setErrorMsg(res.msg || "❌ Registration failed. Dobara try karo.");
        setLoading(false);
        window.scrollTo(0, 200);
        return;
      }

      // Successful registration
      const uid = res.userId;
      setGeneratedUid(uid);

      // Save user to LocalStorage
      const localUsers = GU();
      const newUser = { userId: uid, ...payload };
      localUsers.push(newUser);
      SU(localUsers);

      // Reset fields
      setRegFirstName("");
      setRegLastName("");
      setRegPhone("");
      setRegEmail("");
      setRegPassword("");
      setRegPasswordConfirm("");
      setRegDob("");
      setRegGender("");
      setRegCity("");
      setRegState("");
      setRegReferral("");
      setSelfieB64(null);

      // Auto login the user
      onLoginSuccess(newUser);

      setLoading(false);
      goTo("success");
    } catch (err) {
      setErrorMsg("❌ Connection failed. Check local fallback settings.");
      setLoading(false);
    }
  };

  // USER LOGIN
  const handleLogin = (e) => {
    e.preventDefault();
    setErrorMsg("");

    const identifier = loginIdentifier.trim();
    const password = loginPassword;

    if (!identifier) return setErrorMsg("❌ Mobile number ya email daalo");
    if (!password) return setErrorMsg("❌ Password daalo");

    setLoading(true);

    setTimeout(() => {
      const users = GU();
      // Match phone or email, and password
      const user = users.find((u) => {
        const phoneMatch = u.phone && String(u.phone).trim() === identifier;
        const emailMatch =
          u.email && u.email.trim().toLowerCase() === identifier.toLowerCase();
        const passMatch = u.password && String(u.password) === password;
        return (phoneMatch || emailMatch) && passMatch;
      });

      if (!user) {
        // Helpful debugging messages
        const userExists = users.find(
          (u) =>
            (u.phone && String(u.phone).trim() === identifier) ||
            (u.email && u.email.trim().toLowerCase() === identifier.toLowerCase())
        );

        setLoading(false);
        if (!userExists) {
          setErrorMsg("❌ Is number/email se koi account nahi mila. Pehle register karo.");
        } else if (!userExists.password) {
          setErrorMsg('❌ Is account ka password set nahi hai. "Password Bhul Gaye?" click karein.');
        } else {
          setErrorMsg("❌ Password galat hai. Dobara try karo.");
        }
        return;
      }

      onLoginSuccess(user);
      setLoading(false);
      goTo("dashboard");
    }, 600);
  };

  // FORGOT PASSWORD STEP 1: IDENTIFY USER
  const handleForgotStep1 = (e) => {
    e.preventDefault();
    setErrorMsg("");
    const id = forgotIdentifier.trim();
    if (!id) return setErrorMsg("❌ Mobile number ya email daalo");

    const users = GU();
    const user = users.find((u) => u.phone === id || u.email === id);
    if (!user) {
      return setErrorMsg("❌ Is number/email se koi account nahi mila");
    }

    setForgotUserId(user.userId);
    setForgotStep(2);
  };

  // FORGOT PASSWORD STEP 2: PASSWORD UPDATE
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (forgotNewPassword.length < 6)
      return setErrorMsg("❌ Password minimum 6 characters ka hona chahiye");
    if (forgotNewPassword !== forgotConfirmPassword)
      return setErrorMsg("❌ Dono passwords match nahi karte");

    setLoading(true);

    try {
      const users = GU();
      const idx = users.findIndex((u) => u.userId === forgotUserId);
      if (idx === -1) {
        setErrorMsg("❌ User account nahi mila");
        setLoading(false);
        return;
      }

      // Update password locally
      users[idx].password = forgotNewPassword;
      SU(users);

      // Sync to Google Sheets if enabled
      await sheetsAPI("updatePassword", {
        userId: forgotUserId,
        password: forgotNewPassword,
      });

      alert("✅ Password reset ho gaya! Ab login karein.");
      setLoginTab("login");
      setLoginIdentifier(users[idx].phone || users[idx].email);
      setForgotIdentifier("");
      setForgotNewPassword("");
      setForgotConfirmPassword("");
      setForgotStep(1);
      setLoading(false);
    } catch (err) {
      setErrorMsg("❌ Reset failed. Check your network.");
      setLoading(false);
    }
  };

  // Copy success code
  const copyUidToClipboard = () => {
    if (!generatedUid) return;
    navigator.clipboard
      .writeText(generatedUid)
      .then(() => alert("✅ User ID copied!"))
      .catch(() => {});
  };

  // Loading Overlay Component
  const LoaderOverlay = () => {
    if (!loading) return null;
    return (
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(14,27,46,0.7)",
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            background: "#fff",
            borderRadius: "16px",
            padding: "28px 36px",
            textAlign: "center",
            boxShadow: "0 8px 48px rgba(0,0,0,0.2)",
          }}
        >
          <div style={{ fontSize: "36px", marginBottom: "8px", animation: "spin 1.5s linear infinite" }}>
            ⏳
          </div>
          <div
            style={{
              fontFamily: "'Baloo 2', cursive",
              fontSize: "18px",
              color: "#0E1B2E",
              fontWeight: 800,
            }}
          >
            Please wait...
          </div>
        </div>
      </div>
    );
  };

  // --- RENDER SUCCESS VIEW ---
  if (viewType === "success") {
    return (
      <div className="suc-wrap">
        <LoaderOverlay />
        <div className="suc-card">
          <div className="suc-ico">🎉</div>
          <h2>Registration Successful!</h2>
          <p>
            Aapka Profit Adda advisor account successfully activate ho gaya hai. Aapki
            Unique User ID neeche di gayi hai:
          </p>
          <div className="uid-box">
            <small>Aapki Advisor User ID</small>
            <strong>{generatedUid || "PA######"}</strong>
          </div>
          <button className="copy-btn" onClick={copyUidToClipboard}>
            📋 ID Copy Karo
          </button>
          <button
            className="submit-btn"
            style={{ marginTop: "24px" }}
            onClick={() => goTo("dashboard")}
          >
            💸 Go to Wallet Dashboard
          </button>
        </div>
      </div>
    );
  }

  // --- RENDER LOGIN VIEW ---
  if (viewType === "login") {
    return (
      <div className="al-wrap">
        <LoaderOverlay />
        <div className="al-card">
          {loginTab === "login" ? (
            <>
              <div className="al-ico">🔑</div>
              <h2>Advisor Login</h2>
              <p>Apna registered mobile number/email aur password bharo</p>

              <form onSubmit={handleLogin}>
                {errorMsg && (
                  <div className="err-box" style={{ display: "block" }}>
                    {errorMsg}
                  </div>
                )}

                <input
                  type="text"
                  placeholder="Mobile Number / Email ID"
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                  required
                />

                <div style={{ position: "relative", width: "100%" }}>
                  <input
                    type={showLoginPassword ? "text" : "password"}
                    placeholder="Password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                  />
                  <span
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    style={{
                      position: "absolute",
                      right: "12px",
                      top: "11px",
                      cursor: "pointer",
                      fontSize: "14px",
                    }}
                  >
                    {showLoginPassword ? "🙈" : "👁️"}
                  </span>
                </div>

                <button className="al-btn" type="submit" style={{ marginTop: "10px" }}>
                  🔐 Secure Login
                </button>
              </form>

              <p style={{ marginTop: "20px", fontSize: "12px", color: "var(--muted)" }}>
                <span
                  style={{ color: "var(--gold-d)", fontWeight: "700", cursor: "pointer" }}
                  onClick={() => setLoginTab("forgot")}
                >
                  Password Bhool Gaye?
                </span>
                <br />
                Naya Account Banana Hai?{" "}
                <span
                  style={{ color: "var(--gold-d)", fontWeight: "700", cursor: "pointer" }}
                  onClick={() => goTo("register")}
                >
                  Join Free
                </span>
              </p>
            </>
          ) : (
            // FORGOT PASSWORD FLOW
            <>
              <div className="al-ico">🔄</div>
              <h2>Password Reset</h2>
              <p>Registered account identity verify karein</p>

              {forgotStep === 1 ? (
                <form onSubmit={handleForgotStep1}>
                  {errorMsg && (
                    <div className="err-box" style={{ display: "block" }}>
                      {errorMsg}
                    </div>
                  )}

                  <input
                    type="text"
                    placeholder="Registered Mobile / Email ID"
                    value={forgotIdentifier}
                    onChange={(e) => setForgotIdentifier(e.target.value)}
                    required
                  />

                  <button className="al-btn" type="submit" style={{ marginTop: "10px" }}>
                    Identify Account →
                  </button>
                </form>
              ) : (
                <form onSubmit={handleResetPassword}>
                  {errorMsg && (
                    <div className="err-box" style={{ display: "block" }}>
                      {errorMsg}
                    </div>
                  )}

                  <div style={{ marginBottom: "12px", fontSize: "13px", color: "var(--green-d)" }}>
                    🟢 User ID Verified: <b>{forgotUserId}</b>
                  </div>

                  <input
                    type="password"
                    placeholder="New Password (min 6 chars)"
                    value={forgotNewPassword}
                    onChange={(e) => setForgotNewPassword(e.target.value)}
                    required
                  />

                  <input
                    type="password"
                    placeholder="Confirm New Password"
                    value={forgotConfirmPassword}
                    onChange={(e) => setForgotConfirmPassword(e.target.value)}
                    required
                  />

                  <button className="al-btn" type="submit" style={{ marginTop: "10px" }}>
                    Reset Password Now
                  </button>
                </form>
              )}

              <p style={{ marginTop: "20px", fontSize: "12px", color: "var(--muted)" }}>
                <span
                  style={{ color: "var(--gold-d)", fontWeight: "700", cursor: "pointer" }}
                  onClick={() => {
                    setLoginTab("login");
                    setForgotStep(1);
                  }}
                >
                  Back to Login
                </span>
              </p>
            </>
          )}
        </div>
      </div>
    );
  }

  // --- RENDER REGISTRATION VIEW ---
  return (
    <div className="reg-wrap">
      <LoaderOverlay />
      <div className="reg-card">
        <div className="reg-top">
          <h2>Advisor Registration</h2>
          <p>India ka trusted earning channel — complete details bharo</p>
        </div>

        <form onSubmit={handleRegister} className="reg-body">
          {errorMsg && (
            <div className="err-box" style={{ display: "block" }}>
              {errorMsg}
            </div>
          )}

          <div className="frow">
            <div className="fg">
              <label>
                First Name <em>*</em>
              </label>
              <input
                type="text"
                placeholder="eg. Neha"
                value={regFirstName}
                onChange={(e) => setRegFirstName(e.target.value)}
                required
              />
            </div>
            <div className="fg">
              <label>
                Last Name <em>*</em>
              </label>
              <input
                type="text"
                placeholder="eg. Sharma"
                value={regLastName}
                onChange={(e) => setRegLastName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="frow">
            <div className="fg">
              <label>
                Mobile Number <em>*</em>
              </label>
              <input
                type="tel"
                maxLength="10"
                placeholder="10-Digit Mobile No."
                value={regPhone}
                onChange={(e) => setRegPhone(e.target.value)}
                required
              />
            </div>
            <div className="fg">
              <label>
                Email ID <em>*</em>
              </label>
              <input
                type="email"
                placeholder="eg. neha@gmail.com"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="frow">
            <div className="fg">
              <label>
                Password <em>*</em>
              </label>
              <input
                type="password"
                placeholder="Minimum 6 characters"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                required
              />
            </div>
            <div className="fg">
              <label>
                Confirm Password <em>*</em>
              </label>
              <input
                type="password"
                placeholder="Same password enter karo"
                value={regPasswordConfirm}
                onChange={(e) => setRegPasswordConfirm(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="frow">
            <div className="fg">
              <label>
                Date of Birth <em>*</em>
              </label>
              <input
                type="date"
                value={regDob}
                onChange={(e) => setRegDob(e.target.value)}
                required
              />
            </div>
            <div className="fg">
              <label>
                Gender <em>*</em>
              </label>
              <select
                value={regGender}
                onChange={(e) => setRegGender(e.target.value)}
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male ♂</option>
                <option value="Female">Female ♀</option>
                <option value="Other">Other ⚧</option>
              </select>
            </div>
          </div>

          <div className="frow">
            <div className="fg">
              <label>
                City Name <em>*</em>
              </label>
              <input
                type="text"
                placeholder="eg. Patna"
                value={regCity}
                onChange={(e) => setRegCity(e.target.value)}
                required
              />
            </div>
            <div className="fg">
              <label>
                State Name <em>*</em>
              </label>
              <select
                value={regState}
                onChange={(e) => setRegState(e.target.value)}
                required
              >
                <option value="">Select State</option>
                {[
                  "Andhra Pradesh",
                  "Arunachal Pradesh",
                  "Assam",
                  "Bihar",
                  "Chhattisgarh",
                  "Delhi",
                  "Goa",
                  "Gujarat",
                  "Haryana",
                  "Himachal Pradesh",
                  "Jharkhand",
                  "Karnataka",
                  "Kerala",
                  "Madhya Pradesh",
                  "Maharashtra",
                  "Manipur",
                  "Meghalaya",
                  "Mizoram",
                  "Nagaland",
                  "Odisha",
                  "Punjab",
                  "Rajasthan",
                  "Sikkim",
                  "Tamil Nadu",
                  "Telangana",
                  "Tripura",
                  "Uttar Pradesh",
                  "Uttarakhand",
                  "West Bengal",
                ].map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="frow full">
            <div className="fg">
              <label>Referral Code (Optional)</label>
              <input
                type="text"
                placeholder="eg. PA123456"
                value={regReferral}
                onChange={(e) => setRegReferral(e.target.value)}
                style={{ textTransform: "uppercase" }}
              />
            </div>
          </div>

          <div className="fdiv"></div>
          <div className="fsec">Verification Selfie Upload</div>

          {/* Selfie upload / capture UI */}
          <div className={`selfie-area ${selfieB64 ? "done" : ""}`} id="selfieArea">
            {selfieB64 ? (
              <img
                src={selfieB64}
                alt="Selfie Preview"
                id="selfiePreview"
                style={{ display: "block" }}
              />
            ) : (
              <div id="selfieDefault" style={{ color: "var(--muted)", fontSize: "13px" }}>
                🤳 Live Webcam selfie capture karein ya upload file karein
              </div>
            )}

            <div className="s-btns">
              <button className="s-btn" type="button" onClick={openWebcam}>
                📷 Open Webcam Camera
              </button>
              <label className="s-btn" style={{ display: "inline-block", margin: 0 }}>
                📁 Upload Photo File
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleSelfieUpload}
                  style={{ display: "none" }}
                />
              </label>
              {selfieB64 && (
                <button
                  className="s-btn"
                  type="button"
                  style={{ color: "var(--red)" }}
                  onClick={() => setSelfieB64(null)}
                >
                  ❌ Remove
                </button>
              )}
            </div>
          </div>

          <button className="submit-btn" type="submit">
            🚀 Complete Advisor Registration
          </button>

          <p
            style={{
              textAlign: "center",
              fontSize: "12px",
              color: "var(--muted)",
              marginTop: "16px",
            }}
          >
            Pehle se account hai?{" "}
            <span
              style={{ color: "var(--gold-d)", fontWeight: "700", cursor: "pointer" }}
              onClick={() => goTo("login")}
            >
              Login Karo
            </span>
          </p>
        </form>
      </div>

      {/* Webcam Modal overlay */}
      {webcamOpen && (
        <div
          className="cam-modal"
          style={{ display: "flex" }}
          onClick={closeWebcam}
        >
          <div className="cam-inner" onClick={(e) => e.stopPropagation()}>
            <h3>📷 Real-time Selfie Capture</h3>
            <video id="camVideo" ref={videoRef} autoPlay playsInline></video>
            <canvas id="camCanvas" ref={canvasRef} style={{ display: "none" }}></canvas>
            <div className="cam-btns">
              <button className="submit-btn" style={{ width: "auto", padding: "10px 20px" }} type="button" onClick={captureWebcamPhoto}>
                📸 Snap Selfie Photo
              </button>
              <button
                className="submit-btn"
                style={{ width: "auto", padding: "10px 20px", background: "var(--navy)", color: "#fff" }}
                type="button"
                onClick={closeWebcam}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
