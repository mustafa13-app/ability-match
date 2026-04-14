import React, { useEffect, useMemo, useRef, useState } from "react";

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
  default: { emoji: "⭐", bg: "#e5e7eb", accent: "#6b7280", text: "#1f2937" },
};

const kids = {
  laya: {
    name: "Laya",
    schedule: [
      { day: "Monday", time: "08:30", title: "Registration", link: "https://us06web.zoom.us/j/83324290741?pwd=oT0UXnumxF6CRZU9J6RHQPwHPEOT1y.1" },
      { day: "Monday", time: "09:40", title: "English", link: "https://us06web.zoom.us/j/83324290741?pwd=oT0UXnumxF6CRZU9J6RHQPwHPEOT1y.1" },
      { day: "Monday", time: "11:30", title: "Maths", link: "https://us06web.zoom.us/j/83324290741?pwd=oT0UXnumxF6CRZU9J6RHQPwHPEOT1y.1" },
      { day: "Monday", time: "12:50", title: "Arabic", link: "" },
      { day: "Monday", time: "13:40", title: "Phonics", link: "https://us06web.zoom.us/j/83324290741?pwd=oT0UXnumxF6CRZU9J6RHQPwHPEOT1y.1" },

      { day: "Tuesday", time: "08:30", title: "Registration", link: "https://us06web.zoom.us/j/83324290741?pwd=oT0UXnumxF6CRZU9J6RHQPwHPEOT1y.1" },
      { day: "Tuesday", time: "09:40", title: "Maths", link: "https://us06web.zoom.us/j/83324290741?pwd=oT0UXnumxF6CRZU9J6RHQPwHPEOT1y.1" },
      { day: "Tuesday", time: "11:30", title: "English", link: "https://us06web.zoom.us/j/83324290741?pwd=oT0UXnumxF6CRZU9J6RHQPwHPEOT1y.1" },
      { day: "Tuesday", time: "12:50", title: "Arabic", link: "" },
      { day: "Tuesday", time: "13:40", title: "Phonics", link: "https://us06web.zoom.us/j/83324290741?pwd=oT0UXnumxF6CRZU9J6RHQPwHPEOT1y.1" },

      { day: "Wednesday", time: "08:30", title: "Registration", link: "https://us06web.zoom.us/j/83324290741?pwd=oT0UXnumxF6CRZU9J6RHQPwHPEOT1y.1" },
      { day: "Wednesday", time: "09:40", title: "English", link: "https://us06web.zoom.us/j/83324290741?pwd=oT0UXnumxF6CRZU9J6RHQPwHPEOT1y.1" },
      { day: "Wednesday", time: "11:30", title: "Maths", link: "https://us06web.zoom.us/j/83324290741?pwd=oT0UXnumxF6CRZU9J6RHQPwHPEOT1y.1" },
      { day: "Wednesday", time: "13:40", title: "Phonics", link: "https://us06web.zoom.us/j/83324290741?pwd=oT0UXnumxF6CRZU9J6RHQPwHPEOT1y.1" },

      { day: "Thursday", time: "08:30", title: "Registration", link: "https://us06web.zoom.us/j/83324290741?pwd=oT0UXnumxF6CRZU9J6RHQPwHPEOT1y.1" },
      { day: "Thursday", time: "09:40", title: "Maths", link: "https://us06web.zoom.us/j/83324290741?pwd=oT0UXnumxF6CRZU9J6RHQPwHPEOT1y.1" },
      { day: "Thursday", time: "11:30", title: "English", link: "https://us06web.zoom.us/j/83324290741?pwd=oT0UXnumxF6CRZU9J6RHQPwHPEOT1y.1" },
      { day: "Thursday", time: "12:50", title: "Arabic", link: "" },
      { day: "Thursday", time: "13:40", title: "Phonics", link: "https://us06web.zoom.us/j/83324290741?pwd=oT0UXnumxF6CRZU9J6RHQPwHPEOT1y.1" },

      { day: "Friday", time: "08:00", title: "Registration", link: "https://us06web.zoom.us/j/83324290741?pwd=oT0UXnumxF6CRZU9J6RHQPwHPEOT1y.1" },
      { day: "Friday", time: "09:10", title: "Science", link: "" },
    ],
    optional: [
      { day: "Monday", time: "08:00", title: "PE", type: "live" },
      { day: "Monday", time: "08:50", title: "Art", type: "activity" },
      { day: "Monday", time: "10:40", title: "Non-screen Time Choices", type: "activity" },
      { day: "Monday", time: "14:30", title: "PE", type: "live" },

      { day: "Tuesday", time: "08:50", title: "Music", type: "activity" },
      { day: "Tuesday", time: "10:40", title: "Performing Arts", type: "activity" },

      { day: "Wednesday", time: "08:50", title: "PE", type: "activity" },
      { day: "Wednesday", time: "10:40", title: "Stem / Computing", type: "activity" },
      { day: "Wednesday", time: "12:50", title: "MFL", type: "activity" },

      { day: "Thursday", time: "08:50", title: "Islamic / PSHCE", type: "activity" },
      { day: "Thursday", time: "10:40", title: "Spelling & Handwriting", type: "activity" },

      { day: "Friday", time: "08:20", title: "Maths Choice Board", type: "activity" },
      { day: "Friday", time: "11:00", title: "Class Assembly", type: "live" },
      { day: "Friday", time: "14:30", title: "PE", type: "live" },
    ],
  },

  talia: {
    name: "Talia",
    schedule: [
      { day: "Monday", time: "08:30", title: "Registration", link: "https://us06web.zoom.us/j/5208959517?pwd=IbeSjtSr26VzXNRjjbb443mvJETFxu.1&omn=87184112838" },
      { day: "Monday", time: "09:40", title: "Phonics", link: "https://us06web.zoom.us/j/5208959517?pwd=IbeSjtSr26VzXNRjjbb443mvJETFxu.1&omn=87184112838" },
      { day: "Monday", time: "11:30", title: "Wellbeing", link: "https://us06web.zoom.us/j/5208959517?pwd=IbeSjtSr26VzXNRjjbb443mvJETFxu.1&omn=87184112838" },
      { day: "Monday", time: "12:50", title: "Arabic", link: "https://us06web.zoom.us/j/81683839837?pwd=LlOt9oGTBQLmWmtQEPEKkE40bPwofp.1" },

      { day: "Tuesday", time: "08:30", title: "Registration", link: "https://us06web.zoom.us/j/5208959517?pwd=IbeSjtSr26VzXNRjjbb443mvJETFxu.1&omn=87184112838" },
      { day: "Tuesday", time: "09:40", title: "Phonics", link: "https://us06web.zoom.us/j/5208959517?pwd=IbeSjtSr26VzXNRjjbb443mvJETFxu.1&omn=87184112838" },
      { day: "Tuesday", time: "11:30", title: "Wellbeing", link: "https://us06web.zoom.us/j/5208959517?pwd=IbeSjtSr26VzXNRjjbb443mvJETFxu.1&omn=87184112838" },
      { day: "Tuesday", time: "12:50", title: "Arabic", link: "https://us06web.zoom.us/j/81683839837?pwd=LlOt9oGTBQLmWmtQEPEKkE40bPwofp.1" },

      { day: "Wednesday", time: "08:30", title: "Registration", link: "https://us06web.zoom.us/j/5208959517?pwd=IbeSjtSr26VzXNRjjbb443mvJETFxu.1&omn=87184112838" },
      { day: "Wednesday", time: "09:40", title: "Phonics", link: "https://us06web.zoom.us/j/5208959517?pwd=IbeSjtSr26VzXNRjjbb443mvJETFxu.1&omn=87184112838" },
      { day: "Wednesday", time: "11:30", title: "Wellbeing", link: "https://us06web.zoom.us/j/5208959517?pwd=IbeSjtSr26VzXNRjjbb443mvJETFxu.1&omn=87184112838" },
      { day: "Wednesday", time: "12:50", title: "Arabic", link: "https://us06web.zoom.us/j/81683839837?pwd=LlOt9oGTBQLmWmtQEPEKkE40bPwofp.1" },

      { day: "Thursday", time: "08:30", title: "Registration", link: "https://us06web.zoom.us/j/5208959517?pwd=IbeSjtSr26VzXNRjjbb443mvJETFxu.1&omn=87184112838" },
      { day: "Thursday", time: "09:40", title: "Phonics", link: "https://us06web.zoom.us/j/5208959517?pwd=IbeSjtSr26VzXNRjjbb443mvJETFxu.1&omn=87184112838" },
      { day: "Thursday", time: "11:30", title: "Wellbeing", link: "https://us06web.zoom.us/j/5208959517?pwd=IbeSjtSr26VzXNRjjbb443mvJETFxu.1&omn=87184112838" },
      { day: "Thursday", time: "12:50", title: "Arabic", link: "https://us06web.zoom.us/j/81683839837?pwd=LlOt9oGTBQLmWmtQEPEKkE40bPwofp.1" },

      { day: "Friday", time: "08:30", title: "Registration", link: "https://us06web.zoom.us/j/5208959517?pwd=IbeSjtSr26VzXNRjjbb443mvJETFxu.1&omn=87184112838" },
    ],
    optional: [
      { day: "Monday", time: "08:00", title: "PE", type: "live" },
      { day: "Monday", time: "09:00", title: "Choice Board", type: "activity" },
      { day: "Monday", time: "11:30", title: "Art", type: "activity" },

      { day: "Tuesday", time: "09:40", title: "Choice Board", type: "activity" },
      { day: "Tuesday", time: "11:30", title: "PE", type: "activity" },
      { day: "Tuesday", time: "12:30", title: "Music", type: "activity" },
      { day: "Tuesday", time: "14:30", title: "PE", type: "live" },

      { day: "Wednesday", time: "09:00", title: "Choice Board", type: "activity" },
      { day: "Wednesday", time: "12:30", title: "Music", type: "activity" },

      { day: "Thursday", time: "09:40", title: "Choice Board", type: "activity" },
      { day: "Thursday", time: "12:30", title: "Art", type: "activity" },
      { day: "Thursday", time: "14:30", title: "PE", type: "live" },
    ],
  },
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

function buildUpcoming(list, isOptional = false) {
  const now = new Date();

  return list
    .map((cls) => {
      const [h, m] = cls.time.split(":").map(Number);
      const d = new Date(now);
      d.setHours(h, m, 0, 0);

      let diff = daysMap[cls.day] - now.getDay();
      if (diff < 0 || (diff === 0 && d < now)) diff += 7;

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
  if (path === "talia") return "talia";
  return "laya";
}

export default function App() {
  const childKey = getChildFromPath();
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
                  background: next.link ? "#22c55e" : "#6b7280",
                  color: "white",
                  border: "none",
                  cursor: next.link ? "pointer" : "not-allowed",
                  boxShadow: next.link ? "0 12px 28px rgba(34,197,94,0.32)" : "none",
                  marginBottom: "12px",
                  animation: highlight ? "pulseButton 1s infinite" : "none",
                }}
                disabled={!next.link}
                onClick={() => window.open(next.link, "_blank")}
              >
                JOIN CLASS
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