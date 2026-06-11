"use client";

import { useEffect, useState } from "react";
import {
  FiCalendar,
  FiExternalLink,
  FiFileText,
  FiFolderPlus,
  FiLink,
  FiLock,
} from "react-icons/fi";
import { RESOURCES, type ResourceType } from "./goteamData";
import styles from "./GoTeamContent.module.css";

// Dane logowania. UWAGA: to jest statyczna strona (output: "export"),
// więc weryfikacja odbywa się w przeglądarce i NIE jest realnym
// zabezpieczeniem – chroni jedynie przed przypadkowym wejściem.
const LOGIN = "PCW";
const PASSWORD = "PCW";
const STORAGE_KEY = "goteam-auth";

function ResourceIcon({ type }: { type: ResourceType }) {
  switch (type) {
    case "drive":
      return <FiFolderPlus aria-hidden />;
    case "sheet":
      return <FiCalendar aria-hidden />;
    case "doc":
      return <FiFileText aria-hidden />;
    default:
      return <FiLink aria-hidden />;
  }
}

export default function GoTeamContent() {
  const [authed, setAuthed] = useState(false);
  const [ready, setReady] = useState(false);
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  // Po wejściu sprawdź, czy w tej sesji już zalogowano.
  useEffect(() => {
    if (typeof window !== "undefined") {
      setAuthed(window.sessionStorage.getItem(STORAGE_KEY) === "1");
    }
    setReady(true);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login.trim() === LOGIN && password.trim() === PASSWORD) {
      window.sessionStorage.setItem(STORAGE_KEY, "1");
      setAuthed(true);
      setError(false);
    } else {
      setError(true);
    }
  };

  const handleLogout = () => {
    window.sessionStorage.removeItem(STORAGE_KEY);
    setAuthed(false);
    setLogin("");
    setPassword("");
  };

  // Zanim odczytamy sessionStorage, nie renderuj nic (uniknięcie mignięcia).
  if (!ready) return null;

  if (!authed) {
    return (
      <main className={styles.gate}>
        <form className={styles.card} onSubmit={handleSubmit}>
          <span className={styles.lockIcon} aria-hidden>
            <FiLock />
          </span>
          <p className={styles.kicker}>Alvernia Planet</p>
          <h1 className={styles.gateTitle}>GoTeam</h1>
          <p className={styles.gateLead}>
            Panel wewnętrzny zespołu. Zaloguj się, aby zobaczyć zasoby.
          </p>

          <label className={styles.field}>
            <span className={styles.label}>Login</span>
            <input
              className={styles.input}
              type="text"
              value={login}
              onChange={(e) => {
                setLogin(e.target.value);
                setError(false);
              }}
              autoComplete="username"
              autoFocus
            />
          </label>

          <label className={styles.field}>
            <span className={styles.label}>Hasło</span>
            <input
              className={styles.input}
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(false);
              }}
              autoComplete="current-password"
            />
          </label>

          {error && (
            <p className={styles.error} role="alert">
              Nieprawidłowy login lub hasło.
            </p>
          )}

          <button className={styles.submit} type="submit">
            Zaloguj się
          </button>
        </form>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <div className={styles.intro}>
        <p className={styles.kicker}>Alvernia Planet</p>
        <h1 className={styles.title}>GoTeam</h1>
        <p className={styles.lead}>
          Zasoby zespołu w jednym miejscu. Kliknij kafelek, aby otworzyć.
        </p>
        <button
          type="button"
          className={styles.logout}
          onClick={handleLogout}
        >
          Wyloguj
        </button>
      </div>

      <div className={styles.grid}>
        {RESOURCES.map((r) => (
          <a
            key={r.id}
            className={styles.tile}
            href={r.href}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className={styles.tileIcon}>
              <ResourceIcon type={r.type} />
            </span>
            <span className={styles.tileBody}>
              <span className={styles.tileTitle}>{r.title}</span>
              <span className={styles.tileDesc}>{r.desc}</span>
            </span>
            <span className={styles.tileArrow} aria-label={r.cta}>
              <FiExternalLink aria-hidden />
            </span>
          </a>
        ))}
      </div>
    </main>
  );
}
