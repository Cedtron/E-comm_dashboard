import multer from 'multer';
import nextConnect from 'next-connect';
import fs from 'fs';
import { mongooseConnect } from '@/lib/mongoose';

const handler = nextConnect();
const upload = multer({ storage: multer.memoryStorage() });

// Define a MongoDB collection you want to backup/restore
const collection = client.db('shopy').collection('your-collection');

// Middleware for MongoDB connection
handler.use(async (req, res, next) => {
  await mongooseConnect();
  next();
});

// Backup route
handler.get(async (req, res) => {
  try {
    // Export the data from MongoDB and save it to 'backup.json'
    const data = await collection.find({}).toArray();
    fs.writeFileSync('backup.json', JSON.stringify(data, null, 2));
    res.status(200).json({ message: 'Backup completed successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Backup failed' });
  }
});

// Restore route
handler.post(upload.single('file'), async (req, res) => {
  try {
    // Read the uploaded JSON file and insert data back into MongoDB
    const fileData = JSON.parse(req.file.buffer.toString());
    await collection.deleteMany({});
    await collection.insertMany(fileData);
    res.status(200).json({ message: 'Restore completed successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Restore failed' });
  }
});

export default handler;