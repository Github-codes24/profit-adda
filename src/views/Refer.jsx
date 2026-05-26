import React, { useState, useEffect } from "react";
import { GU, GS } from "../database";

export default function Refer({ goTo, loggedInUser }) {
  const [referredUsers, setReferredUsers] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [expandedRefId, setExpandedRefId] = useState(null);
  const [stats, setStats] = useState({
    totalReferred: 0,
    totalEarned: 0,
    pendingEarn: 0,
  });

  const loadReferralData = () => {
    if (!loggedInUser) return;
    const uid = loggedInUser.userId;

    const allUsers = GU();
    const allSubs = GS();

    const refs = allUsers.filter((u) => u.referral === uid);
    setReferredUsers(refs);
    setSubmissions(allSubs);

    const REFER_PCT = 0.2;
    let totalEarned = 0;
    let pendingEarn = 0;

    refs.forEach((refUser) => {
      const refSubs = allSubs.filter((s) => s.userId === refUser.userId);
      refSubs.forEach((s) => {
        const amt = parseFloat(s.payout) || 0;
        if (s.status === "approved") {
          totalEarned += amt * REFER_PCT;
        } else if (s.status === "pending" || s.status === "rework") {
          pendingEarn += amt * REFER_PCT;
        }
      });
    });

    setStats({
      totalReferred: refs.length,
      totalEarned: Math.round(totalEarned),
      pendingEarn: Math.round(pendingEarn),
    });
  };

  useEffect(() => {
    loadReferralData();
    window.addEventListener("focus", loadReferralData);
    return () => window.removeEventListener("focus", loadReferralData);
  }, [loggedInUser]);

  if (!loggedInUser) return null;

  const handleCopyCode = () => {
    navigator.clipboard
      .writeText(loggedInUser.userId)
      .then(() => alert("✅ Referral code copy ho gaya!"))
      .catch(() => {});
  };

  const handleShareWhatsApp = () => {
    const msg = encodeURIComponent(
      `🤑 Profit Adda join karo aur har kharche pe real cash kamao!\n\nMera referral code use karo: *${loggedInUser.userId}*\n\nFree join karo: https://profitadda.in\n\nNo investment, no risk — sirf earning! 💸`
    );
    window.open("https://wa.me/?text=" + msg, "_blank");
  };

  const toggleRefDetail = (id) => {
    setExpandedRefId((prev) => (prev === id ? null : id));
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "approved":
        return <span className="bdg bdg-g" style={{ fontSize: "9px" }}>✅ Approved</span>;
      case "rejected":
        return <span className="bdg" style={{ background: "var(--red-l)", color: "var(--red)", fontSize: "9px" }}>❌ Rejected</span>;
      case "rework":
        return <span className="bdg bdg-go" style={{ fontSize: "9px" }}>🔄 Rework</span>;
      default:
        return <span className="bdg bdg-go" style={{ fontSize: "9px" }}>⏳ Pending</span>;
    }
  };

  return (
    <div className="page active" id="page-refer">
      <div style={{ background: "var(--navy)", padding: "24px 5%", color: "#fff", textAlign: "center" }}>
        <div style={{ fontSize: "52px", marginBottom: "12px" }}>🤝</div>
        <h1 style={{ fontFamily: "'Baloo 2', cursive", fontSize: "clamp(26px, 5vw, 44px)", margin: 0, fontWeight: "800" }}>
          Referral <span style={{ color: "var(--gold)" }}>Dashboard</span>
        </h1>
        <p style={{ opacity: 0.6, fontSize: "15px", maxWidth: "520px", margin: "6px auto 0" }}>
          Apne doston ko advisor banayein aur unki earning ka 20% passive commission lifetime paayein.
        </p>
      </div>

      <div style={{ maxWidth: "860px", margin: "24px auto", padding: "0 4%" }}>
        {/* Referral code card */}
        <div
          style={{
            background: "var(--gold-l)",
            border: "1.5px solid var(--gold)",
            borderRadius: "16px",
            padding: "24px",
            textAlign: "center",
            boxShadow: "var(--sh)",
            marginBottom: "24px",
          }}
        >
          <span style={{ fontSize: "12px", color: "var(--gold-d)", fontWeight: "700", textTransform: "uppercase" }}>
            Mera Invite Code
          </span>
          <h2 style={{ fontSize: "36px", fontFamily: "'Baloo 2', cursive", color: "var(--navy)", margin: "4px 0 16px", letterSpacing: "2px" }}>
            {loggedInUser.userId}
          </h2>
          <div style={{ display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap" }}>
            <button className="btn-gold" style={{ fontSize: "14px", padding: "10px 22px" }} onClick={handleCopyCode}>
              📋 Code Copy Karo
            </button>
            <button className="btn-gold" style={{ fontSize: "14px", padding: "10px 22px", background: "#25d366", color: "#fff" }} onClick={handleShareWhatsApp}>
              🟢 WhatsApp Par Share Karo
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "16px", marginBottom: "24px" }} className="refer-stats-grid">
          <div style={{ background: "#fff", borderRadius: "12px", padding: "18px", border: "1px solid var(--border)", boxShadow: "var(--sh)", textAlign: "center" }}>
            <span style={{ fontSize: "11px", color: "var(--muted)", textTransform: "uppercase" }}>Total Referred</span>
            <div style={{ fontSize: "28px", fontFamily: "'Baloo 2', cursive", fontWeight: "800", color: "var(--navy)", marginTop: "4px" }}>
              {stats.totalReferred}
            </div>
          </div>
          <div style={{ background: "#fff", borderRadius: "12px", padding: "18px", border: "1px solid var(--border)", boxShadow: "var(--sh)", textAlign: "center" }}>
            <span style={{ fontSize: "11px", color: "var(--muted)", textTransform: "uppercase" }}>Active Network</span>
            <div style={{ fontSize: "28px", fontFamily: "'Baloo 2', cursive", fontWeight: "800", color: "var(--navy)", marginTop: "4px" }}>
              {stats.totalReferred}
            </div>
          </div>
          <div style={{ background: "#fff", borderRadius: "12px", padding: "18px", border: "1px solid var(--border)", boxShadow: "var(--sh)", textAlign: "center" }}>
            <span style={{ fontSize: "11px", color: "var(--muted)", textTransform: "uppercase" }}>Earning Credited</span>
            <div style={{ fontSize: "28px", fontFamily: "'Baloo 2', cursive", fontWeight: "800", color: "var(--green-d)", marginTop: "4px" }}>
              ₹{stats.totalEarned.toLocaleString("en-IN")}
            </div>
          </div>
          <div style={{ background: "#fff", borderRadius: "12px", padding: "18px", border: "1px solid var(--border)", boxShadow: "var(--sh)", textAlign: "center" }}>
            <span style={{ fontSize: "11px", color: "var(--muted)", textTransform: "uppercase" }}>Earning Pending</span>
            <div style={{ fontSize: "28px", fontFamily: "'Baloo 2', cursive", fontWeight: "800", color: "var(--gold-d)", marginTop: "4px" }}>
              ₹{stats.pendingEarn.toLocaleString("en-IN")}
            </div>
          </div>
        </div>

        {/* Referred Users list */}
        <div style={{ background: "#fff", borderRadius: "16px", border: "1px solid var(--border)", boxShadow: "var(--sh-lg)", overflow: "hidden" }}>
          <div style={{ background: "var(--navy)", color: "#fff", padding: "14px 20px", fontSize: "15px", fontWeight: "700" }}>
            👥 Referred Members ({referredUsers.length})
          </div>

          <div id="referredUsersTable">
            {referredUsers.length === 0 ? (
              <div style={{ justifyContent: "center", color: "var(--muted)", padding: "48px 24px", textAlign: "center" }}>
                🤝 Abhi koi referred member nahi hai. Apne code ko WhatsApp par share karke team banayein!
              </div>
            ) : (
              referredUsers.map((u) => {
                const theirSubs = submissions.filter((s) => s.userId === u.userId);
                const REFER_PCT = 0.2;

                const myEarnApproved = theirSubs
                  .filter((s) => s.status === "approved")
                  .reduce((t, s) => t + (parseFloat(s.payout) || 0) * REFER_PCT, 0);

                const myEarnPending = theirSubs
                  .filter((s) => s.status === "pending" || s.status === "rework")
                  .reduce((t, s) => t + (parseFloat(s.payout) || 0) * REFER_PCT, 0);

                const isExpanded = expandedRefId === u.userId;

                return (
                  <div key={u.userId} style={{ borderBottom: "1px solid var(--border)" }}>
                    <div
                      style={{
                        background: isExpanded ? "var(--off)" : "#fff",
                        padding: "16px 20px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                        gap: "8px",
                        cursor: "pointer",
                      }}
                      onClick={() => toggleRefDetail(u.userId)}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <div
                          style={{
                            width: "36px",
                            height: "36px",
                            borderRadius: "50%",
                            background: "var(--navy)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "var(--gold)",
                            fontFamily: "'Baloo 2', cursive",
                            fontWeight: "800",
                            fontSize: "14px",
                            flexShrink: 0,
                          }}
                        >
                          {u.phone ? u.phone[0] : "?"}
                        </div>
                        <div>
                          <div style={{ fontWeight: "700", fontSize: "14px" }}>{u.userId}</div>
                          <div style={{ fontSize: "11px", color: "var(--muted)" }}>
                            {u.city} {u.state ? `, ${u.state}` : ""} · Joined: {u.createdAt?.split(" ")[0]}
                          </div>
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
                        <div style={{ textAlign: "center" }}>
                          <div style={{ fontSize: "10px", color: "var(--muted)", textTransform: "uppercase" }}>Offers</div>
                          <div style={{ fontWeight: "800", fontSize: "16px", color: "var(--navy)" }}>{theirSubs.length}</div>
                        </div>
                        <div style={{ textAlign: "center" }}>
                          <div style={{ fontSize: "10px", color: "var(--muted)", textTransform: "uppercase" }}>Commission</div>
                          <div style={{ fontWeight: "800", fontSize: "16px", color: "var(--green-d)" }}>
                            ₹{Math.round(myEarnApproved)}
                          </div>
                        </div>
                        {myEarnPending > 0 && (
                          <div style={{ textAlign: "center" }}>
                            <div style={{ fontSize: "10px", color: "var(--muted)", textTransform: "uppercase" }}>Pending</div>
                            <div style={{ fontWeight: "800", fontSize: "16px", color: "var(--gold-d)" }}>
                              ₹{Math.round(myEarnPending)}
                            </div>
                          </div>
                        )}
                        <div style={{ color: "var(--muted)", fontSize: "16px" }}>{isExpanded ? "▲" : "▼"}</div>
                      </div>
                    </div>

                    {isExpanded && (
                      <div style={{ padding: "12px 24px", background: "#fff", borderTop: "1px solid var(--border)" }}>
                        {theirSubs.length === 0 ? (
                          <div style={{ fontSize: "12px", color: "var(--muted)", fontStyle: "italic" }}>
                            Is member ne abhi tak koi offer submit nahi kiya hai.
                          </div>
                        ) : (
                          theirSubs
                            .slice()
                            .reverse()
                            .map((s) => {
                              const myShare = Math.round((parseFloat(s.payout) || 0) * REFER_PCT);
                              return (
                                <div
                                  key={s.id}
                                  style={{
                                    padding: "10px 0",
                                    borderBottom: "1px solid var(--border)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    flexWrap: "wrap",
                                    gap: "8px",
                                  }}
                                >
                                  <div>
                                    <div style={{ fontWeight: "600", fontSize: "13px" }}>{s.campName}</div>
                                    <div style={{ fontSize: "10px", color: "var(--muted)", marginTop: "2px" }}>{s.submittedAt}</div>
                                    {s.adminNote && (
                                      <div style={{ fontSize: "11px", color: "var(--gold-d)", background: "var(--gold-l)", padding: "2px 6px", borderRadius: "4px", marginTop: "3px" }}>
                                        💬 {s.adminNote}
                                      </div>
                                    )}
                                  </div>
                                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                    {getStatusBadge(s.status)}
                                    {s.status === "approved" && (
                                      <span style={{ fontSize: "11px", color: "var(--green-d)", fontWeight: "700", background: "var(--green-l)", padding: "2px 8px", borderRadius: "6px" }}>
                                        +₹{myShare} Mujhe
                                      </span>
                                    )}
                                    {(s.status === "pending" || s.status === "rework") && myShare > 0 && (
                                      <span style={{ fontSize: "11px", color: "var(--gold-d)", fontWeight: "700", background: "var(--gold-l)", padding: "2px 8px", borderRadius: "6px" }}>
                                        ~₹{myShare} Pending
                                      </span>
                                    )}
                                  </div>
                                </div>
                              );
                            })
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
