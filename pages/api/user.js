import { User } from "@/models/User";
import { mongooseConnect } from "@/lib/mongoose";
import { isAdminRequest } from "@/pages/api/auth/[...nextauth]";
import bcrypt from 'bcrypt'; // Import bcrypt

export default async function handle(req, res) {
  const { method } = req;
  await mongooseConnect();
  // await isAdminRequest(req, res);

  if (method === 'GET') {
    if (req.query?.id) {
      res.json(await User.findOne({ _id: req.query.id }));
    } else {
      res.json(await User.find());
    }
  }

  if (method === 'POST') {
    const { name, email, image, emailVerified, role, password,passhint } = req.body;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const UserDoc = await User.create({
      name, email, image, emailVerified, role, password: hashedPassword
    });

    res.json(UserDoc);
  }

  if (method === 'PUT') {
    const { name, email, image, emailVerified, role, password,passhint, _id } = req.body;

    // Hash the new password if provided
    const hashedPassword = password
      ? await bcrypt.hash(password, 10)
      : undefined;

    await User.updateOne({ _id }, {
      name, email, image, emailVerified, role,
      ...(hashedPassword && { password: hashedPassword })
    });

    res.json(true);
  }

  if (method === 'DELETE') {
    if (req.query?.id) {
      await User.deleteOne({ _id: req.query?.id });
      res.json(true);
    }
  }
}
