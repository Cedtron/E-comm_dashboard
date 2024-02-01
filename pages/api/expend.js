import { Expend } from "@/models/expend";
import { mongooseConnect } from "@/lib/mongoose";

export default async function handle(req, res) {
  const { method } = req;
  await mongooseConnect();

  if (method === 'GET') {
    res.json(await Expend.find());
  }
 
  if (method === 'POST') {
    const { expcategory, amount, date, description } = req.body;
    const expendDoc = await Expend.create({
      expcategory,
      amount,
      date,
      description,
    });
    res.json(expendDoc);
  }

  if (method === 'PUT') {
    const { expcategory, amount, date, description, _id } = req.body;
    const expendDoc = await Expend.updateOne({ _id }, {
      expcategory,
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