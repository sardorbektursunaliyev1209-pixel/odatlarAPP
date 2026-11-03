import { useEffect, useState } from "react";
import {
  initTelegram,
  tg,
  inTelegram,
  haptic,
  setHaptic,
} from "./lib/telegram";
import { loadJSON, saveJSON } from "./lib/storage";
import { dateKey } from "./lib/habits";
import { notify } from "./lib/api";
import Home from "./screens/Home";
import AddHabit from "./screens/AddHabit";
import Detail from "./screens/Detail";
import Settings from "./screens/Settings";
import { onThemeChange } from "./lib/telegram";
export default function App() {
  const [habits, setHabits] = useState(null);
  const [settings, setSettings] = useState({ vibration: true });
  const [stack, setStack] = useState([{ name: "home" }]);
  const cur = stack[stack.length - 1];

  const push = (s) =>
    setStack((st) =>
      st[st.length - 1].name === s.name && s.name === "settings"
        ? st
        : [...st, s],
    );
  const back = () => setStack((st) => (st.length > 1 ? st.slice(0, -1) : st));
  const home = () => setStack([{ name: "home" }]);

  useEffect(() => {
    initTelegram();
    loadJSON("habits", []).then(setHabits);
    loadJSON("settings", { vibration: true }).then(setSettings);
  }, []);

  useEffect(() => {
    if (habits) saveJSON("habits", habits);
  }, [habits]);
  useEffect(() => {
    setHaptic(settings.vibration);
    saveJSON("settings", settings);
  }, [settings]);

  useEffect(() => {
    if (!inTelegram) return;
    const bb = tg.BackButton;
    if (stack.length > 1) {
      bb.show();
      bb.onClick(back);
      return () => bb.offClick(back);
    }
    bb.hide();
  }, [stack]);

  useEffect(() => {
    if (!inTelegram || !tg.isVersionAtLeast("7.0")) return;
    const open = () => push({ name: "settings" });
    tg.SettingsButton.show();
    tg.SettingsButton.onClick(open);
    return () => {
      tg.SettingsButton.offClick(open);
      tg.SettingsButton.hide();
    };
  }, []);
  useEffect(() => {
    return onThemeChange(() => {
      tg.setHeaderColor("secondary_bg_color");
      tg.setBackgroundColor("bg_color");
      if (tg.isVersionAtLeast("7.10")) tg.setBottomBarColor("bg_color");
    });
  }, []);

  function toggle(id) {
    const t = dateKey();
    const h = habits.find((x) => x.id === id);
    const completing = !h.days.includes(t);
    haptic.impact("light");
    if (completing && habits.every((x) => x.id === id || x.days.includes(t))) {
      haptic.notify("success");
      notify("Bugungi odatlar bajarildi!");
    }
    setHabits((hs) =>
      hs.map((x) =>
        x.id === id
          ? {
              ...x,
              days: completing ? [...x.days, t] : x.days.filter((d) => d !== t),
            }
          : x,
      ),
    );
  }

  if (!habits) return <div className="hint p-4">Yuklanmoqda...</div>;

  return (
    <div
      className="min-h-screen p-4 pb-28"
      style={{ paddingTop: "max(16px, env(safe-area-inset-top))" }}
    >
      {!inTelegram && (
        <div className="mb-3 flex justify-between">
          <button
            onClick={back}
            className={stack.length > 1 ? "" : "invisible"}
          >
            ← Orqaga
          </button>
          {cur.name === "home" && (
            <button onClick={() => push({ name: "settings" })}>
              ⚙ Sozlamalar
            </button>
          )}
        </div>
      )}

      {cur.name === "home" && (
        <Home
          habits={habits}
          onToggle={toggle}
          onOpen={(id) => {
            haptic.select();
            push({ name: "detail", id });
          }}
          onAdd={() => push({ name: "add" })}
        />
      )}
      {cur.name === "add" && (
        <AddHabit
          habits={habits}
          onSave={(h) => {
            setHabits((hs) => [...hs, h]);
            haptic.notify("success");
            notify("Yangi odat qo'shildi: " + h.name);
            home();
          }}
          onCancel={back}
        />
      )}
      {cur.name === "detail" && (
        <Detail
          habit={habits.find((h) => h.id === cur.id)}
          onToggle={toggle}
          onDelete={(id) => {
            setHabits((hs) => hs.filter((h) => h.id !== id));
            home();
          }}
        />
      )}
      {cur.name === "settings" && (
        <Settings settings={settings} onChange={setSettings} />
      )}
    </div>
  );
}
