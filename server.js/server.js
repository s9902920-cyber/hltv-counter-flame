import 'dotenv/config';
import express from 'express';
import path from 'node:path';
import cookieParser from 'cookie-parser';
import routes from './src/routes.js';
import { validateTelegramInitData } from './src/telegram.js';
import db from './src/db.js';

const app = express();

app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/uploads', express.static(path.resolve('uploads')));
app.use(express.static(path.resolve('public')));

app.use('/api', routes);

app.post('/api/telegram/auth', (req, res) => {
  try {
    const user = validateTelegramInitData(
      req.body?.initData,
      process.env.BOT_TOKEN
    );

    db.prepare(`
      INSERT OR REPLACE INTO telegram_users
      (telegram_id, username, first_name, last_name, photo_url)
      VALUES (?, ?, ?, ?, ?)
    `).run(user.id, user.username, user.first_name, user.last_name, user.photo_url);

    res.json({ ok: true, user });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.resolve('public/index.html'));
});

app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({ error: error.message || 'Ошибка сервера' });
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`HLTV запущен на порту ${port}`);
});
