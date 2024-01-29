import { Catexpend } from "@/models/Catexpend";
import { mongooseConnect } from "@/lib/mongoose";

export default async function handle(req, res) {
  const { method } = req;
  await mongooseConnect();

  if (method === 'GET') {
    res.json(await Catexpend.find());
  }

  if (method === 'POST') {
    const { name, properties } = req.body;
    const expendDoc = await Catexpend.create({
      name,
      properties,
    });
    res.json(expendDoc);
  }

  if (method === 'PUT') {
    const { name, properties, _id } = req.body;
    const expendDoc = await Catexpend.findByIdAndUpdate(_id, {
      name,
      properties,
    }, { new: true }); // Set { new: true } to return the modified document
    res.json(expendDoc);
  }

  if (method === 'DELETE') {
    const { _id } = req.query;
    await Catexpend.findByIdAndDelete(_id);
    res.json('ok');
  }
}