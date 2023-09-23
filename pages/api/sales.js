import {Sale} from "@/models/Sale";
import {mongooseConnect} from "@/lib/mongoose";
import {isAdminRequest} from "@/pages/api/auth/[...nextauth]";

export default async function handle(req, res) {
  const { method } = req;
  try {
 
  await mongooseConnect();
  // await isAdminRequest(req,res);

  if (method === 'GET') {
    try {
      if (req.query?.id) {
        const sale = await Sale.findOne({ _id: req.query.id });
        if (sale) {
          res.json(sale);
        } else {
          res.status(404).json({ message: 'Sale not found' });
        }
      } else if (req.query?.saler) {
        const sale = await Sale.findOne({ saler: req.query.saler });
        if (sale) {
          res.json(sale);
        
        } else {
          res.status(404).json({ message: 'Sale not found' });
          console.log("failed")
        }
      } else {
        const sales = await Sale.find();
        res.json(sales);
      }
    } catch (error) {
      // Handle any errors that occur during database operations
      console.error('Error:', error);
      res.status(500).json({ message: 'Internal Server Error' });
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