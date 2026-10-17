import { PrayerKey, PrayerTime } from '../types';

// Coordinates for Masjid Ar-Rohmah, Rangkasbitung, Kabupaten Lebak, Banten
export const RANGKASBITUNG_COORDS = {
  latitude: -6.3615,
  longitude: 106.2486,
  timezone: 7, // UTC+7 (WIB)
  elevation: 25, // meters
  qiblaBearing: 295.2, // degrees from true North clockwise
  distanceToKaabaKm: 7922,
};

// Iqamah delays in minutes from adhan
export const DEFAULT_IQAMAH_DELAYS: Record<PrayerKey, number> = {
  imsak: 0,
  subuh: 12,
  terbit: 0,
  dhuha: 0,
  dzuhur: 10,
  ashar: 10,
  maghrib: 8,
  isya: 10,
};

/**
 * High-precision astronomical prayer calculation following the
 * standard criteria of the Ministry of Religious Affairs Republic of Indonesia (Kemenag RI)
 */
export function calculatePrayerTimes(date: Date = new Date(), ihtiyatMinutes = 2): PrayerTime[] {
  const lat = RANGKASBITUNG_COORDS.latitude;
  const lng = RANGKASBITUNG_COORDS.longitude;
  const tz = RANGKASBITUNG_COORDS.timezone;

  // Julian Day
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  let a = Math.floor((14 - month) / 12);
  let y = year + 4800 - a;
  let m = month + 12 * a - 3;
  let jd = day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
  let d = jd - 2451545.0;

  // Sun's mean anomaly
  let g = (357.529 + 0.98560028 * d) % 360;
  if (g < 0) g += 360;

  // Sun's mean longitude
  let q = (280.459 + 0.98564736 * d) % 360;
  if (q < 0) q += 360;

  // Sun's geocentric apparent ecliptic longitude
  let L = (q + 1.915 * Math.sin((g * Math.PI) / 180) + 0.02 * Math.sin((2 * g * Math.PI) / 180)) % 360;
  if (L < 0) L += 360;

  // Mean obliquity of the ecliptic
  let e = 23.439 - 0.00000036 * d;

  // Sun's declination
  let sinDec = Math.sin((e * Math.PI) / 180) * Math.sin((L * Math.PI) / 180);
  let dec = (Math.asin(sinDec) * 180) / Math.PI;

  // Equation of Time (in minutes)
  let yVal = Math.tan(((e / 2) * Math.PI) / 180);
  yVal *= yVal;
  let lRad = (q * Math.PI) / 180;
  let mRad = (g * Math.PI) / 180;
  let sin2L = Math.sin(2 * lRad);
  let sinM = Math.sin(mRad);
  let cos2L = Math.cos(2 * lRad);
  let sin4L = Math.sin(4 * lRad);
  let sin2M = Math.sin(2 * mRad);
  let eot = 4 * ((yVal * sin2L - 2 * 0.0167 * sinM + 4 * 0.0167 * yVal * sinM * cos2L - 0.5 * yVal * yVal * sin4L - 1.25 * 0.0167 * 0.0167 * sin2M) * 180) / Math.PI;

  // Solar noon in hours (UTC+7)
  let transit = 12 + tz - lng / 15 - eot / 60;

  const latRad = (lat * Math.PI) / 180;
  const decRad = (dec * Math.PI) / 180;

  // Helper to compute hour angle
  const getHourAngle = (altitudeDeg: number): number => {
    const altRad = (altitudeDeg * Math.PI) / 180;
    const cosHA = (Math.sin(altRad) - Math.sin(latRad) * Math.sin(decRad)) / (Math.cos(latRad) * Math.cos(decRad));
    if (cosHA > 1) return 0;
    if (cosHA < -1) return 180;
    return (Math.acos(cosHA) * 180) / Math.PI;
  };

  // Subuh: Kemenag standard is -20°
  const subuhHA = getHourAngle(-20);
  const subuhHours = transit - subuhHA / 15 + ihtiyatMinutes / 60;

  // Imsak: 10 minutes before Subuh
  const imsakHours = subuhHours - 10 / 60;

  // Sunrise (Syuruq): Sun altitude ~ -0.833° - dip
  const dip = 0.0347 * Math.sqrt(RANGKASBITUNG_COORDS.elevation);
  const sunriseHA = getHourAngle(-0.8333 - dip);
  const sunriseHours = transit - sunriseHA / 15;

  // Dhuha: Sun altitude ~ +4.5°
  const dhuhaHA = getHourAngle(4.5);
  const dhuhaHours = transit - dhuhaHA / 15 + ihtiyatMinutes / 60;

  // Dzuhur: Transit + ihtiyat
  const dzuhurHours = transit + ihtiyatMinutes / 60;

  // Ashar: Shafi'i shadow ratio = 1 + tan(|lat - dec|)
  const phiMinusDelta = Math.abs(latRad - decRad);
  const asharAltRad = Math.atan(1 / (1 + Math.tan(phiMinusDelta)));
  const asharAltDeg = (asharAltRad * 180) / Math.PI;
  const asharHA = getHourAngle(asharAltDeg);
  const asharHours = transit + asharHA / 15 + ihtiyatMinutes / 60;

  // Maghrib: Sun altitude ~ -0.8333 - dip + ihtiyat
  const maghribHA = getHourAngle(-0.8333 - dip);
  const maghribHours = transit + maghribHA / 15 + ihtiyatMinutes / 60;

  // Isya: Kemenag standard is -18°
  const isyaHA = getHourAngle(-18);
  const isyaHours = transit + isyaHA / 15 + ihtiyatMinutes / 60;

  const formatHoursToHHMM = (h: number): string => {
    let normalized = (h % 24 + 24) % 24;
    const hours = Math.floor(normalized);
    const mins = Math.floor((normalized - hours) * 60);
    return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
  };

  const addMinutes = (timeHHMM: string, mins: number): string => {
    const [h, m] = timeHHMM.split(':').map(Number);
    const dateObj = new Date();
    dateObj.setHours(h, m + mins, 0, 0);
    return `${String(dateObj.getHours()).padStart(2, '0')}:${String(dateObj.getMinutes()).padStart(2, '0')}`;
  };

  const timesMap: Record<PrayerKey, { name: string; arabic: string; time: string; delay: number }> = {
    imsak: { name: 'Imsak', arabic: 'الإمساك', time: formatHoursToHHMM(imsakHours), delay: 0 },
    subuh: { name: 'Subuh', arabic: 'الفجر', time: formatHoursToHHMM(subuhHours), delay: DEFAULT_IQAMAH_DELAYS.subuh },
    terbit: { name: 'Terbit', arabic: 'الشروق', time: formatHoursToHHMM(sunriseHours), delay: 0 },
    dhuha: { name: 'Dhuha', arabic: 'الضحى', time: formatHoursToHHMM(dhuhaHours), delay: 0 },
    dzuhur: { name: 'Dzuhur', arabic: 'الظهر', time: formatHoursToHHMM(dzuhurHours), delay: DEFAULT_IQAMAH_DELAYS.dzuhur },
    ashar: { name: 'Ashar', arabic: 'العصر', time: formatHoursToHHMM(asharHours), delay: DEFAULT_IQAMAH_DELAYS.ashar },
    maghrib: { name: 'Maghrib', arabic: 'المغرب', time: formatHoursToHHMM(maghribHours), delay: DEFAULT_IQAMAH_DELAYS.maghrib },
    isya: { name: 'Isya', arabic: 'العشاء', time: formatHoursToHHMM(isyaHours), delay: DEFAULT_IQAMAH_DELAYS.isya },
  };

  const keys: PrayerKey[] = ['imsak', 'subuh', 'terbit', 'dhuha', 'dzuhur', 'ashar', 'maghrib', 'isya'];

  return keys.map((key) => {
    const item = timesMap[key];
    const iqamahTime = item.delay > 0 ? addMinutes(item.time, item.delay) : undefined;
    return {
      key,
      name: item.name,
      arabic: item.arabic,
      time: item.time,
      iqamahDelayMinutes: item.delay > 0 ? item.delay : undefined,
      iqamahTime,
    };
  });
}

