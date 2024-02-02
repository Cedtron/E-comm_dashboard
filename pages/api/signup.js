import { mongooseConnect } from "@/lib/mongoose";
import { User } from "@/models/User";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'; // Import the jsonwebtoken library

export default async function handler(req, res) {
  if (req.method === 'POST') {
    await mongooseConnect();
    let role="saler"
    const { name, email, password,passhint } = req.body;

    try {
      // Check if the email already exists in the database
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: 'Email already in use' });
      }

      // Hash the password securely using bcrypt
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new user
      const newUser = new User({
        name,
        email,
        role,
        password: hashedPassword,
        passhint,
      });

      await newUser.save();

      // Create a JWT token for the user
      const token = jwt.sign({ userId: newUser._id }, 'your-secret-key', {
        expiresIn: '1h', // Adjust the expiration time as needed
      });

      return res.status(201).json({ message: 'User registered successfully', token });
    } catch (error) {
      console.error('Error registering user:', error);
      return res.status(500).json({ error: 'Registration failed' });
    }
  } else if (req.method === 'POST') {
    const { email, password } = req.body;

    try {
      // Find the user by email in the database
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ error: 'User not found' });
      }

     
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ error: 'Invalid password' });
      }

    
      const token = jwt.sign({ userId: user._id }, 'your-secret-key', {
        expiresIn: '1h', 
      });

      return res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
      console.error('Error logging in:', error);
      return res.status(500).json({ error: 'Login failed' });
    }
  } else {
    return res.status(405).end();
  }
}
