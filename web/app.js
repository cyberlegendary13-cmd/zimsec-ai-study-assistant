* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: Arial, sans-serif;
  background: #f5f7ff;
  color: #1d2433;
}

.container {
  width: min(1100px, 92%);
  margin: 0 auto;
}

.hero {
  background: linear-gradient(135deg, #151d3b, #2d4dc7);
  color: white;
  padding-bottom: 60px;
}

.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 0;
}

.brand {
  font-size: 1.5rem;
  font-weight: bold;
}

.nav-links {
  display: flex;
  gap: 22px;
}

.nav-links a {
  color: white;
  text-decoration: none;
}

.hero-inner {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 32px;
  align-items: center;
  padding-top: 30px;
}

.tag {
  display: inline-block;
  background: rgba(255,255,255,0.12);
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 999px;
  padding: 8px 14px;
  font-size: 0.8rem;
  margin-bottom: 18px;
}

.hero h1 {
  font-size: clamp(2.3rem, 5vw, 4rem);
  margin: 0 0 18px;
}

.hero p {
  line-height: 1.7;
  opacity: 0.9;
}

.hero-actions {
  display: flex;
  gap: 16px;
  margin-top: 24px;
}

.btn {
  display: inline-block;
  padding: 12px 18px;
  border-radius: 10px;
  text-decoration: none;
  font-weight: bold;
}

.btn.primary {
  background: #f7b801;
  color: #1d2433;
}

.btn.secondary {
  background: transparent;
  border: 1px solid rgba(255,255,255,0.28);
  color: white;
}

.hero-card, .card, .panel, .stat-card {
  background: white;
  border-radius: 16px;
  padding: 22px;
  box-shadow: 0 12px 30px rgba(14, 25, 52, 0.08);
}

.hero-card ul {
  margin: 0;
  padding-left: 18px;
  line-height: 2;
}

.section {
  padding: 80px 0;
}

.alt {
  background: #edf2ff;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
}

.card h3 {
  margin-top: 0;
}

.pricing-grid {
  margin-top: 20px;
}

.plan.featured {
  border: 2px solid #2d4dc7;
}

.price {
  font-size: 2rem;
  margin: 16px 0;
  font-weight: bold;
}

.chat-panel {
  max-width: 900px;
}

.chat-box {
  background: white;
  border-radius: 12px;
  padding: 18px;
  min-height: 220px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  border: 1px solid #dfe7ff;
}

.message {
  background: #eef4ff;
  padding: 12px 14px;
  border-radius: 12px;
  width: fit-content;
  max-width: 80%;
}

.message.bot {
  background: #eef4ff;
}

.chat-controls {
  display: flex;
  gap: 12px;
  margin-top: 18px;
}

.chat-controls input {
  flex: 1;
  padding: 12px 14px;
  border-radius: 10px;
  border: 1px solid #ccd7ff;
}

.chat-controls button {
  background: #2d4dc7;
  color: white;
  border: none;
  border-radius: 10px;
  padding: 12px 18px;
  font-weight: bold;
  cursor: pointer;
}

.dashboard-body {
  background: #edf2ff;
}

.dashboard-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px 0;
}

.dashboard-wrap {
  display: grid;
  grid-template-columns: 260px 1fr;
  gap: 24px;
  padding: 30px 0 80px;
}

.sidebar {
  background: #fff;
  height: fit-content;
  border-radius: 18px;
  padding: 20px;
  box-shadow: 0 12px 30px rgba(14,25,52,0.06);
}

.sidebar ul {
  list-style: none;
  padding: 0;
  margin: 20px 0 0;
  line-height: 2.4;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 18px;
  margin-bottom: 20px;
}

.stat-card h4 {
  margin: 0 0 8px;
  color: #56617c;
}

.stat-card p {
  font-size: 2rem;
  margin: 0;
  font-weight: bold;
}

@media (max-width: 700px) {
  .hero-inner,
  .dashboard-wrap {
    grid-template-columns: 1fr;
  }

  .nav {
    flex-direction: column;
    gap: 14px;
  }

  .nav-links {
    flex-wrap: wrap;
    justify-content: center;
  }
}
