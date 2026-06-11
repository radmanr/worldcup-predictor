// Persian (Eastern Arabic) numeral helpers and localized date/time formatting.

const FA_DIGITS = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

// Convert any Western digits in a string/number to Persian digits.
export function toFa(input) {
  return String(input).replace(/[0-9]/g, (d) => FA_DIGITS[+d]);
}

// Group letters A–L → Persian-friendly group labels (kept as Latin letters,
// which are universally recognised for World Cup groups).
export function groupLabel(letter) {
  return `گروه ${letter}`;
}

// Full day heading, e.g. "پنج‌شنبه ۱۱ ژوئن ۲۰۲۶" (Persian text, Gregorian calendar).
const DAY_FMT = new Intl.DateTimeFormat("fa-IR-u-ca-gregory", {
  weekday: "long", year: "numeric", month: "long", day: "numeric",
  timeZone: "Asia/Tehran",
});

// Kickoff time, e.g. "۱۵:۰۰".
const TIME_FMT = new Intl.DateTimeFormat("fa-IR-u-ca-gregory", {
  hour: "2-digit", minute: "2-digit", hour12: false,
  timeZone: "Asia/Tehran",
});

// Short date+time for admin list.
const DT_FMT = new Intl.DateTimeFormat("fa-IR-u-ca-gregory", {
  weekday: "short", month: "short", day: "numeric",
  hour: "2-digit", minute: "2-digit", hour12: false,
  timeZone: "Asia/Tehran",
});

export function formatDay(date) {
  return DAY_FMT.format(date);
}
export function formatTime(date) {
  return TIME_FMT.format(date);
}
export function formatDateTime(date) {
  return DT_FMT.format(date);
}
