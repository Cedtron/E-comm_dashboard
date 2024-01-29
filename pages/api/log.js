import { Log } from "@/models/log";
import { mongooseConnect } from "@/lib/mongoose";
import { isAdminRequest } from "@/pages/api/auth/[...nextauth]";


export default async function handle(req, res) {
  const { method } = req;
  await mongooseConnect();
  // await isAdminRequest(req, res);

  if (method === 'GET') {
    if (req.query?.id) {
      res.json(await Log.findOne({ _id: req.query.id }));
    } else {
      res.json(await Log.find());
    }
  }

  if (method === 'POST') {
    const { name, email, time } = req.body;

    // Hash the password
   

    const LogDoc = await Log.create({
      name, email, time
    });

    res.json(LogDoc);
  }

  if (method === 'PUT') {
    const { name, email, time, _id } = req.body;

    // Hash the new password if provided
   
    await Log.updateOne({ _id }, {
      name, email, time
    });

    res.json(true);
  }

  if (method === 'DELETE') {
    if (req.query?.id) {
      await Log.deleteOne({ _id: req.query?.id });
      res.json(true);
    }
  }
}
