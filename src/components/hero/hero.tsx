'use client';

import React, { useState, useEffect } from 'react';
import QuizOverlay from './QuizOverlay';

interface FeedEvent {
  text: string;
  cls: string;
}

interface TickerItem {
  stars?: number;
  text?: string;
  name?: string;
  data?: string;
}

const Hero: React.FC = () => {
  const [liveCount, setLiveCount] = useState<number>(12847);
  const [feedEvents, setFeedEvents] = useState<FeedEvent[]>([
    { text: '<strong>Adarsh</strong>, New Delhi — just crossed <strong>800 GE Rating</strong> in Polity', cls: 'green' },
    { text: '<strong>Shreya</strong>, West Bengal — UPSC Rating <strong>1,200</strong> · High probability to clear Prelims', cls: 'blue' },
    { text: '<strong>Abhishek</strong>, New Delhi — crossed <strong>700 GE Rating</strong> in History', cls: 'olive' },
  ]);
  const [isQuizOpen, setIsQuizOpen] = useState<boolean>(false);

  const [tickerItems] = useState<TickerItem[]>([
    { stars: 5, text: '"Daily current affairs by 10am changed my revision routine completely."', name: 'Meena R., UPSC Aspirant' },
    { data: '2.4 Lakh+ questions curated by toppers across all GE subjects' },
    { stars: 5, text: '"The GE Rating showed me I was wasting time on History when Economy needed work."', name: 'Arjun S., SSC CGL 2024' },
    { data: 'Avg aspirant improves GE Rating by 180 points in first 30 days' },
    { stars: 5, text: '"Better discussion quality than any Telegram group I\'ve been in. Period."', name: 'Fatima K., State PSC' },
    { data: '94% of users who complete 7 days return daily' },
    { stars: 5, text: '"Free. Genuinely free. No hidden course upsell. Unbelievable in 2024."', name: 'Deepak M., UPSC Mains' },
    { data: '12,000+ aspirants studying on the platform right now' },
    { stars: 5, text: '"Polity notes here are cleaner than any coaching material I paid ₹40,000 for."', name: 'Sunita P., BPSC' },
    { data: 'Community moderated by 200+ seniors who have cleared GE exams' },
  ]);

  useEffect(() => {
    const countInterval = setInterval(() => {
      setLiveCount(prev => prev + Math.floor(Math.random() * 6) - 2);
    }, 1800);

    const feedInterval = setInterval(() => {
      const allEvents = [
        { text: '<strong>Adarsh</strong>, New Delhi — just crossed <strong>800 GE Rating</strong> in Polity', cls: 'green' },
        { text: '<strong>Shreya</strong>, West Bengal — UPSC Rating <strong>1,200</strong> · High probability to clear Prelims', cls: 'blue' },
        { text: '<strong>Abhishek</strong>, New Delhi — crossed <strong>700 GE Rating</strong> in History', cls: 'olive' },
        { text: '<strong>Priya</strong>, Jaipur — just completed 7-day streak 🔥', cls: 'green' },
        { text: '<strong>Rohit</strong>, Patna — SSC CGL Rating hit <strong>950</strong> today', cls: 'blue' },
        { text: '<strong>Kavya</strong>, Chennai — State PSC Rating <strong>1,100</strong> · Cleared practice cutoff', cls: 'olive' },
        { text: '<strong>Manish</strong>, Lucknow — crossed <strong>600 GE Rating</strong> in Economy', cls: 'green' },
        { text: '<strong>Nisha</strong>, Bhopal — UPSC Rating <strong>1,050</strong> · Strong in Geography', cls: 'blue' },
        { text: '<strong>Vikram</strong>, Hyderabad — completed all 15 questions · Rating updated', cls: 'olive' },
        { text: '<strong>Ananya</strong>, Kolkata — Current Affairs score <strong>92%</strong> today', cls: 'green' },
      ];
      
      setFeedEvents(prev => {
        const newEvent = allEvents[Math.floor(Math.random() * allEvents.length)];
        return [newEvent, ...prev.slice(0, 2)];
      });
    }, 3200);

    return () => {
      clearInterval(countInterval);
      clearInterval(feedInterval);
    };
  }, []);

  return (
    <>
      <style jsx>{`
        /* ── HERO STYLES USING GLOBAL CSS VARIABLES ─────────────────────────────────────────── */
        .hero {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: calc(100svh - 56px);
          text-align: center;
          padding: 3rem 1.25rem 4rem;
          position: relative;
          overflow: hidden;
        }
        .hero::before {
          content: '';
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 70% 55% at 50% -5%, rgba(24,101,242,.08) 0%, transparent 65%),
            radial-gradient(ellipse 45% 38% at 85% 85%, rgba(90,107,50,.06) 0%, transparent 60%);
          pointer-events: none;
        }

        .hero-eyebrow {
          font-size: .69rem;
          font-weight: 900;
          letter-spacing: .18em;
          text-transform: uppercase;
          color: #5A6B32;
          background: #EEF2E4;
          border: 1px solid #C8D5A0;
          padding: .3rem 1rem;
          border-radius: 100px;
          margin-bottom: 1.6rem;
          animation: fadeUp .5s ease both;
          position: relative;
        }

        .hero-title {
       
          font-size: 61.392px;
          font-weight: 400;
          line-height: 1.06;
          color: hsl(var(--foreground));
          letter-spacing: -.03em;
          max-width: 660px;
          margin-bottom: .55rem;
          animation: fadeUp .55s .08s ease both;
        }

        .hero-ragebait {
          font-family: 'Source Serif 4', serif;
          font-size: clamp(1.15rem, 3.8vw, 2.1rem);
          font-weight: 600;
          font-style: italic;
          line-height: 1.25;
          color: var(--primary);
          max-width: 600px;
          width: 100%;
          margin-bottom: 1.4rem;
          animation: fadeUp .55s .12s ease both;
          background: linear-gradient(135deg, var(--tertiary), var(--quaternary));
          border-left: 4px solid var(--secondary);
          padding: .65rem 1.2rem .65rem 1rem;
          border-radius: 0 10px 10px 0;
          text-align: left;
        }
        .hero-ragebait em {
          font-style: normal;
          color: hsl(var(--foreground));
          text-decoration: underline;
          text-decoration-color: var(--tertiary);
          text-underline-offset: 4px;
        }

        .hero-sub {
          font-size: .96rem;
          color: hsl(var(--muted-foreground));
          max-width: 400px;
          line-height: 1.68;
          margin-bottom: 1.8rem;
          font-weight: 400;
          animation: fadeUp .55s .18s ease both;
        }

        .hero-guesswork {
          font-size: .76rem;
          font-weight: 900;
          letter-spacing: .1em;
          text-transform: uppercase;
          color: #5A6B32;
          margin-bottom: .85rem;
          animation: fadeUp .55s .24s ease both;
        }

        .start-btn {
          position: relative;
          background: var(--primary);
          color: var(--primary-foreground);
          border: none;
          padding: 1rem 2.6rem;
          font-size: 1rem;
          font-weight: 900;
          letter-spacing: .02em;
          border-radius: 9px;
          animation: fadeUp .55s .3s ease both, btnPulse 2.4s 1.2s ease-in-out infinite;
          transition: transform .15s, box-shadow .15s, background .18s;
          box-shadow: 0 6px 28px rgba(24,101,242,.32);
          display: inline-flex;
          align-items: center;
          gap: .55rem;
          min-height: 52px;
          cursor: pointer;
        }
        .start-btn:hover {
          background: var(--action-primary-hover);
          transform: translateY(-3px) scale(1.02);
          box-shadow: 0 12px 36px rgba(24,101,242,.4);
          animation: none;
        }
        .start-btn:active { transform: translateY(0) scale(.98); }

        @keyframes btnPulse {
          0%,100% { box-shadow: 0 6px 28px rgba(24,101,242,.32); transform: translateY(0); }
          50% { box-shadow: 0 10px 38px rgba(24,101,242,.5); transform: translateY(-3px); }
        }

        .btn-fire {
          font-size: 1.1rem;
          animation: fireShake 1.6s 2s ease-in-out infinite;
          display: inline-block;
        }
        @keyframes fireShake {
          0%,100% { transform: rotate(0deg) scale(1); }
          25% { transform: rotate(-8deg) scale(1.12); }
          75% { transform: rotate(8deg) scale(1.12); }
        }
        .btn-arrow { transition: transform .2s; font-size: 1rem; }
        .start-btn:hover .btn-arrow { transform: translateX(5px); }

        .hero-meta {
          margin-top: 1.1rem;
          font-size: .74rem;
          color: hsl(var(--muted-foreground));
          animation: fadeUp .55s .38s ease both;
          line-height: 2;
        }
        .hero-meta span { display: inline-block; margin: 0 .55rem; }
        .hero-meta span::before { content: '· '; color: var(--tertiary); }
        .hero-meta span:first-child::before { content: ''; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* ── LIVE WIDGET ────────────────────────────────────── */
        .live-widget {
          max-width: 360px;
          margin: 0 auto 3rem;
          background: hsl(var(--card));
          border: 1px solid hsl(var(--border));
          border-radius: 14px;
          padding: .9rem 1.2rem;
          box-shadow: 0 3px 20px rgba(24,101,242,.07);
          animation: fadeUp .7s .5s ease both;
        }
        .live-top {
          display: flex;
          align-items: center;
          gap: .5rem;
          margin-bottom: .75rem;
          justify-content: center;
        }
        .live-dot {
          width: 8px;
          height: 8px;
          background: #22c55e;
          border-radius: 50%;
          box-shadow: 0 0 0 0 rgba(34,197,94,.4);
          animation: livePulse 1.6s ease-in-out infinite;
          flex-shrink: 0;
        }
        @keyframes livePulse {
          0%,100% { box-shadow: 0 0 0 0 rgba(34,197,94,.4); }
          50% { box-shadow: 0 0 0 6px rgba(34,197,94,0); }
        }
        .live-count { font-size: 1.05rem; font-weight: 900; color: hsl(var(--foreground)); }
        .live-label { font-size: .74rem; color: hsl(var(--muted-foreground)); }
        .live-feed {
          display: flex;
          flex-direction: column;
          gap: .4rem;
          max-height: 130px;
          overflow: hidden;
        }
        .feed-item {
          font-size: .72rem;
          color: hsl(var(--muted-foreground));
          line-height: 1.42;
          padding: .28rem .5rem;
          border-radius: 6px;
          background: var(--bg-subtle);
          border-left: 2px solid transparent;
          animation: feedSlide .38s ease;
        }
        .feed-item.green { border-color: #22c55e; }
        .feed-item.blue { border-color: var(--secondary); }
        .feed-item.olive { border-color: #8FA058; }
        .feed-item strong { color: hsl(var(--foreground)); font-weight: 700; }
        @keyframes feedSlide {
          from { opacity: 0; transform: translateY(-5px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* ── TICKER ─────────────────────────────────────────── */
        .ticker-wrap {
          overflow: hidden;
          border-top: 1px solid hsl(var(--border));
          border-bottom: 1px solid hsl(var(--border));
          padding: .72rem 0;
          background: var(--bg-subtle);
        }
        .ticker-track {
          display: flex;
          gap: 3rem;
          white-space: nowrap;
          animation: tickerScroll 42s linear infinite;
          width: max-content;
        }
        .ticker-track:hover { animation-play-state: paused; }
        @keyframes tickerScroll { to { transform: translateX(-50%); } }
        .ticker-item {
          font-size: .73rem;
          color: hsl(var(--muted-foreground));
          display: inline-flex;
          align-items: center;
          gap: .48rem;
          flex-shrink: 0;
        }
        .ticker-item .t-star { color: #f59e0b; letter-spacing: -.04em; }
        .ticker-item strong { color: hsl(var(--card-foreground)); }
        .ticker-sep { color: #C8D5A0; font-size: .9rem; }

        /* ── DESKTOP UPGRADE ────────────────────────────────── */
        @media (min-width: 680px) {
          .hero { padding: 4rem 2rem 5rem; min-height: calc(100vh - 62px); }
          .hero-title { font-size: 61.392px; }
          .start-btn { padding: 1.05rem 3rem; font-size: 1.05rem; }
          .live-widget { margin-bottom: 4rem; }
        }

        @media (min-width: 1024px) {
          .hero { min-height: calc(100vh - 62px); }
        }
      `}</style>

      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="hero">
        <span className="hero-eyebrow">Try · 15 Questions First · No Login Needed</span>

        <h1 className="hero-title">You think you can do it?</h1>

        <p className="hero-ragebait">
          So does <em>every other aspirant</em> preparing right now.
        </p>

        <p className="hero-sub">
          Try 15 Questions. Get your free <strong>GE (Govt Exam) Rating</strong> — subject-wise.
          Know exactly where you stand before spending another hour studying blindly.
        </p>

        <p className="hero-guesswork">Preparation without measurement is guesswork.</p>

        <button className="start-btn" onClick={() => setIsQuizOpen(true)}>
          <span className="btn-fire">🔥</span>
          Let's Gooo...
          <span className="btn-arrow">→</span>
        </button>

        <p className="hero-meta">
          <span>15 Questions</span>
          <span>Instant Solutions</span>
          <span>Subject-Wise GE Rating</span>
          <span>2 Minutes</span>
        </p>
      </section>

      {/* ── LIVE WIDGET ───────────────────────────────────── */}
      <div className="live-widget">
        <div className="live-top">
          <span className="live-dot"></span>
          <span className="live-count">{liveCount.toLocaleString('en-IN')}</span>
          <span className="live-label">studying right now</span>
        </div>
        <div className="live-feed">
          {feedEvents.map((event, index) => (
            <div
              key={index}
              className={`feed-item ${event.cls}`}
              dangerouslySetInnerHTML={{ __html: event.text }}
            />
          ))}
        </div>
      </div>

      {/* ── TICKER ─────────────────────────────────────────── */}
      <div className="ticker-wrap">
        <div className="ticker-track">
          {[...tickerItems, ...tickerItems].map((item, index) => (
            <React.Fragment key={index}>
              <span className="ticker-item">
                {item.stars ? (
                  <>
                    <span className="t-star">{'★'.repeat(item.stars)}</span> {item.text} <strong>— {item.name}</strong>
                  </>
                ) : (
                  <>
                    <span className="t-star">◆</span> {item.data}
                  </>
                )}
              </span>
              <span className="ticker-sep">|</span>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Quiz Overlay */}
      <QuizOverlay isOpen={isQuizOpen} onClose={() => setIsQuizOpen(false)} />
    </>
  );
};

export default Hero;