const express = require('express');
const cors = require('cors');
const filesRoutes = require('./routes/files.js');

const app = express();
const PORT = Number(process.env.PORT) || 3001;

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map((o) => o.trim())
  : [
      'http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://localhost:5176',
      'http://localhost:8080', 'http://localhost:3000',
      'http://127.0.0.1:5173', 'http://127.0.0.1:5174', 'http://127.0.0.1:5175', 'http://127.0.0.1:5176',
      'http://127.0.0.1:8080', 'http://127.0.0.1:3000',
    ];

app.use(cors({ origin: allowedOrigins }));
app.use(express.json());

app.use('/api/files', filesRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Word-list API listening on port ${PORT}`);
});
