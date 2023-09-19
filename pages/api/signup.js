// pages/api/register.js
import { mongooseConnect } from "@/lib/mongoose";
import { User } from "@/models/User";
import bcrypt from 'bcrypt'; 

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  await mongooseConnect();
 
 

  try {
    // Hash the password securely using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("hello con" + hashedPassword)
 const { name, email, password } = req.body;
    // const use = new User({
    //   name,
    //   email,
    //   password: hashedPassword,
    // });
    // await user.save();

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    })


    return res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    return res.status(500).json({ error: 'Registration man failed' });
  }
}
