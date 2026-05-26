import React, { useState, useEffect } from "react";
import { GC, GS, SS, sheetsAPI } from "../database";

export default function SubmitProofModal({ isOpen, onClose, loggedInUser, onSubmitted }) {
  const [campaigns, setCampaigns] = useState([]);
  const [campId, setCampId] = useState("");
  const [proof, setProof] = useState("");
  const [note, setNote] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (isOpen) {
      setCampaigns(GC());
      setCampId("");
      setProof("");
      setNote("");
      setErrorMsg("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!campId) return setErrorMsg("❌ Pehle offer select karo");
    if (!proof.trim()) return setErrorMsg("❌ Submission proof enter karein");

    const camp = campaigns.find((c) => c.id === campId);
    const submissions = GS();

    // Check duplicate pending submissions
    const duplicate = submissions.find(
      (s) =>
        s.userId === loggedInUser.userId &&
        s.campId === campId &&
        (s.status === "pending" || s.status === "rework")
    );

    if (duplicate) {
      return setErrorMsg("⚠️ Is offer ki submission pehle se pending hai!");
    }

    const now = new Date();
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

    const newSub = {
      id: "sub_" + Date.now(),
      userId: loggedInUser.userId,
      campId,
      campName: camp ? camp.name : "Unknown",
      payout: camp ? camp.payout : "TBD",
      payModel: camp ? camp.payModel : "cash",
      proof: proof.trim(),
      note: note.trim(),
      status: "pending",
      adminNote: "",
      submittedAt: formattedDate,
      updatedAt: "",
    };

    try {
      // Save locally first
      submissions.push(newSub);
      SS(submissions);

      // Save to sheets in background
      sheetsAPI("addSubmission", newSub).catch(() => {});

      alert("✅ Submission ho gaya! Admin isse jaldi review karega.");
      onSubmitted();
      onClose();
    } catch (err) {
      setErrorMsg("❌ Submission failed. Check your network.");
    }
  };

  return (
    <div className="umod on" onClick={onClose}>
      <div className="umod-inner" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "480px" }}>
        <div className="umod-top" style={{ padding: "16px 24px" }}>
          <h3 style={{ color: "#fff", margin: 0 }}>📤 Submit Campaign Proof</h3>
          <button className="umod-close" onClick={onClose}>
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit} className="umod-body" style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {errorMsg && (
            <div className="err-box" style={{ display: "block", marginBottom: 0 }}>
              {errorMsg}
            </div>
          )}

          <div className="fg" style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
            <label style={{ fontSize: "11px", fontWeight: "700", color: "var(--muted)" }}>Select Offer Template *</label>
            <select
              value={campId}
              onChange={(e) => setCampId(e.target.value)}
              style={{
                padding: "10px",
                borderRadius: "8px",
                border: "1.5px solid var(--border)",
                background: "var(--off)",
              }}
              required
            >
              <option value="">-- Choose Offer --</option>
              {campaigns.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} {c.segment ? `(${c.segment})` : ""}
                </option>
              ))}
            </select>
          </div>

          <div className="fg" style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
            <label style={{ fontSize: "11px", fontWeight: "700", color: "var(--muted)" }}>Submission Proof *</label>
            <input
              type="text"
              placeholder="e.g. Application ID / Lead No. / Registered Email"
              value={proof}
              onChange={(e) => setProof(e.target.value)}
              style={{
                padding: "10px",
                borderRadius: "8px",
                border: "1.5px solid var(--border)",
                background: "var(--off)",
              }}
              required
            />
            <small style={{ fontSize: "10px", color: "var(--muted)" }}>
              Jo screen success message pe milta hai use enter karein.
            </small>
          </div>

          <div className="fg" style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
            <label style={{ fontSize: "11px", fontWeight: "700", color: "var(--muted)" }}>Extra Advisor Note (Optional)</label>
            <textarea
              placeholder="Admin ke liye koi specific details..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              style={{
                padding: "10px",
                borderRadius: "8px",
                border: "1.5px solid var(--border)",
                background: "var(--off)",
                minHeight: "80px",
                resize: "vertical",
              }}
            />
          </div>

          <button className="submit-btn" type="submit" style={{ marginTop: "10px" }}>
            ✅ Submit Proof for Review
          </button>
        </form>
      </div>
    </div>
  );
}
