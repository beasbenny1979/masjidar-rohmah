import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

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
app.use('/images', express.static(publicImagesDir));
app.use('/uploads', express.static(publicUploadsDir));
app.use('/src/assets/images', express.static(publicImagesDir));
if (fs.existsSync(assetsImagesDir)) {
  app.use('/src/assets/images', express.static(assetsImagesDir));
}

// API 1: Get Content
app.get('/api/content', (_req, res) => {
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

// API 2: Save Content
app.post('/api/content', (req, res) => {
  try {
    const adminEmail = (req.headers['x-admin-email'] as string) || req.body?.adminEmail;
    if (adminEmail && adminEmail.toLowerCase().trim() !== AUTHORIZED_ADMIN_EMAIL.toLowerCase()) {
      return res.status(403).json({
        success: false,
        error: `Akses ditolak: Operasi ini hanya diizinkan untuk akun resmi ${AUTHORIZED_ADMIN_EMAIL}.`,
      });
    }

    const data = req.body;
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf-8');
    return res.json({ success: true, message: 'Data saved successfully' });
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

// API 5: Multi-turn Gemini Chatbot with Model Selection & System Instruction
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, taskType, model, customRole } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        success: false,
        error: 'Kunci API Gemini (GEMINI_API_KEY) belum terkonfigurasi di lingkungan server.',
      });
    }

    const ai = new GoogleGenAI({ apiKey });

    // Select model based on task complexity as instructed:
    // - gemini-4-argon for particularly complex tasks
    // - gemini-3.8-flash for general tasks
    // - gemini-3.1-flash-lite for tasks that should happen fast
    let selectedModel = 'gemini-3.8-flash';
    if (model === 'gemini-4-argon' || taskType === 'complex') {
      selectedModel = 'gemini-4-argon';
    } else if (model === 'gemini-3.1-flash-lite' || taskType === 'fast') {
      selectedModel = 'gemini-3.1-flash-lite';
    } else if (model) {
      selectedModel = model;
    }

    // Grounding data from current mosque database
    let groundingContext = '';
    try {
      if (fs.existsSync(dbPath)) {
        const d = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
        if (d.mosqueInfo) {
          groundingContext += `\nNama Masjid: ${d.mosqueInfo.name}\nTagline: ${d.mosqueInfo.tagline}\nAlamat: ${d.mosqueInfo.address}\nTelepon/WA: ${d.mosqueInfo.phone}\nEmail: ${d.mosqueInfo.email}\nSK Kemenag: ${d.mosqueInfo.dkmSkNumber}\nTahun Berdiri: ${d.mosqueInfo.establishedYear}\nArah Kiblat: ${d.mosqueInfo.qiblaDirection}\nSejarah: ${d.mosqueInfo.historyText}\nVisi: ${d.mosqueInfo.visionText}`;
        }
        if (d.financialSummary) {
          groundingContext += `\nTotal Saldo Kas: Rp ${Number(d.financialSummary.totalBalance).toLocaleString('id-ID')}\nKas Operasional: Rp ${Number(d.financialSummary.operasionalBalance).toLocaleString('id-ID')}\nKas Pembangunan: Rp ${Number(d.financialSummary.pembangunanBalance).toLocaleString('id-ID')}\nKas ZISWAF & Yatim: Rp ${Number(d.financialSummary.ziswafBalance + d.financialSummary.yatimBalance).toLocaleString('id-ID')}\nStatus Rekonsiliasi Kas: ${d.financialSummary.lastReconciledAt || d.financialSummary.lastUpdated}`;
        }
      }
    } catch {}

    const roleName = customRole || 'Asisten Cerdas Virtual DKM Masjid Ar-Rohmah Rangkasbitung';
    const systemInstruction = `Anda adalah "${roleName}", asisten virtual resmi DKM Masjid Ar-Rohmah di Komplek Bumi Narimbang Indah, Rangkasbitung, Kabupaten Lebak, Banten.
Tugas Anda adalah melayani jamaah dengan ramah, santun, bijaksana, dan bernuansa Islami.
Gunakan salam pembuka islami (Assalamu'alaikum Warahmatullahi Wabarakatuh), bismillah, alhamdulillah, dan kata-kata penyejuk hati.

Informasi resmi masjid yang dapat Anda rujuk:
${groundingContext}
Pimpinan DKM: Bapak Rafiudin (Pelindung), Bapak Adih (Ketua DKM), Bapak Heri Kristiyanto (Bendahara DKM).
Layanan Jamaah: Fardhu Kifayah & Mobil Jenazah 24 Jam, Bimbingan Mualaf, Konsultasi Agama, Peminjaman Aula/Akad Nikah, Jemput ZISWAF.
Transparansi: Seluruh kas dicatat berkala dan terekonsiliasi rapi.

Bantulah jamaah dengan jawaban yang jelas, terstruktur (bullet points), ringkas, dan menenangkan hati.`;

    const contents = (messages || []).map((m: any) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }],
    }));

    const response = await ai.models.generateContent({
      model: selectedModel,
      contents: contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const reply = response.text || 'Mohon maaf, saat ini asisten belum dapat memberikan jawaban.';
    return res.json({ success: true, reply, modelUsed: selectedModel });
  } catch (err: any) {
    console.error('Gemini chat API error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// API 6: Lyria Music Generation (lyria-3-clip-preview for <= 30s clips, lyria-3-pro-preview for full-length)
app.post('/api/music/generate', async (req, res) => {
  try {
    const { prompt, type } = req.body; // type: 'clip' (up to 30s) or 'pro' (full-length track)
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        success: false,
        error: 'Kunci API Gemini (GEMINI_API_KEY) belum terkonfigurasi di lingkungan server.',
      });
    }

    if (!prompt) {
      return res.status(400).json({ success: false, error: 'Prompt musik diperlukan' });
    }

    const ai = new GoogleGenAI({ apiKey });
    const selectedModel = type === 'pro' ? 'lyria-3-pro-preview' : 'lyria-3-clip-preview';

    const response = await ai.models.generateContentStream({
      model: selectedModel,
      contents: prompt,
    });

    let audioBase64 = '';
    let lyrics = '';
    let mimeType = 'audio/wav';

    for await (const chunk of response) {
      const parts = chunk.candidates?.[0]?.content?.parts;
      if (!parts) continue;

      for (const part of parts) {
        if (part.inlineData?.data) {
          if (!audioBase64 && part.inlineData.mimeType) {
            mimeType = part.inlineData.mimeType;
          }
          audioBase64 += part.inlineData.data;
        }
        if (part.text && !lyrics) {
          lyrics = part.text;
        }
      }
    }

    if (!audioBase64) {
      return res.status(500).json({
        success: false,
        error: 'Model Lyria tidak menghasilkan stream audio. Pastikan prompt musik valid.',
      });
    }

    return res.json({
      success: true,
      audioBase64,
      mimeType,
      lyrics,
      modelUsed: selectedModel,
    });
  } catch (err: any) {
    console.error('Lyria music generation API error:', err);
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
