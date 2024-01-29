import { mongooseConnect } from "@/lib/mongoose";
import { User } from "@/models/User";
import bcrypt from 'bcrypt';

export default async function handler(req, res) {
  await mongooseConnect();

  if (req.method === 'POST') {
    const { action, email, code, password } = req.body;

    try {
      switch (action) {
        case 'check-email': {
          const user = await User.findOne({ email });

          if (!user) {
            //console.error('Email not found');
            return res.status(404).json({ error: 'Email not found' });
          }

          return res.json({ exists: true });
        }
        case 'confirm-code': {
          const user = await User.findOne({ email });

          if (!user) {
            //console.error('Email not found');
            return res.status(404).json({ error: 'Email not found' });
          }

          if (user.passhint !== code) {
            //console.error('Incorrect code');
            return res.status(401).json({ error: 'Incorrect code' });
          }

          return res.json({ correct: true });
        }
        case 'update-password': {
          const user = await User.findOne({ email });

          if (!user) {
            //console.error('Email not found or incorrect code');
            return res.status(404).json({ error: 'Email not found or incorrect code' });
          }

          const hashedPassword = await bcrypt.hash(password, 10);
          user.password = hashedPassword;

          await user.save();

          //console.log('Password updated successfully');
          return res.json({ success: true });
        }
        default:
          return res.status(400).json({ error: 'Invalid action' });
      }
    } catch (error) {
      //console.error('Error processing request:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
}