/**
 * Hijri Date Approximation (Umm al-Qura / Indonesian standard)
 */
/**
 * Hijri Date (Official Umm al-Qura standard with reliable arithmetic fallback)
 */
export function getHijriDate(date: Date = new Date()): string {
  try {
    const formatter = new Intl.DateTimeFormat('id-ID-u-ca-islamic-umalqura', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    const formatted = formatter.format(date);
    if (!formatted.includes('H') && !formatted.includes('h')) {
      return `${formatted} H`;
    }
    return formatted;
  } catch {
    // Arithmetic Islamic calendar calculation
    const hijriMonthNames = [
      'Muharram', 'Safar', 'Rabiul Awal', 'Rabiul Akhir',
      'Jumadil Ula', 'Jumadil Akhir', 'Rajab', "Sya'ban",
      'Ramadhan', 'Syawal', 'Dzulqa’dah', 'Dzulhijjah'
    ];

    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();

    let m = month + 1;
    let y = year;
    if (m <= 2) {
      y -= 1;
      m += 12;
    }
    const a = Math.floor(y / 100);
    const b = 2 - a + Math.floor(a / 4);
    const jd = Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + day + b - 1524;

    const epoch = 1948439.5;
    const l = Math.floor(jd - epoch) + 10632;
    const n = Math.floor((l - 1) / 10631);
    const l2 = l - 10631 * n + 354;
    const j = Math.floor((10985 - l2) / 5316) * Math.floor((50 * l2) / 17719) + Math.floor(l2 / 5670) * Math.floor((43 * l2) / 15238);
    const l3 = l2 - Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50) - Math.floor(j / 16) * Math.floor((15238 * j) / 43) + 29;
    const hMonth = Math.floor((24 * l3) / 709);
    const hDay = l3 - Math.floor((709 * hMonth) / 24);
    const hYear = 30 * n + j - 30;

    const safeMonthIndex = Math.max(0, Math.min(11, hMonth - 1));
    const safeDay = Math.max(1, Math.min(30, hDay));
    return `${safeDay} ${hijriMonthNames[safeMonthIndex]} ${hYear} H`;
  }
}

