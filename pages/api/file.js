import multer from 'multer';
import nextConnect from 'next-connect';
import mongoose from 'mongoose';

const handler = nextConnect();
const upload = multer({ storage: multer.memoryStorage() });

await mongooseConnect();

const dataSchema = new mongoose.Schema({
  // Define the fields for your schema
});

const DataModel = mongoose.models.Data || mongoose.model('Data', dataSchema);

handler.use(upload.single('file'));

handler.post(async (req, res) => {
  const fileBuffer = req.file.buffer;

  // Process the Excel file data using xlsx library
  const workbook = xlsx.read(fileBuffer, { type: 'buffer' });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = xlsx.utils.sheet_to_json(sheet);

  // Insert the data into the selected schema (selectedSchema from the front end)
  const selectedSchema = req.body.selectedSchema; // Get selected schema from the request

  try {
    // Create and save a new document for each row of data in the selected schema
    for (const row of data) {
      const newData = new DataModel(row);
      await newData.save();
    }

    res.status(200).json({ message: 'Data uploaded successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error uploading data to MongoDB' });
  }
});

export default handler;