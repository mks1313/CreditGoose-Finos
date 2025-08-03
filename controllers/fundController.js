const { calculateFunding } = require('../services/fundService');

/**
 * Handle funding request for selected invoices.
 * Validates input, calculates funding, and returns a response.
 */
exports.requestFunding = (req, res) => {
  try {
    const { userId, invoiceIds } = req.body;

    // Basic validation of input data
    if (!userId || !Array.isArray(invoiceIds) || invoiceIds.length === 0) {
      return res.status(400).json({ error: 'Invalid request: userId and invoiceIds are required' });
    }

    const funding = calculateFunding(invoiceIds);

    // Respond with funding summary and estimated arrival time
    res.json({
      message: `You’ll receive $${funding.amountToSend} in your bank account within 24 hours.`,
      totalAmount: funding.totalAmount,
      fees: funding.fees,
      amountToSend: funding.amountToSend,
      estimatedArrival: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    });
  } catch (error) {
    console.error('Error in requestFunding:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};