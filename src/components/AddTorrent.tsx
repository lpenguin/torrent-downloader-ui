import React, { useState } from 'react';
import { Config } from '../types/config';

interface AddTorrentProps {
  config: Config;
  onSuccess: () => void;
}

export function AddTorrent({ config, onSuccess }: AddTorrentProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState<string | File>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.type === 'file') {
      const file = event.target.files?.[0];
      if (file) setInput(file);
    } else {
      setInput(event.target.value);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input) return;

    setIsLoading(true);
    setError(null);

    try {
      const credentials = btoa(`${config.username}:${config.password}`);
      const isMagnet = typeof input === 'string' && input.startsWith('magnet:');
      
      const response = await fetch(`${config.apiRootUrl}/${isMagnet ? 'upload-magnet' : 'upload'}`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${credentials}`,
          ...(isMagnet && { 'Content-Type': 'text/plain' }),
        },
        body: input,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      onSuccess();
      setIsOpen(false);
      setInput('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add torrent');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Add Torrent
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Add New Torrent
              </h3>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <form onSubmit={handleUpload} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Torrent File or Magnet Link
                  </label>
                  <input
                    type="file"
                    accept=".torrent"
                    onChange={handleInputChange}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 mb-2"
                  />
                  <input
                    type="text"
                    placeholder="Or paste magnet link here..."
                    onChange={handleInputChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading || !input}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                  >
                    {isLoading ? 'Adding...' : 'Add Torrent'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
