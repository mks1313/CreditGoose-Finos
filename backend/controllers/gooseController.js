const { exec } = require('child_process');

exports.getGooseVersion = (req, res) => {
  exec('goose --version', (error, stdout, stderr) => {
    if (error) return res.status(500).json({ error: error.message });
    if (stderr) return res.status(500).json({ error: stderr });
    res.json({ version: stdout.trim() });
  });
};

exports.getGooseNews = (req, res) => {
  // Simple simulation of news
  const news = [
    { title: 'Goose Hackathon launched', url: 'https://example.com/news1' },
    { title: 'New features in Goose CLI', url: 'https://example.com/news2' },
  ];
  res.json({ news });
};

/**
 * Health check endpoint for Goose CLI
 */
exports.gooseHealthCheck = (req, res) => {
  exec('goose --version', (error, stdout, stderr) => {
    if (error || stderr) {
      return res.status(500).json({ status: 'error', error: error?.message || stderr });
    }
    res.json({ status: 'ok', version: stdout.trim() });
  });
};