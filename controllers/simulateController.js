exports.simulate = (req, res) => {
  const { amount, duration } = req.query;

  if (!amount || !duration) {
    return res.status(400).json({ error: 'Missing amount or duration' });
  }

  // Simulación simple: calculamos pago mensual con interés fijo
  const interestRate = 0.08; // 8%
  const principal = parseFloat(amount);
  const months = parseInt(duration);
  const totalWithInterest = principal * (1 + interestRate);
  const monthlyPayment = (totalWithInterest / months).toFixed(2);

  res.json({
    amount,
    duration,
    interestRate: (interestRate * 100).toFixed(2) + '%',
    monthlyPayment,
  });
};