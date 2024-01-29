import { Expend } from "@/models/expend";
import { mongooseConnect } from "@/lib/mongoose";

export default async function handle(req, res) {
  const { method } = req;
  await mongooseConnect();

  if (method === 'GET') {
    res.json(await Expend.find());
  }
 
  if (method === 'POST') {
    const { category, amount, date, description } = req.body;
    const expendDoc = await Expend.create({
      category,
      amount,
      date,
      description,
    });
    res.json(expendDoc);
  }

  if (method === 'PUT') {
    const { category, amount, date, description, _id } = req.body;
    const expendDoc = await Expend.updateOne({ _id }, {
      category,
      amount,
      date,
      description,
    });
    res.json(expendDoc);
  }

  if (method === 'DELETE') {
    const { _id } = req.query;
    await Expend.deleteOne({ _id });
    res.json('ok');
  }
}