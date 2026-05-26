import React, { useState, useEffect } from "react";
import {
  ADMIN_PASS,
  GU,
  SU,
  GC,
  SC,
  GS,
  SS,
  GW,
  SW,
  sheetsAPI,
  syncFromSheets,
} from "../database";
import UserDetailModal from "../components/UserDetailModal";

const PER_PAGE = 15;

export default function Admin({ goTo }) {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const [activeTab, setActiveTab] = useState("overview"); // overview, users, camps, submissions, withdrawals
  const [usersList, setUsersList] = useState([]);
  const [campaignsList, setCampaignsList] = useState([]);
  const [submissionsList, setSubmissionsList] = useState([]);
  const [withdrawalsList, setWithdrawalsList] = useState([]);

  // Filters & Search
  const [uSearch, setUSearch] = useState("");
  const [fState, setFState] = useState("");
  const [fGender, setFGender] = useState("");
  const [uCurPage, setUCurPage] = useState(1);

  const [subSearch, setSubSearch] = useState("");
  const [subStatusFilter, setSubStatusFilter] = useState("");

  const [wdSearch, setWdSearch] = useState("");
  const [wdStatusFilter, setWdStatusFilter] = useState("");

  const [campSearch, setCampSearch] = useState("");

  // Campaign Form State
  const [cfName, setCfName] = useState("");
  const [cfGoal, setCfGoal] = useState("");
  const [cfDesc, setCfDesc] = useState("");
  const [cfLogo, setCfLogo] = useState("");
  const [cfPayout, setCfPayout] = useState("");
  const [cfSeg, setCfSeg] = useState("");
  const [cfUrl, setCfUrl] = useState("");
  const [cfPayModel, setCfPayModel] = useState("cash"); // cash or pct
  const [cfSubSel, setCfSubSel] = useState(""); // sub_id, subid, sub1, aff_sub, custom
  const [cfSubCustom, setCfSubCustom] = useState("");
  const [editCampId, setEditCampId] = useState(null);

  // Modal State
  const [selectedUser, setSelectedUser] = useState(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);

  const [syncing, setSyncing] = useState(false);

  // Sync / Load database
  const loadDatabase = () => {
    setUsersList(GU());
    setCampaignsList(GC());
    setSubmissionsList(GS());
    setWithdrawalsList(GW());
  };

  const handleSync = async () => {
    setSyncing(true);
    try {
      await syncFromSheets();
      loadDatabase();
      alert("✅ Sheets database sync complete!");
    } catch (e) {
      alert("❌ Sync failed. Using local storage data.");
    }
    setSyncing(false);
  };

  useEffect(() => {
    if (isAdminLoggedIn) {
      loadDatabase();
    }
  }, [isAdminLoggedIn]);

  // ======= AUTHENTICATION =======
  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (adminPassword === ADMIN_PASS) {
      setIsAdminLoggedIn(true);
      setLoginError("");
      setAdminPassword("");
    } else {
      setLoginError("❌ Galat Password. Dobara try karein.");
      setAdminPassword("");
    }
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    setActiveTab("overview");
    goTo("landing");
  };

  // ======= CAMPAIGN MANAGEMENT =======
  const getSubId = () => {
    return cfSubSel === "custom" ? cfSubCustom.trim() : cfSubSel;
  };

  const handleLogoPreview = () => {
    // Just reactive check, render does it
  };

  const handleCampaignSubmit = async (e) => {
    e.preventDefault();
    if (!cfName.trim()) return alert("❌ Campaign name required");
    if (!cfUrl.trim()) return alert("❌ Campaign URL required");

    const campId = editCampId || "c_" + Date.now();
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

    const campObj = {
      id: campId,
      name: cfName.trim(),
      goal: cfGoal.trim(),
      desc: cfDesc.trim(),
      logo: cfLogo.trim(),
      payout: cfPayout.trim(),
      segment: cfSeg,
      payModel: cfPayModel,
      url: cfUrl.trim(),
      subId: getSubId(),
      createdAt: formattedDate,
    };

    const action = editCampId ? "editCampaign" : "addCampaign";

    try {
      // Save locally
      const camps = GC();
      if (editCampId) {
        const idx = camps.findIndex((c) => c.id === editCampId);
        if (idx > -1) camps[idx] = campObj;
        setEditCampId(null);
      } else {
        camps.push(campObj);
      }
      SC(camps);
      setCampaignsList(camps);

      // Sync sheets in background
      sheetsAPI(action, campObj).catch(() => {});

      alert("✅ Campaign successfully saved!");
      clearCampaignForm();
    } catch (err) {
      alert("❌ Failed to save campaign.");
    }
  };

  const clearCampaignForm = () => {
    setCfName("");
    setCfGoal("");
    setCfDesc("");
    setCfLogo("");
    setCfPayout("");
    setCfSeg("");
    setCfUrl("");
    setCfPayModel("cash");
    setCfSubSel("");
    setCfSubCustom("");
    setEditCampId(null);
  };

  const handleEditCampaign = (camp) => {
    setEditCampId(camp.id);
    setCfName(camp.name || "");
    setCfGoal(camp.goal || "");
    setCfDesc(camp.desc || "");
    setCfLogo(camp.logo || "");
    setCfPayout(camp.payout || "");
    setCfSeg(camp.segment || "");
    setCfUrl(camp.url || "");
    setCfPayModel(camp.payModel || "cash");

    const knownSubIds = ["sub_id", "subid", "sub1", "aff_sub"];
    if (camp.subId) {
      if (knownSubIds.includes(camp.subId)) {
        setCfSubSel(camp.subId);
      } else {
        setCfSubSel("custom");
        setCfSubCustom(camp.subId);
      }
    } else {
      setCfSubSel("");
    }
  };

  const handleDeleteCampaign = async (campId) => {
    if (!confirm("Is campaign ko delete karna chahte ho?")) return;
    try {
      const camps = GC().filter((c) => c.id !== campId);
      SC(camps);
      setCampaignsList(camps);

      sheetsAPI("deleteCampaign", { id: campId }).catch(() => {});
      alert("✅ Campaign deleted!");
    } catch (e) {
      alert("❌ Delete failed.");
    }
  };

  const buildTrackedURL = (base, sub, uid = "[USER_ID]") => {
    if (!sub) return base;
    const sep = base.includes("?") ? "&" : "?";
    return `${base}${sep}${sub}=${uid}`;
  };

  // ======= SUBMISSIONS REVIEW =======
  const handleSubmissionAction = async (subId, status) => {
    let note = "";
    if (status === "rejected" || status === "rework") {
      note =
        prompt(
          status === "rework"
            ? "Rework reason details (advisor dashboard par dikhegi):"
            : "Rejection reason details (optional):",
          ""
        ) || "";
    }

    try {
      const subs = GS();
      const idx = subs.findIndex((s) => s.id === subId);
      if (idx === -1) return;

      subs[idx].status = status;
      subs[idx].adminNote = note;
      subs[idx].updatedAt = new Date().toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });

      SS(subs);
      setSubmissionsList(subs);

      // Sheets update in background
      sheetsAPI("updateSubmission", {
        id: subId,
        status,
        adminNote: note,
        updatedAt: subs[idx].updatedAt,
      }).catch(() => {});

      alert(`✅ Submission updated to ${status}!`);
    } catch (e) {
      alert("❌ Failed to update submission.");
    }
  };

  // ======= WITHDRAWALS REVIEW =======
  const handleWithdrawalAction = async (wdId, status) => {
    let reason = "";
    if (status === "rejected") {
      reason = prompt("Rejection reason (user statement mein dikhega):", "") || "";
    }

    if (status === "approved") {
      if (!confirm("Approve withdrawal? User wallet balance se debit ho jayega.")) return;
    }

    try {
      const wds = GW();
      const idx = wds.findIndex((w) => w.id === wdId);
      if (idx === -1) return;

      wds[idx].status = status;
      wds[idx].updatedAt = new Date().toLocaleDateString("en-IN");
      if (status === "rejected") wds[idx].rejectionReason = reason;

      SW(wds);
      setWithdrawalsList(wds);

      // Sheets update in background
      sheetsAPI("updateWithdrawal", {
        id: wdId,
        status,
        reason,
      }).catch(() => {});

      alert(`✅ Withdrawal request ${status}!`);
    } catch (e) {
      alert("❌ Failed to update withdrawal.");
    }
  };

  // ======= USER MANAGING CSV EXPORT =======
  const exportUsersCSV = () => {
    const list = GU();
    if (!list.length) return alert("No users to export.");

    const headers = ["User ID", "Name", "Phone", "Email", "DOB", "Gender", "City", "State", "Referral", "Joined Date"];
    const rows = list.map((x) => [
      x.userId,
      `${x.firstName || ""} ${x.lastName || ""}`.trim(),
      x.phone,
      x.email,
      x.dob || "",
      x.gender || "",
      x.city || "",
      x.state || "",
      x.referral || "",
      x.createdAt || "",
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `ProfitAdda_Advisors_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ======= RENDER LOGIN BARRIER =======
  if (!isAdminLoggedIn) {
    return (
      <div className="al-wrap">
        <div className="al-card" style={{ maxWidth: "340px" }}>
          <div className="al-ico">🛡️</div>
          <h2>Admin Access</h2>
          <p>Profit Adda administration portal barrier</p>

          <form onSubmit={handleAdminLogin}>
            {loginError && <div className="al-err" style={{ display: "block" }}>{loginError}</div>}
            <input
              type="password"
              placeholder="Enter Admin Password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              required
            />
            <button className="al-btn" type="submit">
              🔐 Authorize Session
            </button>
          </form>
          <p style={{ marginTop: "14px", fontSize: "11px", color: "var(--muted)" }}>
            Exit to homepage?{" "}
            <span style={{ color: "var(--gold-d)", fontWeight: "700", cursor: "pointer" }} onClick={() => goTo("landing")}>
              Go Home
            </span>
          </p>
        </div>
      </div>
    );
  }

  // ======= RENDER STATS OVERVIEW =======
  const renderOverview = () => {
    const totalUsers = usersList.length;
    const totalCamps = campaignsList.length;
    const totalSubs = submissionsList.length;
    const totalWds = withdrawalsList.length;

    const pendingSubs = submissionsList.filter((s) => s.status === "pending").length;
    const pendingWds = withdrawalsList.filter((w) => w.status === "pending").length;

    // Filter recent users (last 5)
    const recentUsers = usersList.slice().reverse().slice(0, 5);

    return (
      <div className="atab on">
        <div className="phdr">
          <div>
            <h2>Admin Overview</h2>
            <p>System counters overview</p>
          </div>
          <button className="abtn gold" onClick={handleSync} disabled={syncing}>
            {syncing ? "Syncing..." : "🔄 Sheets Database Sync"}
          </button>
        </div>

        <div className="sg">
          <div className="sc">
            <span className="sl">Total Advisors</span>
            <div className="sn">{totalUsers}</div>
          </div>
          <div className="sc go">
            <span className="sl">Pending Submissions</span>
            <div className="sn">{pendingSubs}</div>
          </div>
          <div className="sc gr">
            <span className="sl">Pending Withdrawals</span>
            <div className="sn">{pendingWds}</div>
          </div>
          <div className="sc">
            <span className="sl">Total Campaign Templates</span>
            <div className="sn">{totalCamps}</div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "20px", marginTop: "24px" }} className="frow">
          {/* Recent Registrations Card */}
          <div style={{ background: "#fff", borderRadius: "14px", border: "1px solid var(--border)", boxShadow: "var(--sh)", padding: "20px" }}>
            <h3 style={{ fontSize: "16px", marginBottom: "14px", color: "var(--navy)" }}>Recent Advisor Registrations</h3>
            <div id="recentList">
              {recentUsers.length === 0 ? (
                <p style={{ color: "var(--muted)", textAlign: "center", padding: "20px" }}>Abhi koi registration nahi hua</p>
              ) : (
                recentUsers.map((u) => (
                  <div
                    key={u.userId}
                    style={{ display: "flex", alignItems: "center", gap: "12px", padding: "9px 0", borderBottom: "1px solid var(--border)", cursor: "pointer" }}
                    onClick={() => {
                      setSelectedUser(u);
                      setIsUserModalOpen(true);
                    }}
                  >
                    {u.selfie ? (
                      <img src={u.selfie} style={{ width: "32px", height: "32px", borderRadius: "50%", objectFit: "cover", border: "2px solid var(--border)" }} alt="Selfie" />
                    ) : (
                      <div className="av-ph">{u.phone ? u.phone[0] : "?"}</div>
                    )}
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: "13px" }}>{u.userId}</div>
                      <div style={{ fontSize: "11px", color: "var(--muted)" }}>{u.firstName} {u.lastName} · {u.phone} · {u.city}</div>
                    </div>
                    <div style={{ fontSize: "10px", color: "var(--muted)" }}>{u.createdAt?.split(" ")[0]}</div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Config details */}
          <div style={{ background: "#fff", borderRadius: "14px", border: "1px solid var(--border)", boxShadow: "var(--sh)", padding: "20px" }}>
            <h3 style={{ fontSize: "16px", marginBottom: "14px", color: "var(--navy)" }}>Database Connections</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "13px" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--muted)" }}>Google Sheets Sync:</span>
                <strong style={{ color: "var(--green-d)" }}>ENABLED</strong>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <span style={{ color: "var(--muted)" }}>Spreadsheet Web API:</span>
                <span style={{ fontFamily: "monospace", fontSize: "10px", background: "var(--off)", padding: "6px", borderRadius: "5px", wordBreak: "break-all" }}>
                  {sheetsAPI}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid var(--border)", paddingTop: "10px", marginTop: "4px" }}>
                <span style={{ color: "var(--muted)" }}>Total Submissions Logs:</span>
                <strong>{totalSubs}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--muted)" }}>Total Withdrawals Logs:</span>
                <strong>{totalWds}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ======= RENDER USERS DATABASE =======
  const renderUsersTab = () => {
    // Unique list of states for filter dropdown
    const statesList = [...new Set(usersList.map((u) => u.state).filter(Boolean))].sort();

    // Filter users list
    let filteredUsers = usersList.slice().reverse();
    if (uSearch.trim()) {
      const q = uSearch.toLowerCase();
      filteredUsers = filteredUsers.filter(
        (u) =>
          u.userId.toLowerCase().includes(q) ||
          (u.firstName && u.firstName.toLowerCase().includes(q)) ||
          (u.lastName && u.lastName.toLowerCase().includes(q)) ||
          u.phone.includes(q) ||
          u.email.toLowerCase().includes(q) ||
          (u.city && u.city.toLowerCase().includes(q)) ||
          (u.state && u.state.toLowerCase().includes(q))
      );
    }
    if (fState) filteredUsers = filteredUsers.filter((u) => u.state === fState);
    if (fGender) filteredUsers = filteredUsers.filter((u) => u.gender === fGender);

    // Pagination
    const totalUsers = filteredUsers.length;
    const totalPages = Math.ceil(totalUsers / PER_PAGE) || 1;
    const currentPageUsers = filteredUsers.slice((uCurPage - 1) * PER_PAGE, uCurPage * PER_PAGE);

    return (
      <div className="atab on">
        <div className="phdr">
          <div>
            <h2>Advisors Database ({totalUsers})</h2>
            <p>View registered agents profiles</p>
          </div>
          <button className="abtn prim" onClick={exportUsersCSV}>
            📥 Export CSV Database
          </button>
        </div>

        <div className="tbar" style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "14px" }}>
          <input
            type="text"
            className="srch"
            placeholder="Search phone, ID, city..."
            value={uSearch}
            onChange={(e) => {
              setUSearch(e.target.value);
              setUCurPage(1);
            }}
          />
          <select value={fState} onChange={(e) => { setFState(e.target.value); setUCurPage(1); }} className="srch">
            <option value="">All States</option>
            {statesList.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <select value={fGender} onChange={(e) => { setFGender(e.target.value); setUCurPage(1); }} className="srch">
            <option value="">All Genders</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="twrap">
          <table className="dtbl">
            <thead>
              <tr>
                <th>User ID</th>
                <th>Photo</th>
                <th>Full Name</th>
                <th>Phone No.</th>
                <th>Email Address</th>
                <th>DOB</th>
                <th>Gender</th>
                <th>Location</th>
                <th>Referrer</th>
                <th>Joined On</th>
              </tr>
            </thead>
            <tbody id="uTbody">
              {currentPageUsers.length === 0 ? (
                <tr>
                  <td colSpan="10">
                    <div className="empty">
                      <div className="ei">🔍</div>
                      <p>Koi user nahi mila</p>
                    </div>
                  </td>
                </tr>
              ) : (
                currentPageUsers.map((u) => (
                  <tr
                    key={u.userId}
                    onClick={() => {
                      setSelectedUser(u);
                      setIsUserModalOpen(true);
                    }}
                  >
                    <td>
                      <span className="bdg bdg-n" style={{ fontFamily: "'Baloo 2', cursive", letterSpacing: "1px" }}>
                        {u.userId}
                      </span>
                    </td>
                    <td>
                      {u.selfie ? (
                        <img src={u.selfie} className="av" alt="Selfie" />
                      ) : (
                        <div className="av-ph">{u.phone ? u.phone[0] : "?"}</div>
                      )}
                    </td>
                    <td style={{ fontWeight: 600 }}>{`${u.firstName || ""} ${u.lastName || ""}`}</td>
                    <td>{u.phone}</td>
                    <td>{u.email}</td>
                    <td>{u.dob}</td>
                    <td>
                      <span className={`bdg ${u.gender === "Male" ? "bdg-n" : u.gender === "Female" ? "bdg-go" : "bdg-g"}`}>
                        {u.gender}
                      </span>
                    </td>
                    <td>{u.city}, {u.state}</td>
                    <td>{u.referral ? <span className="bdg bdg-g">{u.referral}</span> : "—"}</td>
                    <td style={{ fontSize: "11px", whiteSpace: "nowrap" }}>{u.createdAt}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="pg-row">
              <span>
                Showing {(uCurPage - 1) * PER_PAGE + 1} - {Math.min(uCurPage * PER_PAGE, totalUsers)} of {totalUsers}
              </span>
              <div className="pg-btns">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    className={`pgb ${p === uCurPage ? "on" : ""}`}
                    onClick={() => setUCurPage(p)}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // ======= RENDER CAMPAIGNS EDITOR =======
  const renderCampsTab = () => {
    let filteredCamps = campaignsList.slice().reverse();
    if (campSearch.trim()) {
      filteredCamps = filteredCamps.filter(
        (c) =>
          c.name.toLowerCase().includes(campSearch.toLowerCase()) ||
          (c.segment && c.segment.toLowerCase().includes(campSearch.toLowerCase()))
      );
    }

    return (
      <div className="atab on">
        <div className="phdr">
          <div>
            <h2>Campaign Templates Editor ({filteredCamps.length})</h2>
            <p>Configure earn campaign templates and affiliate URLs</p>
          </div>
          {editCampId && (
            <button className="abtn dng" onClick={clearCampaignForm}>
              Cancel Editing
            </button>
          )}
        </div>

        {/* Campaign Creation Form */}
        <form onSubmit={handleCampaignSubmit} className="cf-card" style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <h3 id="cfTitle">{editCampId ? "✏️ Edit Campaign Template" : "➕ Add New Campaign Template"}</h3>

          <div className="cfr" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
            <div className="cfg">
              <label>Campaign Name *</label>
              <input
                type="text"
                placeholder="e.g. Axis Bank Credit Card"
                value={cfName}
                onChange={(e) => setCfName(e.target.value)}
                required
              />
            </div>
            <div className="cfg">
              <label>Conversion Goal *</label>
              <input
                type="text"
                placeholder="e.g. Card Approval & Dispatch"
                value={cfGoal}
                onChange={(e) => setCfGoal(e.target.value)}
              />
            </div>
          </div>

          <div className="cfr" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
            <div className="cfg">
              <label>Category Segment *</label>
              <select value={cfSeg} onChange={(e) => setCfSeg(e.target.value)} required>
                <option value="">-- Choose Category --</option>
                <option value="Credit Card">Credit Card 💳</option>
                <option value="Saving Account">Saving Account 🏦</option>
                <option value="Health Insurance">Health Insurance 🏥</option>
                <option value="Car Insurance">Car Insurance 🚗</option>
                <option value="Bike Insurance">Bike Insurance 🏍️</option>
                <option value="Loan">Loan 🏠</option>
                <option value="E-commerce">E-commerce 🛍️</option>
                <option value="Demat Account">Demat Account 📈</option>
                <option value="Gaming">Gaming 🎮</option>
                <option value="Other">Other Category ➕</option>
              </select>
            </div>
            <div className="cfg">
              <label>Brand Logo URL</label>
              <input
                type="url"
                placeholder="https://image-hosting.com/logo.png"
                value={cfLogo}
                onChange={(e) => setCfLogo(e.target.value)}
                onBlur={handleLogoPreview}
              />
              {cfLogo && (
                <img
                  id="cfLogoPrev"
                  src={cfLogo}
                  style={{ width: "32px", height: "32px", objectFit: "contain", border: "1px solid var(--border)", padding: "2px", borderRadius: "5px", marginTop: "4px" }}
                  alt="Brand Logo"
                  onError={(e) => { e.target.style.display = "none"; }}
                />
              )}
            </div>
          </div>

          <div className="cfr" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
            <div className="cfg">
              <label>Base Destination Link *</label>
              <input
                type="url"
                placeholder="https://partner-redirect.com/offer"
                value={cfUrl}
                onChange={(e) => setCfUrl(e.target.value)}
                required
              />
            </div>
            <div className="cfg">
              <label>Payout Yield Type *</label>
              <div style={{ display: "flex", gap: "10px" }}>
                <input
                  type="text"
                  placeholder="e.g. 500 (for Cash) or 5 (for %)"
                  value={cfPayout}
                  onChange={(e) => setCfPayout(e.target.value)}
                  style={{ flex: 1 }}
                  required
                />
                <div className="pay-tog" style={{ display: "flex" }}>
                  <button
                    type="button"
                    className={`pto ${cfPayModel === "cash" ? "on" : ""}`}
                    onClick={() => setCfPayModel("cash")}
                  >
                    Cash
                  </button>
                  <button
                    type="button"
                    className={`pto ${cfPayModel === "pct" ? "on" : ""}`}
                    onClick={() => setCfPayModel("pct")}
                  >
                    % Pct
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sub ID dynamic building */}
          <div className="cfr" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
            <div className="cfg">
              <label>Affiliate Sub ID query param</label>
              <div className="subid-row" style={{ display: "flex", gap: "8px" }}>
                <select value={cfSubSel} onChange={(e) => setCfSubSel(e.target.value)} style={{ flex: 1 }}>
                  <option value="">-- No Sub ID --</option>
                  <option value="sub_id">sub_id</option>
                  <option value="subid">subid</option>
                  <option value="sub1">sub1</option>
                  <option value="aff_sub">aff_sub</option>
                  <option value="custom">Custom Param</option>
                </select>
                {cfSubSel === "custom" && (
                  <input
                    type="text"
                    placeholder="custom_param"
                    value={cfSubCustom}
                    onChange={(e) => setCfSubCustom(e.target.value)}
                    style={{ flex: 1 }}
                  />
                )}
              </div>
            </div>
            <div className="cfg">
              <label>Link Preview with User ID</label>
              <div
                className="url-prev"
                style={{
                  background: "var(--off)",
                  borderRadius: "8px",
                  padding: "10px",
                  fontFamily: "monospace",
                  fontSize: "10px",
                  wordBreak: "break-all",
                  border: "1px solid var(--border)",
                  minHeight: "38px",
                }}
              >
                {cfUrl ? (
                  <>
                    {cfUrl}
                    {cfSubSel && (
                      <>
                        {cfUrl.includes("?") ? "&" : "?"}
                        {getSubId()}=
                        <span className="uhl" style={{ background: "var(--green-l)", color: "var(--green-d)", padding: "0 4px", borderRadius: "2px", fontWeight: "700" }}>
                          PA123456
                        </span>
                      </>
                    )}
                  </>
                ) : (
                  <span style={{ color: "var(--muted)", fontStyle: "italic" }}>Destination URL daalne par yahan dynamic link dikhegi</span>
                )}
              </div>
            </div>
          </div>

          <div className="cfg">
            <label>Campaign Descriptions</label>
            <textarea
              placeholder="Advisor instructions (e.g. Account open hotey hi screenshot upload karein)..."
              value={cfDesc}
              onChange={(e) => setCfDesc(e.target.value)}
              style={{ minHeight: "60px" }}
            />
          </div>

          <button className="submit-btn" type="submit" style={{ margin: 0 }}>
            💾 Save Earning Campaign Template
          </button>
        </form>

        {/* Search Campaigns list */}
        <div style={{ marginBottom: "14px" }}>
          <input
            type="text"
            className="srch"
            placeholder="Search campaigns..."
            value={campSearch}
            onChange={(e) => setCampSearch(e.target.value)}
          />
        </div>

        {/* Campaign cards grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "16px" }}>
          {filteredCamps.length === 0 ? (
            <div style={{ gridColumn: "1/-1", textAlign: "center", background: "#fff", border: "1px solid var(--border)", padding: "40px", borderRadius: "12px" }}>
              <span style={{ fontSize: "36px" }}>🎯</span>
              <p style={{ color: "var(--muted)", marginTop: "8px" }}>No campaigns templates found. Upar form se create karein.</p>
            </div>
          ) : (
            filteredCamps.map((c) => (
              <div className="camp-card" key={c.id}>
                <div className="camp-hdr">
                  {c.logo ? (
                    <img src={c.logo} className="camp-logo" alt="Logo" onError={(e) => { e.target.style.display = "none"; }} />
                  ) : (
                    <div className="camp-logo-ph">🎯</div>
                  )}
                  <div className="camp-meta">
                    <h4>{c.name}</h4>
                    <small>Created: {c.createdAt}</small>
                  </div>
                  <div style={{ display: "flex", gap: "4px" }}>
                    <button className="abtn" style={{ padding: "4px 8px", fontSize: "10px" }} onClick={() => handleEditCampaign(c)}>
                      ✏️ Edit
                    </button>
                    <button className="abtn dng" style={{ padding: "4px 6px", fontSize: "10px" }} onClick={() => handleDeleteCampaign(c.id)}>
                      🗑️
                    </button>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "8px" }}>
                  <span className="bdg bdg-n">{c.segment}</span>
                  <span className={`bdg ${c.payModel === "pct" ? "bdg-go" : "bdg-g"}`}>
                    {c.payModel === "pct" ? "%" : "💰"} {c.payout}
                  </span>
                  {c.goal && <span className="bdg bdg-n">Goal: {c.goal}</span>}
                </div>

                {c.desc && <p style={{ fontSize: "12px", color: "var(--muted)", marginBottom: "8px" }}>{c.desc}</p>}
                
                <div className="camp-url" style={{ fontSize: "9px" }}>
                  {c.subId ? (
                    <>
                      {c.url}
                      {c.url.includes("?") ? "&" : "?"}
                      {c.subId}=<span style={{ color: "var(--green-d)", fontWeight: "700" }}>[USER_ID]</span>
                    </>
                  ) : (
                    c.url
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  // ======= RENDER SUBMISSIONS REVIEW =======
  const renderSubmissionsTab = () => {
    let filteredSubs = submissionsList.slice().reverse();

    if (subSearch.trim()) {
      const q = subSearch.toLowerCase();
      filteredSubs = filteredSubs.filter(
        (s) =>
          s.userId.toLowerCase().includes(q) ||
          s.campName.toLowerCase().includes(q)
      );
    }
    if (subStatusFilter) {
      filteredSubs = filteredSubs.filter((s) => s.status === subStatusFilter);
    }

    return (
      <div className="atab on">
        <div className="phdr">
          <div>
            <h2>Advisor Submissions Review ({filteredSubs.length})</h2>
            <p>Review and verify conversion proofs submitted by advisors</p>
          </div>
        </div>

        <div className="tbar" style={{ display: "flex", gap: "10px", marginBottom: "14px" }}>
          <input
            type="text"
            className="srch"
            placeholder="Search advisor ID, offer..."
            value={subSearch}
            onChange={(e) => setSubSearch(e.target.value)}
          />
          <select value={subStatusFilter} onChange={(e) => setSubStatusFilter(e.target.value)} className="srch">
            <option value="">All Statuses</option>
            <option value="pending">⏳ Pending</option>
            <option value="approved">✅ Approved</option>
            <option value="rejected">❌ Rejected</option>
            <option value="rework">🔄 Rework</option>
          </select>
        </div>

        <div className="twrap">
          <table className="dtbl">
            <thead>
              <tr>
                <th>Advisor ID</th>
                <th>Campaign/Offer</th>
                <th>Expected Payout</th>
                <th>Submitted On</th>
                <th>Proof Data</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSubs.length === 0 ? (
                <tr>
                  <td colSpan="7" className="empty">
                    <div className="ei">📭</div>
                    <p>No submissions found.</p>
                  </td>
                </tr>
              ) : (
                filteredSubs.map((s) => {
                  let statusHtml = "";
                  if (s.status === "approved") {
                    statusHtml = <span className="bdg bdg-g">✅ Approved</span>;
                  } else if (s.status === "rejected") {
                    statusHtml = <span className="bdg" style={{ background: "var(--red-l)", color: "var(--red)" }}>❌ Rejected</span>;
                  } else if (s.status === "rework") {
                    statusHtml = <span className="bdg bdg-go">🔄 Rework</span>;
                  } else {
                    statusHtml = <span className="bdg bdg-go">⏳ Pending</span>;
                  }

                  const showActions = s.status === "pending" || s.status === "rework";

                  return (
                    <tr key={s.id}>
                      <td><span className="bdg bdg-n">{s.userId}</span></td>
                      <td style={{ fontWeight: 600 }}>{s.campName}</td>
                      <td style={{ fontWeight: 700, color: "var(--green-d)" }}>
                        {s.payModel === "pct" ? `${s.payout}%` : `₹${s.payout}`}
                      </td>
                      <td style={{ fontSize: "11px", color: "var(--muted)", whiteSpace: "nowrap" }}>{s.submittedAt}</td>
                      <td style={{ fontSize: "12px", maxWidth: "150px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={s.proof}>
                        {s.proof}
                      </td>
                      <td>
                        {statusHtml}
                        {s.adminNote && <div style={{ fontSize: "10px", color: "var(--gold-d)" }}>Note: {s.adminNote}</div>}
                      </td>
                      <td>
                        {showActions ? (
                          <div style={{ display: "flex", gap: "4px" }}>
                            <button
                              className="abtn"
                              style={{ fontSize: "10px", padding: "4px 8px", background: "var(--green-l)", borderColor: "var(--green)", color: "var(--green-d)" }}
                              onClick={() => handleSubmissionAction(s.id, "approved")}
                            >
                              Approve
                            </button>
                            <button
                              className="abtn"
                              style={{ fontSize: "10px", padding: "4px 8px", background: "var(--gold-l)", borderColor: "var(--gold)", color: "var(--gold-d)" }}
                              onClick={() => handleSubmissionAction(s.id, "rework")}
                            >
                              Rework
                            </button>
                            <button
                              className="abtn dng"
                              style={{ fontSize: "10px", padding: "4px 6px" }}
                              onClick={() => handleSubmissionAction(s.id, "rejected")}
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span style={{ fontSize: "11px", color: "var(--muted)" }}>Closed ({s.updatedAt || "—"})</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // ======= RENDER WITHDRAWALS REVIEW =======
  const renderWithdrawalsTab = () => {
    let filteredWds = withdrawalsList.slice().reverse();

    if (wdSearch.trim()) {
      const q = wdSearch.toLowerCase();
      filteredWds = filteredWds.filter(
        (w) =>
          w.userId.toLowerCase().includes(q) ||
          w.id.toLowerCase().includes(q)
      );
    }
    if (wdStatusFilter) {
      filteredWds = filteredWds.filter((w) => w.status === wdStatusFilter);
    }

    return (
      <div className="atab on">
        <div className="phdr">
          <div>
            <h2>Advisor Withdrawals & KYC Review ({filteredWds.length})</h2>
            <p>Review payouts and verify banking/UPI credentials and KYC files</p>
          </div>
        </div>

        <div className="tbar" style={{ display: "flex", gap: "10px", marginBottom: "14px" }}>
          <input
            type="text"
            className="srch"
            placeholder="Search advisor ID, req ID..."
            value={wdSearch}
            onChange={(e) => setWdSearch(e.target.value)}
          />
          <select value={wdStatusFilter} onChange={(e) => setWdStatusFilter(e.target.value)} className="srch">
            <option value="">All Statuses</option>
            <option value="pending">⏳ Pending</option>
            <option value="approved">✅ Approved</option>
            <option value="rejected">❌ Rejected</option>
          </select>
        </div>

        <div className="twrap">
          <table className="dtbl">
            <thead>
              <tr>
                <th>Request ID</th>
                <th>Advisor ID</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Payment & KYC Details</th>
                <th>Requested On</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredWds.length === 0 ? (
                <tr>
                  <td colSpan="8" className="empty">
                    <div className="ei">💸</div>
                    <p>No withdrawal requests found.</p>
                  </td>
                </tr>
              ) : (
                filteredWds.map((w) => {
                  const pd = w.paymentDetails || {};
                  let detailsHtml = "";

                  if (pd.type === "bank") {
                    detailsHtml = (
                      <div style={{ fontSize: "11px", lineHeight: "1.4" }}>
                        🏦 <b>{pd.bankName}</b>
                        <br />
                        Acc Holder: {pd.accHolder}
                        <br />
                        Acc Num: <b>{pd.accNum}</b> | IFSC: {pd.ifsc}
                        <br />
                        PAN: {pd.pan} | Aadhaar: {pd.aadhaar}
                        
                        {/* View verification files button if images exist */}
                        {(w.panImg || w.aadhaarFront || w.aadhaarBack) && (
                          <button
                            type="button"
                            className="abtn"
                            style={{ padding: "2px 6px", fontSize: "9px", height: "auto", minHeight: "auto", marginTop: "4px", display: "inline-block" }}
                            onClick={() => {
                              // View this user in UserDetailModal (contains all documents)
                              const users = GU();
                              const userObj = users.find((x) => x.userId === w.userId);
                              if (userObj) {
                                setSelectedUser(userObj);
                                setIsUserModalOpen(true);
                              } else {
                                alert("User profile details not found in database.");
                              }
                            }}
                          >
                            👁️ View KYC Docs
                          </button>
                        )}
                      </div>
                    );
                  } else {
                    detailsHtml = (
                      <div style={{ fontSize: "12px" }}>
                        📱 UPI Address: <strong style={{ color: "var(--green-d)" }}>{pd.upiId}</strong>
                      </div>
                    );
                  }

                  let statusHtml = "";
                  if (w.status === "approved") {
                    statusHtml = <span className="bdg bdg-g">✅ Approved</span>;
                  } else if (w.status === "rejected") {
                    statusHtml = (
                      <>
                        <span className="bdg" style={{ background: "var(--red-l)", color: "var(--red)" }}>❌ Rejected</span>
                        {w.rejectionReason && <div style={{ fontSize: "10px", color: "var(--red)", marginTop: "2px" }}>Reason: {w.rejectionReason}</div>}
                      </>
                    );
                  } else {
                    statusHtml = <span className="bdg bdg-go">⏳ Pending</span>;
                  }

                  const isPending = w.status === "pending";

                  return (
                    <tr key={w.id}>
                      <td style={{ fontFamily: "'Baloo 2', cursive", fontSize: "11px", color: "var(--muted)" }}>{w.id}</td>
                      <td><span className="bdg bdg-n">{w.userId}</span></td>
                      <td style={{ fontFamily: "'Baloo 2', cursive", fontSize: "16px", fontWeight: "800", color: "var(--green-d)" }}>
                        ₹{w.amount.toLocaleString("en-IN")}
                      </td>
                      <td>
                        <span className={`bdg ${pd.type === "bank" ? "bdg-n" : "bdg-go"}`}>
                          {pd.type === "bank" ? "🏦 Bank" : "📱 UPI"}
                        </span>
                      </td>
                      <td>{detailsHtml}</td>
                      <td style={{ fontSize: "11px", color: "var(--muted)", whiteSpace: "nowrap" }}>{w.createdAt}</td>
                      <td>{statusHtml}</td>
                      <td>
                        {isPending ? (
                          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                            <button
                              className="abtn"
                              style={{ fontSize: "11px", padding: "4px 10px", background: "var(--green-l)", borderColor: "var(--green-d)", color: "var(--green-d)" }}
                              onClick={() => handleWithdrawalAction(w.id, "approved")}
                            >
                              Approve
                            </button>
                            <button
                              className="abtn dng"
                              style={{ fontSize: "11px", padding: "4px 8px" }}
                              onClick={() => handleWithdrawalAction(w.id, "rejected")}
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span style={{ fontSize: "11px", color: "var(--muted)", whiteSpace: "nowrap" }}>Processed ({w.updatedAt || "—"})</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="adm-layout">
      {/* SIDEBAR NAVIGATION */}
      <aside className="adm-side">
        <div style={{ padding: "0 18px 10px", borderBottom: "1px solid rgba(255,255,255,0.08)", marginBottom: "10px" }}>
          <div className="logo" onClick={() => goTo("landing")}>
            <div className="logo-icon" style={{ width: "30px", height: "30px", fontSize: "13px" }}>P</div>
            <div className="logo-text" style={{ fontSize: "16px" }}>Profit<span>Adda</span></div>
          </div>
        </div>

        <div className="aside-lbl">Controls</div>
        <button className={`aside-btn ${activeTab === "overview" ? "on" : ""}`} onClick={() => setActiveTab("overview")}>
          <span className="aside-ico">📊</span> Overview
        </button>
        <button className={`aside-btn ${activeTab === "users" ? "on" : ""}`} onClick={() => { setActiveTab("users"); setUCurPage(1); }}>
          <span className="aside-ico">👥</span> Advisors DB
        </button>
        <button className={`aside-btn ${activeTab === "camps" ? "on" : ""}`} onClick={() => setActiveTab("camps")}>
          <span className="aside-ico">🎯</span> Campaigns Editor
        </button>
        <button className={`aside-btn ${activeTab === "submissions" ? "on" : ""}`} onClick={() => setActiveTab("submissions")}>
          <span className="aside-ico">📥</span> Submissions Review
          {submissionsList.filter((s) => s.status === "pending").length > 0 && (
            <span className="aside-cnt">{submissionsList.filter((s) => s.status === "pending").length}</span>
          )}
        </button>
        <button className={`aside-btn ${activeTab === "withdrawals" ? "on" : ""}`} onClick={() => setActiveTab("withdrawals")}>
          <span className="aside-ico">💸</span> Payouts &amp; KYC
          {withdrawalsList.filter((w) => w.status === "pending").length > 0 && (
            <span className="aside-cnt">{withdrawalsList.filter((w) => w.status === "pending").length}</span>
          )}
        </button>

        <div className="aside-lbl" style={{ marginTop: "20px" }}>Session</div>
        <button className="aside-btn" onClick={handleAdminLogout} style={{ color: "var(--red)" }}>
          <span className="aside-ico">🚪</span> Exit Portal
        </button>
      </aside>

      {/* MAIN ADMIN WORKSPACE AREA */}
      <main className="adm-main">
        {activeTab === "overview" && renderOverview()}
        {activeTab === "users" && renderUsersTab()}
        {activeTab === "camps" && renderCampsTab()}
        {activeTab === "submissions" && renderSubmissionsTab()}
        {activeTab === "withdrawals" && renderWithdrawalsTab()}
      </main>

      {/* USER DETAIL MODAL POPUP */}
      <UserDetailModal
        user={selectedUser}
        isOpen={isUserModalOpen}
        onClose={() => {
          setSelectedUser(null);
          setIsUserModalOpen(false);
        }}
      />
    </div>
  );
}
