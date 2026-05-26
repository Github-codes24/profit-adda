import React from "react";

export function HowItWorks({ goTo }) {
  return (
    <div className="page active" id="page-how">
      <div className="how-page">
        <div className="how-page-header">
          <div className="stag">Complete Journey</div>
          <h2 className="stitle">Profit Adda Kaise Kaam Karta Hai?</h2>
          <p className="ssub">
            Step by step samjho — registration se lekar cash withdrawal tak sab
            kuch.
          </p>
        </div>

        <div style={{ maxWidth: "700px", margin: "0 auto" }}>
          <div className="journey-step">
            <div className="js-num">1</div>
            <div className="js-ico">📝</div>
            <div className="js-content">
              <h3>Free Registration Karo</h3>
              <p>
                Sirf 2 minute mein apna account banao. Mobile number, email,
                password aur basic details bharo. Koi fees nahi, koi credit card
                nahi chahiye.
              </p>
              <div className="js-tip">
                💡 Apna Unique User ID (PA######) milega — ye hamesha save
                rakho!
              </div>
            </div>
          </div>

          <div
            style={{
              textAlign: "center",
              color: "var(--gold)",
              fontSize: "24px",
              margin: "-8px 0",
            }}
          >
            ↓
          </div>

          <div className="journey-step">
            <div className="js-num">2</div>
            <div className="js-ico">🎯</div>
            <div className="js-content">
              <h3>Offers Browse Karo</h3>
              <p>
                Login karne ke baad "Offers" section mein jao. Wahan categories
                milenge — Credit Card, Insurance, Banking, Shopping aur bahut
                kuch. Jo category pasand aaye usse click karo.
              </p>
              <div className="js-tip">
                💡 Sirf us category ke offers dikhenge jise aapne select kiya!
              </div>
            </div>
          </div>

          <div
            style={{
              textAlign: "center",
              color: "var(--gold)",
              fontSize: "24px",
              margin: "-8px 0",
            }}
          >
            ↓
          </div>

          <div className="journey-step">
            <div className="js-num">3</div>
            <div className="js-ico">🛒</div>
            <div className="js-content">
              <h3>Apna Offer Choose Karo</h3>
              <p>
                Category ke andar saare live offers dikhenge. Har offer mein
                reward clearly likha hoga. "Offer Use Karo" button dabao — ye
                aapka unique tracking link khol dega.
              </p>
              <div className="js-tip">
                💡 Aapka ID automatically tracking link mein add ho jata hai —
                manually kuch nahi karna!
              </div>
            </div>
          </div>

          <div
            style={{
              textAlign: "center",
              color: "var(--gold)",
              fontSize: "24px",
              margin: "-8px 0",
            }}
          >
            ↓
          </div>

          <div className="journey-step">
            <div className="js-num">4</div>
            <div className="js-ico">✅</div>
            <div className="js-content">
              <h3>Offer Complete Karo</h3>
              <p>
                Partner ke website ya app par jao aur offer complete karo. Jaise
                — bank account open karo, credit card apply karo, insurance
                kharido, ya app download karo.
              </p>
              <div className="js-tip">
                💡 Offer complete karne mein 1 din se lekar 30 din lag sakte
                hain — depend karta hai offer type par.
              </div>
            </div>
          </div>

          <div
            style={{
              textAlign: "center",
              color: "var(--gold)",
              fontSize: "24px",
              margin: "-8px 0",
            }}
          >
            ↓
          </div>

          <div className="journey-step">
            <div className="js-num">5</div>
            <div className="js-ico">💸</div>
            <div className="js-content">
              <h3>Cash Pao & Withdraw Karo</h3>
              <p>
                Offer verify hone ke baad aapka cash credited ho jata hai. UPI,
                bank transfer ya wallet mein direct withdrawal possible hai.
                Minimum withdrawal ₹100 se start hota hai.
              </p>
              <div className="js-tip">
                💡 Refer karne se bhi 20% commission milta hai — passive income
                ka sabse aasaan tarika!
              </div>
            </div>
          </div>

          <div style={{ textAlign: "center", marginTop: "36px" }}>
            <button
              className="btn-gold"
              style={{ fontSize: "16px", padding: "15px 36px" }}
              onClick={() => goTo("register")}
            >
              🚀 Abhi Join Karo — It's Free!
            </button>
            <p style={{ marginTop: "12px", fontSize: "13px", color: "var(--muted)" }}>
              Pehle se account hai?{" "}
              <span
                style={{ color: "var(--gold-d)", fontWeight: 700, cursor: "pointer" }}
                onClick={() => goTo("login")}
              >
                Login Karo
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AboutUs({ goTo }) {
  return (
    <div className="page active" id="page-about">
      <div
        style={{
          background: "var(--navy)",
          padding: "60px 5% 50px",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: "52px", marginBottom: "16px" }}>🏆</div>
        <h1
          style={{
            fontFamily: '"Baloo 2", cursive',
            color: "#fff",
            fontSize: "clamp(28px, 5vw, 48px)",
            fontWeight: 800,
            marginBottom: "12px",
          }}
        >
          Hamare <span style={{ color: "var(--gold)" }}>Baare Mein</span>
        </h1>
        <p
          style={{
            color: "rgba(255, 255, 255, 0.6)",
            fontSize: "17px",
            maxWidth: "540px",
            margin: "0 auto",
          }}
        >
          India ka sabse trusted cashback aur referral platform — jahan har
          kharcha income ban jaata hai.
        </p>
      </div>
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "48px 5% 80px" }}>
        <div
          style={{
            background: "#fff",
            borderRadius: "var(--r)",
            border: "1px solid var(--border)",
            padding: "36px",
            marginBottom: "24px",
            boxShadow: "var(--sh)",
          }}
        >
          <h2
            style={{
              fontFamily: '"Baloo 2", cursive',
              fontSize: "26px",
              color: "var(--navy)",
              marginBottom: "16px",
            }}
          >
            🎯 Humara Mission
          </h2>
          <p
            style={{
              color: "var(--muted)",
              fontSize: "15px",
              lineHeight: 1.8,
              marginBottom: "14px",
            }}
          >
            Profit Adda ka mission hai — India ke har ghar mein ek extra income
            ka zariya banana. Hum chahte hain ki log apni daily life ke har
            kharche pe thoda cashback ya reward zaroor payein.
          </p>
          <p style={{ color: "var(--muted)", fontSize: "15px", lineHeight: 1.8 }}>
            Bank account kholna ho, credit card lena ho, insurance khareednaa ho
            ya sirf online shopping karni ho — Profit Adda pe har cheez par
            earning milti hai. Koi investment nahi, koi risk nahi.
          </p>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "18px",
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              background: "var(--gold-l)",
              borderRadius: "var(--r)",
              padding: "28px",
              border: "1px solid rgba(245, 166, 35, 0.3)",
            }}
          >
            <div style={{ fontSize: "36px", marginBottom: "12px" }}>📅</div>
            <h3
              style={{
                fontFamily: '"Baloo 2", cursive',
                fontSize: "20px",
                color: "var(--navy)",
                marginBottom: "8px",
              }}
            >
              Founded 2024
            </h3>
            <p style={{ color: "var(--gold-d)", fontSize: "14px", lineHeight: "1.6" }}>
              India ke tier-2 aur tier-3 cities ke logon ko financial products
              ka fayda dilane ke liye shuru kiya gaya.
            </p>
          </div>
          <div
            style={{
              background: "var(--green-l)",
              borderRadius: "var(--r)",
              padding: "28px",
              border: "1px solid rgba(26, 171, 95, 0.3)",
            }}
          >
            <div style={{ fontSize: "36px", marginBottom: "12px" }}>👥</div>
            <h3
              style={{
                fontFamily: '"Baloo 2", cursive',
                fontSize: "20px",
                color: "var(--navy)",
                marginBottom: "8px",
              }}
            >
              10,000+ Members
            </h3>
            <p style={{ color: "var(--green-d)", fontSize: "14px", lineHeight: "1.6" }}>
              Hazaron active members jo har mahine real cash kama rahe hain —
              bina koi paisa lagaye.
            </p>
          </div>
          <div
            style={{
              background: "rgba(14, 27, 46, 0.06)",
              borderRadius: "var(--r)",
              padding: "28px",
              border: "1px solid var(--border)",
            }}
          >
            <div style={{ fontSize: "36px", marginBottom: "12px" }}>🏙️</div>
            <h3
              style={{
                fontFamily: '"Baloo 2", cursive',
                fontSize: "20px",
                color: "var(--navy)",
                marginBottom: "8px",
              }}
            >
              5 Cities
            </h3>
            <p style={{ color: "var(--muted)", fontSize: "14px", lineHeight: "1.6" }}>
              Gurgaon, Bangalore, Patna, Ranchi aur Nagpur — aur jald hi aur
              sheher add ho rahe hain.
            </p>
          </div>
        </div>
        <div
          style={{
            background: "#fff",
            borderRadius: "var(--r)",
            border: "1px solid var(--border)",
            padding: "36px",
            marginBottom: "24px",
            boxShadow: "var(--sh)",
          }}
        >
          <h2
            style={{
              fontFamily: '"Baloo 2", cursive',
              fontSize: "26px",
              color: "var(--navy)",
              marginBottom: "20px",
            }}
          >
            💡 Hum Kyun Alag Hain?
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  background: "var(--gold-l)",
                  borderRadius: "9px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "18px",
                  flexShrink: 0,
                }}
              >
                ✅
              </div>
              <div>
                <strong style={{ fontSize: "15px", color: "var(--navy)" }}>
                  100% Transparent
                </strong>
                <br />
                <span style={{ color: "var(--muted)", fontSize: "13px" }}>
                  Har offer ka payout clearly bataya jaata hai — koi hidden
                  terms nahi.
                </span>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  background: "var(--green-l)",
                  borderRadius: "9px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "18px",
                  flexShrink: 0,
                }}
              >
                💸
              </div>
              <div>
                <strong style={{ fontSize: "15px", color: "var(--navy)" }}>
                  Real Cash, No Vouchers
                </strong>
                <br />
                <span style={{ color: "var(--muted)", fontSize: "13px" }}>
                  Aapki earning seedha bank ya UPI mein transfer hoti hai — koi
                  gift card nahi.
                </span>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  background: "rgba(14, 27, 46, 0.07)",
                  borderRadius: "9px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "18px",
                  flexShrink: 0,
                }}
              >
                🤝
              </div>
              <div>
                <strong style={{ fontSize: "15px", color: "var(--navy)" }}>
                  Lifetime Referral
                </strong>
                <br />
                <span style={{ color: "var(--muted)", fontSize: "13px" }}>
                  Aapke referred members ki har earning ka 20% aapko milta hai
                  — lifetime tak.
                </span>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  background: "var(--gold-l)",
                  borderRadius: "9px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "18px",
                  flexShrink: 0,
                }}
              >
                🔒
              </div>
              <div>
                <strong style={{ fontSize: "15px", color: "var(--navy)" }}>
                  Data Surakshit
                </strong>
                <br />
                <span style={{ color: "var(--muted)", fontSize: "13px" }}>
                  Aapka data kabhi bhi kisi third party ko nahi becha
                  jaata.
                </span>
              </div>
            </div>
          </div>
        </div>
        <div
          style={{
            background: "var(--navy)",
            borderRadius: "var(--r)",
            padding: "36px",
            textAlign: "center",
            color: "#fff",
          }}
        >
          <h2
            style={{
              fontFamily: '"Baloo 2", cursive',
              fontSize: "26px",
              color: "var(--gold)",
              marginBottom: "12px",
            }}
          >
            Aaj Hi Join Karo
          </h2>
          <p
            style={{
              color: "rgba(255, 255, 255, 0.6)",
              fontSize: "15px",
              marginBottom: "24px",
            }}
          >
            Free hai, fast hai, aur kaafi faydemand hai!
          </p>
          <div
            style={{
              display: "flex",
              gap: "12px",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <button
              className="btn-gold"
              style={{ fontSize: "15px", padding: "13px 30px" }}
              onClick={() => goTo("register")}
            >
              🚀 Free Join Karo
            </button>
            <button
              className="btn-outline"
              onClick={() => goTo("contact")}
              style={{ fontSize: "15px", padding: "13px 28px" }}
            >
              📞 Contact Karo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Contact({ goTo }) {
  return (
    <div className="page active" id="page-contact">
      <div
        style={{
          background: "var(--navy)",
          padding: "60px 5% 50px",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: "52px", marginBottom: "16px" }}>📞</div>
        <h1
          style={{
            fontFamily: '"Baloo 2", cursive',
            color: "#fff",
            fontSize: "clamp(28px, 5vw, 48px)",
            fontWeight: 800,
            marginBottom: "12px",
          }}
        >
          Contact <span style={{ color: "var(--gold)" }}>Karo</span>
        </h1>
        <p
          style={{
            color: "rgba(255, 255, 255, 0.6)",
            fontSize: "17px",
            maxWidth: "480px",
            margin: "0 auto",
          }}
        >
          Koi bhi sawaal ho — hum yahaan hain. Seedha email karo ya WhatsApp par
          message karo.
        </p>
      </div>
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "48px 5% 80px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "20px",
            marginBottom: "32px",
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: "var(--r)",
              border: "1px solid var(--border)",
              padding: "30px",
              boxShadow: "var(--sh)",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "40px", marginBottom: "12px" }}>📧</div>
            <h3
              style={{
                fontFamily: '"Baloo 2", cursive',
                fontSize: "20px",
                marginBottom: "8px",
              }}
            >
              Email Karo
            </h3>
            <a
              href="mailto:contact@profitadda.com"
              style={{ color: "var(--gold-d)", fontWeight: 700, fontSize: "15px" }}
            >
              contact@profitadda.com
            </a>
            <p style={{ color: "var(--muted)", fontSize: "12px", marginTop: "8px" }}>
              24 ghante mein reply milega
            </p>
          </div>
          <div
            style={{
              background: "#fff",
              borderRadius: "var(--r)",
              border: "1px solid var(--border)",
              padding: "30px",
              boxShadow: "var(--sh)",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "40px", marginBottom: "12px" }}>📱</div>
            <h3
              style={{
                fontFamily: '"Baloo 2", cursive',
                fontSize: "20px",
                marginBottom: "8px",
              }}
            >
              WhatsApp Support
            </h3>
            <p
              style={{ color: "var(--muted)", fontSize: "14px", marginBottom: "10px" }}
            >
              Jaldi help chahiye? WhatsApp par message karo
            </p>
            <a
              href="https://wa.me/919999999999"
              target="_blank"
              rel="noreferrer"
              style={{
                background: "#25d366",
                color: "#fff",
                padding: "9px 20px",
                borderRadius: "8px",
                fontWeight: 700,
                fontSize: "13px",
                display: "inline-block",
              }}
            >
              WhatsApp Karo
            </a>
          </div>
          <div
            style={{
              background: "#fff",
              borderRadius: "var(--r)",
              border: "1px solid var(--border)",
              padding: "30px",
              boxShadow: "var(--sh)",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "40px", marginBottom: "12px" }}>⏰</div>
            <h3
              style={{
                fontFamily: '"Baloo 2", cursive',
                fontSize: "20px",
                marginBottom: "8px",
              }}
            >
              Timings
            </h3>
            <p style={{ color: "var(--navy)", fontSize: "15px", fontWeight: "700" }}>
              10:00 AM to 7:00 PM
            </p>
            <p style={{ color: "var(--muted)", fontSize: "12px", marginTop: "8px" }}>
              Monday se Saturday support active hai
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Privacy() {
  return (
    <div className="page active" id="page-privacy">
      <div
        style={{
          background: "var(--navy)",
          padding: "60px 5% 50px",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: "52px", marginBottom: "16px" }}>🔒</div>
        <h1
          style={{
            fontFamily: '"Baloo 2", cursive',
            color: "#fff",
            fontSize: "clamp(28px, 5vw, 44px)",
            fontWeight: 800,
            marginBottom: "12px",
          }}
        >
          Privacy <span style={{ color: "var(--gold)" }}>Policy</span>
        </h1>
        <p style={{ color: "rgba(255, 255, 255, 0.6)", fontSize: "15px" }}>
          Last updated: January 2025
        </p>
      </div>
      <div style={{ maxWidth: "820px", margin: "0 auto", padding: "48px 5% 80px" }}>
        <div
          style={{
            background: "#fff",
            borderRadius: "var(--r)",
            border: "1px solid var(--border)",
            padding: "36px",
            boxShadow: "var(--sh)",
          }}
        >
          <div
            style={{
              background: "var(--gold-l)",
              borderLeft: "4px solid var(--gold)",
              padding: "16px 20px",
              borderRadius: "0 var(--r-sm) var(--r-sm) 0",
              marginBottom: "28px",
            }}
          >
            <p style={{ color: "var(--gold-d)", fontSize: "14px", fontWeight: 600 }}>
              Profit Adda aapki privacy ko bahut seriously leta hai. Hum aapka
              data kabhi bhi kisi third party ko nahi bechte.
            </p>
          </div>
          <h2
            style={{
              fontFamily: '"Baloo 2", cursive',
              fontSize: "20px",
              color: "var(--navy)",
              marginBottom: "12px",
              paddingBottom: "8px",
              borderBottom: "2px solid var(--border)",
            }}
          >
            1. Kaunsa Data Collect Hota Hai?
          </h2>
          <ul
            style={{
              color: "var(--muted)",
              fontSize: "14px",
              lineHeight: 2,
              paddingLeft: "20px",
              marginBottom: "24px",
            }}
          >
            <li>
              <strong style={{ color: "var(--navy)" }}>Personal Info:</strong> Phone
              number, email, date of birth, gender
            </li>
            <li>
              <strong style={{ color: "var(--navy)" }}>Location:</strong> City aur
              state
            </li>
            <li>
              <strong style={{ color: "var(--navy)" }}>Photo/Selfie:</strong> Optional
              — verification ke liye
            </li>
            <li>
              <strong style={{ color: "var(--navy)" }}>Usage Data:</strong> Konse
              offers dekhe, kab login kiya
            </li>
          </ul>
          <h2
            style={{
              fontFamily: '"Baloo 2", cursive',
              fontSize: "20px",
              color: "var(--navy)",
              marginBottom: "12px",
              paddingBottom: "8px",
              borderBottom: "2px solid var(--border)",
            }}
          >
            2. Data Ka Upyog Kaise Hota Hai?
          </h2>
          <ul
            style={{
              color: "var(--muted)",
              fontSize: "14px",
              lineHeight: 2,
              paddingLeft: "20px",
              marginBottom: "24px",
            }}
          >
            <li>Aapka account banane aur manage karne ke liye</li>
            <li>Earnings track karne aur payment process karne ke liye</li>
            <li>Relevant offers recommend karne ke liye</li>
            <li>Customer support provide karne ke liye</li>
            <li>Fraud prevention ke liye</li>
          </ul>
          <h2
            style={{
              fontFamily: '"Baloo 2", cursive',
              fontSize: "20px",
              color: "var(--navy)",
              marginBottom: "12px",
              paddingBottom: "8px",
              borderBottom: "2px solid var(--border)",
            }}
          >
            3. Data Sharing
          </h2>
          <p
            style={{
              color: "var(--muted)",
              fontSize: "14px",
              lineHeight: "1.8",
              marginBottom: "24px",
            }}
          >
            Hum aapka personal data KABHI BHI kisi third party ko nahi bechte.
            Offer partners ke saath sirf aggregate/anonymized data share hota
            hai — aapka naam ya contact kabhi nahi.
          </p>
          <h2
            style={{
              fontFamily: '"Baloo 2", cursive',
              fontSize: "20px",
              color: "var(--navy)",
              marginBottom: "12px",
              paddingBottom: "8px",
              borderBottom: "2px solid var(--border)",
            }}
          >
            4. Data Security
          </h2>
          <p
            style={{
              color: "var(--muted)",
              fontSize: "14px",
              lineHeight: "1.8",
              marginBottom: "24px",
            }}
          >
            Aapka data Google Sheets par encrypted form mein secure store hota
            hai. Hum industry-standard security practices follow karte hain.
          </p>
          <h2
            style={{
              fontFamily: '"Baloo 2", cursive',
              fontSize: "20px",
              color: "var(--navy)",
              marginBottom: "12px",
              paddingBottom: "8px",
              borderBottom: "2px solid var(--border)",
            }}
          >
            5. Aapke Adhikar
          </h2>
          <ul
            style={{
              color: "var(--muted)",
              fontSize: "14px",
              lineHeight: 2,
              paddingLeft: "20px",
              marginBottom: "24px",
            }}
          >
            <li>Apna data access karne ka adhikar</li>
            <li>Data delete karwane ka adhikar</li>
            <li>Data correction ka adhikar</li>
            <li>Account close karwane ka adhikar</li>
          </ul>
          <p style={{ color: "var(--muted)", fontSize: "14px", marginBottom: "24px" }}>
            Kisi bhi request ke liye:{" "}
            <a
              href="mailto:contact@profitadda.com"
              style={{ color: "var(--gold-d)", fontWeight: 700 }}
            >
              contact@profitadda.com
            </a>
          </p>
          <h2
            style={{
              fontFamily: '"Baloo 2", cursive',
              fontSize: "20px",
              color: "var(--navy)",
              marginBottom: "12px",
              paddingBottom: "8px",
              borderBottom: "2px solid var(--border)",
            }}
          >
            6. Cookies & Storage
          </h2>
          <p
            style={{
              color: "var(--muted)",
              fontSize: "14px",
              lineHeight: "1.8",
              marginBottom: "24px",
            }}
          >
            Hum localStorage use karte hain aapka session save karne ke liye. Ye
            data sirf aapke device par rehta hai.
          </p>
          <h2
            style={{
              fontFamily: '"Baloo 2", cursive',
              fontSize: "20px",
              color: "var(--navy)",
              marginBottom: "12px",
              paddingBottom: "8px",
              borderBottom: "2px solid var(--border)",
            }}
          >
            7. Policy Mein Changes
          </h2>
          <p
            style={{
              color: "var(--muted)",
              fontSize: "14px",
              lineHeight: "1.8",
              marginBottom: "24px",
            }}
          >
            Koi change hone par email ke zariye notify kiya jayega.
          </p>
          <div
            style={{
              background: "var(--off)",
              borderRadius: "var(--r-sm)",
              padding: "20px",
              textAlign: "center",
            }}
          >
            <p style={{ color: "var(--muted)", fontSize: "13px" }}>
              Sawaal?{" "}
              <a
                href="mailto:contact@profitadda.com"
                style={{ color: "var(--gold-d)", fontWeight: 700 }}
              >
                contact@profitadda.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Terms() {
  return (
    <div className="page active" id="page-terms">
      <div
        style={{
          background: "var(--navy)",
          padding: "60px 5% 50px",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: "52px", marginBottom: "16px" }}>📋</div>
        <h1
          style={{
            fontFamily: '"Baloo 2", cursive',
            color: "#fff",
            fontSize: "clamp(28px, 5vw, 44px)",
            fontWeight: 800,
            marginBottom: "12px",
          }}
        >
          Terms & <span style={{ color: "var(--gold)" }}>Conditions</span>
        </h1>
        <p style={{ color: "rgba(255, 255, 255, 0.6)", fontSize: "15px" }}>
          Last updated: January 2025
        </p>
      </div>
      <div style={{ maxWidth: "820px", margin: "0 auto", padding: "48px 5% 80px" }}>
        <div
          style={{
            background: "#fff",
            borderRadius: "var(--r)",
            border: "1px solid var(--border)",
            padding: "36px",
            boxShadow: "var(--sh)",
          }}
        >
          <div
            style={{
              background: "var(--gold-l)",
              borderLeft: "4px solid var(--gold)",
              padding: "16px 20px",
              borderRadius: "0 var(--r-sm) var(--r-sm) 0",
              marginBottom: "28px",
            }}
          >
            <p style={{ color: "var(--gold-d)", fontSize: "14px", fontWeight: 600 }}>
              Platform use karna matlab aap in terms se agree karte ho. Dhyan se
              padho.
            </p>
          </div>
          <h2
            style={{
              fontFamily: '"Baloo 2", cursive',
              fontSize: "20px",
              color: "var(--navy)",
              marginBottom: "12px",
              paddingBottom: "8px",
              borderBottom: "2px solid var(--border)",
            }}
          >
            1. Membership & Eligibility
          </h2>
          <ul
            style={{
              color: "var(--muted)",
              fontSize: "14px",
              lineHeight: 2,
              paddingLeft: "20px",
              marginBottom: "24px",
            }}
          >
            <li>Age 18 saal ya usse zyada hona zaroori hai</li>
            <li>Ek phone number pe sirf ek account allowed hai</li>
            <li>
              Fake information dene par account permanently ban ho sakta hai
            </li>
            <li>Membership free hai aur hamesha free rahegi</li>
          </ul>
          <h2
            style={{
              fontFamily: '"Baloo 2", cursive',
              fontSize: "20px",
              color: "var(--navy)",
              marginBottom: "12px",
              paddingBottom: "8px",
              borderBottom: "2px solid var(--border)",
            }}
          >
            2. Earnings & Cashback
          </h2>
          <ul
            style={{
              color: "var(--muted)",
              fontSize: "14px",
              lineHeight: 2,
              paddingLeft: "20px",
              marginBottom: "24px",
            }}
          >
            <li>Earnings sirf approved offers par credit hoti hain</li>
            <li>Pending earnings 7–15 working days mein process hoti hain</li>
            <li>
              Cashback amounts brand partners dwara decide hote hain aur badal
              sakte hain
            </li>
          </ul>
          <h2
            style={{
              fontFamily: '"Baloo 2", cursive',
              fontSize: "20px",
              color: "var(--navy)",
              marginBottom: "12px",
              paddingBottom: "8px",
              borderBottom: "2px solid var(--border)",
            }}
          >
            3. Referral Program
          </h2>
          <ul
            style={{
              color: "var(--muted)",
              fontSize: "14px",
              lineHeight: 2,
              paddingLeft: "20px",
              marginBottom: "24px",
            }}
          >
            <li>
              Referral commission 20% hai — referred member ki har approved
              earning ka
            </li>
            <li>Self-referral strictly banned hai</li>
            <li>Fake accounts banane par sab earnings forfeit ho jaayengi</li>
          </ul>
          <h2
            style={{
              fontFamily: '"Baloo 2", cursive',
              fontSize: "20px",
              color: "var(--navy)",
              marginBottom: "12px",
              paddingBottom: "8px",
              borderBottom: "2px solid var(--border)",
            }}
          >
            4. Withdrawal Rules
          </h2>
          <ul
            style={{
              color: "var(--muted)",
              fontSize: "14px",
              lineHeight: 2,
              paddingLeft: "20px",
              marginBottom: "24px",
            }}
          >
            <li>Minimum withdrawal amount: ₹200</li>
            <li>Sirf verified bank account ya UPI ID pe withdrawal hoga</li>
            <li>Har withdrawal 3–7 working days mein process hoti hai</li>
            <li>TDS applicable ho sakta hai (as per Indian tax law)</li>
          </ul>
          <h2
            style={{
              fontFamily: '"Baloo 2", cursive',
              fontSize: "20px",
              color: "var(--navy)",
              marginBottom: "12px",
              paddingBottom: "8px",
              borderBottom: "2px solid var(--border)",
            }}
          >
            5. Prohibited Activities
          </h2>
          <ul
            style={{
              color: "var(--muted)",
              fontSize: "14px",
              lineHeight: 2,
              paddingLeft: "20px",
              marginBottom: "24px",
            }}
          >
            <li>Multiple accounts banana</li>
            <li>False ya fraudulent submissions dena</li>
            <li>Bot ya automation se offers complete karna</li>
            <li>Platform ko hack ya manipulate karne ki koshish karna</li>
          </ul>
          <h2
            style={{
              fontFamily: '"Baloo 2", cursive',
              fontSize: "20px",
              color: "var(--navy)",
              marginBottom: "12px",
              paddingBottom: "8px",
              borderBottom: "2px solid var(--border)",
            }}
          >
            6. Disclaimer
          </h2>
          <p
            style={{
              color: "var(--muted)",
              fontSize: "14px",
              lineHeight: "1.8",
              marginBottom: "24px",
            }}
          >
            Profit Adda ek cashback aur referral platform hai. Hum kisi bhi
            financial product ke liye advice nahi dete. Offer partners ke
            products unki khud ki responsibility hain.
          </p>
          <div
            style={{
              background: "var(--off)",
              borderRadius: "var(--r-sm)",
              padding: "20px",
              textAlign: "center",
            }}
          >
            <p style={{ color: "var(--muted)", fontSize: "13px" }}>
              Sawaal?{" "}
              <a
                href="mailto:contact@profitadda.com"
                style={{ color: "var(--gold-d)", fontWeight: 700 }}
              >
                contact@profitadda.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function WithdrawalProcess({ goTo }) {
  return (
    <div className="page active" id="page-withdrawal">
      <div
        style={{
          background: "var(--navy)",
          padding: "60px 5% 50px",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: "52px", marginBottom: "16px" }}>💸</div>
        <h1
          style={{
            fontFamily: '"Baloo 2", cursive',
            color: "#fff",
            fontSize: "clamp(28px, 5vw, 44px)",
            fontWeight: 800,
            marginBottom: "12px",
          }}
        >
          Withdrawal <span style={{ color: "var(--gold)" }}>Process</span>
        </h1>
        <p
          style={{
            color: "rgba(255, 255, 255, 0.6)",
            fontSize: "17px",
            maxWidth: "480px",
            margin: "0 auto",
          }}
        >
          Apni kamayi seedha bank ya UPI mein nikalo — bilkul aasaan!
        </p>
      </div>
      <div style={{ maxWidth: "860px", margin: "0 auto", padding: "48px 5% 80px" }}>
        <h2
          style={{
            fontFamily: '"Baloo 2", cursive',
            fontSize: "26px",
            color: "var(--navy)",
            marginBottom: "24px",
            textAlign: "center",
          }}
        >
          Withdrawal Kaise Karte Hain?
        </h2>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            marginBottom: "32px",
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: "var(--r)",
              border: "1px solid var(--border)",
              padding: "24px 28px",
              boxShadow: "var(--sh)",
              display: "flex",
              alignItems: "flex-start",
              gap: "20px",
            }}
          >
            <div
              style={{
                fontFamily: '"Baloo 2", cursive',
                fontSize: "44px",
                fontWeight: 800,
                color: "var(--gold)",
                opacity: 0.25,
                lineHeight: 1,
                flexShrink: 0,
                width: "50px",
                textAlign: "center",
              }}
            >
              01
            </div>
            <div>
              <h3 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "6px" }}>
                Dashboard pe Jao
              </h3>
              <p style={{ color: "var(--muted)", fontSize: "14px", lineHeight: 1.7 }}>
                Login karo aur "Wallet Balance" dekho. Minimum ₹200 chahiye
                withdrawal ke liye.
              </p>
            </div>
          </div>
          <div
            style={{
              background: "#fff",
              borderRadius: "var(--r)",
              border: "1px solid var(--border)",
              padding: "24px 28px",
              boxShadow: "var(--sh)",
              display: "flex",
              alignItems: "flex-start",
              gap: "20px",
            }}
          >
            <div
              style={{
                fontFamily: '"Baloo 2", cursive',
                fontSize: "44px",
                fontWeight: 800,
                color: "var(--gold)",
                opacity: 0.25,
                lineHeight: 1,
                flexShrink: 0,
                width: "50px",
                textAlign: "center",
              }}
            >
              02
            </div>
            <div>
              <h3 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "6px" }}>
                Payment Method aur KYC Details Bharo
              </h3>
              <p style={{ color: "var(--muted)", fontSize: "14px", lineHeight: 1.7 }}>
                Bank Account ya UPI ID select karo. Bank transfer ke liye PAN aur
                Aadhaar card details upload karke verification complete karo.
              </p>
            </div>
          </div>
          <div
            style={{
              background: "#fff",
              borderRadius: "var(--r)",
              border: "1px solid var(--border)",
              padding: "24px 28px",
              boxShadow: "var(--sh)",
              display: "flex",
              alignItems: "flex-start",
              gap: "20px",
            }}
          >
            <div
              style={{
                fontFamily: '"Baloo 2", cursive',
                fontSize: "44px",
                fontWeight: 800,
                color: "var(--gold)",
                opacity: 0.25,
                lineHeight: 1,
                flexShrink: 0,
                width: "50px",
                textAlign: "center",
              }}
            >
              03
            </div>
            <div>
              <h3 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "6px" }}>
                Request Submit Karo
              </h3>
              <p style={{ color: "var(--muted)", fontSize: "14px", lineHeight: 1.7 }}>
                Amount daalo aur "Withdraw" click karo. Request automatically
                admin approval pipeline mein chali jayegi.
              </p>
            </div>
          </div>
        </div>
        <div style={{ textAlign: "center" }}>
          <button className="btn-gold" onClick={() => goTo("dashboard")}>
            💸 Dashboard Par Jao
          </button>
        </div>
      </div>
    </div>
  );
}

