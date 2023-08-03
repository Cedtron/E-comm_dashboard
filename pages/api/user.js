import {User} from "@/models/User";
import {mongooseConnect} from "@/lib/mongoose";
import {isAdminRequest} from "@/pages/api/auth/[...nextauth]";

export default async function handle(req, res) {
  const {method} = req;
  await mongooseConnect();
  await isAdminRequest(req,res);

  if (method === 'GET') {
    if (req.query?.id) {
      res.json(await User.findOne({_id:req.query.id}));
    } else {
      res.json(await User.find());
    }
  }

  if (method === 'POST') {
    const {name,email,image,emailVerified,role,password} = req.body;
    const UserDoc = await User.create({
      name,email,image,emailVerified,role,password})
    res.json(UserDoc);
  
  
  
  }

  if (method === 'PUT') {
    const {name,email,image,emailVerified,role,password,_id} = req.body;
    await User.updateOne({_id}, {name,email,image,emailVerified,role,password});
    res.json(true);
  }

  if (method === 'DELETE') {
    if (req.query?.id) {
      await User.deleteOne({_id:req.query?.id});
      res.json(true);
    }
  }
}