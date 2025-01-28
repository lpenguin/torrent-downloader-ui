import React, { useState } from 'react';
import { Config } from '../types/config';

interface AddTorrentProps {
  config: Config;
  onSuccess: () => void;
}

export function AddTorrent({ config, onSuccess }: AddTorrentProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [magnetLink, setMagnetLink] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setError(null);

    try {
      const credentials = btoa(`${config.username}:${config.password}`);
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${config.apiRootUrl}/`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${credentials}`,
        },
        body: file,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      onSuccess();
      setIsOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload torrent');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMagnetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!magnetLink.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const credentials = btoa(`${config.username}:${config.password}`);
      const response = await fetch(`${config.apiRootUrl}/upload-magnet`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${credentials}`,
          'Content-Type': 'text/plain',
        },
        body: magnetLink.trim(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      onSuccess();
      setIsOpen(false);
      setMagnetLink('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add magnet link');
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

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Torrent File
                  </label>
                  <input
                    type="file"
                    accept=".torrent"
                    onChange={handleFileUpload}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">OR</span>
                  </div>
                </div>

                <form onSubmit={handleMagnetSubmit}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Magnet Link
                  </label>
                  <input
                    type="text"
                    value={magnetLink}
                    onChange={(e) => setMagnetLink(e.target.value)}
                    placeholder="magnet:?xt=urn:btih:..."
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                  <div className="mt-4 flex justify-end space-x-3">
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
                      disabled={isLoading || !magnetLink.trim()}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                    >
                      {isLoading ? 'Adding...' : 'Add Magnet'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
