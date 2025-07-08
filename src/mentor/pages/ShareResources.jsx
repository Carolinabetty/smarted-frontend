import { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';

const ShareResources = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [resources, setResources] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState('');

  // Fetch resources on component mount
  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('mentor_resources')
        .select('*')
        .eq('mentor_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setResources(data || []);
    } catch (err) {
      console.error('Error fetching resources:', err);
      setError('Failed to load resources');
    }
  };

  // Handle file selection with preview
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    // Create preview for images
    if (selectedFile?.type.startsWith('image/')) {
      setPreviewUrl(URL.createObjectURL(selectedFile));
    } else {
      setPreviewUrl('');
    }
  };

  const handleUpload = async () => {
    setLoading(true);
    setError('');
    setUploadProgress(0);

    try {
      // Validate inputs
      if (!title.trim()) throw new Error('Title is required');
      if (!file) throw new Error('Please select a file');

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Upload file
      const fileName = `${user.id}/${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
      const filePath = `resources/${fileName}`;

      // Upload with progress tracking
      const { error: uploadError } = await supabase.storage
        .from('resources')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = await supabase.storage
        .from('resources')
        .getPublicUrl(filePath);

      // Prepare data for insertion
      const resourceData = {
        mentor_id: user.id,
        title,
        description,
        file_url: publicUrl
      };

      // Check if additional columns exist before adding them
      const tableInfo = await supabase
        .rpc('get_table_columns', { table_name: 'mentor_resources' });

      if (!tableInfo.error) {
        const columns = tableInfo.data;
        if (columns.some(col => col.column_name === 'file_name')) {
          resourceData.file_name = file.name;
        }
        if (columns.some(col => col.column_name === 'file_type')) {
          resourceData.file_type = file.type;
        }
        if (columns.some(col => col.column_name === 'file_size')) {
          resourceData.file_size = file.size;
        }
      }

      // Insert into database
      const { error: dbError } = await supabase
        .from('mentor_resources')
        .insert(resourceData);

      if (dbError) throw dbError;

      // Success
      setUploadProgress(100);
      setTitle('');
      setDescription('');
      setFile(null);
      setPreviewUrl('');
      document.getElementById('fileInput').value = '';
      await fetchResources();
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (resource) => {
    if (!window.confirm('Are you sure you want to delete this resource?')) return;

    try {
      // Extract file path from URL
      const filePath = resource.file_url.split('/storage/v1/object/public/resources/')[1];

      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('resources')
        .remove([filePath]);

      if (storageError) throw storageError;

      // Delete from database
      const { error: dbError } = await supabase
        .from('mentor_resources')
        .delete()
        .eq('id', resource.id);

      if (dbError) throw dbError;

      // Refresh list
      await fetchResources();
    } catch (err) {
      console.error('Delete error:', err);
      setError('Failed to delete resource');
    }
  };

  // File type icon mapping
  const getFileIcon = (fileType) => {
    if (!fileType) return '📄';
    
    if (fileType.startsWith('image/')) return '🖼️';
    if (fileType.includes('pdf')) return '📕';
    if (fileType.includes('word')) return '📝';
    if (fileType.includes('zip')) return '🗄️';
    
    return '📄';
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Share Resources</h1>
      
      {/* Upload Form */}
      <div className="bg-gray-50 p-6 rounded-lg mb-8 border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Upload New Resource</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded border border-red-100">
            {error}
          </div>
        )}

        {/* Progress Bar */}
        {uploadProgress > 0 && (
          <div className="mb-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full" 
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-1 text-right">
              {uploadProgress}% complete
            </p>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Resource Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Calculus Study Guide"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Brief description of this resource"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              File *
            </label>
            <input
              id="fileInput"
              type="file"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded file:border-0
                file:text-sm file:font-medium
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
            />
            {file && (
              <p className="mt-1 text-sm text-gray-500">
                Selected: {file.name} ({Math.round(file.size / 1024)} KB)
              </p>
            )}
            {previewUrl && (
              <div className="mt-2">
                <img 
                  src={previewUrl} 
                  alt="Preview" 
                  className="max-h-40 rounded border border-gray-200"
                  onLoad={() => URL.revokeObjectURL(previewUrl)}
                />
              </div>
            )}
          </div>

          <button
            onClick={handleUpload}
            disabled={loading}
            className={`mt-2 px-4 py-2 rounded-md text-white font-medium ${
              loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {loading ? 'Uploading...' : 'Upload Resource'}
          </button>
        </div>
      </div>

      {/* Resources List */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-700">Your Resources</h2>
          <span className="text-sm text-gray-500">
            {resources.length} {resources.length === 1 ? 'item' : 'items'}
          </span>
        </div>

        {resources.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p className="text-lg">No resources shared yet</p>
            <p className="text-sm mt-1">Upload your first resource above</p>
          </div>
        ) : (
          <div className="space-y-3">
            {resources.map((resource) => (
              <div 
                key={resource.id} 
                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl mt-1">
                    {getFileIcon(resource.file_type)}
                  </span>
                  <div className="flex-1 min-w-0">
                    <a
                      href={resource.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block font-medium text-blue-600 hover:text-blue-800 truncate"
                    >
                      {resource.title}
                    </a>
                    <p className="text-sm text-gray-500 mt-1">
                      {resource.file_name || 'File'} • {resource.file_size ? `${Math.round(resource.file_size / 1024)} KB` : ''}
                    </p>
                    {resource.description && (
                      <p className="text-sm text-gray-600 mt-2">
                        {resource.description}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => handleDelete(resource)}
                    className="text-red-500 hover:text-red-700 p-1"
                    title="Delete resource"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShareResources;