export const ru = {
  "brand.subtitle": "Гармонии цвета для дизайна",

  "language.switch": "Язык интерфейса",
  "language.ru": "RU",
  "language.en": "EN",

  "action.save": "Сохранить",
  "action.exportCss": "Экспорт CSS",
  "action.random": "Рандом",
  "action.load": "Загрузить палитру",
  "action.delete": "Удалить палитру",

  "section.color": "01 / Выбор цвета",
  "section.harmony": "02 / Гармонии",
  "title.colorWheel": "Цветовое колесо",
  "title.palette": "Палитра",

  "wheel.selected": "ВЫБРАННЫЙ ЦВЕТ",
  "wheel.aria": "Цветовое колесо: перетащите, чтобы выбрать оттенок",
  "sv.title": "Насыщенность / яркость",
  "sv.aria": "Насыщенность и яркость",

  "preview.label": "Как выглядит текст",
  "preview.contrast": "контраст с белым {value}:1",

  "slider.h": "Оттенок (H)",
  "slider.s": "Насыщенность (S)",
  "slider.l": "Светлота (L)",
  "field.hex": "HEX",
  "field.rgb": "RGB",
  "field.hsl": "HSL",

  "palette.note":
    "Схема: {scheme}. Нажмите на цвет, чтобы сделать его основой, или на иконку копирования, чтобы скопировать HEX.",
  "swatch.setBase": "Сделать базовым цветом",
  "swatch.copy": "Копировать HEX",

  "saved.title": "Сохранённые палитры",
  "saved.empty": "Пока пусто. Нажмите «Сохранить», чтобы добавить текущую палитру.",

  "footer.brand": "Color Studio · Tauri",
  "footer.hint": "Подсказка: клавиша {key} — случайная палитра",

  "toast.random": "Новая случайная палитра",
  "toast.badHex": "Неверный HEX-код",
  "toast.duplicate": "Такая палитра уже сохранена",
  "toast.saved": "Палитра сохранена",
  "toast.css": "CSS-переменные скопированы",
  "toast.loaded": "Палитра загружена",
  "toast.copied": "{hex} скопирован",
  "toast.copyFailed": "Не удалось скопировать",

  "harmony.complementary.label": "Комплиментарные",
  "harmony.complementary.hint": "180° · контраст",
  "harmony.complementary.desc":
    "Базовый цвет и цвет напротив него на колесе (180°). Максимальный контраст; остальные три цвета — светлые и приглушённые варианты этой пары.",
  "harmony.split.label": "Расщеплённые",
  "harmony.split.hint": "150° / 210°",
  "harmony.split.desc":
    "Базовый цвет и два оттенка по бокам от его дополнения (150° и 210°). Контраст мягче, чем у комплиментарной пары.",
  "harmony.analogous.label": "Аналогичные",
  "harmony.analogous.hint": "соседние оттенки",
  "harmony.analogous.desc":
    "Пять соседних оттенков в пределах ±40° от базового. Даёт спокойный, цельный переход.",
  "harmony.triadic.label": "Триада",
  "harmony.triadic.hint": "120° · три цвета",
  "harmony.triadic.desc":
    "Три цвета, равномерно расположенные на колесе через 120°. Яркая, но сбалансированная схема.",
  "harmony.tetradic.label": "Тетрада",
  "harmony.tetradic.hint": "60° / 180° / 240°",
  "harmony.tetradic.desc":
    "Четыре оттенка на расстоянии 60°, 180° и 240° от базового. Богатая палитра с двумя контрастными парами.",
  "harmony.square.label": "Квадрат",
  "harmony.square.hint": "90° · четыре цвета",
  "harmony.square.desc":
    "Четыре цвета через равные интервалы 90°. Ритмичная схема без единого доминирующего цвета.",
  "harmony.monochromatic.label": "Монохром",
  "harmony.monochromatic.hint": "один оттенок",
  "harmony.monochromatic.desc":
    "Один оттенок в пяти градациях светлоты. Подходит для минималистичных интерфейсов.",
} satisfies Record<string, string>;

