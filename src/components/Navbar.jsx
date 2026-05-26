import React, { useState } from "react";

export default function Navbar({
  page,
  goTo,
  loggedInUser,
  onLogout,
  isLive,
  onOpenDashboard,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (target) => {
    setMobileMenuOpen(false);
    if (target === "offers") {
      if (loggedInUser) {
        goTo("offers");
      } else {
        goTo("login");
      }
    } else if (target === "refer") {
      if (loggedInUser) {
        goTo("refer");
      } else {
        goTo("login");
      }
    } else {
      goTo(target);
    }
  };

  const showNav = page !== "dashboard" && page !== "offers" && page !== "admin" && page !== "admin-login";

  if (!showNav) return null;

  return (
    <>
      <nav id="mainNav">
        <div className="logo" onClick={() => handleNavClick("landing")}>
          <div className="logo-icon">P</div>
          <div className="logo-text">
            Profit<span>Adda</span>
          </div>
        </div>
        <ul className="nav-links">
          <li>
            <a onClick={() => handleNavClick("landing")}>Home</a>
          </li>
          <li>
            <a onClick={() => handleNavClick("offers")}>Offers</a>
          </li>
          <li>
            <a onClick={() => handleNavClick("refer")}>Refer &amp; Earn</a>
          </li>
          <li>
            <a onClick={() => handleNavClick("how")}>How it Works</a>
          </li>
          <li>
            <a onClick={() => handleNavClick("about")}>About Us</a>
          </li>
          <li>
            <a onClick={() => handleNavClick("contact")}>Contact</a>
          </li>
        </ul>
        <div className="nav-right">
          <span
            id="syncBadge"
            style={{
              fontSize: "10px",
              padding: "3px 9px",
              borderRadius: "100px",
              fontWeight: "700",
              marginRight: "4px",
              cursor: "default",
              background: isLive ? "rgba(26,171,95,0.18)" : "rgba(245,166,35,0.18)",
              color: isLive ? "#1AAB5F" : "#C47D0A",
            }}
            title={
              isLive
                ? "Google Sheets se connected hai"
                : "Demo mode - Google Sheets URL set karo"
            }
          >
            {isLive ? "🟢 Live" : "🟡 Demo"}
          </span>

          <button className="nav-admin" onClick={() => handleNavClick("admin-login")}>
            Admin
          </button>

          {!loggedInUser ? (
            <div id="navGuest" style={{ display: "flex", gap: "8px" }}>
              <button className="nav-admin" onClick={() => handleNavClick("login")}>
                Login
              </button>
              <button className="nav-reg" onClick={() => handleNavClick("register")}>
                Join Free
              </button>
            </div>
          ) : (
            <div id="navUser" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span
                id="navUserIdLabel"
                style={{
                  color: "var(--gold)",
                  fontFamily: "'Baloo 2', cursive",
                  fontWeight: 800,
                  fontSize: "14px",
                }}
              >
                {loggedInUser.userId}
              </span>
              <button className="nav-admin" onClick={onOpenDashboard}>
                Dashboard
              </button>
              <button
                className="nav-admin"
                onClick={onLogout}
                style={{ borderColor: "var(--red)", color: "var(--red)" }}
              >
                Logout
              </button>
            </div>
          )}

          <div className="hamburger" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </nav>

      {/* Ticker banner (only on home/landing page) */}
      {page === "landing" && (
        <div className="ticker">
          <div className="ticker-inner">
            <span className="tick-item">🔥 Profit Adda — Har Click Pe Kamayi Shuru Karo!</span>
            <span className="tick-item">💸 Apne doston ko refer karo aur unki earning ka 20% lifetime pao!</span>
            <span className="tick-item">⚡ 100% Trusted cashback aur financial offers platform.</span>
            <span className="tick-item">📱 Wallet mein ₹200 hote hi seedha UPI ya Bank account mein withdraw karein.</span>
            <span className="tick-item">🔥 Profit Adda — Har Click Pe Kamayi Shuru Karo!</span>
            <span className="tick-item">💸 Apne doston ko refer karo aur unki earning ka 20% lifetime pao!</span>
            <span className="tick-item">⚡ 100% Trusted cashback aur financial offers platform.</span>
            <span className="tick-item">📱 Wallet mein ₹200 hote hi seedha UPI ya Bank account mein withdraw karein.</span>
          </div>
        </div>
      )}

      {/* Mobile Navigation Drawer */}
      <div className={`mobile-menu ${mobileMenuOpen ? "on" : ""}`} onClick={() => setMobileMenuOpen(false)}>
        <div className="mmenu-inner" onClick={(e) => e.stopPropagation()}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div className="logo">
              <div className="logo-icon">P</div>
              <div className="logo-text">Profit<span>Adda</span></div>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              style={{
                background: "transparent",
                border: "none",
                color: "#fff",
                fontSize: "24px",
                cursor: "pointer"
              }}
            >
              ×
            </button>
          </div>
          <ul>
            <li>
              <a onClick={() => handleNavClick("landing")}>Home</a>
            </li>
            <li>
              <a onClick={() => handleNavClick("offers")}>Offers</a>
            </li>
            <li>
              <a onClick={() => handleNavClick("refer")}>Refer &amp; Earn</a>
            </li>
            <li>
              <a onClick={() => handleNavClick("how")}>How it Works</a>
            </li>
            <li>
              <a onClick={() => handleNavClick("about")}>About Us</a>
            </li>
            <li>
              <a onClick={() => handleNavClick("contact")}>Contact</a>
            </li>
            <li style={{ margin: "20px 0", height: "1px", background: "rgba(255,255,255,0.1)" }}></li>
            {!loggedInUser ? (
              <>
                <li>
                  <a onClick={() => handleNavClick("login")} style={{ color: "var(--gold)" }}>Login</a>
                </li>
                <li>
                  <a onClick={() => handleNavClick("register")} style={{ color: "var(--green)" }}>Join Free</a>
                </li>
              </>
            ) : (
              <>
                <li style={{ padding: "0 14px", color: "var(--gold)", fontSize: "14px", fontWeight: "700" }}>
                  ID: {loggedInUser.userId}
                </li>
                <li>
                  <a onClick={onOpenDashboard} style={{ color: "var(--gold)" }}>Dashboard</a>
                </li>
                <li>
                  <a onClick={onLogout} style={{ color: "var(--red)" }}>Logout</a>
                </li>
              </>
            )}
            <li>
              <a onClick={() => handleNavClick("admin-login")} style={{ opacity: 0.5, fontSize: "12px" }}>Admin Panel</a>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
