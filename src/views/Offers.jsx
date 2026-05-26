import React, { useState, useEffect } from "react";
import { GC, sheetsAPI } from "../database";

const SEGMENTS = [
  { key: "Credit Card", icon: "💳", label: "Credit Card" },
  { key: "Saving Account", icon: "🏦", label: "Saving Account" },
  { key: "Health Insurance", icon: "🏥", label: "Health Insurance" },
  { key: "Car Insurance", icon: "🚗", label: "Car Insurance" },
  { key: "Bike Insurance", icon: "🏍️", label: "Bike Insurance" },
  { key: "Loan", icon: "🏠", label: "Loan" },
  { key: "E-commerce", icon: "🛍️", label: "E-commerce" },
  { key: "Demat Account", icon: "📈", label: "Demat Account" },
  { key: "Gaming", icon: "🎮", label: "Gaming" },
  { key: "Other", icon: "➕", label: "Aur Bhi" },
];

export default function Offers({ goTo, loggedInUser, onShareOfferClick }) {
  const [campaigns, setCampaigns] = useState([]);
  const [activeSegment, setActiveSegment] = useState(null);

  useEffect(() => {
    setCampaigns(GC());
  }, []);

  if (!loggedInUser) return null;

  const handleCopyUid = () => {
    navigator.clipboard
      .writeText(loggedInUser.userId)
      .then(() => alert("✅ ID copied!"))
      .catch(() => {});
  };

  // Count active campaigns per segment
  const countMap = {};
  campaigns.forEach((c) => {
    const seg = c.segment || "Other";
    countMap[seg] = (countMap[seg] || 0) + 1;
  });

  const activeSegmentCampaigns = campaigns.filter(
    (c) => (c.segment || "Other") === activeSegment
  );

  const handleUseOffer = (campaign) => {
    const uid = loggedInUser.userId;
    const base = campaign.url;
    const sub = campaign.subId;
    const sep = base.includes("?") ? "&" : "?";
    const targetUrl = sub ? `${base}${sep}${sub}=${uid}` : base;

    if (targetUrl) {
      // Log click event on sheets
      sheetsAPI("logClick", {
        userId: uid,
        campaignId: campaign.id,
        campaignName: campaign.name,
      }).catch(() => {});

      window.open(targetUrl, "_blank");
    } else {
      alert("❌ Campaign URL not available.");
    }
  };

  return (
    <div className="page active" id="page-offers">
      <div style={{ background: "var(--navy)", padding: "20px 5%", color: "#fff" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
          <div>
            <span style={{ fontSize: "12px", opacity: 0.5 }}>ADVISOR ID</span>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "2px" }}>
              <strong id="offersUidDisplay" style={{ fontFamily: "'Baloo 2', cursive", fontSize: "20px", color: "var(--gold)" }}>
                {loggedInUser.userId}
              </strong>
              <button
                className="abtn"
                style={{ padding: "4px 8px", fontSize: "10px", borderColor: "rgba(255,255,255,0.2)", color: "#fff" }}
                onClick={handleCopyUid}
              >
                📋 Copy
              </button>
            </div>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <button className="abtn gold" onClick={() => goTo("dashboard")}>
              💸 Back to Dashboard
            </button>
            <button className="abtn" style={{ background: "transparent", color: "#fff", borderColor: "rgba(255,255,255,0.2)" }} onClick={() => goTo("landing")}>
              🏠 Exit
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: "1000px", margin: "24px auto", padding: "0 4%" }}>
        <center>
          <span className="stag">Choose Earning Segment</span>
          <h2 className="stitle" style={{ fontSize: "28px" }}>Kaise Kamaoge Aaj?</h2>
          <p className="ssub" style={{ marginBottom: "28px" }}>
            Categories select karein aur unke live templates check karein:
          </p>
        </center>

        {/* Categories Grid */}
        <div className="seg-grid" id="segmentGrid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: "14px", margin: "0 auto" }}>
          {SEGMENTS.map((s) => {
            const cnt = countMap[s.key] || 0;
            const isSelected = activeSegment === s.key;

            return (
              <div
                key={s.key}
                className={`seg-card ${cnt === 0 ? "seg-empty" : ""} ${isSelected ? "active" : ""}`}
                onClick={() => cnt > 0 && setActiveSegment(isSelected ? null : s.key)}
                style={{
                  position: "relative",
                  border: isSelected ? "2.5px solid var(--gold)" : "1px solid var(--border)",
                  cursor: cnt > 0 ? "pointer" : "default",
                  opacity: cnt === 0 ? 0.45 : 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  padding: "16px 12px",
                  borderRadius: "12px",
                  background: "#fff",
                  boxShadow: isSelected ? "var(--sh-lg)" : "var(--sh)",
                  transition: "all 0.2s",
                }}
                title={s.label}
              >
                {cnt > 0 && (
                  <span
                    className="seg-cnt"
                    style={{
                      position: "absolute",
                      top: "6px",
                      right: "6px",
                      background: "var(--gold)",
                      color: "var(--navy)",
                      fontSize: "9px",
                      fontWeight: "800",
                      width: "18px",
                      height: "18px",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {cnt}
                  </span>
                )}
                <span className="seg-ico" style={{ fontSize: "32px", marginBottom: "6px" }}>
                  {s.icon}
                </span>
                <div className="seg-name" style={{ fontSize: "12px", fontWeight: "700", textAlign: "center" }}>
                  {s.label}
                </div>
                {cnt === 0 && (
                  <div style={{ fontSize: "9px", color: "var(--muted)", marginTop: "4px" }}>Coming soon</div>
                )}
              </div>
            );
          })}
        </div>

        {/* CAMPAIGNS CONTAINER */}
        {activeSegment && (
          <div
            id="offersPanel"
            style={{
              marginTop: "32px",
              background: "#fff",
              borderRadius: "16px",
              border: "1px solid var(--border)",
              boxShadow: "var(--sh-lg)",
              padding: "24px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1.5px solid var(--border)", paddingBottom: "12px", marginBottom: "20px" }}>
              <div>
                <h3 id="offersPanelTitle" style={{ fontSize: "20px", fontFamily: "'Baloo 2', cursive", color: "var(--navy)", margin: 0 }}>
                  {activeSegment} Offers
                </h3>
                <small id="offersPanelCount" style={{ color: "var(--muted)", fontSize: "11px" }}>
                  {activeSegmentCampaigns.length} offer{activeSegmentCampaigns.length !== 1 ? "s" : ""} available
                </small>
              </div>
              <button
                style={{
                  background: "transparent",
                  border: "none",
                  fontSize: "20px",
                  cursor: "pointer",
                  color: "var(--muted)",
                }}
                onClick={() => setActiveSegment(null)}
              >
                ×
              </button>
            </div>

            <div className="offers-grid" id="offersCardsGrid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
              {activeSegmentCampaigns.map((c) => {
                const payLabel =
                  c.payModel === "pct"
                    ? c.payout
                      ? `${c.payout}% Cashback`
                      : "% Cashback"
                    : c.payout
                      ? `₹${c.payout} Cash`
                      : "Cash Reward";

                return (
                  <div className="offer-user-card" key={c.id}>
                    <div className="ouc-header">
                      {c.logo ? (
                        <img
                          src={c.logo}
                          className="ouc-logo"
                          alt="Logo"
                          onError={(e) => {
                            e.target.style.display = "none";
                          }}
                        />
                      ) : (
                        <div className="ouc-logo-ph">🎯</div>
                      )}
                      <div>
                        <div className="ouc-name">{c.name}</div>
                        <span className="ouc-seg">{c.segment || "Other"}</span>
                      </div>
                    </div>

                    {c.desc && <p className="ouc-desc">{c.desc}</p>}
                    {c.goal && (
                      <p style={{ fontSize: "12px", color: "var(--navy-l)", marginBottom: "12px", fontWeight: "600" }}>
                        🎯 Goal: {c.goal}
                      </p>
                    )}

                    <div className="ouc-payout">
                      <span className="pi">💰</span>
                      <div>
                        <div className="pa">{payLabel}</div>
                        <div className="pl">Offer complete karne ke baad milega</div>
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: "8px" }}>
                      <button className="ouc-use-btn" style={{ flex: 1 }} onClick={() => handleUseOffer(c)}>
                        Offer Use Karo →
                      </button>
                      <button
                        onClick={() => onShareOfferClick(c)}
                        style={{
                          padding: "11px 14px",
                          background: "var(--navy)",
                          border: "none",
                          borderRadius: "9px",
                          color: "var(--gold)",
                          fontSize: "18px",
                          cursor: "pointer",
                          flexShrink: 0,
                        }}
                        title="Share link"
                      >
                        🔗
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
