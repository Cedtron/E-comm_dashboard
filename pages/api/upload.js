import multiparty from 'multiparty';
import fs from 'fs';
import path from 'path';
import mime from 'mime-types';
import { mongooseConnect } from '@/lib/mongoose';
import { isAdminRequest } from '@/pages/api/auth/[...nextauth]';

export default async function handle(req, res) {
  await mongooseConnect();
  // await isAdminRequest(req, res);

  const form = new multiparty.Form();
  const { fields, files } = await new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      resolve({ fields, files });
    });
  });

  const links = [];
  for (const file of files.file) {
    const ext = file.originalFilename.split('.').pop();
    const newFilename = Date.now() + '.' + ext;
    const localFilePath = path.join(process.cwd(), 'public/uploads', newFilename);

    fs.copyFileSync(file.path, localFilePath);

    const link = `/uploads/${newFilename}`;
    links.push(link);
  }
  return res.json({ links });
}

export const config = {
  api: { bodyParser: false },
};
