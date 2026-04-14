import React, { useEffect, useMemo, useRef, useState } from "react";
import { kids } from "./data/kids";

const daysMap = {
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
};

const classStyles = {
  Registration: { emoji: "👋", bg: "#fde68a", accent: "#f59e0b", text: "#1f2937" },
  English: { emoji: "📚", bg: "#bfdbfe", accent: "#3b82f6", text: "#1f2937" },
  Maths: { emoji: "➕", bg: "#bbf7d0", accent: "#22c55e", text: "#1f2937" },
  Arabic: { emoji: "🔤", bg: "#fecdd3", accent: "#f43f5e", text: "#1f2937" },
  Phonics: { emoji: "🔊", bg: "#ddd6fe", accent: "#8b5cf6", text: "#1f2937" },
  Science: { emoji: "🔬", bg: "#a7f3d0", accent: "#10b981", text: "#1f2937" },
  Wellbeing: { emoji: "💛", bg: "#fde68a", accent: "#eab308", text: "#1f2937" },
  "Understanding of the World": { emoji: "🌍", bg: "#c7f9cc", accent: "#16a34a", text: "#1f2937" },
  default: { emoji: "⭐", bg: "#e5e7eb", accent: "#6b7280", text: "#1f2937" },
};

function getClassStyle(title) {
  return classStyles[title] || classStyles.default;
}

function formatClassTime(timeString) {
  const [h, m] = timeString.split(":").map(Number);
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return d.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function formatClockTime(date) {
  return date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
}

function isJoinWindowOpen(classItem, now) {
  if (!classItem?.date) return false;

  const diffMs = classItem.date.getTime() - now.getTime();
  const fiveMinutes = 5 * 60 * 1000;

  return diffMs <= fiveMinutes && diffMs >= -fiveMinutes;
}

function buildUpcoming(list, isOptional = false) {
  const now = new Date();
  const fiveMinutes = 5 * 60 * 1000;

  return list
    .map((cls) => {
      const [h, m] = cls.time.split(":").map(Number);
      const d = new Date(now);
      d.setHours(h, m, 0, 0);

      let diff = daysMap[cls.day] - now.getDay();

      // Keep class as current until 5 minutes after start
      if (diff < 0 || (diff === 0 && d.getTime() + fiveMinutes < now.getTime())) {
        diff += 7;
      }

      d.setDate(now.getDate() + diff);
      return { ...cls, date: d, isOptional };
    })
    .sort((a, b) => a.date - b.date);
}

function playReminderSound() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;

    const ctx = new AudioCtx();
    const notes = [740, 880, 988];
    let startAt = ctx.currentTime;

    notes.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, startAt);

      gain.gain.setValueAtTime(0.0001, startAt);
      gain.gain.exponentialRampToValueAtTime(0.12, startAt + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, startAt + 0.22);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startAt);
      osc.stop(startAt + 0.24);

      startAt += index === 1 ? 0.18 : 0.16;
    });

    setTimeout(() => {
      try {
        ctx.close();
      } catch {
        // ignore
      }
    }, 1200);
  } catch {
    // ignore
  }
}

function getReminderStorageKey(childKey, reminderType, classItem) {
  return `kid-${childKey}-reminder-${reminderType}-${classItem.title}-${classItem.date.toISOString()}`;
}

function getChildFromPath() {
  const path = window.location.pathname.toLowerCase().replace(/^\/+|\/+$/g, "");
  if (path === "laya") return "laya";
  if (path === "talia") return "talia";
  return null;
}

