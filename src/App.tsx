import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
} from "react";
import { writeText as writeNativeText } from "@tauri-apps/plugin-clipboard-manager";
import { ColorWheel } from "./components/ColorWheel";
import { SvSquare } from "./components/SvSquare";
import { Slider } from "./components/Slider";
import {
  BookmarkIcon,
  CheckIcon,
  CopyIcon,
  DiceIcon,
  ExportIcon,
  SparkleIcon,
  TrashIcon,
} from "./components/Icons";
import { useI18n } from "./i18n";
import {
  contrastRatio,
  formatHsl,
  formatRgb,
  hexToHsl,
  hslToHex,
  hslToHsv,
  hslToRgb,
  hsvToHsl,
  randomHsl,
  readableTextColor,
  type Hsl,
} from "./lib/color";
import {
  generatePalette,
  HARMONIES,
  harmonyLabelKey,
  type HarmonyId,
} from "./lib/harmonies";
import { createId, storageGet, storageSet } from "./lib/storage";
import type { Language } from "./i18n";
import "./App.css";

const STORAGE = {
  color: "color-studio:color",
  harmony: "color-studio:harmony",
  saved: "color-studio:saved",
};

const LANGUAGES: Language[] = ["ru", "en"];

type SavedPalette = {
  id: string;
  colors: string[];
  harmony: HarmonyId;
  base?: Hsl;
  createdAt: number;
};

function loadInitialHsl(): Hsl {
  const stored = storageGet<string | null>(STORAGE.color, null);
  return (stored && hexToHsl(stored)) || { h: 262, s: 78, l: 58 };
}

function loadInitialHarmony(): HarmonyId {
  const stored = storageGet<HarmonyId>(STORAGE.harmony, "complementary");
  return HARMONIES.some((item) => item.id === stored) ? stored : "complementary";
}

