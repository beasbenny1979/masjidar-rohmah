import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Body parser with 50mb limit for image uploads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

const dbPath = path.resolve(__dirname, 'src/data/db.json');
const publicImagesDir = path.resolve(__dirname, 'public/images');
const publicUploadsDir = path.resolve(__dirname, 'public/uploads');
const assetsImagesDir = path.resolve(__dirname, 'src/assets/images');

// Ensure directories exist
[publicImagesDir, publicUploadsDir, assetsImagesDir].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Serve uploaded and static images across multiple routes for maximum hosting compatibility
// Set short cache & revalidate so updated images are immediately fetched on all devices
const staticImageOptions = {
  etag: true,
  lastModified: true,
  setHeaders: (res: express.Response) => {
    res.setHeader('Cache-Control', 'public, max-age=60, s-maxage=60, must-revalidate');
  },
};
app.use('/images', express.static(publicImagesDir, staticImageOptions));
app.use('/uploads', express.static(publicUploadsDir, staticImageOptions));
app.use('/src/assets/images', express.static(publicImagesDir, staticImageOptions));
if (fs.existsSync(assetsImagesDir)) {
  app.use('/src/assets/images', express.static(assetsImagesDir, staticImageOptions));
}

// API 1: Get Content - Strict No-Cache so mobile browsers and other PCs always get latest DB
app.get('/api/content', (_req, res) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('Surrogate-Control', 'no-store');
  try {
    if (fs.existsSync(dbPath)) {
      const data = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
      return res.json({ success: true, data });
    }
    return res.json({ success: true, data: null });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

const AUTHORIZED_ADMIN_EMAIL = 'mjdarrohmah@gmail.com';
const DKM_ADMIN_PASSWORD = 'Gavi2021';

// API: Google / Gmail Account Login for mjdarrohmah@gmail.com
app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;
    const cleanEmail = (email || '').trim().toLowerCase();

    // STRICT CHECK 1: Hanya alamat email mjdarrohmah@gmail.com
    if (cleanEmail !== AUTHORIZED_ADMIN_EMAIL.toLowerCase()) {
      return res.status(403).json({
        success: false,
        error: `Akses ditolak: Alamat email "${email}" tidak memiliki hak akses administrator. Akses Admin DKM hanya dapat diakses oleh alamat email ${AUTHORIZED_ADMIN_EMAIL}.`,
      });
    }

    // STRICT CHECK 2: Password harus persis 'Gavi2021'. Kalo keliru, tidak dapat akses sama sekali.
    if (!password || password !== DKM_ADMIN_PASSWORD) {
      return res.status(401).json({
        success: false,
        error: 'Kata sandi keliru! Akses ke Panel Admin DKM ditolak sama sekali.',
      });
    }

    // Persist and record last login
    let data: any = {};
    if (fs.existsSync(dbPath)) {
      try {
        data = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
      } catch {}
    }
    data.adminAuth = {
      email: AUTHORIZED_ADMIN_EMAIL,
      password: DKM_ADMIN_PASSWORD,
      lastLoginAt: new Date().toISOString(),
    };
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf-8');

    return res.json({
      success: true,
      email: AUTHORIZED_ADMIN_EMAIL,
      token: `gauth_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      authenticatedAt: new Date().toISOString(),
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// API 2: Save Content - Always timestamps with current ISO time so all devices immediately synchronize
app.post('/api/content', (req, res) => {
  try {
    const adminEmail = (req.headers['x-admin-email'] as string) || req.body?.adminEmail;
    if (adminEmail && adminEmail.toLowerCase().trim() !== AUTHORIZED_ADMIN_EMAIL.toLowerCase()) {
      return res.status(403).json({
        success: false,
        error: `Akses ditolak: Operasi ini hanya diizinkan untuk akun resmi ${AUTHORIZED_ADMIN_EMAIL}.`,
      });
    }

    const savedAt = new Date().toISOString();
    const data = {
      ...req.body,
      savedAt,
      adminEmail: AUTHORIZED_ADMIN_EMAIL,
    };
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf-8');
    console.log(`[Content Database Saved] Stamped at ${savedAt}`);
    return res.json({ success: true, savedAt, message: 'Data saved successfully' });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// API 3: Upload Image (base64)
app.post('/api/upload', (req, res) => {
  try {
    const adminEmail = (req.headers['x-admin-email'] as string) || req.body?.adminEmail;
    if (adminEmail && adminEmail.toLowerCase().trim() !== AUTHORIZED_ADMIN_EMAIL.toLowerCase()) {
      return res.status(403).json({
        success: false,
        error: `Akses ditolak: Operasi ini hanya diizinkan untuk akun resmi ${AUTHORIZED_ADMIN_EMAIL}.`,
      });
    }

    const { imageBase64, filename } = req.body;
    if (!imageBase64) {
      return res.status(400).json({ success: false, error: 'No image data provided' });
    }

    const matches = imageBase64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    let buffer: Buffer;
    let ext = '.jpg';

    if (matches && matches.length === 3) {
      const mime = matches[1];
      if (mime.includes('png')) ext = '.png';
      if (mime.includes('webp')) ext = '.webp';
      buffer = Buffer.from(matches[2], 'base64');
    } else {
      buffer = Buffer.from(imageBase64, 'base64');
    }

    const safeName = filename ? filename.replace(/[^a-zA-Z0-9_-]/g, '') : 'upload';
    const finalFilename = `${safeName}_${Date.now()}${ext}`;
    const targetPath = path.join(publicImagesDir, finalFilename);
    const backupUploadPath = path.join(publicUploadsDir, finalFilename);

    fs.writeFileSync(targetPath, buffer);
    fs.writeFileSync(backupUploadPath, buffer);
    if (fs.existsSync(assetsImagesDir)) {
      try {
        fs.writeFileSync(path.join(assetsImagesDir, finalFilename), buffer);
      } catch {}
    }

    const publicUrl = `/images/${finalFilename}`;

    return res.json({ success: true, url: publicUrl });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// API 4: Reset
app.post('/api/reset', (_req, res) => {
  try {
    if (fs.existsSync(dbPath)) {
      fs.unlinkSync(dbPath);
    }
    return res.json({ success: true, message: 'Database reset successfully' });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Vite middleware in dev or static in prod
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

startServer();