function ChildHome() {
  return (
    <div
      style={{
        minHeight: "100vh",
        margin: 0,
        fontFamily: "Arial, sans-serif",
        background: "linear-gradient(180deg, #0f172a 0%, #172554 100%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "16px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "700px",
          background: "rgba(255,255,255,0.12)",
          borderRadius: "32px",
          padding: "28px",
          textAlign: "center",
          backdropFilter: "blur(10px)",
          boxShadow: "0 25px 60px rgba(0,0,0,0.35)",
        }}
      >
        <div style={{ fontSize: "34px", fontWeight: "900", color: "white", marginBottom: "10px" }}>
          Choose Your School App
        </div>
        <div style={{ fontSize: "18px", color: "rgba(255,255,255,0.8)", marginBottom: "22px" }}>
          Pick your name to open your timetable
        </div>

        <div style={{ display: "grid", gap: "14px" }}>
          {Object.entries(kids).map(([key, kid]) => (
            <a
              key={key}
              href={`/${key}`}
              style={{
                display: "block",
                padding: "18px",
                borderRadius: "22px",
                background: "#ffffff",
                color: "#1f2937",
                textDecoration: "none",
                fontSize: "26px",
                fontWeight: "900",
                boxShadow: "0 12px 28px rgba(255,255,255,0.15)",
              }}
            >
              {kid.name === "Laya" ? "🌟" : "🌸"} {kid.name}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const childKey = getChildFromPath();

  if (!childKey) {
    return <ChildHome />;
  }

  const child = kids[childKey] || kids.laya;

  const [now, setNow] = useState(new Date());
  const [activeReminder, setActiveReminder] = useState(null);
  const [notificationPermission, setNotificationPermission] = useState(
    typeof Notification !== "undefined" ? Notification.permission : "unsupported"
  );
  const [highlight, setHighlight] = useState(false);
  const timeoutRef = useRef(null);

  const upcoming = useMemo(() => buildUpcoming(child.schedule, false), [child, now]);
  const next = upcoming[0];
  const style = next ? getClassStyle(next.title) : classStyles.default;

  const comingNext = useMemo(() => {
    const requiredAfterCurrent = upcoming.slice(1);
    const optionalUpcoming = buildUpcoming(child.optional, true);

    return [...requiredAfterCurrent, ...optionalUpcoming]
      .sort((a, b) => a.date - b.date)
      .slice(0, 2);
  }, [child, upcoming, now]);

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  async function enableReminders() {
    if (typeof Notification === "undefined") {
      alert("Notifications are not supported on this device/browser.");
      return;
    }

    const permission = await Notification.requestPermission();
    setNotificationPermission(permission);

    if (permission === "granted") {
      playReminderSound();
      setActiveReminder({
        title: "🎉 Reminders are on!",
        message: `${child.name} will get a heads-up before class starts.`,
      });
      setHighlight(true);

      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setActiveReminder(null);
        setHighlight(false);
      }, 3500);
    }
  }

  function showReminder(classItem, reminderType) {
    const classStyle = getClassStyle(classItem.title);

    const title =
      reminderType === "five"
        ? `${classStyle.emoji} ${classItem.title} in 5 minutes!`
        : `${classStyle.emoji} It’s time for ${classItem.title}!`;

    const body =
      reminderType === "five"
        ? `Get ready, ${child.name} — ${classItem.title} starts at ${formatClassTime(classItem.time)}.`
        : `Let’s go! Tap JOIN CLASS for ${classItem.title}.`;

    if (typeof Notification !== "undefined" && Notification.permission === "granted") {
      try {
        new Notification(title, {
          body,
          icon: "/icon-192.png",
          badge: "/icon-192.png",
        });
      } catch {
        // ignore
      }
    }

    playReminderSound();

    setActiveReminder({
      title,
      message: body,
      accent: classStyle.accent,
      bg: classStyle.bg,
      text: classStyle.text,
    });

    setHighlight(true);

    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setActiveReminder(null);
      setHighlight(false);
    }, 7000);
  }

  useEffect(() => {
    if (!next) return;

    const diff = next.date.getTime() - now.getTime();

    const fiveMinuteKey = getReminderStorageKey(childKey, "five", next);
    const startKey = getReminderStorageKey(childKey, "start", next);

    const fiveAlreadySent = localStorage.getItem(fiveMinuteKey) === "1";
    const startAlreadySent = localStorage.getItem(startKey) === "1";

    if (!fiveAlreadySent && diff <= 5 * 60 * 1000 && diff > 5 * 60 * 1000 - 15000) {
      localStorage.setItem(fiveMinuteKey, "1");
      showReminder(next, "five");
    }

    if (!startAlreadySent && diff <= 10000 && diff >= -10000) {
      localStorage.setItem(startKey, "1");
      showReminder(next, "start");
    }
  }, [childKey, next, now]);

  useEffect(() => {
    return () => clearTimeout(timeoutRef.current);
  }, []);

  const nextClassTime = next ? `${next.day} ${formatClassTime(next.time)}` : "";
  const joinEnabled = next?.link && isJoinWindowOpen(next, now);

  return (
    <>
      <style>{`
        @keyframes bounceReminder {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-8px); }
          60% { transform: translateY(-4px); }
        }

        @keyframes pulseButton {
          0% { transform: scale(1); }
          50% { transform: scale(1.06); }
          100% { transform: scale(1); }
        }
      `}</style>

      <div
        style={{
          minHeight: "100vh",
          margin: 0,
          fontFamily: "Arial, sans-serif",
          background: "linear-gradient(180deg, #0f172a 0%, #172554 100%)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "16px",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "820px",
            background: "rgba(255,255,255,0.12)",
            borderRadius: "32px",
            padding: "20px",
            textAlign: "center",
            boxShadow: highlight
              ? "0 0 70px rgba(34,197,94,0.55)"
              : "0 25px 60px rgba(0,0,0,0.35)",
            transition: "all 0.4s ease",
            backdropFilter: "blur(10px)",
            position: "relative",
          }}
        >
          {activeReminder && (
            <div
              style={{
                background: activeReminder.bg || "#fff7ed",
                color: activeReminder.text || "#1f2937",
                borderRadius: "20px",
                padding: "14px",
                marginBottom: "12px",
                boxShadow: `0 12px 26px ${(activeReminder.accent || "#f59e0b")}55`,
                animation: "bounceReminder 1.1s ease 2",
                border: `3px solid ${activeReminder.accent || "#f59e0b"}`,
              }}
            >
              <div style={{ fontSize: "20px", fontWeight: "900", marginBottom: "4px" }}>
                {activeReminder.title}
              </div>
              <div style={{ fontSize: "16px", fontWeight: "700" }}>
                {activeReminder.message}
              </div>
            </div>
          )}

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "10px",
              alignItems: "center",
              marginBottom: "12px",
              flexWrap: "wrap",
            }}
          >
            <div style={{ textAlign: "left", color: "white" }}>
              <div style={{ fontSize: "20px", fontWeight: "700" }}>Hi {child.name} 🌟</div>
              <div style={{ fontSize: "16px", opacity: 0.8 }}>Your next class is ready</div>
            </div>

            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              <a
                href="/"
                style={{
                  padding: "10px 14px",
                  borderRadius: "14px",
                  textDecoration: "none",
                  background: "#ffffff",
                  color: "#1f2937",
                  fontWeight: "800",
                  fontSize: "14px",
                }}
              >
                🏠 Home
              </a>

              <button
                onClick={enableReminders}
                style={{
                  padding: "10px 16px",
                  borderRadius: "14px",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: "800",
                  fontSize: "14px",
                  background: notificationPermission === "granted" ? "#22c55e" : "#ffffff",
                  color: notificationPermission === "granted" ? "white" : "#1f2937",
                  boxShadow:
                    notificationPermission === "granted"
                      ? "0 10px 20px rgba(34,197,94,0.22)"
                      : "0 10px 20px rgba(255,255,255,0.12)",
                }}
              >
                {notificationPermission === "granted"
                  ? "🔔 Reminders On"
                  : "🔔 Enable Reminders"}
              </button>
            </div>
          </div>

          {next && (
            <>
              <div
                style={{
                  background: style.bg,
                  color: style.text,
                  borderRadius: "24px",
                  padding: "16px 18px",
                  marginBottom: "12px",
                  boxShadow: `0 12px 26px ${style.accent}33`,
                }}
              >
                <div style={{ fontSize: "40px", marginBottom: "6px" }}>
                  {style.emoji}
                </div>

                <div
                  style={{
                    fontSize: "42px",
                    fontWeight: "900",
                    lineHeight: 1,
                    marginBottom: "8px",
                  }}
                >
                  {next.title}
                </div>

                <div
                  style={{
                    fontSize: "22px",
                    fontWeight: "700",
                    marginBottom: "4px",
                  }}
                >
                  {next.day}
                </div>

                <div
                  style={{
                    fontSize: "18px",
                    fontWeight: "700",
                  }}
                >
                  {formatClassTime(next.time)}
                </div>
              </div>

              <button
                style={{
                  width: "100%",
                  padding: "16px 18px",
                  fontSize: "24px",
                  fontWeight: "900",
                  borderRadius: "24px",
                  background: joinEnabled ? "#22c55e" : "#6b7280",
                  color: "white",
                  border: "none",
                  cursor: joinEnabled ? "pointer" : "not-allowed",
                  boxShadow: joinEnabled ? "0 12px 28px rgba(34,197,94,0.32)" : "none",
                  marginBottom: "12px",
                  animation: joinEnabled && highlight ? "pulseButton 1s infinite" : "none",
                  opacity: joinEnabled ? 1 : 0.9,
                }}
                disabled={!joinEnabled}
                onClick={() => {
                  if (joinEnabled) window.open(next.link, "_blank");
                }}
              >
                {joinEnabled ? "JOIN CLASS" : "AVAILABLE SOON"}
              </button>

              <div
                style={{
                  background: "rgba(255,255,255,0.1)",
                  borderRadius: "18px",
                  padding: "12px 14px",
                  color: "white",
                  marginBottom: "10px",
                }}
              >
                <div
                  style={{
                    fontSize: "13px",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                    opacity: 0.7,
                    marginBottom: "8px",
                  }}
                >
                  Coming Next
                </div>

                {comingNext.length > 0 ? (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                    }}
                  >
                    {comingNext.map((item, index) => (
                      <div
                        key={`${item.title}-${item.day}-${item.time}-${index}`}
                        style={{
                          background: item.isOptional
                            ? "rgba(255,255,255,0.05)"
                            : "rgba(255,255,255,0.08)",
                          border: item.isOptional
                            ? "1px dashed rgba(255,255,255,0.18)"
                            : "1px solid rgba(255,255,255,0.08)",
                          borderRadius: "14px",
                          padding: "10px 12px",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "11px",
                            textTransform: "uppercase",
                            letterSpacing: "1px",
                            opacity: 0.65,
                            marginBottom: "3px",
                          }}
                        >
                          {item.isOptional ? "Optional" : "Required"}
                        </div>

                        <div style={{ fontSize: "18px", fontWeight: "800", lineHeight: 1.2 }}>
                          {item.isOptional
                            ? item.title
                            : `${getClassStyle(item.title).emoji} ${item.title}`}
                        </div>

                        <div style={{ fontSize: "14px", opacity: 0.82, marginTop: "3px" }}>
                          {item.day} at {formatClassTime(item.time)}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ fontSize: "16px", opacity: 0.8 }}>No more classes today</div>
                )}
              </div>

              <div
                style={{
                  marginTop: "8px",
                  color: "rgba(255,255,255,0.72)",
                  fontSize: "13px",
                }}
              >
                Current time: {formatClockTime(now)} • Next: {nextClassTime}
              </div>

              <div
                style={{
                  marginTop: "6px",
                  color: "rgba(255,255,255,0.55)",
                  fontSize: "12px",
                }}
              >
                Reminders work while the app is open.
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}