export default function App() {
  const { language, setLanguage, t } = useI18n();
  const [hsl, setHsl] = useState<Hsl>(loadInitialHsl);
  const [harmony, setHarmony] = useState<HarmonyId>(loadInitialHarmony);
  const [savedPalettes, setSavedPalettes] = useState<SavedPalette[]>(() =>
    storageGet<SavedPalette[]>(STORAGE.saved, []),
  );
  const [hexInput, setHexInput] = useState(() => hslToHex(loadInitialHsl()));
  const [toast, setToast] = useState<string | null>(null);

  const hsv = useMemo(() => hslToHsv(hsl), [hsl]);
  const rgb = useMemo(() => hslToRgb(hsl), [hsl]);
  const hex = useMemo(() => hslToHex(hsl), [hsl]);
  const palette = useMemo(() => generatePalette(hsl, harmony), [hsl, harmony]);
  const paletteHex = useMemo(() => palette.map(hslToHex), [palette]);

  useEffect(() => setHexInput(hex), [hex]);
  useEffect(() => storageSet(STORAGE.color, hex), [hex]);
  useEffect(() => storageSet(STORAGE.harmony, harmony), [harmony]);
  useEffect(() => storageSet(STORAGE.saved, savedPalettes), [savedPalettes]);
  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 1900);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const copyText = useCallback(
    async (text: string, message: string) => {
      let copied = false;
      try {
        // В Tauri это нативный буфер; в обычном браузере вызов упадёт — тогда используем веб-API.
        await writeNativeText(text);
        copied = true;
      } catch {
        try {
          if (!navigator.clipboard?.writeText) throw new Error("no clipboard api");
          await navigator.clipboard.writeText(text);
          copied = true;
        } catch {
          try {
            const field = document.createElement("textarea");
            field.value = text;
            field.style.position = "fixed";
            field.style.opacity = "0";
            document.body.appendChild(field);
            field.select();
            copied = document.execCommand("copy");
            field.remove();
          } catch {
            copied = false;
          }
        }
      }
      setToast(copied ? message : t("toast.copyFailed"));
    },
    [t],
  );

  const randomize = useCallback(() => {
    setHsl(randomHsl());
    setToast(t("toast.random"));
  }, [t]);

  function commitHex() {
    const parsed = hexToHsl(hexInput);
    if (parsed) {
      setHsl(parsed);
    } else {
      setHexInput(hex);
      setToast(t("toast.badHex"));
    }
  }

  function savePalette() {
    const duplicate = savedPalettes.some(
      (item) => item.harmony === harmony && item.colors.join() === paletteHex.join(),
    );
    if (duplicate) {
      setToast(t("toast.duplicate"));
      return;
    }
    setSavedPalettes((items) => [
      {
        id: createId(),
        colors: paletteHex,
        harmony,
        base: hsl,
        createdAt: Date.now(),
      },
      ...items,
    ]);
    setToast(t("toast.saved"));
  }

  function exportCss() {
    const css = `:root {\n${paletteHex.map((color, index) => `  --color-${index + 1}: ${color};`).join("\n")}\n}`;
    void copyText(css, t("toast.css"));
  }

  function loadPalette(saved: SavedPalette) {
    const base = saved.base ?? hexToHsl(saved.colors[2]);
    if (base) setHsl(base);
    setHarmony(saved.harmony);
    setToast(t("toast.loaded"));
  }

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.tagName === "INPUT" || target?.tagName === "TEXTAREA") return;
      if (event.key.toLowerCase() === "r" && !event.ctrlKey && !event.metaKey && !event.altKey) {
        randomize();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [randomize]);

  const themeStyle = {
    "--accent": hex,
    "--accent-text": readableTextColor(hex),
  } as CSSProperties;

  return (
    <div className="app" style={themeStyle}>
      <header className="topbar">
        <div className="brand">
          <div className="brand__mark" />
          <div>
            <h1>Color Studio</h1>
            <p>{t("brand.subtitle")}</p>
          </div>
        </div>
        <div className="topbar__actions">
          <div className="lang-switch" role="group" aria-label={t("language.switch")}>
            {LANGUAGES.map((item) => (
              <button
                key={item}
                className={`lang-switch__btn ${language === item ? "is-active" : ""}`}
                onClick={() => setLanguage(item)}
                aria-pressed={language === item}
              >
                {item.toUpperCase()}
              </button>
            ))}
          </div>
          <button className="btn btn--ghost" onClick={savePalette}>
            <BookmarkIcon /> {t("action.save")}
          </button>
          <button className="btn btn--ghost" onClick={exportCss}>
            <ExportIcon /> {t("action.exportCss")}
          </button>
        </div>
      </header>

      <main className="layout">
        <section className="card editor">
          <div className="section-head">
            <span className="eyebrow">{t("section.color")}</span>
            <h2>{t("title.colorWheel")}</h2>
          </div>

          <div className="picker">
            <ColorWheel
              hue={hsl.h}
              color={hex}
              onChange={(hue) => setHsl((current) => ({ ...current, h: hue }))}
            />
            <div className="picker__side">
              <SvSquare
                hue={hsl.h}
                saturation={hsv.s}
                value={hsv.v}
                onChange={(saturation, value) =>
                  setHsl((current) => ({
                    ...hsvToHsl({ h: current.h, s: saturation, v: value }),
                    h: current.h,
                  }))
                }
              />
              <div className="preview" style={{ background: hex, color: readableTextColor(hex) }}>
                <span className="preview__label">{t("preview.label")}</span>
                <strong className="preview__sample">Aa</strong>
                <span className="preview__contrast">
                  {t("preview.contrast", { value: contrastRatio(hex, "#FFFFFF").toFixed(1) })}
                </span>
              </div>
            </div>
          </div>

          <div className="sliders">
            <Slider
              label={t("slider.h")}
              value={hsl.h}
              max={360}
              display={`${Math.round(hsl.h)}°`}
              gradient="linear-gradient(to right, #ff5252, #ffd152, #52ff68, #52e0ff, #5268ff, #d752ff, #ff5252)"
              onChange={(hue) => setHsl((current) => ({ ...current, h: hue }))}
            />
            <Slider
              label={t("slider.s")}
              value={hsl.s}
              max={100}
              display={`${Math.round(hsl.s)}%`}
              gradient={`linear-gradient(to right, ${hslToHex({ ...hsl, s: 0 })}, ${hslToHex({ ...hsl, s: 100 })})`}
              onChange={(s) => setHsl((current) => ({ ...current, s }))}
            />
            <Slider
              label={t("slider.l")}
              value={hsl.l}
              max={100}
              display={`${Math.round(hsl.l)}%`}
              gradient={`linear-gradient(to right, #000000, ${hslToHex({ ...hsl, l: 50 })}, #ffffff)`}
              onChange={(l) => setHsl((current) => ({ ...current, l }))}
            />
          </div>

          <div className="values">
            <label className="hex-field">
              <span>{t("field.hex")}</span>
              <input
                value={hexInput}
                spellCheck={false}
                maxLength={7}
                onChange={(event) => setHexInput(event.target.value)}
                onBlur={commitHex}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    commitHex();
                    event.currentTarget.blur();
                  }
                }}
              />
            </label>
            <div className="readout">
              <span>{t("field.rgb")}</span>
              <strong>{formatRgb(rgb)}</strong>
            </div>
            <div className="readout">
              <span>{t("field.hsl")}</span>
              <strong>{formatHsl(hsl)}</strong>
            </div>
          </div>
        </section>

        <section className="card palette-card">
          <div className="section-head section-head--row">
            <div>
              <span className="eyebrow">{t("section.harmony")}</span>
              <h2>{t("title.palette")}</h2>
            </div>
            <button className="btn btn--primary" onClick={randomize}>
              <DiceIcon /> {t("action.random")} <kbd>R</kbd>
            </button>
          </div>

          <div className="harmony-chips">
            {HARMONIES.map((item) => (
              <span className="chip-wrap" key={item.id}>
                <button
                  className={`chip ${harmony === item.id ? "chip--active" : ""}`}
                  onClick={() => setHarmony(item.id)}
                  aria-describedby={`chip-tip-${item.id}`}
                >
                  {t(item.labelKey)}
                </button>
                <span
                  className="chip-tooltip"
                  id={`chip-tip-${item.id}`}
                  role="tooltip"
                >
                  <strong>
                    {t(item.labelKey)} · {t(item.hintKey)}
                  </strong>
                  {t(item.descKey)}
                </span>
              </span>
            ))}
          </div>

          <div className="swatches">
            {paletteHex.map((color, index) => (
              <div
                className="swatch"
                key={`${index}-${color}`}
                style={{ background: color, color: readableTextColor(color) }}
              >
                <button
                  className="swatch__main"
                  onClick={() => setHsl(palette[index])}
                  title={t("swatch.setBase")}
                >
                  <span className="swatch__index">{String(index + 1).padStart(2, "0")}</span>
                  <span className="swatch__info">
                    <strong>{color}</strong>
                    <small>{formatRgb(hslToRgb(palette[index]))}</small>
                  </span>
                </button>
                <button
                  className="swatch__copy"
                  onClick={() => void copyText(color, t("toast.copied", { hex: color }))}
                  title={t("swatch.copy")}
                >
                  <CopyIcon />
                </button>
              </div>
            ))}
          </div>

          <div className="palette-note">
            <SparkleIcon />
            <span>
              {t("palette.note", { scheme: t(harmonyLabelKey(harmony)) })}
            </span>
          </div>

          <div className="saved">
            <div className="saved__head">
              <h3>{t("saved.title")}</h3>
              <span>{savedPalettes.length}</span>
            </div>
            {savedPalettes.length === 0 ? (
              <p className="saved__empty">{t("saved.empty")}</p>
            ) : (
              <div className="saved__list">
                {savedPalettes.map((saved) => (
                  <div className="saved-item" key={saved.id}>
                    <div className="saved-item__colors">
                      {saved.colors.map((color, index) => (
                        <span key={`${saved.id}-${index}`} style={{ background: color }} />
                      ))}
                    </div>
                    <div className="saved-item__meta">
                      <strong>{t(harmonyLabelKey(saved.harmony))}</strong>
                      <small>{saved.colors.slice(0, 3).join(" · ")}</small>
                    </div>
                    <button
                      className="icon-btn"
                      onClick={() => loadPalette(saved)}
                      title={t("action.load")}
                    >
                      <CheckIcon />
                    </button>
                    <button
                      className="icon-btn icon-btn--danger"
                      onClick={() =>
                        setSavedPalettes((items) => items.filter((item) => item.id !== saved.id))
                      }
                      title={t("action.delete")}
                    >
                      <TrashIcon />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <footer className="footer">
        <span>{t("footer.brand")}</span>
        <span>{t("footer.hint", { key: "R" })}</span>
      </footer>

      <div className={`toast ${toast ? "toast--visible" : ""}`}>{toast}</div>
    </div>
  );
}
