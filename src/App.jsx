import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Landing from "./views/Landing";
import Onboarding from "./views/Onboarding";
import Dashboard from "./views/Dashboard";
import Offers from "./views/Offers";
import Refer from "./views/Refer";
import Admin from "./views/Admin";
import {
  HowItWorks,
  AboutUs,
  Contact,
  Privacy,
  Terms,
  WithdrawalProcess,
  FAQs,
} from "./views/StaticPages";
import SubmitProofModal from "./components/SubmitProofModal";
import WithdrawModal from "./components/WithdrawModal";
import ShareModal from "./components/ShareModal";
import { syncFromSheets, USE_SHEETS, GC, sheetsAPI } from "./database";

export default function App() {
  // Routing & Session
  const [page, setPage] = useState("landing"); // landing, login, register, success, dashboard, offers, refer, admin, admin-login, how, about, contact, privacy, terms, withdrawal, faqs
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [preFilledPhone, setPreFilledPhone] = useState("");
  const [generatedUid, setGeneratedUid] = useState("");

  // Sync state
  const [isLive, setIsLive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState("");

  // Modal states
  const [isSubmitProofOpen, setIsSubmitProofOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [selectedShareCampaign, setSelectedShareCampaign] = useState(null);

  // Global Toast State
  const [toast, setToast] = useState({ show: false, msg: "", type: "" });

  const triggerToast = (msg, type = "ok") => {
    setToast({ show: true, msg, type });
    setTimeout(() => {
      setToast({ show: false, msg: "", type: "" });
    }, 3000);
  };

  // Sync from Sheets on start
  useEffect(() => {
    const initSync = async () => {
      // Check if user session is active
      const cachedSession = sessionStorage.getItem("pa_logged_in_user");
      if (cachedSession) {
        try {
          setLoggedInUser(JSON.parse(cachedSession));
        } catch (e) {}
      }

      if (USE_SHEETS) {
        const hasCache = GC().length > 0;
        if (!hasCache) {
          setLoading(true);
          setLoadingMsg("📡 Syncing database...");
        }
        const connected = await syncFromSheets();
        setIsLive(connected);
        if (!hasCache) {
          setLoading(false);
        }
      }
    };
    initSync();
  }, []);

  // Handle URL Query Parameters (Referral code or Short link redirect)
  useEffect(() => {
    const handleQueryParams = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("r");
      if (!code) return;

      // Clean the URL query params so they don't stay in the address bar if they refresh
      const cleanUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
      window.history.replaceState({ path: cleanUrl }, "", cleanUrl);

      // Check if it's an Advisor Referral Code (e.g. PA123456)
      if (/^PA\d{6}$/i.test(code.trim())) {
        sessionStorage.setItem("pa_referral_code", code.trim().toUpperCase());
        triggerToast(`👋 Referral code applied: ${code.trim().toUpperCase()}`, "ok");
        navigateTo("register");
      } else {
        // It's a Campaign Short Link code! Resolve it via Sheets API
        setLoading(true);
        setLoadingMsg("🔗 Redirecting to offer...");
        try {
          const res = await sheetsAPI("resolveShortLink", { code: code.trim() });
          if (res.ok && res.targetUrl) {
            // Track click count on Sheets
            sheetsAPI("incrementClick", { code: code.trim() }).catch(() => {});
            // Redirect
            window.location.replace(res.targetUrl);
          } else {
            setLoading(false);
            triggerToast("❌ Invalid or expired offer link", "er");
          }
        } catch (e) {
          setLoading(false);
          triggerToast("❌ Connection error. Could not resolve link.", "er");
        }
      }
    };
    
    if (isLive || !USE_SHEETS) {
      handleQueryParams();
    }
  }, [isLive]);

  const handleLoginSuccess = (user) => {
    setLoggedInUser(user);
    sessionStorage.setItem("pa_logged_in_user", JSON.stringify(user));
  };

  const handleUserUpdate = (updatedUser) => {
    setLoggedInUser(updatedUser);
    sessionStorage.setItem("pa_logged_in_user", JSON.stringify(updatedUser));
  };

  const handleLogout = () => {
    setLoggedInUser(null);
    sessionStorage.removeItem("pa_logged_in_user");
    setPage("landing");
    triggerToast("👋 Logout ho gaye! Phir milenge.", "ok");
  };

  const navigateTo = (target) => {
    setPage(target);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleOpenDashboard = () => {
    if (loggedInUser) {
      navigateTo("dashboard");
    } else {
      navigateTo("login");
      triggerToast("⚠️ Dashboard dekhne ke liye pehle login karein", "er");
    }
  };

  const handleOpenOffers = () => {
    if (loggedInUser) {
      navigateTo("offers");
    } else {
      navigateTo("login");
      triggerToast("⚠️ Offers dekhne ke liye pehle login karein", "er");
    }
  };

  const handleOpenRefer = () => {
    if (loggedInUser) {
      navigateTo("refer");
    } else {
      navigateTo("login");
      triggerToast("⚠️ Refer karne ke liye pehle login karein", "er");
    }
  };

  // Render view based on state
  const renderView = () => {
    switch (page) {
      case "landing":
        return <Landing goTo={navigateTo} setPreFilledPhone={setPreFilledPhone} />;
      case "login":
        return (
          <Onboarding
            viewType="login"
            goTo={navigateTo}
            onLoginSuccess={handleLoginSuccess}
          />
        );
      case "register":
        return (
          <Onboarding
            viewType="register"
            goTo={navigateTo}
            preFilledPhone={preFilledPhone}
            onLoginSuccess={handleLoginSuccess}
            setGeneratedUid={setGeneratedUid}
          />
        );
      case "success":
        return (
          <Onboarding
            viewType="success"
            goTo={navigateTo}
            generatedUid={generatedUid}
          />
        );
      case "dashboard":
        return (
          <Dashboard
            goTo={navigateTo}
            loggedInUser={loggedInUser}
            onSubmitProofClick={() => setIsSubmitProofOpen(true)}
            onWithdrawClick={() => setIsWithdrawOpen(true)}
          />
        );
      case "offers":
        return (
          <Offers
            goTo={navigateTo}
            loggedInUser={loggedInUser}
            onShareOfferClick={(campaign) => {
              setSelectedShareCampaign(campaign);
              setIsShareOpen(true);
            }}
          />
        );
      case "refer":
        return <Refer goTo={navigateTo} loggedInUser={loggedInUser} />;
      case "admin-login":
      case "admin":
        return <Admin goTo={navigateTo} />;
      case "how":
        return <HowItWorks goTo={navigateTo} />;
      case "about":
        return <AboutUs goTo={navigateTo} />;
      case "contact":
        return <Contact goTo={navigateTo} />;
      case "privacy":
        return <Privacy />;
      case "terms":
        return <Terms />;
      case "withdrawal":
        return <WithdrawalProcess goTo={navigateTo} />;
      case "faqs":
        return <FAQs goTo={navigateTo} />;
      default:
        return <Landing goTo={navigateTo} setPreFilledPhone={setPreFilledPhone} />;
    }
  };

  return (
    <div className="App">
      {/* Navbar Layout (hidden inside dashboard, offers and admin) */}
      <Navbar
        page={page}
        goTo={navigateTo}
        loggedInUser={loggedInUser}
        onLogout={handleLogout}
        isLive={isLive}
        onOpenDashboard={handleOpenDashboard}
      />

      {/* Main Page Area */}
      {renderView()}

      {/* GLOBAL LOADING SCREEN */}
      {loading && (
        <div
          id="pa-loader"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(14,27,46,0.65)",
            zIndex: 9998,
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
              boxShadow: "0 8px 48px rgba(0,0,0,0.18)",
            }}
          >
            <div style={{ fontSize: "28px", marginBottom: "8px", animation: "spin 1.5s linear infinite" }}>
              ⏳
            </div>
            <div
              style={{
                fontFamily: "'Baloo 2', cursive",
                fontSize: "16px",
                color: "#0E1B2E",
                fontWeight: "700",
              }}
            >
              {loadingMsg}
            </div>
          </div>
        </div>
      )}

      {/* USER MODALS */}
      <SubmitProofModal
        isOpen={isSubmitProofOpen}
        onClose={() => setIsSubmitProofOpen(false)}
        loggedInUser={loggedInUser}
        onSubmitted={() => triggerToast("✅ Submissions submitted!", "ok")}
      />

      <WithdrawModal
        isOpen={isWithdrawOpen}
        onClose={() => setIsWithdrawOpen(false)}
        loggedInUser={loggedInUser}
        onWithdrawSuccess={() => triggerToast("✅ Withdrawal request submitted!", "ok")}
        onUserUpdate={handleUserUpdate}
      />

      <ShareModal
        isOpen={isShareOpen}
        onClose={() => {
          setIsShareOpen(false);
          setSelectedShareCampaign(null);
        }}
        campaign={selectedShareCampaign}
        loggedInUser={loggedInUser}
      />

      {/* TOAST PANEL */}
      <div id="toast" className={`toast ${toast.show ? "show" : ""} ${toast.type}`}>
        {toast.msg}
      </div>
    </div>
  );
}
