exports.healthCheck = (req, res) => {
  res.json({ message: 'Backend is alive!' });
};
