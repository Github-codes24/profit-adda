import React, { useState, useEffect } from "react";
import { GU, GC } from "../database";

export default function Landing({ goTo, setPreFilledPhone }) {
  const [cShop, setCShop] = useState(5000);
  const [cIns, setCIns] = useState(2);
  const [cRef, setCRef] = useState(10);
  const [cCards, setCCards] = useState(1);
  const [quickPhone, setQuickPhone] = useState("");

  const [stats, setStats] = useState({
    users: 1250,
    paid: 185200,
    claims: 9540,
    cities: 5,
  });

  // Calculate earnings
  const s = Math.round(cShop * 0.05);
  const i = Math.round(cIns * 300);
  const r = Math.round(cRef * 500);
  const total = s * 12 + i + r * 12 + cCards * 1000;

  useEffect(() => {
    // Dynamically update stats based on localStorage users/camps if desired, or keep premium static stats
    const localUsers = GU().length;
    if (localUsers > 0) {
      setStats((prev) => ({
        ...prev,
        users: 1250 + localUsers,
      }));
    }
  }, []);

  const handleQuickSignupSubmit = (e) => {
    e.preventDefault();
    if (!/^\d{10}$/.test(quickPhone.trim())) {
      alert("❌ Valid 10-digit number daalo");
      return;
    }
    setPreFilledPhone(quickPhone.trim());
    goTo("register");
  };

  return (
    <div className="page active" id="page-landing">
      {/* ====== HERO ====== */}
      <div className="hero">
        <span className="hero-badge">🚀 ZERO INVESTMENT EARNING PLATFORM</span>
        <h1>
          Profit Adda pe milegi <br />
          <span className="hl">Har Click Pe Kamayi!</span>
        </h1>
        <p>
          Apne mobile se financial products suggest karein ya khud use karein aur
          doston ko refer karke lifetime cashback aur passive income kamayein.
        </p>
        <div className="hero-btns">
          <button className="btn-gold" onClick={() => goTo("register")}>
            🚀 Register Free Now
          </button>
          <button className="btn-outline" onClick={() => goTo("how")}>
            ℹ️ Kaise Kaam Karta Hai?
          </button>
        </div>
        <div className="hero-stats">
          <div className="hs-item">
            <span className="hs-num">{stats.users.toLocaleString("en-IN")}+</span>
            <span className="hs-lbl">Active Users</span>
          </div>
          <div className="hs-item">
            <span className="hs-num">₹{stats.paid.toLocaleString("en-IN")}+</span>
            <span className="hs-lbl">Total Cash Paid Out</span>
          </div>
          <div className="hs-item">
            <span className="hs-num">{stats.claims.toLocaleString("en-IN")}+</span>
            <span className="hs-lbl">Offers Completed</span>
          </div>
          <div className="hs-item">
            <span className="hs-num">{stats.cities} SHEHER</span>
            <span className="hs-lbl">Pan India Presence</span>
          </div>
        </div>
      </div>

      {/* ====== HOW IT WORKS ====== */}
      <section className="sec how">
        <center>
          <span className="stag">Aasaan Rasta</span>
          <h2 className="stitle">3 Simple Steps Mein Kamayi</h2>
          <p className="ssub">
            Profit Adda se paise kamana bilkul aasaan hai. Bas in steps ko follow
            karo:
          </p>
        </center>

        <div className="steps">
          <div className="step">
            <span className="step-n">01</span>
            <div className="step-ico ico-g">📝</div>
            <h3>Free Register Karo</h3>
            <p>
              Apne number se account banao aur login karke apna Unique User ID (PA######)
              generate karo.
            </p>
          </div>
          <div className="step">
            <span className="step-n">02</span>
            <div className="step-ico ico-gr">🎯</div>
            <h3>Offers Share & Use Karo</h3>
            <p>
              Credit Card, Saving Account, Insurance, Demat ya Gaming templates se options
              select karke links share ya use karo.
            </p>
          </div>
          <div className="step">
            <span className="step-n">03</span>
            <div className="step-ico ico-n">💸</div>
            <h3>Direct Cash Extract</h3>
            <p>
              Offer verify hote hi wallet balance badhega, jise aap seedha Bank Transfer or
              UPI se nikal sakte hain.
            </p>
          </div>
        </div>
      </section>

      {/* ====== REFERRAL ====== */}
      <section className="sec ref-sec">
        <center>
          <span className="stag g">Passive Income</span>
          <h2 className="stitle">Doston Ko Refer Karo, Lifetime Kamao</h2>
          <p className="ssub">
            Apne network ko leverage karein. Har referral ki approved earning ka
            flat 20% aapko milta rahega — lifetime tak!
          </p>
        </center>

        <div className="ref-flow">
          <div className="ref-box">
            <span className="ri">🔗</span>
            <h4>Code Share Karo</h4>
            <p>Apna link WhatsApp ya social media par share karo.</p>
          </div>
          <span className="ref-arrow">→</span>
          <div className="ref-box">
            <span className="ri">👥</span>
            <h4>Dost Join Karein</h4>
            <p>Aapke code se log sign up karke earning shuru karenge.</p>
          </div>
          <span className="ref-arrow">→</span>
          <div className="ref-box">
            <span className="ri">📈</span>
            <h4>Dost Offer Karein</h4>
            <p>Wo offers complete karke cashback kamayenge.</p>
          </div>
          <span className="ref-arrow">→</span>
          <div className="ref-box">
            <span className="ri">💰</span>
            <h4>20% Aapka Hua</h4>
            <p>Unke earnings ka 20% direct aapke wallet mein automatic aayega.</p>
          </div>
        </div>

        <div className="big-box">
          <p>Agar aapke 10 dost milkar har mahine ₹20,000 kamate hain, toh aapki monthly extra income hogi:</p>
          <h3>₹4,000 / month</h3>
          <p style={{ marginTop: "10px", fontSize: "12px", opacity: 0.7 }}>Bina kuch kiye — direct wallet credit!</p>
        </div>
      </section>

      {/* ====== CALCULATOR ====== */}
      <section className="sec calc-sec">
        <center>
          <span className="stag">Income Calculator</span>
          <h2 className="stitle">Apni Monthly Earning Estimate Karein</h2>
          <p className="ssub">
            Aap kitna kama sakte hain? Neeche diye sliders ko adjust karke calculate
            karein:
          </p>
        </center>

        <div className="calc-wrap">
          <div className="calc-row">
            <div className="cg">
              <label>Monthly Shopping Expense (₹)</label>
              <input
                type="number"
                value={cShop}
                onChange={(e) => setCShop(parseInt(e.target.value) || 0)}
              />
              <input
                type="range"
                min="1000"
                max="50000"
                step="1000"
                value={cShop}
                onChange={(e) => setCShop(parseInt(e.target.value) || 0)}
                style={{ width: "100%", marginTop: "8px" }}
              />
              <small>Cashback average 5%</small>
            </div>
            <div className="cg">
              <label>Insurance Policies Sold / Year</label>
              <input
                type="number"
                value={cIns}
                onChange={(e) => setCIns(parseInt(e.target.value) || 0)}
              />
              <input
                type="range"
                min="0"
                max="20"
                step="1"
                value={cIns}
                onChange={(e) => setCIns(parseInt(e.target.value) || 0)}
                style={{ width: "100%", marginTop: "8px" }}
              />
              <small>Commission average ₹300 per policy</small>
            </div>
          </div>
          <div className="calc-row">
            <div className="cg">
              <label>Dost Jo Har Month Kholenge Account</label>
              <input
                type="number"
                value={cRef}
                onChange={(e) => setCRef(parseInt(e.target.value) || 0)}
              />
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={cRef}
                onChange={(e) => setCRef(parseInt(e.target.value) || 0)}
                style={{ width: "100%", marginTop: "8px" }}
              />
              <small>Earning average ₹500 per referral monthly</small>
            </div>
            <div className="cg">
              <label>Credit Cards Approved / Month</label>
              <input
                type="number"
                value={cCards}
                onChange={(e) => setCCards(parseInt(e.target.value) || 0)}
              />
              <input
                type="range"
                min="0"
                max="15"
                step="1"
                value={cCards}
                onChange={(e) => setCCards(parseInt(e.target.value) || 0)}
                style={{ width: "100%", marginTop: "8px" }}
              />
              <small>Earning average ₹1,000 per card approval</small>
            </div>
          </div>

          <div className="result-grid">
            <div className="rc">
              <span className="ra" id="rShop">₹{s.toLocaleString("en-IN")}</span>
              <span className="rl">Shopping Cashback/Month</span>
            </div>
            <div className="rc">
              <span className="ra" id="rIns">₹{i.toLocaleString("en-IN")}</span>
              <span className="rl">Insurance Earning/Year</span>
            </div>
            <div className="rc">
              <span className="ra" id="rRefCalc">₹{r.toLocaleString("en-IN")}</span>
              <span className="rl">Referral Income/Month</span>
            </div>
          </div>

          <div className="total-box">
            <small>Estimated Annual Income</small>
            <strong id="rTotal">₹{total.toLocaleString("en-IN")}</strong>
          </div>
        </div>
      </section>

      {/* ====== SIGNUP BANNER ====== */}
      <section className="signup-sec">
        <center>
          <h2 className="stitle">Earning Platform Pe Abhi Shuru Karein</h2>
          <p>
            Apne doston ke saath milkar aasan digital task complete karein. Signup karein
            aur join karein Profit Adda ko.
          </p>
          <form className="su-form" onSubmit={handleQuickSignupSubmit}>
            <input
              type="text"
              id="suPhone"
              placeholder="10-Digit Mobile Number"
              maxLength="10"
              value={quickPhone}
              onChange={(e) => setQuickPhone(e.target.value)}
            />
            <button className="btn-gold" type="submit">
              🚀 Free Join Karo
            </button>
          </form>
          <div className="trust-row">
            <div className="trust-item">🛡️ 100% Secure</div>
            <div className="trust-item">🔒 Data Protected</div>
            <div className="trust-item">🤝 Lifetime Passive Earning</div>
          </div>
        </center>
      </section>

      {/* ====== FOOTER ====== */}
      <footer>
        <div className="footer-top">
          <div>
            <div className="fl-logo">
              Profit<span>Adda</span>
            </div>
            <div className="fl-desc">
              India ka trusted earnings and cashback reward advisor model platform.
              Smart ways to monetize your daily transactions.
            </div>
          </div>
          <div className="fc">
            <h4>Quick Links</h4>
            <ul>
              <li><a onClick={() => goTo("landing")}>Home</a></li>
              <li><a onClick={() => goTo("how")}>How it Works</a></li>
              <li><a onClick={() => goTo("about")}>About Us</a></li>
              <li><a onClick={() => goTo("contact")}>Contact Us</a></li>
            </ul>
          </div>
          <div className="fc">
            <h4>Support Links</h4>
            <ul>
              <li><a onClick={() => goTo("faqs")}>FAQs</a></li>
              <li><a onClick={() => goTo("withdrawal")}>Withdrawal Process</a></li>
              <li><a onClick={() => goTo("privacy")}>Privacy Policy</a></li>
              <li><a onClick={() => goTo("terms")}>Terms of Service</a></li>
            </ul>
          </div>
          <div className="fc">
            <h4>Contact Info</h4>
            <ul>
              <li>Email: <a href="mailto:support@profitadda.com">support@profitadda.com</a></li>
              <li>WhatsApp: +91 9955860644</li>
              <li>Location: Pan India Support</li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 Profit Adda. All rights reserved.</span>
          <span>Made for India 🇮🇳</span>
        </div>
      </footer>
    </div>
  );
}
