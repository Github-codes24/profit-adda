import React from "react";

export default function UserDetailModal({ isOpen, onClose, user }) {
  if (!isOpen || !user) return null;

  const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim();
  const hasKyc = !!user.kycDone;

  return (
    <div className="umod on" onClick={onClose}>
      <div className="umod-inner" onClick={(e) => e.stopPropagation()} style={{ width: "600px" }}>
        <div className="umod-top">
          {user.selfie ? (
            <img src={user.selfie} className="umod-av" alt="Selfie" />
          ) : (
            <div className="umod-av-ph">{user.phone ? user.phone[0] : "?"}</div>
          )}
          <div className="umod-info">
            <h3>{fullName || "No Name"}</h3>
            <small>Joined: {user.createdAt || "—"}</small>
          </div>
          <button className="umod-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="umod-body" style={{ maxHeight: "70vh", overflowY: "auto", display: "flex", flexDirection: "column", gap: "16px" }}>
          <div className="uid-show">
            <label>Advisor User ID</label>
            <span>{user.userId}</span>
          </div>

          <h4 style={{ borderBottom: "1px solid var(--border)", paddingBottom: "4px", margin: "10px 0 0", fontSize: "14px", color: "var(--navy)" }}>
            📞 Contact & Profile Details
          </h4>
          <div className="um-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            <div className="umf">
              <label>Phone Number</label>
              <span>{user.phone || "—"}</span>
            </div>
            <div className="umf">
              <label>Email ID</label>
              <span>{user.email || "—"}</span>
            </div>
            <div className="umf">
              <label>Date of Birth</label>
              <span>{user.dob || "—"}</span>
            </div>
            <div className="umf">
              <label>Gender</label>
              <span>{user.gender || "—"}</span>
            </div>
            <div className="umf">
              <label>Location</label>
              <span>{user.city ? `${user.city}, ${user.state}` : "—"}</span>
            </div>
            <div className="umf">
              <label>Referrer ID</label>
              <span>{user.referral || "—"}</span>
            </div>
          </div>

          <h4 style={{ borderBottom: "1px solid var(--border)", paddingBottom: "4px", margin: "10px 0 0", fontSize: "14px", color: "var(--navy)" }}>
            🏦 Bank & KYC Verification Profile
          </h4>
          
          {hasKyc ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div className="um-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div className="umf">
                  <label>Bank Name</label>
                  <span>{user.kycBank?.bankName || "—"}</span>
                </div>
                <div className="umf">
                  <label>Account Holder</label>
                  <span>{user.kycBank?.accHolder || "—"}</span>
                </div>
                <div className="umf">
                  <label>Account Number</label>
                  <span>{user.kycBank?.accNum || "—"}</span>
                </div>
                <div className="umf">
                  <label>IFSC Code</label>
                  <span>{user.kycBank?.ifsc || "—"}</span>
                </div>
                <div className="umf">
                  <label>PAN Card Number</label>
                  <span>{user.kyc?.pan || "—"}</span>
                </div>
                <div className="umf">
                  <label>Aadhaar Card Number</label>
                  <span>{user.kyc?.aadhaar || "—"}</span>
                </div>
              </div>

              {/* Document Images Display */}
              <div style={{ marginTop: "10px" }}>
                <label style={{ fontSize: "11px", fontWeight: "700", color: "var(--muted)", textTransform: "uppercase" }}>Uploaded Document Files</label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px", marginTop: "6px" }}>
                  {user.kyc?.panImg && (
                    <div style={{ textAlign: "center" }}>
                      <span style={{ fontSize: "10px", color: "var(--muted)" }}>PAN Copy</span>
                      <a href={user.kyc.panImg} target="_blank" rel="noreferrer">
                        <img src={user.kyc.panImg} alt="PAN Copy" style={{ width: "100%", height: "100px", objectFit: "cover", borderRadius: "6px", border: "1px solid var(--border)", marginTop: "4px" }} />
                      </a>
                    </div>
                  )}
                  {user.kyc?.aadhaarFront && (
                    <div style={{ textAlign: "center" }}>
                      <span style={{ fontSize: "10px", color: "var(--muted)" }}>Aadhaar Front</span>
                      <a href={user.kyc.aadhaarFront} target="_blank" rel="noreferrer">
                        <img src={user.kyc.aadhaarFront} alt="Aadhaar Front" style={{ width: "100%", height: "100px", objectFit: "cover", borderRadius: "6px", border: "1px solid var(--border)", marginTop: "4px" }} />
                      </a>
                    </div>
                  )}
                  {user.kyc?.aadhaarBack && (
                    <div style={{ textAlign: "center" }}>
                      <span style={{ fontSize: "10px", color: "var(--muted)" }}>Aadhaar Back</span>
                      <a href={user.kyc.aadhaarBack} target="_blank" rel="noreferrer">
                        <img src={user.kyc.aadhaarBack} alt="Aadhaar Back" style={{ width: "100%", height: "100px", objectFit: "cover", borderRadius: "6px", border: "1px solid var(--border)", marginTop: "4px" }} />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div style={{ padding: "16px", background: "var(--off)", borderRadius: "8px", border: "1px solid var(--border)", color: "var(--muted)", fontSize: "13px", textAlign: "center" }}>
              ⚠️ Is user ne abhi tak KYC documents submit nahi kiye hain.
            </div>
          )}

          {user.kycUpi && (
            <div style={{ marginTop: "5px" }}>
              <h4 style={{ borderBottom: "1px solid var(--border)", paddingBottom: "4px", margin: "10px 0 8px", fontSize: "14px", color: "var(--navy)" }}>
                📱 UPI Address Profile
              </h4>
              <div className="umf">
                <label>UPI ID Address</label>
                <span style={{ fontSize: "14px", fontWeight: "700", color: "var(--green-d)" }}>{user.kycUpi}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
