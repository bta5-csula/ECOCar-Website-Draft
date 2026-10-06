import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static assets with html extension resolution
app.use(express.static(__dirname, {
  extensions: ['html', 'htm']
}));

// Route handler for clean URLs
app.get('/:page', (req, res, next) => {
  const filePath = path.join(__dirname, `${req.params.page}.html`);
  if (fs.existsSync(filePath)) {
    return res.sendFile(filePath);
  }
  next();
});

// Fallback to index.html for root or client navigation
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${PORT}`);
});
