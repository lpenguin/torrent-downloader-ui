import React from 'react';
import { Torrent } from '../types/torrent';

interface TorrentListProps {
  torrents: Torrent[];
  loading: boolean;
  error: string | null;
}

export function TorrentList({ torrents, loading, error }: TorrentListProps) {
  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-gray-500">Loading torrents...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4 my-4">
        <div className="text-red-700">{error}</div>
      </div>
    );
  }

  if (torrents.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-md p-8 text-center">
        <div className="text-gray-500">No torrents found</div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Progress
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {torrents.map((torrent) => (
            <tr key={torrent.sha256Hash}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  {torrent.torrentName}
                </div>
                <div className="text-sm text-gray-500">
                  {torrent.sha256Hash.substring(0, 8)}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                  ${torrent.status?.downloadComplete 
                    ? 'bg-green-100 text-green-800'
                    : torrent.status?.error
                    ? 'bg-red-100 text-red-800'
                    : 'bg-yellow-100 text-yellow-800'
                  }`}>
                  {torrent.status?.downloadComplete 
                    ? 'Complete'
                    : torrent.status?.status || 'Unknown'}
                </span>
                {torrent.status?.error && (
                  <div className="text-sm text-red-500 mt-1">
                    {torrent.status.error}
                  </div>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {torrent.status?.downloadComplete ? (
                  <div className="text-green-600">
                    Download complete
                    {torrent.status.downloadPath && (
                      <div className="text-gray-500 text-xs mt-1">
                        {torrent.status.downloadPath}
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    {torrent.status?.startedAt && (
                      <div>
                        Started: {new Date(torrent.status.startedAt).toLocaleString()}
                      </div>
                    )}
                    {torrent.status?.stoppedAt && (
                      <div>
                        Stopped: {new Date(torrent.status.stoppedAt).toLocaleString()}
                      </div>
                    )}
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
