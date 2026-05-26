import React, { useState, useEffect } from "react";
import { GU, GS, GW } from "../database";

export default function Dashboard({
  goTo,
  loggedInUser,
  onSubmitProofClick,
  onWithdrawClick,
}) {
  const [activeTab, setActiveTab] = useState("submissions"); // "submissions", "referrals", "withdrawals"
  const [submissions, setSubmissions] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [referredUsers, setReferredUsers] = useState([]);
  const [expandedRef, setExpandedRef] = useState({});

  const [walletStats, setWalletStats] = useState({
    balance: 0,
    pending: 0,
    totalEarned: 0,
  });

  const loadData = () => {
    if (!loggedInUser) return;

    const uid = loggedInUser.userId;

    // Load user submissions
    const allSubs = GS();
    const mySubs = allSubs.filter((s) => s.userId === uid);
    setSubmissions(mySubs);

    // Load withdrawals statement
    const allWds = GW();
    const myWds = allWds.filter((w) => w.userId === uid);
    setWithdrawals(myWds);

    // Load referred users
    const allUsers = GU();
    const myRefs = allUsers.filter((u) => u.referral === uid);
    setReferredUsers(myRefs);

    // Calculate balances
    const approvedAmt = mySubs
      .filter((s) => s.status === "approved")
      .reduce((t, s) => t + (parseFloat(s.payout) || 0), 0);

    const pendingAmt = mySubs
      .filter((s) => s.status === "pending" || s.status === "rework")
      .reduce((t, s) => t + (parseFloat(s.payout) || 0), 0);

    const withdrawnApproved = myWds
      .filter((w) => w.status === "approved")
      .reduce((t, w) => t + (parseFloat(w.amount) || 0), 0);

    const withdrawnPending = myWds
      .filter((w) => w.status === "pending")
      .reduce((t, w) => t + (parseFloat(w.amount) || 0), 0);

    // Calculate referral commissions (20% of referred users' approved submissions)
    const REFER_PCT = 0.2;
    let refApprovedEarn = 0;
    let refPendingEarn = 0;

    myRefs.forEach((refUser) => {
      const refSubs = allSubs.filter((s) => s.userId === refUser.userId);
      refSubs.forEach((s) => {
        const amt = parseFloat(s.payout) || 0;
        if (s.status === "approved") refApprovedEarn += amt * REFER_PCT;
        else if (s.status === "pending" || s.status === "rework")
          refPendingEarn += amt * REFER_PCT;
      });
    });

    const netApproved = approvedAmt + refApprovedEarn;
    const netPending = pendingAmt + refPendingEarn;
    const walletBal = Math.max(0, netApproved - withdrawnApproved - withdrawnPending);

    setWalletStats({
      balance: walletBal,
      pending: netPending,
      totalEarned: netApproved,
    });
  };

  useEffect(() => {
    loadData();
    // Hook interval or simple refresh on focus
    window.addEventListener("focus", loadData);
    return () => window.removeEventListener("focus", loadData);
  }, [loggedInUser]);

  if (!loggedInUser) return null;

  const handleCopyCode = () => {
    navigator.clipboard
      .writeText(loggedInUser.userId)
      .then(() => alert("✅ Referral code copy ho gaya!"))
      .catch(() => {});
  };

  const toggleRefExpansion = (refId) => {
    setExpandedRef((prev) => ({
      ...prev,
      [refId]: !prev[refId],
    }));
  };

  // Status Badge Helper
  const getStatusBadge = (status) => {
    switch (status) {
      case "approved":
        return <span className="bdg bdg-g">✅ Approved</span>;
      case "rejected":
        return <span className="bdg" style={{ background: "var(--red-l)", color: "var(--red)" }}>❌ Rejected</span>;
      case "rework":
        return <span className="bdg bdg-go">🔄 Rework</span>;
      default:
        return <span className="bdg bdg-go">⏳ Pending</span>;
    }
  };

  return (
    <div className="page active" id="page-dashboard">
      <div style={{ background: "var(--navy)", padding: "24px 5%", color: "#fff" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "14px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div
              id="dashAvatar"
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "50%",
                background: "var(--gold)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "24px",
                fontWeight: "800",
                color: "var(--navy)",
                fontFamily: "'Baloo 2', cursive",
                overflow: "hidden",
                border: "3px solid var(--gold)",
              }}
            >
              {loggedInUser.selfie ? (
                <img src={loggedInUser.selfie} alt="Avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                loggedInUser.phone ? loggedInUser.phone[0] : "?"
              )}
            </div>
            <div>
              <h2 style={{ fontFamily: "'Baloo 2', cursive", fontSize: "22px", margin: 0 }}>
                Advisor ID: <span id="dashUserId" style={{ color: "var(--gold)" }}>{loggedInUser.userId}</span>
              </h2>
              <p id="dashUserInfo" style={{ fontSize: "13px", opacity: 0.6, margin: "2px 0 0" }}>
                {loggedInUser.firstName} {loggedInUser.lastName} · {loggedInUser.city}, {loggedInUser.state} · {loggedInUser.phone}
              </p>
            </div>
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            <button className="abtn gold" onClick={() => goTo("offers")}>
              🎯 Offers Browse Karo
            </button>
            <button className="abtn" style={{ background: "transparent", color: "#fff", borderColor: "rgba(255,255,255,0.2)" }} onClick={() => goTo("landing")}>
              🏠 Exit Panel
            </button>
          </div>
        </div>
      </div>

      <div className="dash-grid">
        {/* LEFT COLUMN: WALLET CARD */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div
            style={{
              background: "#fff",
              borderRadius: "var(--r)",
              border: "1px solid var(--border)",
              boxShadow: "var(--sh)",
              padding: "24px",
              textAlign: "center",
            }}
          >
            <span style={{ fontSize: "11px", color: "var(--muted)", textTransform: "uppercase", fontWeight: "700" }}>Wallet Balance</span>
            <h2 id="dashWallet" style={{ fontSize: "36px", fontFamily: "'Baloo 2', cursive", color: "var(--green)", fontWeight: "800", margin: "5px 0 16px" }}>
              ₹{walletStats.balance.toLocaleString("en-IN")}
            </h2>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "18px", borderTop: "1px solid var(--border)", paddingTop: "14px" }}>
              <div>
                <span style={{ fontSize: "10px", color: "var(--muted)" }}>PENDING</span>
                <div id="dashPending" style={{ fontSize: "14px", fontWeight: "700", color: "var(--gold-d)" }}>
                  ₹{walletStats.pending.toLocaleString("en-IN")}
                </div>
              </div>
              <div>
                <span style={{ fontSize: "10px", color: "var(--muted)" }}>TOTAL EARNED</span>
                <div id="dashTotalEarned" style={{ fontSize: "14px", fontWeight: "700", color: "var(--green-d)" }}>
                  ₹{walletStats.totalEarned.toLocaleString("en-IN")}
                </div>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <button className="submit-btn" style={{ margin: 0 }} onClick={onSubmitProofClick}>
                📤 Submit Offer Proof
              </button>
              <button
                className="submit-btn"
                style={{ margin: 0, background: "var(--navy)", color: "#fff" }}
                onClick={onWithdrawClick}
              >
                💸 Wallet Withdraw
              </button>
            </div>
          </div>

          {/* REFERRAL QUICK BANNER */}
          <div
            style={{
              background: "var(--gold-l)",
              border: "1.5px solid var(--gold)",
              borderRadius: "var(--r)",
              padding: "20px",
              textAlign: "center",
            }}
          >
            <h4 style={{ fontSize: "14px", color: "var(--gold-d)", marginBottom: "4px" }}>My Refer Code</h4>
            <strong id="dashRefCode" style={{ fontSize: "24px", color: "var(--navy)", fontFamily: "'Baloo 2', cursive", letterSpacing: "1px" }}>
              {loggedInUser.userId}
            </strong>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginTop: "12px" }}>
              <button className="abtn" style={{ padding: "6px", fontSize: "11px" }} onClick={handleCopyCode}>
                📋 Copy Code
              </button>
              <button className="abtn" style={{ padding: "6px", fontSize: "11px", background: "#25d366", color: "#fff", borderColor: "#25d366" }} onClick={() => goTo("refer")}>
                🤝 Invite Friends
              </button>
            </div>
            <div style={{ marginTop: "12px", fontSize: "11px", color: "var(--gold-d)", borderTop: "1px solid rgba(245, 166, 35, 0.3)", paddingTop: "8px" }}>
              Referred members: <strong id="dashReferrals">{referredUsers.length}</strong>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: STATEMENTS TABS */}
        <div
          style={{
            background: "#fff",
            borderRadius: "var(--r)",
            border: "1px solid var(--border)",
            boxShadow: "var(--sh)",
            padding: "24px",
            minHeight: "450px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Tabs header */}
          <div style={{ display: "flex", borderBottom: "2.5px solid var(--border)", gap: "2px", marginBottom: "18px", overflowX: "auto", whiteSpace: "nowrap" }}>
            <button
              onClick={() => setActiveTab("submissions")}
              style={{
                padding: "10px 18px",
                border: "none",
                background: "transparent",
                fontSize: "14px",
                fontWeight: "700",
                cursor: "pointer",
                borderBottom: activeTab === "submissions" ? "3px solid var(--gold)" : "none",
                color: activeTab === "submissions" ? "var(--navy)" : "var(--muted)",
                flexShrink: 0,
              }}
            >
              📥 Submissions ({submissions.length})
            </button>
            <button
              onClick={() => setActiveTab("referrals")}
              style={{
                padding: "10px 18px",
                border: "none",
                background: "transparent",
                fontSize: "14px",
                fontWeight: "700",
                cursor: "pointer",
                borderBottom: activeTab === "referrals" ? "3px solid var(--gold)" : "none",
                color: activeTab === "referrals" ? "var(--navy)" : "var(--muted)",
                flexShrink: 0,
              }}
            >
              🤝 Referrals Activity ({referredUsers.length})
            </button>
            <button
              onClick={() => setActiveTab("withdrawals")}
              style={{
                padding: "10px 18px",
                border: "none",
                background: "transparent",
                fontSize: "14px",
                fontWeight: "700",
                cursor: "pointer",
                borderBottom: activeTab === "withdrawals" ? "3px solid var(--gold)" : "none",
                color: activeTab === "withdrawals" ? "var(--navy)" : "var(--muted)",
                flexShrink: 0,
              }}
            >
              💸 Withdrawal Statement ({withdrawals.length})
            </button>
          </div>

          {/* TAB CONTENTS */}
          <div style={{ flex: 1 }}>
            {/* SUBMISSIONS LIST */}
            {activeTab === "submissions" && (
              <div id="dashSubmissions">
                {submissions.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "50px 20px", color: "var(--muted)" }}>
                    <div style={{ fontSize: "48px", marginBottom: "12px" }}>📭</div>
                    <p style={{ fontSize: "14px" }}>
                      Abhi koi submission nahi hai.
                      <br />
                      Offers complete karo aur yahan submit karo!
                    </p>
                    <button className="btn-gold" style={{ marginTop: "16px", fontSize: "14px", padding: "10px 22px" }} onClick={() => goTo("offers")}>
                      Offers Dekho →
                    </button>
                  </div>
                ) : (
                  submissions
                    .slice()
                    .reverse()
                    .map((s) => (
                      <div
                        key={s.id}
                        style={{
                          padding: "14px 20px",
                          borderBottom: "1px solid var(--border)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          flexWrap: "wrap",
                          gap: "10px",
                        }}
                      >
                        <div style={{ flex: 1, minWidth: "180px" }}>
                          <div style={{ fontWeight: "700", fontSize: "14px" }}>{s.campName}</div>
                          <div style={{ fontSize: "11px", color: "var(--muted)", marginTop: "2px" }}>
                            Submitted: {s.submittedAt}
                          </div>
                          {s.adminNote && (
                            <div
                              style={{
                                fontSize: "12px",
                                color: "var(--gold-d)",
                                marginTop: "4px",
                                background: "var(--gold-l)",
                                padding: "4px 8px",
                                borderRadius: "5px",
                              }}
                            >
                              💬 Admin note: {s.adminNote}
                            </div>
                          )}
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                          <strong style={{ color: "var(--green-d)", fontSize: "15px" }}>
                            {s.payModel === "pct" ? `${s.payout}%` : `₹${s.payout}`}
                          </strong>
                          {getStatusBadge(s.status)}
                        </div>
                      </div>
                    ))
                )}
              </div>
            )}

            {/* REFERRALS NESTED ACTIVITY LIST */}
            {activeTab === "referrals" && (
              <div id="dashReferralActivity">
                {referredUsers.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "36px 20px", color: "var(--muted)" }}>
                    <div style={{ fontSize: "40px", marginBottom: "10px" }}>🤝</div>
                    <p style={{ fontSize: "13px" }}>Abhi koi referral nahi. Apna link share karo!</p>
                  </div>
                ) : (
                  referredUsers.map((u) => {
                    const allSubs = GS();
                    const theirSubs = allSubs.filter((s) => s.userId === u.userId);
                    const REFER_PCT = 0.2;

                    const earnedCommission = theirSubs
                      .filter((s) => s.status === "approved")
                      .reduce((t, s) => t + (parseFloat(s.payout) || 0) * REFER_PCT, 0);

                    const pendingCommission = theirSubs
                      .filter((s) => s.status === "pending" || s.status === "rework")
                      .reduce((t, s) => t + (parseFloat(s.payout) || 0) * REFER_PCT, 0);

                    const isExpanded = !!expandedRef[u.userId];

                    return (
                      <div key={u.userId} style={{ padding: "12px 18px", borderBottom: "1px solid var(--border)", background: isExpanded ? "var(--off)" : "#fff" }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            flexWrap: "wrap",
                            gap: "8px",
                            cursor: "pointer",
                          }}
                          onClick={() => toggleRefExpansion(u.userId)}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <div
                              style={{
                                width: "32px",
                                height: "32px",
                                borderRadius: "50%",
                                background: "var(--navy)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "var(--gold)",
                                fontFamily: "'Baloo 2', cursive",
                                fontWeight: "800",
                                fontSize: "13px",
                                flexShrink: 0,
                              }}
                            >
                              {u.phone ? u.phone[0] : "?"}
                            </div>
                            <div>
                              <div style={{ fontWeight: "700", fontSize: "13px" }}>
                                {u.userId}{" "}
                                <span style={{ fontSize: "11px", color: "var(--muted)", fontWeight: "400" }}>
                                  {theirSubs.length} submission{theirSubs.length !== 1 ? "s" : ""}
                                </span>
                              </div>
                              <div style={{ fontSize: "11px", color: "var(--muted)" }}>
                                {u.city} · Registered: {u.createdAt?.split(" ")[0]}
                              </div>
                            </div>
                          </div>
                          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                            {earnedCommission > 0 && (
                              <span style={{ fontSize: "11px", color: "var(--green-d)", fontWeight: "700", background: "var(--green-l)", padding: "2px 8px", borderRadius: "6px" }}>
                                +₹{Math.round(earnedCommission)} commission
                              </span>
                            )}
                            {pendingCommission > 0 && (
                              <span style={{ fontSize: "11px", color: "var(--gold-d)", fontWeight: "700", background: "var(--gold-l)", padding: "2px 8px", borderRadius: "6px" }}>
                                ~₹{Math.round(pendingCommission)} pending
                              </span>
                            )}
                            <span style={{ color: "var(--muted)", fontSize: "14px" }}>{isExpanded ? "▲" : "▼"}</span>
                          </div>
                        </div>

                        {/* Dropdown details */}
                        {isExpanded && (
                          <div style={{ marginTop: "10px", padding: "10px", background: "#fff", borderRadius: "8px", border: "1px solid var(--border)" }}>
                            {theirSubs.length === 0 ? (
                              <p style={{ fontSize: "12px", color: "var(--muted)", fontStyle: "italic", margin: 0 }}>
                                Is advisor ne abhi tak koi offer complete nahi kiya hai.
                              </p>
                            ) : (
                              theirSubs
                                .slice()
                                .reverse()
                                .map((s) => {
                                  const commissionVal = Math.round((parseFloat(s.payout) || 0) * REFER_PCT);
                                  return (
                                    <div
                                      key={s.id}
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        padding: "6px 0",
                                        borderBottom: "1px solid var(--border)",
                                        fontSize: "12px",
                                      }}
                                    >
                                      <div>
                                        <b>{s.campName}</b>
                                        <div style={{ fontSize: "10px", color: "var(--muted)" }}>{s.submittedAt}</div>
                                      </div>
                                      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                                        <span style={{ fontWeight: "700" }}>
                                          {s.status === "approved" ? "🟢 Approved" : s.status === "rejected" ? "🔴 Rejected" : "🟡 Pending"}
                                        </span>
                                        {s.status === "approved" && (
                                          <span style={{ color: "var(--green-d)", fontWeight: "700" }}>+₹{commissionVal}</span>
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
            )}

            {/* WITHDRAWALS LIST */}
            {activeTab === "withdrawals" && (
              <div id="withdrawStatement">
                {withdrawals.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "36px 20px", color: "var(--muted)" }}>
                    <div style={{ fontSize: "40px", marginBottom: "10px" }}>💸</div>
                    <p style={{ fontSize: "13px" }}>Abhi koi withdrawal request nahi hai.</p>
                  </div>
                ) : (
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", minWidth: "500px" }}>
                      <thead>
                        <tr style={{ background: "var(--navy)", color: "rgba(255,255,255,0.75)" }}>
                          <th style={{ padding: "10px 14px", textAlign: "left", fontSize: "10px", textTransform: "uppercase" }}>Req ID</th>
                          <th style={{ padding: "10px 14px", textAlign: "left", fontSize: "10px", textTransform: "uppercase" }}>Amount</th>
                          <th style={{ padding: "10px 14px", textAlign: "left", fontSize: "10px", textTransform: "uppercase" }}>Method</th>
                          <th style={{ padding: "10px 14px", textAlign: "left", fontSize: "10px", textTransform: "uppercase" }}>Requested On</th>
                          <th style={{ padding: "10px 14px", textAlign: "left", fontSize: "10px", textTransform: "uppercase" }}>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {withdrawals
                          .slice()
                          .reverse()
                          .map((w) => {
                            let statusBadge = "";
                            if (w.status === "approved") {
                              statusBadge = <span style={{ background: "var(--green-l)", color: "var(--green-d)", padding: "2px 8px", borderRadius: "100px", fontSize: "10px", fontWeight: "700" }}>Approved</span>;
                            } else if (w.status === "rejected") {
                              statusBadge = (
                                <>
                                  <span style={{ background: "var(--red-l)", color: "var(--red)", padding: "2px 8px", borderRadius: "100px", fontSize: "10px", fontWeight: "700" }}>Rejected</span>
                                  {w.rejectionReason && <div style={{ fontSize: "10px", color: "var(--red)", marginTop: "2px" }}>Reason: {w.rejectionReason}</div>}
                                </>
                              );
                            } else {
                              statusBadge = <span style={{ background: "var(--gold-l)", color: "var(--gold-d)", padding: "2px 8px", borderRadius: "100px", fontSize: "10px", fontWeight: "700" }}>Pending</span>;
                            }

                            return (
                              <tr key={w.id} style={{ borderBottom: "1px solid var(--border)" }}>
                                <td style={{ padding: "10px 14px", fontFamily: "'Baloo 2', cursive", fontSize: "11px", color: "var(--muted)" }}>{w.id}</td>
                                <td style={{ padding: "10px 14px", fontFamily: "'Baloo 2', cursive", fontSize: "16px", fontWeight: "800", color: "var(--green-d)" }}>
                                  ₹{w.amount.toLocaleString("en-IN")}
                                </td>
                                <td style={{ padding: "10px 14px" }}>{w.paymentDetails?.type === "bank" ? "🏦 Bank" : "📱 UPI"}</td>
                                <td style={{ padding: "10px 14px", color: "var(--muted)", fontSize: "12px" }}>{w.createdAt}</td>
                                <td style={{ padding: "10px 14px" }}>{statusBadge}</td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