export function FAQs({ goTo }) {
  return (
    <div className="page active" id="page-faqs">
      <div
        style={{
          background: "var(--navy)",
          padding: "60px 5% 50px",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: "52px", marginBottom: "16px" }}>❓</div>
        <h1
          style={{
            fontFamily: '"Baloo 2", cursive',
            color: "#fff",
            fontSize: "clamp(28px, 5vw, 44px)",
            fontWeight: 800,
            marginBottom: "12px",
          }}
        >
          Aksar Pooche Jane Wale <span style={{ color: "var(--gold)" }}>Sawaal</span>
        </h1>
        <p
          style={{
            color: "rgba(255, 255, 255, 0.6)",
            fontSize: "17px",
            maxWidth: "540px",
            margin: "0 auto",
          }}
        >
          Sabse common sawaalon ke jawab.
        </p>
      </div>
      <div style={{ maxWidth: "820px", margin: "0 auto", padding: "48px 5% 80px" }}>
        <h2
          style={{
            fontFamily: '"Baloo 2", cursive',
            fontSize: "20px",
            color: "var(--navy)",
            marginBottom: "14px",
          }}
        >
          🔰 Shuru Karne Se Pehle
        </h2>
        <details className="faq-item">
          <summary>Profit Adda kya hai?</summary>
          <div className="faq-body">
            Profit Adda India ka cashback aur referral platform hai. Banking
            products, insurance, loans ya online shopping par real cash earn
            karo. Koi investment nahi — sirf smartly kharcha karo aur paise
            wapas pao.
          </div>
        </details>
        <details className="faq-item">
          <summary>Join karna kitne ka hai?</summary>
          <div className="faq-body">
            100% Free! Joining bilkul free hai aur hamesha free rahegi. Koi
            hidden fees ya monthly charges nahi.
          </div>
        </details>
        <details className="faq-item">
          <summary>Koi bhi join kar sakta hai?</summary>
          <div className="faq-body">
            Haan! 18 saal ya usse zyada umra ka koi bhi Indian citizen join kar
            sakta hai. Ek valid phone number aur email chahiye.
          </div>
        </details>
        <details className="faq-item">
          <summary>Mujhe kuch invest karna padega?</summary>
          <div className="faq-body">
            Bilkul nahi! Aapko koi paisa invest nahi karna. Jo kharche pehle se
            karte ho usi par cashback milta hai.
          </div>
        </details>

        <h2
          style={{
            fontFamily: '"Baloo 2", cursive',
            fontSize: "20px",
            color: "var(--navy)",
            marginBottom: "14px",
            marginTop: "28px",
          }}
        >
          💰 Earning
        </h2>
        <details className="faq-item">
          <summary>Paise kaise milte hain?</summary>
          <div className="faq-body">
            Offer complete karo → proof submit karo → admin approve karega →
            wallet mein credit → bank/UPI mein withdraw karo. Itna simple!
          </div>
        </details>
        <details className="faq-item">
          <summary>Ek mahine mein kitna kama sakte hain?</summary>
          <div className="faq-body">
            Personal offers se ₹500–₹5,000. Referral network ke saath
            ₹10,000–₹50,000+ bhi possible. Top advisors isi tarah kamate hain.
          </div>
        </details>
        <details className="faq-item">
          <summary>Approval mein kitna time lagta hai?</summary>
          <div className="faq-body">
            Admin usually 2–5 working days mein submissions review karta hai.
            Approved hone par turant wallet credit hota hai.
          </div>
        </details>

        <h2
          style={{
            fontFamily: '"Baloo 2", cursive',
            fontSize: "20px",
            color: "var(--navy)",
            marginBottom: "14px",
            marginTop: "28px",
          }}
        >
          🤝 Referral
        </h2>
        <details className="faq-item">
          <summary>Referral commission kitna milta hai?</summary>
          <div className="faq-body">
            Referred member ki har approved earning ka <strong>20%</strong> aapko
            milta hai — lifetime! ₹1,000 ki earning par aapko ₹200.
          </div>
        </details>
        <details className="faq-item">
          <summary>Kya khud ko refer kar sakta hun?</summary>
          <div className="faq-body">
            Nahi. Self-referral strictly banned hai. Account ban aur earnings
            forfeit ho sakti hain.
          </div>
        </details>
        <details className="faq-item">
          <summary>Kitne log refer kar sakta hun?</summary>
          <div className="faq-body">
            Koi limit nahi! Jitna bada network, utni zyada passive income.
          </div>
        </details>

        <h2
          style={{
            fontFamily: '"Baloo 2", cursive',
            fontSize: "20px",
            color: "var(--navy)",
            marginBottom: "14px",
            marginTop: "28px",
          }}
        >
          🏦 Withdrawal
        </h2>
        <details className="faq-item">
          <summary>Minimum withdrawal kitna hai?</summary>
          <div className="faq-body">Minimum ₹200. Koi maximum limit nahi.</div>
        </details>
        <details className="faq-item">
          <summary>Withdrawal mein kitna time lagta hai?</summary>
          <div className="faq-body">
            3–7 working days. Weekends mein processing nahi hoti.
          </div>
        </details>
        <details className="faq-item">
          <summary>Withdrawal charges lagte hain?</summary>
          <div className="faq-body">Bilkul nahi! Withdrawal 100% free hai.</div>
        </details>

        <h2
          style={{
            fontFamily: '"Baloo 2", cursive',
            fontSize: "20px",
            color: "var(--navy)",
            marginBottom: "14px",
            marginTop: "28px",
          }}
        >
          🔒 Account & Security
        </h2>
        <details className="faq-item">
          <summary>Kya mera data safe hai?</summary>
          <div className="faq-body">
            Haan! Hum aapka data kabhi third party ko nahi bechte. Sab encrypted
            aur secure hai.
          </div>
        </details>
        <details className="faq-item">
          <summary>Password bhool gaya — kya karu?</summary>
          <div className="faq-body">
            Login page par "Password Bhool Gaye?" link click karo aur reset process follow karo.
          </div>
        </details>
        <details className="faq-item">
          <summary>Aur koi sawaal hai?</summary>
          <div className="faq-body">
            Email karo{" "}
            <a
              href="mailto:contact@profitadda.com"
              style={{ color: "var(--gold-d)", fontWeight: 700 }}
            >
              contact@profitadda.com
            </a>{" "}
            — 24 ghante mein reply milega!
          </div>
        </details>

        <div
          style={{
            background: "var(--navy)",
            borderRadius: "var(--r)",
            padding: "28px",
            textAlign: "center",
            color: "#fff",
            marginTop: "28px",
          }}
        >
          <h3
            style={{
              fontFamily: '"Baloo 2", cursive',
              fontSize: "22px",
              color: "var(--gold)",
              marginBottom: "10px",
            }}
          >
            Abhi Bhi Sawaal Hai?
          </h3>
          <p
            style={{
              color: "rgba(255, 255, 255, 0.6)",
              fontSize: "14px",
              marginBottom: "18px",
            }}
          >
            Seedha hum se baat karo!
          </p>
          <button
            className="btn-gold"
            onClick={() => goTo("contact")}
            style={{ fontSize: "15px", padding: "12px 28px" }}
          >
            📞 Contact Karo →
          </button>
        </div>
      </div>
    </div>
  );
}
