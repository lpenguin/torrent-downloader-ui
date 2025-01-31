import { useState } from 'react';
import { Torrent } from '../types/torrent';
import { FileList } from './FileList';
import { LogsDialog } from './LogsDialog';
import { useTorrentActions } from '../hooks/useTorrentActions';
import { Config } from '../types/config';

interface TorrentListProps {
  torrents: Torrent[];
  loading: boolean;
  error: string | null;
  config: Config;
  onTorrentAction: () => void;
}

export function TorrentList({ torrents, loading, error, config, onTorrentAction }: TorrentListProps) {
  const [selectedTorrent, setSelectedTorrent] = useState<Torrent | null>(null);
  const [logsForTorrent, setLogsForTorrent] = useState<Torrent | null>(null);

  const { deleteTorrent, loading: actionLoading } = useTorrentActions(config);

  const handleDelete = async (hash: string) => {
    if (window.confirm('Are you sure you want to delete this torrent? This will stop the download and remove all files.')) {
      try {
        await deleteTorrent(hash);
        onTorrentAction();
      } catch (err) {
        console.error('Failed to delete torrent:', err);
      }
    }
  };

  if (loading || actionLoading) {
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
    <>
      <div className="bg-white shadow-sm rounded-lg">
        <div className="bg-gray-50 flex divide-x divide-gray-200">
          <div className="w-[50%] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Name
          </div>
          <div className="w-[20%] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Status
          </div>
          <div className="w-[30%] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Progress
          </div>
        </div>
        <div className="divide-y divide-gray-200">
            {torrents.map((torrent) => (
              <div key={torrent.sha256Hash} className="flex divide-x divide-gray-200">
                <div className="w-[50%] px-6 py-4">
                  <div className="text-sm font-medium text-gray-900 truncate overflow-hidden">
                    {torrent.torrentName}
                  </div>
                  <div className="text-sm text-gray-500">
                    {torrent.sha256Hash.substring(0, 8)}
                  </div>
                </div>
                <div className="w-[20%] px-6 py-4 whitespace-nowrap">
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
                </div>
                <div className="w-[30%] px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {torrent.status?.downloadComplete ? (
                    <div className="text-green-600">
                      Download complete
                      <div className="flex gap-2 mt-1">
                        {torrent.status.files && torrent.status.files.length > 0 && (
                          <button
                            onClick={() => setSelectedTorrent(torrent)}
                            className="text-xs font-medium text-indigo-600 hover:text-indigo-900 bg-indigo-50 px-2 py-1 rounded"
                          >
                            View Files ({torrent.status.files.length})
                          </button>
                        )}
                        <button
                          onClick={() => setLogsForTorrent(torrent)}
                          className="text-xs font-medium text-indigo-600 hover:text-indigo-900 bg-indigo-50 px-2 py-1 rounded"
                        >
                          Logs
                        </button>
                        {torrent.status.downloadUrl && (
                          <a
                            href={torrent.status.downloadUrl}
                            className="text-xs font-medium text-indigo-600 hover:text-indigo-900 bg-indigo-50 px-2 py-1 rounded"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Download
                          </a>
                        )}
                        <button
                          onClick={() => handleDelete(torrent.sha256Hash)}
                          className="text-xs font-medium text-red-600 hover:text-red-900 bg-red-50 px-2 py-1 rounded"
                        >
                          Delete
                        </button>
                      </div>
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
                      <div className="flex gap-2 mt-1">
                        <div className="flex gap-2">
                          <button
                            onClick={() => setLogsForTorrent(torrent)}
                            className="text-xs font-medium text-indigo-600 hover:text-indigo-900 bg-indigo-50 px-2 py-1 rounded"
                          >
                            Logs
                          </button>
                          <button
                            onClick={() => handleDelete(torrent.sha256Hash)}
                            className="text-xs font-medium text-red-600 hover:text-red-900 bg-red-50 px-2 py-1 rounded"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
        </div>
      </div>

      {selectedTorrent && selectedTorrent.status?.files && (
        <FileList
          files={selectedTorrent.status.files}
          isOpen={!!selectedTorrent}
          onClose={() => setSelectedTorrent(null)}
        />
      )}
      {logsForTorrent && (
        <LogsDialog
          logs={logsForTorrent.status?.logs || []}
          isOpen={!!logsForTorrent}
          onClose={() => setLogsForTorrent(null)}
        />
      )}
    </>
  );
}