export type TranslationKey = keyof typeof ru;

export const en: Record<TranslationKey, string> = {
  "brand.subtitle": "Color harmonies for design",

  "language.switch": "Interface language",
  "language.ru": "RU",
  "language.en": "EN",

  "action.save": "Save",
  "action.exportCss": "Export CSS",
  "action.random": "Random",
  "action.load": "Load palette",
  "action.delete": "Delete palette",

  "section.color": "01 / Pick a color",
  "section.harmony": "02 / Harmonies",
  "title.colorWheel": "Color wheel",
  "title.palette": "Palette",

  "wheel.selected": "SELECTED COLOR",
  "wheel.aria": "Color wheel: drag to pick a hue",
  "sv.title": "Saturation / brightness",
  "sv.aria": "Saturation and brightness",

  "preview.label": "How the text looks",
  "preview.contrast": "contrast with white {value}:1",

  "slider.h": "Hue (H)",
  "slider.s": "Saturation (S)",
  "slider.l": "Lightness (L)",
  "field.hex": "HEX",
  "field.rgb": "RGB",
  "field.hsl": "HSL",

  "palette.note":
    "Scheme: {scheme}. Click a color to make it the base, or the copy icon to copy its HEX.",
  "swatch.setBase": "Make this the base color",
  "swatch.copy": "Copy HEX",

  "saved.title": "Saved palettes",
  "saved.empty": "Nothing here yet. Click “Save” to add the current palette.",

  "footer.brand": "Color Studio · Tauri",
  "footer.hint": "Tip: press {key} for a random palette",

  "toast.random": "New random palette",
  "toast.badHex": "Invalid HEX code",
  "toast.duplicate": "This palette is already saved",
  "toast.saved": "Palette saved",
  "toast.css": "CSS variables copied",
  "toast.loaded": "Palette loaded",
  "toast.copied": "{hex} copied",
  "toast.copyFailed": "Could not copy",

  "harmony.complementary.label": "Complementary",
  "harmony.complementary.hint": "180° · high contrast",
  "harmony.complementary.desc":
    "The base color and its opposite on the wheel (180°). Maximum contrast; the other three shades are lighter, muted variations of that pair.",
  "harmony.split.label": "Split complementary",
  "harmony.split.hint": "150° / 210°",
  "harmony.split.desc":
    "The base color plus the two hues adjacent to its complement (150° and 210°). Softer contrast than a straight complementary pair.",
  "harmony.analogous.label": "Analogous",
  "harmony.analogous.hint": "neighboring hues",
  "harmony.analogous.desc":
    "Five neighboring hues within ±40° of the base. Creates a calm, cohesive gradient.",
  "harmony.triadic.label": "Triadic",
  "harmony.triadic.hint": "120° · three colors",
  "harmony.triadic.desc":
    "Three colors evenly spaced 120° apart on the wheel. Bright yet balanced.",
  "harmony.tetradic.label": "Tetradic",
  "harmony.tetradic.hint": "60° / 180° / 240°",
  "harmony.tetradic.desc":
    "Four hues at 60°, 180° and 240° from the base. A rich scheme with two contrasting pairs.",
  "harmony.square.label": "Square",
  "harmony.square.hint": "90° · four colors",
  "harmony.square.desc":
    "Four colors spaced evenly at 90°. A rhythmic scheme with no single dominant color.",
  "harmony.monochromatic.label": "Monochromatic",
  "harmony.monochromatic.hint": "single hue",
  "harmony.monochromatic.desc":
    "One hue in five lightness steps. Ideal for minimal interfaces.",
};

export const dictionaries = { ru, en } as const;
export type Language = keyof typeof dictionaries;

export const LANGUAGE_STORAGE_KEY = "color-studio:language";

export function translate(
  language: Language,
  key: TranslationKey,
  params?: Record<string, string | number>,
): string {
  const template = dictionaries[language][key];
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (match, name: string) =>
    Object.prototype.hasOwnProperty.call(params, name) ? String(params[name]) : match,
  );
}
