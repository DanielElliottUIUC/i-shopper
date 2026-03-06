"use client";

import { useState } from "react";
import Link from "next/link";

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState<"ondemand" | "autopilot">("ondemand");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        :root {
          --primary: #2D5F4C; --primary-light: #4A8B6F; --accent: #D4A574;
          --text: #1A1A1A; --text-light: #666; --bg: #FDFCF9; --bg-alt: #F5F2ED; --white: #FFFFFF;
        }
        body { font-family: 'DM Sans', sans-serif; color: var(--text); background: var(--bg); line-height: 1.6; overflow-x: hidden; }
        h1, h2, h3 { font-family: 'Playfair Display', serif; font-weight: 600; line-height: 1.2; }
        .landing-nav { position: fixed; top: 0; width: 100%; background: rgba(253,252,249,0.95); backdrop-filter: blur(10px); z-index: 1000; border-bottom: 1px solid rgba(45,95,76,0.1); }
        .nav-container { max-width: 1200px; margin: 0 auto; padding: 1.5rem 2rem; display: flex; justify-content: space-between; align-items: center; }
        .logo { font-family: 'Playfair Display', serif; font-size: 1.5rem; font-weight: 700; color: var(--primary); text-decoration: none; display: flex; align-items: center; }
        .nav-links { display: flex; gap: 2.5rem; list-style: none; }
        .nav-links a { text-decoration: none; color: var(--text); font-weight: 500; font-size: 0.95rem; transition: color 0.3s ease; }
        .nav-links a:hover { color: var(--primary); }
        .hero { margin-top: 80px; padding: 6rem 2rem 4rem; background: linear-gradient(135deg, var(--bg) 0%, var(--bg-alt) 100%); position: relative; overflow: hidden; }
        .hero::before { content: ''; position: absolute; top: 0; right: -20%; width: 60%; height: 100%; background: radial-gradient(circle, rgba(74,139,111,0.08) 0%, transparent 70%); pointer-events: none; }
        .hero-container { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: center; position: relative; }
        .hero-content h1 { font-size: 3.5rem; color: var(--primary); margin-bottom: 1.5rem; animation: fadeInUp 0.8s ease; }
        .hero-subtitle { font-size: 1.3rem; color: var(--text-light); margin-bottom: 2rem; line-height: 1.7; animation: fadeInUp 0.8s ease 0.2s backwards; }
        .hero-cta { display: flex; gap: 1rem; animation: fadeInUp 0.8s ease 0.4s backwards; }
        .btn { padding: 1rem 2rem; font-size: 1rem; font-weight: 600; border: none; border-radius: 8px; cursor: pointer; transition: all 0.3s ease; text-decoration: none; display: inline-block; }
        .btn-primary { background: var(--primary); color: var(--white); }
        .btn-primary:hover { background: var(--primary-light); transform: translateY(-2px); box-shadow: 0 8px 20px rgba(45,95,76,0.3); }
        .btn-secondary { background: transparent; color: var(--primary); border: 2px solid var(--primary); }
        .btn-secondary:hover { background: var(--primary); color: var(--white); }
        .hero-visual { display: flex; align-items: center; justify-content: center; animation: fadeIn 1s ease 0.6s backwards; }
        .feature-grid-mini { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
        .feature-card-mini { background: var(--white); padding: 1.5rem; border-radius: 12px; border: 1px solid rgba(45,95,76,0.1); transition: all 0.3s ease; }
        .feature-card-mini:hover { transform: translateY(-4px); box-shadow: 0 8px 24px rgba(45,95,76,0.12); }
        .feature-icon { font-size: 2rem; margin-bottom: 0.5rem; }
        .feature-card-mini h3 { font-size: 1.1rem; color: var(--primary); margin-bottom: 0.5rem; }
        .feature-card-mini p { font-size: 0.9rem; color: var(--text-light); }
        .problem-section { padding: 5rem 2rem; background: var(--white); }
        .section-container { max-width: 1200px; margin: 0 auto; }
        .section-header { text-align: center; margin-bottom: 3rem; }
        .section-label { font-size: 0.9rem; font-weight: 600; color: var(--accent); text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 1rem; }
        .section-header h2 { font-size: 2.5rem; color: var(--primary); margin-bottom: 1rem; }
        .section-header p { font-size: 1.1rem; color: var(--text-light); max-width: 700px; margin: 0 auto; }
        .stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; margin-top: 3rem; }
        .stat-card { text-align: center; padding: 2rem; background: var(--bg-alt); border-radius: 12px; transition: all 0.3s ease; }
        .stat-card:hover { transform: translateY(-4px); }
        .stat-number { font-size: 3rem; font-weight: 700; color: var(--primary); font-family: 'Playfair Display', serif; }
        .stat-label { font-size: 1rem; color: var(--text-light); margin-top: 0.5rem; }
        .how-section { padding: 5rem 2rem; background: var(--bg); }
        .mode-tabs { display: flex; justify-content: center; gap: 0; margin: 2.5rem auto 3rem; max-width: 380px; background: var(--bg-alt); border-radius: 12px; padding: 6px; }
        .mode-tab { flex: 1; padding: 0.75rem 1.5rem; border: none; border-radius: 8px; font-family: 'DM Sans', sans-serif; font-size: 0.95rem; font-weight: 600; cursor: pointer; transition: all 0.25s ease; background: transparent; color: var(--text-light); }
        .mode-tab.active { background: var(--white); color: var(--primary); box-shadow: 0 2px 8px rgba(45,95,76,0.12); }
        .steps-container { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; }
        .step-card { position: relative; padding: 2rem; background: var(--white); border-radius: 16px; border: 2px solid var(--bg-alt); transition: all 0.4s ease; }
        .step-card:hover { border-color: var(--accent); transform: translateY(-8px); box-shadow: 0 12px 32px rgba(45,95,76,0.15); }
        .step-number { position: absolute; top: -20px; left: 2rem; width: 48px; height: 48px; background: var(--primary); color: var(--white); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 1.2rem; box-shadow: 0 4px 12px rgba(45,95,76,0.3); }
        .step-card h3 { font-size: 1.3rem; color: var(--primary); margin: 1rem 0 1rem; }
        .step-card p { color: var(--text-light); line-height: 1.7; }
        .passive-features { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; }
        .passive-card { background: var(--white); padding: 2rem; border-radius: 12px; border: 1px solid rgba(45,95,76,0.1); transition: all 0.3s ease; }
        .passive-card:hover { transform: translateY(-4px); box-shadow: 0 8px 24px rgba(45,95,76,0.12); }
        .passive-icon { font-size: 2.5rem; margin-bottom: 1rem; }
        .passive-card h3 { font-size: 1.3rem; color: var(--primary); margin-bottom: 1rem; }
        .passive-card p { color: var(--text-light); line-height: 1.7; }
        .passive-example { margin-top: 3rem; background: linear-gradient(135deg, var(--bg) 0%, var(--bg-alt) 100%); padding: 2.5rem; border-radius: 16px; border: 2px solid var(--accent); }
        .example-header h4 { font-size: 1.5rem; color: var(--primary); margin-bottom: 2rem; text-align: center; font-family: 'Playfair Display', serif; }
        .example-timeline { max-width: 700px; margin: 0 auto; }
        .example-item { display: grid; grid-template-columns: 140px 1fr; gap: 1.5rem; margin-bottom: 2rem; padding-bottom: 2rem; border-bottom: 1px solid rgba(45,95,76,0.1); }
        .example-item:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }
        .example-time { font-size: 0.9rem; font-weight: 600; color: var(--accent); padding-top: 0.25rem; }
        .example-content { background: var(--white); padding: 1rem 1.5rem; border-radius: 8px; line-height: 1.7; color: var(--text-light); }
        .example-content strong { color: var(--primary); display: block; margin-bottom: 0.5rem; }
        .faq-section { padding: 5rem 2rem; background: var(--white); }
        .faq-grid { display: grid; gap: 1.5rem; max-width: 900px; margin: 3rem auto 0; }
        .faq-item { background: var(--bg); border-radius: 12px; overflow: hidden; border: 1px solid rgba(45,95,76,0.1); transition: all 0.3s ease; }
        .faq-item:hover { border-color: var(--accent); }
        .faq-question { padding: 1.5rem 2rem; cursor: pointer; display: flex; justify-content: space-between; align-items: center; font-weight: 600; color: var(--primary); font-family: 'DM Sans', sans-serif; font-size: 1rem; background: none; border: none; width: 100%; text-align: left; }
        .faq-toggle { font-size: 1.5rem; transition: transform 0.3s ease; flex-shrink: 0; }
        .faq-toggle.open { transform: rotate(45deg); }
        .faq-answer { max-height: 0; overflow: hidden; transition: max-height 0.3s ease, padding 0.3s ease; padding: 0 2rem; color: var(--text-light); }
        .faq-answer.open { max-height: 500px; padding: 0 2rem 1.5rem; }
        .cta-section { padding: 5rem 2rem; background: linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%); color: var(--white); text-align: center; }
        .cta-section h2 { font-size: 2.5rem; color: var(--white); margin-bottom: 1rem; }
        .cta-section p { font-size: 1.2rem; margin-bottom: 2rem; opacity: 0.9; }
        .landing-footer { background: var(--text); color: var(--white); padding: 3rem 2rem 2rem; }
        .footer-container { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 3rem; margin-bottom: 2rem; }
        .footer-brand h3 { font-size: 1.5rem; margin-bottom: 1rem; color: var(--accent); }
        .footer-brand p { color: rgba(255,255,255,0.7); line-height: 1.7; }
        .footer-links h4 { font-size: 1rem; margin-bottom: 1rem; color: var(--accent); }
        .footer-links ul { list-style: none; }
        .footer-links li { margin-bottom: 0.5rem; }
        .footer-links a { color: rgba(255,255,255,0.7); text-decoration: none; transition: color 0.3s ease; }
        .footer-links a:hover { color: var(--white); }
        .footer-bottom { text-align: center; padding-top: 2rem; border-top: 1px solid rgba(255,255,255,0.1); color: rgba(255,255,255,0.5); }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @media (max-width: 968px) {
          .nav-links { display: none; }
          .hero-container { grid-template-columns: 1fr; text-align: center; }
          .hero-content h1 { font-size: 2.5rem; }
          .hero-cta { justify-content: center; }
          .stats-grid, .steps-container, .passive-features { grid-template-columns: 1fr; }
          .example-item { grid-template-columns: 1fr; gap: 0.5rem; }
          .footer-container { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* Nav */}
      <nav className="landing-nav">
        <div className="nav-container">
          <a href="/" className="logo">I-Shopper</a>
          <ul className="nav-links">
            <li><a href="/demo.html">Demo</a></li>
            <li><a href="/market.html">Market</a></li>
            <li><a href="/team.html">Team</a></li>
            <li><a href="/careers.html">Careers</a></li>
          </ul>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero">
        <div className="hero-container">
          <div className="hero-content">
            <h1>Shopping shouldn&apos;t feel like work</h1>
            <p className="hero-subtitle">
              A shopping agent built entirely around your interests—helping you make
              confident decisions, faster.
            </p>
            <div className="hero-cta">
              <Link href="/chat" className="btn btn-primary">Try It Now</Link>
              <a href="#how" className="btn btn-secondary">See How It Works</a>
            </div>
          </div>
          <div className="hero-visual">
            <div className="feature-grid-mini">
              {[
                { icon: "🎯", title: "Personalized", desc: "Learns your preferences over time" },
                { icon: "🛡️", title: "Unbiased", desc: "No ads. No hidden agendas." },
                { icon: "⚡", title: "Automated", desc: "From search to checkout" },
                { icon: "💡", title: "Smart", desc: "Powered by advanced AI" },
              ].map((f) => (
                <div key={f.title} className="feature-card-mini">
                  <div className="feature-icon">{f.icon}</div>
                  <h3>{f.title}</h3>
                  <p>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Problem */}
      <section className="problem-section">
        <div className="section-container">
          <div className="section-header">
            <p className="section-label">The Problem</p>
            <h2>Online shopping is broken</h2>
            <p>
              You spend hours comparing products, reading reviews, and second-guessing
              decisions. Meanwhile, recommendation algorithms push what pays them the
              most—not what&apos;s best for you.
            </p>
          </div>
          <p style={{ textAlign: "center", fontSize: "1.1rem", fontWeight: 500, color: "var(--primary)" }}>
            Millions of shoppers feel the same way.
          </p>
          <div className="stats-grid">
            {[
              { num: "89%", label: "spend 10+ minutes researching each purchase" },
              { num: "61%", label: "of consumers are willing to pay more for truly personalized shopping" },
              { num: "$6.8T", label: "global e-commerce market in 2025—and shoppers are navigating it largely alone" },
            ].map((s) => (
              <div key={s.num} className="stat-card">
                <div className="stat-number">{s.num}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="how-section" id="how">
        <div className="section-container">
          <div className="section-header">
            <p className="section-label">How It Works</p>
            <h2>Shopping made effortless</h2>
            <p>Ask on demand, or let Autopilot handle it—I-Shopper works however fits your life.</p>
          </div>

          <div className="mode-tabs">
            <button
              className={`mode-tab${activeTab === "ondemand" ? " active" : ""}`}
              onClick={() => setActiveTab("ondemand")}
            >
              On Demand
            </button>
            <button
              className={`mode-tab${activeTab === "autopilot" ? " active" : ""}`}
              onClick={() => setActiveTab("autopilot")}
            >
              Autopilot
            </button>
          </div>

          {activeTab === "ondemand" && (
            <div className="steps-container">
              {[
                { n: "1", title: "Tell us what you need", desc: "Describe what you're looking for in natural language. Our agent understands your intent and preferences." },
                { n: "2", title: "We search everywhere", desc: "Our agent searches across all major marketplaces and retailers to find the best options—unbiased by ads or sponsorships." },
                { n: "3", title: "Get personalized recommendations", desc: "Receive a curated shortlist of products that match your preferences, complete with honest comparisons and insights." },
              ].map((s) => (
                <div key={s.n} className="step-card">
                  <div className="step-number">{s.n}</div>
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === "autopilot" && (
            <div className="passive-features">
              {[
                { icon: "🎁", title: "Smart Gift Reminders", desc: "Tell I-Shopper about birthdays, anniversaries, and people you buy gifts for. We'll proactively suggest thoughtful gift ideas based on their interests—weeks before the occasion, so you're never scrambling at the last minute." },
                { icon: "📅", title: "Event-Driven Shopping Lists", desc: "Connect your calendar and interests. Traveling next month? I-Shopper suggests travel essentials. Holiday party coming up? Get hosting recommendations. Weather changing? Seasonal wardrobe updates arrive automatically." },
                { icon: "🔄", title: "Replenishment Tracking", desc: "For items you buy regularly—skincare, supplements, household goods—I-Shopper learns your usage patterns and reminds you to reorder at the perfect time, complete with price comparisons." },
              ].map((f) => (
                <div key={f.title} className="passive-card">
                  <div className="passive-icon">{f.icon}</div>
                  <h3>{f.title}</h3>
                  <p>{f.desc}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* FAQ */}
      <section className="faq-section">
        <div className="section-container">
          <div className="section-header">
            <p className="section-label">FAQ</p>
            <h2>Common questions</h2>
          </div>
          <div className="faq-grid">
            {[
              {
                q: "How is I-Shopper different from Amazon or Google Shopping?",
                a: "Unlike platforms that prioritize ad revenue, I-Shopper only prioritizes you. We don't accept sponsorships, don't boost products that pay us more, and don't sell your data to advertisers. Our recommendations are based solely on what's best for your needs and preferences.",
              },
              {
                q: "How does the personalization work?",
                a: "I-Shopper learns from your purchase decisions over time. Every time you choose (or don't choose) a recommendation, our AI refines its understanding of your preferences—what features matter to you, which brands you trust, and how you balance quality vs. price.",
              },
              {
                q: "Is my data private?",
                a: "Absolutely. Your shopping preferences and history are encrypted and never sold to advertisers. Your data is used to improve your experience—full stop.",
              },
              {
                q: "How much does it cost?",
                a: "We're currently in private beta. Pricing will be announced before our public launch. We're committed to keeping it affordable—much less than the time you'd waste on inefficient shopping decisions.",
              },
              {
                q: "Can I-Shopper actually make purchases for me?",
                a: "That's where we're headed. Our first version focuses on finding and recommending the right products so you can make confident decisions quickly. Full purchase automation is coming in a future release. When it does, you'll always have final approval before any payment is processed.",
              },
            ].map((item, i) => (
              <div key={i} className="faq-item">
                <button className="faq-question" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  {item.q}
                  <span className={`faq-toggle${openFaq === i ? " open" : ""}`}>+</span>
                </button>
                <div className={`faq-answer${openFaq === i ? " open" : ""}`}>
                  {item.a}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <h2>Ready to shop smarter?</h2>
        <p>Try I-Shopper now—no sign-up required.</p>
        <Link href="/chat" className="btn" style={{ background: "var(--accent)", color: "var(--text)" }}>
          Start Shopping
        </Link>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-container">
          <div className="footer-brand">
            <h3>I-Shopper</h3>
            <p>Your private shopping agent. Shopping that works for you, not advertisers.</p>
          </div>
          <div className="footer-links">
            <h4>Product</h4>
            <ul>
              <li><a href="/demo.html">Demo</a></li>
              <li><a href="/market.html">Market</a></li>
              <li><Link href="/chat">Try It</Link></li>
            </ul>
          </div>
          <div className="footer-links">
            <h4>Company</h4>
            <ul>
              <li><a href="/team.html">Team</a></li>
              <li><a href="/careers.html">Careers</a></li>
              <li><a href="mailto:contact@i-shopper.ai">Contact</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          &copy; 2026 I-Shopper. All rights reserved.
        </div>
      </footer>
    </>
  );
}
