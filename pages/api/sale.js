import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";
import { Sale } from "@/models/Sale";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.json('Should be a POST request');
    return;
  }

  const {
    items, price, saler, esawa, dprice,
  } = req.body;

  await mongooseConnect();

  const productsIds = items;
  const uniqueIds = [...new Set(productsIds)];
  const productsInfos = await Product.find({ _id: uniqueIds });

  let line_items = [];


  for (const productId of uniqueIds) {
    const productInfo = productsInfos.find(p => p._id.toString() === productId);
    const quantity = productsIds.filter(id => id === productId)?.length || 0;

    if (quantity > 0 && productInfo) {
      // Use the edited price if available, otherwise use the original price
      const editedPrice = dprice.find(ep => ep.productId === productId);
      const unit_amount = (editedPrice ? editedPrice.price : productInfo.price) * quantity;
      line_items.push({
        quantity,
        price_data: {
          currency: 'UGX',
          product_data: { name: productInfo.title,prices:productInfo.price,costprice: productInfo.costprice*quantity},
          unit_amount,
        },
      });

      // Subtract sold quantity from the stock and update in the database
      const updatedStock = productInfo.stock - quantity;
      await Product.updateOne({ _id: productId }, { stock: updatedStock });
    }
  }

  const sellDoc = await Sale.create({
    line_items,
    price,
    saler,
    esawa,
  });

  res.json({
    sellDoc,
  });
}

