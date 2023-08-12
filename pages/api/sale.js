import {mongooseConnect} from "@/lib/mongoose";
import {Product} from "@/models/Product";
import {Sale} from "@/models/Sale";


export default async function handler(req,res) {
  if (req.method !== 'POST') {
    res.json('should be a POST request');
    return;
  }
  const {
    items,price,saler,esawa,
  } = req.body;
  await mongooseConnect();
  const productsIds = items;
  const uniqueIds = [...new Set(productsIds)];
  const productsInfos = await Product.find({_id:uniqueIds});

  let line_items = [];
  for (const productId of uniqueIds) {
    const productInfo = productsInfos.find(p => p._id.toString() === productId);
    const quantity = productsIds.filter(id => id === productId)?.length || 0;
    if (quantity > 0 && productInfo) {
      line_items.push({
        quantity,
        price_data: {
          currency: 'USD',
          product_data: {name:productInfo.title},
          unit_amount: quantity * productInfo.price,
        },
      });
    }
  }

  const sellDoc = await Sale.create({
    line_items,price,saler,esawa,
  });
 

  res.json({
   sellDoc
  })

} 