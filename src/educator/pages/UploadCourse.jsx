import React, { useState } from 'react';
import { supabase } from '../../supabaseClient';
import { v4 as uuidv4 } from 'uuid';

const UploadCourse = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [thumbnail, setThumbnail] = useState(null);
  const [modules, setModules] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [progress, setProgress] = useState(0);

  const addModule = () => {
    setModules([...modules, { title: '', files: [] }]);
  };

  const updateModuleTitle = (index, newTitle) => {
    const updatedModules = [...modules];
    updatedModules[index].title = newTitle;
    setModules(updatedModules);
  };

  const updateModuleFiles = (index, fileList) => {
    const updatedModules = [...modules];
    updatedModules[index].files = Array.from(fileList);
    setModules(updatedModules);
  };

  const handleUpload = async () => {
    setUploading(true);
    setError('');
    setSuccess('');
    setProgress(0);

    if (!title || modules.length === 0) {
      setError('Please provide a course title and at least one module.');
      setUploading(false);
      return;
    }

    try {
      // Get current user
      const { data: { user }, error: sessionError } = await supabase.auth.getUser();
      if (sessionError || !user) throw new Error('Authentication failed. Please log in.');

      // Upload thumbnail to thumbnails bucket
      let thumbnailUrl = '';
      if (thumbnail) {
        setProgress(10);
        const thumbPath = `public/${uuidv4()}_${thumbnail.name}`;
        const { error: thumbErr } = await supabase.storage
          .from('thumbnails')
          .upload(thumbPath, thumbnail);

        if (thumbErr) throw thumbErr;

        const { data: { publicUrl } } = supabase.storage
          .from('thumbnails')
          .getPublicUrl(thumbPath);
        thumbnailUrl = publicUrl;
      }

      // Insert course into database
      setProgress(30);
      const { data: courseData, error: courseInsertError } = await supabase
        .from('courses')
        .insert({
          title,
          description,
          category,
          thumbnail_url: thumbnailUrl,
          educator_id: user.id,
        })
        .select()
        .single();

      if (courseInsertError) throw courseInsertError;
      const courseId = courseData.id;

      // Upload modules and files
      let moduleProgress = 40;
      const progressIncrement = 50 / modules.length;

      for (const [index, mod] of modules.entries()) {
        // Insert module
        const { data: modData, error: modError } = await supabase
          .from('modules')
          .insert({
            course_id: courseId,
            title: mod.title,
            order: index + 1
          })
          .select()
          .single();

        if (modError) throw modError;
        const moduleId = modData.id;

        // Upload files for this module
        for (const file of mod.files) {
          const fileExt = file.name.split('.').pop();
          const filePath = `courses/${courseId}/${moduleId}/${uuidv4()}.${fileExt}`;
          
          const { error: uploadError } = await supabase.storage
            .from('courses')
            .upload(filePath, file);

          if (uploadError) throw uploadError;

          // Generate signed URL for private access
          const { data: signedUrlData } = await supabase.storage
            .from('courses')
            .createSignedUrl(filePath, 60 * 60 * 24 * 7); // 1 week expiry

          await supabase.from('module_files').insert({
            module_id: moduleId,
            file_name: file.name,
            file_path: filePath,
            file_type: file.type,
            file_size: file.size,
            signed_url: signedUrlData?.signedUrl
          });
        }

        moduleProgress += progressIncrement;
        setProgress(moduleProgress);
      }

      // Success
      setProgress(100);
      setSuccess('Course uploaded successfully!');
      resetForm();
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.message || 'Failed to upload course');
      setProgress(0);
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setCategory('');
    setThumbnail(null);
    setModules([]);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Upload New Course</h1>

      {/* Progress Bar */}
      {uploading && (
        <div className="mb-4">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            Uploading... {Math.round(progress)}%
          </p>
        </div>
      )}

      {/* Course Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block mb-1 font-medium">Course Title*</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Category</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Description</label>
        <textarea
          className="w-full p-2 border rounded"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      {/* Thumbnail Upload */}
      <div className="mb-6">
        <label className="block mb-1 font-medium">Thumbnail Image</label>
        <input
          type="file"
          accept="image/jpeg,image/png"
          onChange={(e) => setThumbnail(e.target.files?.[0] || null)}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
        />
        <p className="text-xs text-gray-500 mt-1">JPEG or PNG, max 5MB</p>
      </div>

      {/* Modules Section */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-medium">Modules*</h2>
          <button
            type="button"
            onClick={addModule}
            className="flex items-center text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded"
          >
            <span className="mr-1">+</span> Add Module
          </button>
        </div>

        {modules.length === 0 ? (
          <p className="text-sm text-gray-500">No modules added yet</p>
        ) : (
          <div className="space-y-4">
            {modules.map((mod, index) => (
              <div key={index} className="border rounded-lg p-4 bg-white">
                <div className="mb-3">
                  <label className="block mb-1 font-medium">Module {index + 1} Title*</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded"
                    value={mod.title}
                    onChange={(e) => updateModuleTitle(index, e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium">Files</label>
                  <input
                    type="file"
                    multiple
                    onChange={(e) => updateModuleFiles(index, e.target.files)}
                    className="block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded file:border-0
                      file:text-sm file:font-semibold
                      file:bg-gray-50 file:text-gray-700
                      hover:file:bg-gray-100"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {mod.files.length} file(s) selected
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Status Messages */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
          {success}
        </div>
      )}

      {/* Submit Button */}
      <button
        onClick={handleUpload}
        disabled={uploading}
        className={`px-6 py-2 rounded text-white font-medium ${
          uploading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {uploading ? 'Uploading...' : 'Upload Course'}
      </button>
    </div>
  );
};

export default UploadCourse;