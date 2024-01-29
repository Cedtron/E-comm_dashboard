import { mongooseConnect } from '@/lib/mongoose';
import { Product } from '@/models/Product';

export default async function handle(req, res) {
  try {
    await mongooseConnect();
    
    // Validate input (assuming 'ids' is an array of valid ObjectId strings)
    const ids = Array.isArray(req.body.ids) ? req.body.ids : [];
// console.log(ids)
    // Fetch products based on the provided ids
    const products = await Product.find({ _id: { $in: ids } });

    // Check if products were found
    if (products.length === 0) {
      return res.status(404).json({ error: 'Products not found' });
    }

    // Return the products in the response
    res.status(200).json(products);
  } catch (error) {
    // Handle errors and send an appropriate response
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
