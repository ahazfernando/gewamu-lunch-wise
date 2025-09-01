import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/dbConnect';
import Payment from '@/models/Payment';
import { verifyJwt } from '@/lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();
  const token = req.headers.authorization?.split(' ')[1];
  const user = token ? verifyJwt(token) : null;
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  if (req.method === 'POST') {
    // Submit payment
    const { group, amount } = req.body;
    if (!group || !amount) return res.status(400).json({ error: 'Missing fields' });
    const payment = await Payment.create({
      group,
      participant: user.userId,
      amount,
      status: 'submitted',
      submittedAt: new Date(),
      history: [{ status: 'submitted', date: new Date() }],
    });
    return res.status(201).json(payment);
  } else if (req.method === 'GET') {
    // List payments for user
    const payments = await Payment.find({ participant: user.userId });
    return res.status(200).json(payments);
  } else {
    return res.status(405).end();
  }
}
