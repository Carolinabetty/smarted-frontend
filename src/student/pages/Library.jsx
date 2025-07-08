import { useState, useEffect } from 'react';
import { supabase } from "../../supabaseClient"; // Your original path

export default function Library() {
  const [books, setBooks] = useState([]);
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const { data, error } = await supabase
        .storage
        .from('library')
        .list();

      if (error) throw error;

      const booksWithUrls = await Promise.all(
        data.map(async (file) => {
          const { data: { publicUrl } } = supabase
            .storage
            .from('library')
            .getPublicUrl(file.name);

          return {
            name: file.name,
            url: publicUrl,
            uploadedAt: file.created_at
          };
        })
      );

      setBooks(booksWithUrls);
    } catch (err) {
      setError('Failed to load books');
      console.error(err);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!title || !file) {
      setError('Please provide both title and file');
      return;
    }

    setUploading(true);
    setError(null);
    const fileExt = file.name.split('.').pop();
    const fileName = `${title.replace(/\s+/g, '_')}_${Date.now()}.${fileExt}`;

    try {
      const { error: uploadError } = await supabase
        .storage
        .from('library')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      setSuccess('Book uploaded successfully!');
      setTitle('');
      setFile(null);
      document.getElementById('fileInput').value = '';
      await fetchBooks();
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Library</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Upload a Book</h2>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        {success && <div className="text-green-500 mb-4">{success}</div>}
        
        <form onSubmit={handleUpload}>
          <div className="mb-4">
            <label className="block mb-2">Book Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block mb-2">Book File (PDF, EPUB)</label>
            <input
              id="fileInput"
              type="file"
              accept=".pdf,.epub"
              onChange={(e) => setFile(e.target.files[0])}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={uploading}
            className={`px-4 py-2 rounded text-white ${uploading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {uploading ? 'Uploading...' : 'Upload Book'}
          </button>
        </form>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Available Books</h2>
        {books.length === 0 ? (
          <p>No books available yet</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {books.map((book) => (
              <div key={book.name} className="bg-white p-4 rounded-lg shadow-md border">
                <h3 className="font-medium">{book.name.split('_')[0]}</h3>
                <p className="text-sm text-gray-500 mb-2">
                  {new Date(book.uploadedAt).toLocaleDateString()}
                </p>
                <a
                  href={book.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline inline-block mt-2"
                >
                  Download
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}