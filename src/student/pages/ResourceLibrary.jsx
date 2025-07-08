import { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';

const ResourceLibrary = () => {
  const [resources, setResources] = useState([]);

  useEffect(() => {
    const fetchResources = async () => {
      const { data, error } = await supabase
        .from('mentor_resources')
        .select(`
          id, title, description, file_url, created_at,
          profiles (first_name, last_name)
        `)
        .order('created_at', { ascending: false });

      if (error) console.error(error);
      else setResources(data || []);
    };

    fetchResources();
  }, []);

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold text-emerald-700 mb-6">Mentor Resource Library</h1>
      {resources.length === 0 ? (
        <p className="text-gray-500">No resources shared yet.</p>
      ) : (
        <ul className="space-y-6">
          {resources.map((res) => (
            <li key={res.id} className="bg-white p-4 shadow rounded-md">
              <h3 className="text-lg font-semibold text-emerald-800">{res.title}</h3>
              <p className="text-sm text-gray-600">{res.description}</p>
              <p className="text-xs text-gray-500 italic mt-1">
                By {res.profiles?.first_name} {res.profiles?.last_name}
              </p>
              <a
                href={res.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-2 text-blue-600 hover:underline text-sm"
              >
                Download
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ResourceLibrary;
