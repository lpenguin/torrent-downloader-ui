import { useState } from 'react';
import { Config } from '../types/config';

interface UseTorrentActionsResult {
  deleteTorrent: (hash: string) => Promise<void>;
  loading: boolean;
  error: string | null;
}

export function useTorrentActions(config: Config): UseTorrentActionsResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteTorrent = async (hash: string) => {
    setLoading(true);
    setError(null);

    try {
      const credentials = btoa(`${config.username}:${config.password}`);
      const response = await fetch(`${config.apiRootUrl}/torrents/${hash}/delete`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Basic ${credentials}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to delete torrent: ${response.statusText}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete torrent');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    deleteTorrent,
    loading,
    error,
  };
}
