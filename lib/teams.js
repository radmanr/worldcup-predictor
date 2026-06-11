// Maps the English team name stored in the database to a Persian name + flag emoji.
export const TEAMS = {
  "Mexico": { fa: "مکزیک", flag: "🇲🇽" },
  "South Africa": { fa: "آفریقای جنوبی", flag: "🇿🇦" },
  "South Korea": { fa: "کره جنوبی", flag: "🇰🇷" },
  "Czechia": { fa: "جمهوری چک", flag: "🇨🇿" },
  "Canada": { fa: "کانادا", flag: "🇨🇦" },
  "Bosnia and Herzegovina": { fa: "بوسنی و هرزگوین", flag: "🇧🇦" },
  "Qatar": { fa: "قطر", flag: "🇶🇦" },
  "Switzerland": { fa: "سوئیس", flag: "🇨🇭" },
  "Brazil": { fa: "برزیل", flag: "🇧🇷" },
  "Morocco": { fa: "مراکش", flag: "🇲🇦" },
  "Haiti": { fa: "هائیتی", flag: "🇭🇹" },
  "Scotland": { fa: "اسکاتلند", flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿" },
  "United States": { fa: "ایالات متحده", flag: "🇺🇸" },
  "Paraguay": { fa: "پاراگوئه", flag: "🇵🇾" },
  "Australia": { fa: "استرالیا", flag: "🇦🇺" },
  "Türkiye": { fa: "ترکیه", flag: "🇹🇷" },
  "Germany": { fa: "آلمان", flag: "🇩🇪" },
  "Curaçao": { fa: "کوراسائو", flag: "🇨🇼" },
  "Ivory Coast": { fa: "ساحل عاج", flag: "🇨🇮" },
  "Ecuador": { fa: "اکوادور", flag: "🇪🇨" },
  "Netherlands": { fa: "هلند", flag: "🇳🇱" },
  "Japan": { fa: "ژاپن", flag: "🇯🇵" },
  "Sweden": { fa: "سوئد", flag: "🇸🇪" },
  "Tunisia": { fa: "تونس", flag: "🇹🇳" },
  "Belgium": { fa: "بلژیک", flag: "🇧🇪" },
  "Egypt": { fa: "مصر", flag: "🇪🇬" },
  "Iran": { fa: "ایران", flag: "🇮🇷" },
  "New Zealand": { fa: "نیوزیلند", flag: "🇳🇿" },
  "Spain": { fa: "اسپانیا", flag: "🇪🇸" },
  "Cape Verde": { fa: "کیپ ورد", flag: "🇨🇻" },
  "Saudi Arabia": { fa: "عربستان سعودی", flag: "🇸🇦" },
  "Uruguay": { fa: "اروگوئه", flag: "🇺🇾" },
  "France": { fa: "فرانسه", flag: "🇫🇷" },
  "Senegal": { fa: "سنگال", flag: "🇸🇳" },
  "Iraq": { fa: "عراق", flag: "🇮🇶" },
  "Norway": { fa: "نروژ", flag: "🇳🇴" },
  "Argentina": { fa: "آرژانتین", flag: "🇦🇷" },
  "Algeria": { fa: "الجزایر", flag: "🇩🇿" },
  "Austria": { fa: "اتریش", flag: "🇦🇹" },
  "Jordan": { fa: "اردن", flag: "🇯🇴" },
  "Portugal": { fa: "پرتغال", flag: "🇵🇹" },
  "DR Congo": { fa: "کنگو دموکراتیک", flag: "🇨🇩" },
  "Uzbekistan": { fa: "ازبکستان", flag: "🇺🇿" },
  "Colombia": { fa: "کلمبیا", flag: "🇨🇴" },
  "England": { fa: "انگلیس", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" },
  "Croatia": { fa: "کرواسی", flag: "🇭🇷" },
  "Ghana": { fa: "غنا", flag: "🇬🇭" },
  "Panama": { fa: "پاناما", flag: "🇵🇦" },
};

// Returns "🇧🇷 برزیل" (flag + Persian name), falling back to the raw name.
export function teamLabel(name) {
  const t = TEAMS[name];
  return t ? `${t.flag} ${t.fa}` : name;
}

export function teamFlag(name) {
  return TEAMS[name]?.flag || "";
}

export function teamFa(name) {
  return TEAMS[name]?.fa || name;
}
