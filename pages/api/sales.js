import {Sale} from "@/models/Sale";
import {mongooseConnect} from "@/lib/mongoose";
import {isAdminRequest} from "@/pages/api/auth/[...nextauth]";

export default async function handle(req, res) {
  const { method } = req;
  try {
 
  await mongooseConnect();
  await isAdminRequest(req,res);

  if (method === 'GET') {
    if (req.query?.id) {
      res.json(await Sale.findOne({_id:req.query.id}));
    } 
    else if (req.query?.saler) {
      res.json(await Sale.findOne({saler:req.query.saler}));
    } else{
      res.json(await Sale.find());
    }
  }
  
  if (method === 'POST') {
    const {productId,product,stock, price,saler,esawa } = req.body;
    const SaleDoc = await Sale.create({
      productId,product,stock, price,saler,esawa
    })
    res.json(SaleDoc);
  
  
  
  }

  if (method === 'PUT') {
    const {productId,product,stock, price,saler,esawa ,_id} = req.body;
    await Sale.updateOne({_id}, {productId,product,stock, price,saler,esawa });
    res.json(true);
  }

  if (method === 'DELETE') {
    if (req.query?.id) {
      await Sale.deleteOne({_id:req.query?.id});
      res.json(true);
    }
  }
}  catch (error) {
  console.error('Internal server error:', error);
  res.status(500).json({ error: 'Internal server error' });
}
}