import {Sale} from "@/models/Sale";
import {mongooseConnect} from "@/lib/mongoose";
import {isAdminRequest} from "@/pages/api/auth/[...nextauth]";

export default async function handle(req, res) {
  const { method } = req;
  try {
 
  await mongooseConnect();
  // await isAdminRequest(req,res);

  if (method === 'GET') {
    try {if (req.query?.id) {
        res.json(await Sale.findOne({ _id: req.query.id }));
        console.log('Sales by id'); 
      }else

      if (req.query?.saler==null) {
    res.json(await Sale.find());
        console.log('All Sales:'); 
      }     else       
       {
       
        const sales = await Sale.find({ saler: req.query.saler });
        res.json(sales);
        console.log('Sales of the saler:',  req.query.saler); 
      }  
  
    } catch (error) {
   
      console.error('Error:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
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