/**
 * Calculates current active or next upcoming prayer
 */
export function getUpcomingPrayerInfo(prayers: PrayerTime[], now: Date = new Date()) {
  const currentMinutes = now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60;

  // Filter 5 primary prayers
  const primaryKeys: PrayerKey[] = ['subuh', 'dzuhur', 'ashar', 'maghrib', 'isya'];
  const prayerMinutes = prayers
    .filter((p) => primaryKeys.includes(p.key))
    .map((p) => {
      const [h, m] = p.time.split(':').map(Number);
      return {
        ...p,
        totalMinutes: (isNaN(h) ? 0 : h) * 60 + (isNaN(m) ? 0 : m),
      };
    });

  const fallbackPrayer = prayerMinutes[0] || {
    key: 'subuh' as PrayerKey,
    name: 'Subuh',
    arabic: 'الفجر',
    time: '04:23',
    totalMinutes: 263,
  };

  let next = prayerMinutes.find((p) => p.totalMinutes > currentMinutes);
  let isTomorrow = false;

  if (!next) {
    // Tomorrow's Subuh
    next = prayerMinutes[0] || fallbackPrayer;
    isTomorrow = true;
  }

  // Calculate difference
  let diffMinutes = next.totalMinutes - currentMinutes;
  if (isTomorrow) {
    diffMinutes += 24 * 60;
  }

  const hoursLeft = Math.max(0, Math.floor(diffMinutes / 60));
  const minsLeft = Math.max(0, Math.floor(diffMinutes % 60));
  const secsLeft = Math.max(0, Math.floor((diffMinutes * 60) % 60));

  // Determine current active prayer
  let currentActive = prayerMinutes[prayerMinutes.length - 1] || fallbackPrayer;
  for (let i = 0; i < prayerMinutes.length; i++) {
    if (currentMinutes >= prayerMinutes[i].totalMinutes) {
      currentActive = prayerMinutes[i];
    }
  }

  return {
    nextPrayer: next,
    currentActivePrayer: currentActive,
    hoursLeft,
    minsLeft,
    secsLeft,
    formattedCountdown: `${String(hoursLeft).padStart(2, '0')}:${String(minsLeft).padStart(2, '0')}:${String(secsLeft).padStart(2, '0')}`,
    isTomorrow,
  };
}

/**
 * Generate 30-day prayer times for Rangkasbitung
 */
export function generateMonthlyCalendar(year: number, month: number) {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const calendar: { date: Date; dateStr: string; hijriStr: string; times: PrayerTime[] }[] = [];

  for (let d = 1; d <= daysInMonth; d++) {
    const targetDate = new Date(year, month, d);
    const times = calculatePrayerTimes(targetDate);
    const dateStr = targetDate.toLocaleDateString('id-ID', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    });
    calendar.push({
      date: targetDate,
      dateStr,
      hijriStr: getHijriDate(targetDate),
      times,
    });
  }

  return calendar;
}
