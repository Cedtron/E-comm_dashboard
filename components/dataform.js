import { useState } from 'react';
import axios from 'axios';

export default function Dataform() {
  const [file, setFile] = useState(null);
  const [backupMessage, setBackupMessage] = useState('');
  const [restoreMessage, setRestoreMessage] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleBackup = async () => {
    try {
      const response = await axios.get('/api/data');
      setBackupMessage(response.data.message);
    } catch (error) {
      setBackupMessage('Backup failed');
    }
  };

  const handleRestore = async () => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('/api/data', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setRestoreMessage(response.data.message);
    } catch (error) {
      setRestoreMessage('Restore failed');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Backup and Restore</h1>

      <div className="mb-4">
        <button
          onClick={handleBackup}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Backup 
        </button>
        <p className="text-green-500">{backupMessage}</p>
      </div>

      <div className="mb-4">
        <input type="file" onChange={handleFileChange} />
        <button
          onClick={handleRestore}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Restore
        </button>
        <p className="text-green-500">{restoreMessage}</p>
      </div>
    </div>
  );
}