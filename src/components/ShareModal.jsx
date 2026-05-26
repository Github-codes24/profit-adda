import React, { useState, useEffect } from "react";
import { sheetsAPI } from "../database";

export default function ShareModal({ isOpen, onClose, campaign, loggedInUser }) {
  const [shortUrl, setShortUrl] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const generateLink = async () => {
      if (isOpen && campaign && loggedInUser) {
        setLoading(true);
        setShortUrl("");

        const uid = loggedInUser.userId;
        let base = campaign.url || "";
        if (base.includes("netlify.app") || base.includes("profitadda.com") || base.includes("profitadda.in")) {
          base = window.location.origin + "/";
        }
        const sub = campaign.subId;
        const sep = base.includes("?") ? "&" : "?";
        const targetUrl = sub ? `${base}${sep}${sub}=${uid}` : base;

        try {
          const res = await sheetsAPI("createShortLink", {
            userId: uid,
            campaignId: campaign.id,
            campaignName: campaign.name,
            targetUrl: targetUrl,
          });

          if (res.ok && res.shortUrl) {
            try {
              const urlObj = new URL(res.shortUrl);
              const code = urlObj.searchParams.get("r");
              if (code) {
                setShortUrl(`${window.location.origin}/?r=${code}`);
              } else {
                setShortUrl(res.shortUrl);
              }
            } catch (urlErr) {
              setShortUrl(res.shortUrl);
            }
          } else {
            setShortUrl(targetUrl);
          }
        } catch (e) {
          setShortUrl(targetUrl);
        }
        setLoading(false);
      }
    };

    generateLink();
  }, [isOpen, campaign, loggedInUser]);

  if (!isOpen || !campaign) return null;

  const copyToClipboard = () => {
    if (!shortUrl) return;
    navigator.clipboard
      .writeText(shortUrl)
      .then(() => alert("✅ Link copy ho gaya!"))
      .catch(() => alert("❌ Copy failed"));
  };

  const shareOnWhatsApp = () => {
    if (!shortUrl) return;
    const desc = campaign.desc ? campaign.desc.substring(0, 100) + "..." : "";
    const msg = encodeURIComponent(
      `🎯 *${campaign.name}*\n\n` +
        (desc ? `${desc}\n\n` : "") +
        `💡 Profit Adda pe aise aur bhi bahut saare offers hain!\n\n` +
        `👉 ${shortUrl}\n\n` +
        `🔥 Free join karo aur real cash kamao — koi investment nahi!`
    );
    window.open("https://wa.me/?text=" + msg, "_blank");
  };

  return (
    <div className="umod on" onClick={onClose}>
      <div className="umod-inner" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "420px" }}>
        <div className="umod-top" style={{ padding: "16px 24px" }}>
          <h3 style={{ color: "#fff", margin: 0 }}>🔗 Share Earning Link</h3>
          <button className="umod-close" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="umod-body" style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <span style={{ fontSize: "36px" }}>🎯</span>
            <h4 style={{ margin: "5px 0 2px", fontSize: "16px" }}>{campaign.name}</h4>
            <span className="bdg bdg-n">{campaign.segment || "Offer"}</span>
          </div>

          {loading ? (
            <div style={{ padding: "20px 0", fontSize: "14px", color: "var(--muted)" }}>
              ⏳ Earning short link ban raha hai...
            </div>
          ) : (
            <>
              <div
                style={{
                  background: "var(--off)",
                  border: "1.5px solid var(--border)",
                  borderRadius: "8px",
                  padding: "12px",
                  fontFamily: "monospace",
                  fontSize: "12px",
                  wordBreak: "break-all",
                }}
              >
                {shortUrl}
              </div>

              <div style={{ display: "flex", gap: "10px", marginTop: "5px" }}>
                <button
                  className="submit-btn"
                  onClick={copyToClipboard}
                  style={{ flex: 1, margin: 0, background: "var(--navy)", color: "#fff" }}
                >
                  📋 Link Copy Karo
                </button>
                <button
                  className="submit-btn"
                  onClick={shareOnWhatsApp}
                  style={{ flex: 1, margin: 0, background: "#25d366", color: "#fff" }}
                >
                  🟢 WhatsApp Share
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
