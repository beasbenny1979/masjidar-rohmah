/**
 * Utility for resolving and handling image paths reliably across all hosting environments.
 * Ensures images work in development (Vite), production build (dist/ on Vercel, Netlify, cPanel, Nginx, etc.),
 * and when edited or uploaded via the DKM Admin panel.
 */

// Fallback high-fidelity SVG placeholders as data URIs (guaranteed to render offline and on any host)
const FALLBACK_MOSQUE_SVG = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="800" height="500">
  <defs>
    <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#064e3b" />
      <stop offset="100%" stop-color="#022c22" />
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#skyGrad)" />
  <circle cx="400" cy="220" r="140" fill="#047857" opacity="0.4" />
  <!-- Mosque Dome Silhouette -->
  <path d="M 400 90 Q 425 150 480 200 Q 500 240 500 280 L 300 280 Q 300 240 320 200 Q 375 150 400 90 Z" fill="#059669" />
  <!-- Minaret Left -->
  <rect x="230" y="140" width="30" height="180" fill="#047857" rx="4" />
  <path d="M 230 140 Q 245 100 260 140 Z" fill="#10b981" />
  <!-- Minaret Right -->
  <rect x="540" y="140" width="30" height="180" fill="#047857" rx="4" />
  <path d="M 540 140 Q 555 100 570 140 Z" fill="#10b981" />
  <!-- Base Building -->
  <rect x="200" y="280" width="400" height="130" fill="#065f46" rx="6" />
  <!-- Arch Doors -->
  <path d="M 360 410 L 360 330 Q 400 300 440 330 L 440 410 Z" fill="#022c22" />
  <path d="M 280 410 L 280 350 Q 310 330 340 350 L 340 410 Z" fill="#022c22" />
  <path d="M 460 410 L 460 350 Q 490 330 520 350 L 520 410 Z" fill="#022c22" />
  <!-- Text Label -->
  <text x="400" y="460" font-family="sans-serif" font-size="20" font-weight="bold" fill="#fde68a" text-anchor="middle">
    Masjid Ar-Rohmah Rangkasbitung
  </text>
</svg>
`)}`;

const FALLBACK_AVATAR_SVG = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500" width="400" height="500">
  <rect width="100%" height="100%" fill="#0f172a" />
  <circle cx="200" cy="180" r="70" fill="#334155" />
  <path d="M 100 420 C 100 300 300 300 300 420 Z" fill="#1e293b" />
  <text x="200" y="460" font-family="sans-serif" font-size="16" font-weight="bold" fill="#94a3b8" text-anchor="middle">
    Pengurus DKM Ar-Rohmah
  </text>
</svg>
`)}`;

/**
 * Resolves an image URL so it functions correctly regardless of host configuration.
 * - Leaves data URIs untouched.
 * - Leaves external http/https URLs untouched.
 * - Replaces any `/src/assets/images/` path with public `/images/` path.
 */
export function resolveImageUrl(url?: string | null): string {
  if (!url) return '';
  const trimmed = url.trim();
  if (!trimmed) return '';

  // Base64 data URLs work natively anywhere
  if (trimmed.startsWith('data:image/')) {
    return trimmed;
  }

  // Absolute web URLs work natively
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }

  // Normalize legacy `/src/assets/images/` or `src/assets/images/` to `/images/`
  if (trimmed.includes('assets/images/')) {
    const filename = trimmed.split('/').pop();
    return `/images/${filename}`;
  }

  // If starts with `images/` without leading slash, add slash
  if (trimmed.startsWith('images/')) {
    return `/${trimmed}`;
  }

  return trimmed;
}

/**
 * Image error handler to ensure that broken links or host path mismatches
 * never show a broken image icon. Tries alternative local path first, then fallback SVG.
 */
export function handleImageError(
  e: React.SyntheticEvent<HTMLImageElement, Event>,
  fallbackType: 'mosque' | 'avatar' | 'qris' = 'mosque'
): void {
  const target = e.currentTarget;
  const currentSrc = target.getAttribute('src') || '';
  const retryCount = parseInt(target.dataset.retryCount || '0', 10);

  // Attempt 1: If currentSrc has /src/assets/images/, switch to /images/
  if (retryCount === 0 && currentSrc.includes('assets/images/')) {
    target.dataset.retryCount = '1';
    const filename = currentSrc.split('/').pop();
    target.src = `/images/${filename}`;
    return;
  }

  // Attempt 2: If currentSrc has /images/, try /src/assets/images/ (in local dev)
  if (retryCount === 0 && currentSrc.startsWith('/images/')) {
    target.dataset.retryCount = '1';
    const filename = currentSrc.split('/').pop();
    target.src = `/src/assets/images/${filename}`;
    return;
  }

  // Final fallback: Use SVG placeholder so no broken image appears
  target.dataset.retryCount = '99';
  if (fallbackType === 'avatar') {
    target.src = FALLBACK_AVATAR_SVG;
  } else {
    target.src = FALLBACK_MOSQUE_SVG;
  }
}
