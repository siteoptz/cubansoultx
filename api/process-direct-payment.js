export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { amount, customerInfo, paymentInfo, orderDetails } = req.body;

    // Validate input
    if (!amount || !customerInfo || !paymentInfo || !orderDetails) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // For now, return a success response
    // In production, this would process the actual payment
    return res.status(200).json({
      success: true,
      transactionId: 'demo_' + Date.now(),
      amount: amount,
      message: 'Payment processed successfully'
    });

  } catch (error) {
    console.error('Direct payment error:', error);
    return res.status(500).json({ error: 'Payment processing failed' });
  }
}