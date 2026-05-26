import React, { useState, useEffect } from "react";
import { GU, SU, GW, SW, sheetsAPI } from "../database";

export default function WithdrawModal({ isOpen, onClose, loggedInUser, onWithdrawSuccess, onUserUpdate }) {
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState(null); // "bank" or "upi"
  const [availableBal, setAvailableBal] = useState(0);

  // KYC Bank fields
  const [bankName, setBankName] = useState("");
  const [accHolder, setAccHolder] = useState("");
  const [accNum, setAccNum] = useState("");
  const [accNumConfirm, setAccNumConfirm] = useState("");
  const [ifsc, setIfsc] = useState("");
  const [pan, setPan] = useState("");
  const [panConfirm, setPanConfirm] = useState("");
  const [aadhaar, setAadhaar] = useState("");
  const [aadhaarConfirm, setAadhaarConfirm] = useState("");

  // Saved KYC indicators
  const [hasSavedBankKyc, setHasSavedBankKyc] = useState(false);
  const [hasSavedUpiKyc, setHasSavedUpiKyc] = useState(false);

  // KYC base64 document files
  const [panImg, setPanImg] = useState(null);
  const [aadhaarFrontImg, setAadhaarFrontImg] = useState(null);
  const [aadhaarBackImg, setAadhaarBackImg] = useState(null);

  // UPI fields
  const [upiId, setUpiId] = useState("");

  // Common UI states
  const [step, setStep] = useState(1); // 1: Form, 2: Success
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && loggedInUser) {
      setAmount("");
      setMethod(null);
      setStep(1);
      setErrorMsg("");
      setLoading(false);
      setPanImg(null);
      setAadhaarFrontImg(null);
      setAadhaarBackImg(null);

      // Reset form fields
      setBankName("");
      setAccHolder("");
      setAccNum("");
      setAccNumConfirm("");
      setIfsc("");
      setPan("");
      setPanConfirm("");
      setAadhaar("");
      setAadhaarConfirm("");
      setUpiId("");

      // Fetch saved profile details
      const users = GU();
      const u = users.find((x) => x.userId === loggedInUser.userId) || {};
      setHasSavedBankKyc(!!u.kycBank);
      setHasSavedUpiKyc(!!u.kycUpi);

      if (u.kycUpi) setUpiId(u.kycUpi);

      // Calculate available balance
      const withdrawals = GW();
      const myWds = withdrawals.filter((w) => w.userId === loggedInUser.userId);
      const totalWithdrawnApproved = myWds
        .filter((w) => w.status === "approved")
        .reduce((t, w) => t + (parseFloat(w.amount) || 0), 0);
      const totalWithdrawnPending = myWds
        .filter((w) => w.status === "pending")
        .reduce((t, w) => t + (parseFloat(w.amount) || 0), 0);

      // Available calculation
      const subs = JSON.parse(localStorage.getItem("pa_submissions") || "[]");
      const approvedAmt = subs
        .filter((s) => s.userId === loggedInUser.userId && s.status === "approved")
        .reduce((t, s) => t + (parseFloat(s.payout) || 0), 0);

      const bal = Math.max(0, approvedAmt - totalWithdrawnApproved - totalWithdrawnPending);
      setAvailableBal(bal);
    }
  }, [isOpen, loggedInUser]);

  if (!isOpen) return null;

  // Compress helper
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
      canvas.getContext("2d").drawImage(img, 0, 0, w, h);
      cb(canvas.toDataURL("image/jpeg", 0.6));
    };
    img.src = src;
  };

  const handleDocUpload = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      compress(ev.target.result, (compressedB64) => {
        if (type === "pan") setPanImg(compressedB64);
        if (type === "front") setAadhaarFrontImg(compressedB64);
        if (type === "back") setAadhaarBackImg(compressedB64);
      });
    };
    reader.readAsDataURL(file);
  };

  const handleWithdrawalSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    const parsedAmt = parseFloat(amount);
    if (!amount || isNaN(parsedAmt) || parsedAmt < 200) {
      return setErrorMsg("❌ Minimum ₹200 ka amount daalo");
    }
    if (parsedAmt > availableBal) {
      return setErrorMsg(`❌ Itna balance available nahi hai. Balance: ₹${availableBal.toLocaleString("en-IN")}`);
    }
    if (!method) {
      return setErrorMsg("❌ Pehle payment method select karo (Bank / UPI)");
    }

    setLoading(true);

    const users = GU();
    const uIdx = users.findIndex((x) => x.userId === loggedInUser.userId);
    const u = users[uIdx] || {};

    let paymentDetails = {};

    if (method === "bank") {
      if (hasSavedBankKyc) {
        paymentDetails = { type: "bank", ...u.kycBank };
      } else {
        // Validation check for inputs
        if (!bankName.trim()) { setLoading(false); return setErrorMsg("❌ Bank Name daalo"); }
        if (!accHolder.trim()) { setLoading(false); return setErrorMsg("❌ Account Holder Name daalo"); }
        if (!accNum.trim()) { setLoading(false); return setErrorMsg("❌ Account Number daalo"); }
        if (accNum !== accNumConfirm) { setLoading(false); return setErrorMsg("❌ Account Number match nahi karta"); }
        if (!ifsc || !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifsc.toUpperCase())) {
          setLoading(false);
          return setErrorMsg("❌ Valid IFSC code daalo (e.g. SBIN0001234)");
        }
        if (!pan || !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan.toUpperCase())) {
          setLoading(false);
          return setErrorMsg("❌ Valid PAN Number daalo (e.g. ABCDE1234F)");
        }
        if (pan.toUpperCase() !== panConfirm.toUpperCase()) {
          setLoading(false);
          return setErrorMsg("❌ PAN Number match nahi karta");
        }
        if (!panImg) { setLoading(false); return setErrorMsg("❌ PAN Card photo upload karo"); }
        
        const cleanAadhaar = aadhaar.replace(/\s/g, "");
        const cleanAadhaarConfirm = aadhaarConfirm.replace(/\s/g, "");
        if (!cleanAadhaar || !/^\d{12}$/.test(cleanAadhaar)) {
          setLoading(false);
          return setErrorMsg("❌ Valid 12-digit Aadhaar Number daalo");
        }
        if (cleanAadhaar !== cleanAadhaarConfirm) {
          setLoading(false);
          return setErrorMsg("❌ Aadhaar Number match nahi karta");
        }
        if (!aadhaarFrontImg) { setLoading(false); return setErrorMsg("❌ Aadhaar Front photo upload karo"); }
        if (!aadhaarBackImg) { setLoading(false); return setErrorMsg("❌ Aadhaar Back photo upload karo"); }

        paymentDetails = {
          type: "bank",
          bankName: bankName.trim(),
          accHolder: accHolder.trim(),
          accNum: accNum.trim(),
          ifsc: ifsc.toUpperCase(),
          pan: pan.toUpperCase(),
          aadhaar: cleanAadhaar,
        };

        // Update profile KYC details
        if (uIdx > -1) {
          users[uIdx].kycDone = true;
          users[uIdx].kycBank = {
            bankName: bankName.trim(),
            accHolder: accHolder.trim(),
            accNum: accNum.trim(),
            ifsc: ifsc.toUpperCase(),
          };
          users[uIdx].kyc = {
            pan: pan.toUpperCase(),
            panImg,
            aadhaar: cleanAadhaar,
            aadhaarFront: aadhaarFrontImg,
            aadhaarBack: aadhaarBackImg,
          };
          SU(users);
          onUserUpdate(users[uIdx]);
        }
      }
    } else {
      // UPI Flow
      if (hasSavedUpiKyc) {
        paymentDetails = { type: "upi", upiId: u.kycUpi };
      } else {
        if (!upiId.trim()) { setLoading(false); return setErrorMsg("❌ UPI ID daalo"); }
        paymentDetails = { type: "upi", upiId: upiId.trim() };

        if (uIdx > -1) {
          users[uIdx].kycUpi = upiId.trim();
          SU(users);
          onUserUpdate(users[uIdx]);
        }
      }
    }

    const now = new Date();
    const reqId = "WD" + Date.now();
    const formattedDate =
      now.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }) +
      " " +
      now.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
      });

    const newWd = {
      id: reqId,
      userId: loggedInUser.userId,
      amount: parsedAmt,
      paymentDetails,
      status: "pending",
      createdAt: formattedDate,
      updatedAt: formattedDate,
      kycData: uIdx > -1 ? users[uIdx].kyc : null,
      kycBank: uIdx > -1 ? users[uIdx].kycBank : null,
      panImg: method === "bank" ? panImg : null,
      aadhaarFront: method === "bank" ? aadhaarFrontImg : null,
      aadhaarBack: method === "bank" ? aadhaarBackImg : null,
    };

    try {
      const wds = GW();
      wds.push(newWd);
      SW(wds);

      // Sync to sheets in background
      sheetsAPI("addWithdrawal", newWd).catch(() => {});

      setLoading(false);
      setStep(2);
      onWithdrawSuccess();
    } catch (err) {
      setErrorMsg("❌ Withdrawal failed. Server connection error.");
      setLoading(false);
    }
  };

  return (
    <div className="umod on" onClick={onClose}>
      <div className="umod-inner" onClick={(e) => e.stopPropagation()} style={{ width: "580px" }}>
        <div className="umod-top" style={{ padding: "16px 24px" }}>
          <h3 style={{ color: "#fff", margin: 0 }}>💸 Withdraw Earnings</h3>
          <button className="umod-close" onClick={onClose}>
            ×
          </button>
        </div>

        {step === 1 ? (
          <form onSubmit={handleWithdrawalSubmit} className="umod-body" style={{ maxHeight: "75vh", overflowY: "auto", display: "flex", flexDirection: "column", gap: "14px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", background: "#f0fdf7", border: "1px solid #c6f0df", borderRadius: "8px", padding: "12px 16px" }}>
              <span style={{ fontSize: "13px", color: "var(--green-d)", fontWeight: "600" }}>Available Wallet Balance:</span>
              <strong style={{ fontSize: "16px", color: "var(--green)" }}>₹{availableBal.toLocaleString("en-IN")}</strong>
            </div>

            {errorMsg && (
              <div className="err-box" style={{ display: "block", marginBottom: 0 }}>
                {errorMsg}
              </div>
            )}

            <div className="fg">
              <label>Withdrawal Amount (₹) *</label>
              <input
                type="number"
                min="200"
                placeholder="Minimum ₹200 daalo"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1.5px solid var(--border)" }}
              />
            </div>

            <div className="fg">
              <label>Select Payment Method *</label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginTop: "5px" }}>
                <div
                  id="wdBankOpt"
                  onClick={() => selectWithdrawMethod("bank")}
                  style={{
                    border: "1.5px solid var(--border)",
                    borderRadius: "8px",
                    padding: "12px",
                    textAlign: "center",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    borderColor: method === "bank" ? "var(--green-d)" : "var(--border)",
                    background: method === "bank" ? "var(--green-l)" : "#fff",
                  }}
                >
                  🏦 Bank Account
                </div>
                <div
                  id="wdUpiOpt"
                  onClick={() => selectWithdrawMethod("upi")}
                  style={{
                    border: "1.5px solid var(--border)",
                    borderRadius: "8px",
                    padding: "12px",
                    textAlign: "center",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    borderColor: method === "upi" ? "var(--green-d)" : "var(--border)",
                    background: method === "upi" ? "var(--green-l)" : "#fff",
                  }}
                >
                  📱 UPI ID
                </div>
              </div>
            </div>

            {/* BANK METHOD FIELDS */}
            {method === "bank" && (
              <div style={{ background: "#fafafa", borderRadius: "8px", padding: "16px", border: "1px solid var(--border)", display: "flex", flexDirection: "column", gap: "12px" }}>
                {hasSavedBankKyc ? (
                  <div>
                    <h4 style={{ fontSize: "12px", color: "var(--muted)", textTransform: "uppercase", marginBottom: "8px" }}>Saved Bank KYC Profile</h4>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", fontSize: "13px" }}>
                      <div>Bank: <b>{loggedInUser.kycBank?.bankName}</b></div>
                      <div>Holder: <b>{loggedInUser.kycBank?.accHolder}</b></div>
                      <div>Account: <b>****{(loggedInUser.kycBank?.accNum || "").slice(-4)}</b></div>
                      <div>IFSC: <b>{loggedInUser.kycBank?.ifsc}</b></div>
                    </div>
                  </div>
                ) : (
                  <>
                    <h4 style={{ fontSize: "13px", color: "var(--navy)", borderBottom: "1px solid var(--border)", paddingBottom: "6px" }}>Bank & KYC details verification (One-time)</h4>
                    <div className="frow" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                      <div className="fg">
                        <label>Bank Name *</label>
                        <input type="text" placeholder="SBI, HDFC, etc." value={bankName} onChange={(e) => setBankName(e.target.value)} required />
                      </div>
                      <div className="fg">
                        <label>Account Holder Name *</label>
                        <input type="text" placeholder="Passbook wala naam" value={accHolder} onChange={(e) => setAccHolder(e.target.value)} required />
                      </div>
                    </div>
                    <div className="frow" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                      <div className="fg">
                        <label>Account Number *</label>
                        <input type="password" placeholder="Account number" value={accNum} onChange={(e) => setAccNum(e.target.value)} required />
                      </div>
                      <div className="fg">
                        <label>Confirm Account Number *</label>
                        <input type="text" placeholder="Confirm account number" value={accNumConfirm} onChange={(e) => setAccNumConfirm(e.target.value)} required />
                      </div>
                    </div>
                    <div className="fg">
                      <label>IFSC Code *</label>
                      <input type="text" placeholder="e.g. SBIN0001234" value={ifsc} onChange={(e) => setIfsc(e.target.value)} style={{ textTransform: "uppercase" }} required />
                    </div>

                    <div style={{ height: "1px", background: "var(--border)", margin: "8px 0" }}></div>
                    <div style={{ fontSize: "11px", fontWeight: "700", color: "var(--navy)" }}>📄 Document KYC Details</div>

                    <div className="frow" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                      <div className="fg">
                        <label>PAN Card Number *</label>
                        <input type="text" placeholder="ABCDE1234F" maxLength="10" value={pan} onChange={(e) => setPan(e.target.value)} style={{ textTransform: "uppercase" }} required />
                      </div>
                      <div className="fg">
                        <label>Confirm PAN *</label>
                        <input type="text" placeholder="Same PAN Number" maxLength="10" value={panConfirm} onChange={(e) => setPanConfirm(e.target.value)} style={{ textTransform: "uppercase" }} required />
                      </div>
                    </div>

                    <div className="fg">
                      <label>PAN Card Copy *</label>
                      <div className={`selfie-area ${panImg ? "done" : ""}`} style={{ padding: "14px" }}>
                        <span style={{ fontSize: "12px", color: "var(--muted)" }}>{panImg ? "✅ PAN Card Uploaded!" : "📁 Upload PAN photo"}</span>
                        <input type="file" accept="image/*" onChange={(e) => handleDocUpload(e, "pan")} style={{ display: "none" }} id="panDocFile" />
                        <label htmlFor="panDocFile" className="s-btn" style={{ padding: "4px 10px", fontSize: "11px", marginTop: "6px", display: "inline-block", cursor: "pointer" }}>Select Image</label>
                      </div>
                    </div>

                    <div className="frow" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                      <div className="fg">
                        <label>Aadhaar Card Number *</label>
                        <input
                          type="text"
                          maxLength="14"
                          placeholder="xxxx xxxx xxxx"
                          value={aadhaar}
                          onChange={(e) => {
                            let val = e.target.value.replace(/\D/g, "");
                            let fmt = val.match(/.{1,4}/g);
                            setAadhaar(fmt ? fmt.join(" ") : val);
                          }}
                          required
                        />
                      </div>
                      <div className="fg">
                        <label>Confirm Aadhaar *</label>
                        <input
                          type="text"
                          maxLength="14"
                          placeholder="xxxx xxxx xxxx"
                          value={aadhaarConfirm}
                          onChange={(e) => {
                            let val = e.target.value.replace(/\D/g, "");
                            let fmt = val.match(/.{1,4}/g);
                            setAadhaarConfirm(fmt ? fmt.join(" ") : val);
                          }}
                          required
                        />
                      </div>
                    </div>

                    <div className="frow" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                      <div className="fg">
                        <label>Aadhaar Front Photo *</label>
                        <div className={`selfie-area ${aadhaarFrontImg ? "done" : ""}`} style={{ padding: "14px" }}>
                          <span style={{ fontSize: "11px", color: "var(--muted)" }}>{aadhaarFrontImg ? "✅ Front Uploaded!" : "📁 Front"}</span>
                          <input type="file" accept="image/*" onChange={(e) => handleDocUpload(e, "front")} style={{ display: "none" }} id="aadFrontFile" />
                          <label htmlFor="aadFrontFile" className="s-btn" style={{ padding: "4px 8px", fontSize: "10px", marginTop: "5px", display: "inline-block", cursor: "pointer" }}>Upload</label>
                        </div>
                      </div>
                      <div className="fg">
                        <label>Aadhaar Back Photo *</label>
                        <div className={`selfie-area ${aadhaarBackImg ? "done" : ""}`} style={{ padding: "14px" }}>
                          <span style={{ fontSize: "11px", color: "var(--muted)" }}>{aadhaarBackImg ? "✅ Back Uploaded!" : "📁 Back"}</span>
                          <input type="file" accept="image/*" onChange={(e) => handleDocUpload(e, "back")} style={{ display: "none" }} id="aadBackFile" />
                          <label htmlFor="aadBackFile" className="s-btn" style={{ padding: "4px 8px", fontSize: "10px", marginTop: "5px", display: "inline-block", cursor: "pointer" }}>Upload</label>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* UPI METHOD FIELDS */}
            {method === "upi" && (
              <div style={{ background: "#fafafa", borderRadius: "8px", padding: "16px", border: "1px solid var(--border)", display: "flex", flexDirection: "column", gap: "12px" }}>
                {hasSavedUpiKyc ? (
                  <div>
                    <span style={{ color: "var(--muted)", fontSize: "11px" }}>Saved UPI ID:</span>
                    <br />
                    <strong>{upiId}</strong>
                  </div>
                ) : (
                  <div className="fg">
                    <label>Enter UPI Address *</label>
                    <input
                      type="text"
                      placeholder="e.g. name@upi or mobile@paytm"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      required
                      style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1.5px solid var(--border)" }}
                    />
                    <small style={{ fontSize: "11px", color: "var(--muted)" }}>Aapki earnings seedha is UPI address par transfer hogi.</small>
                  </div>
                )}
              </div>
            )}

            <button className="submit-btn" type="submit" disabled={loading} style={{ marginTop: "10px" }}>
              {loading ? "Processing..." : "💸 Withdraw Request Submit Karo"}
            </button>
          </form>
        ) : (
          // SUCCESS STATE
          <div className="umod-body" style={{ textAlign: "center", padding: "32px" }}>
            <div style={{ fontSize: "60px", marginBottom: "16px" }}>✔️</div>
            <h3 style={{ fontSize: "20px", color: "var(--navy)", marginBottom: "10px" }}>Withdrawal Request Submitted</h3>
            <p style={{ color: "var(--muted)", fontSize: "14px", lineHeight: "1.7", marginBottom: "20px" }}>
              Aapka withdrawal request successfully register ho gaya hai. Admin isse verify
              karke <b>3 se 7 working days</b> mein approve karega. Account balances update ho
              chuke hain.
            </p>
            <button className="submit-btn" onClick={onClose}>
              Dashboard par jao
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
