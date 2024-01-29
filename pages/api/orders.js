import { mongooseConnect } from "@/lib/mongoose";
import { Order } from "@/models/Order";

export default async function handler(req, res) {
  const { method } = req;

  try {
    await mongooseConnect();

    switch (method) {
      case 'GET':
        if (req.query?.id) {
          const order = await Order.findOne({ _id: req.query.id });
          res.json(order);
        } else {
          const orders = await Order.find().sort({ createdAt: -1 });
          res.json(orders);
        }
        break;

      case 'PUT':
        const { status, _id } = req.body;
        await Order.updateOne({ _id }, { status });
        res.json(true);
        break;

      case 'DELETE':
        if (req.query?.id) {
          await Order.deleteOne({ _id: req.query.id });
          res.json(true);
        }
        break;

      default:
        res.status(405).json({ error: 'Method Not Allowed' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
