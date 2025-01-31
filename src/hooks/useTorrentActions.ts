import { useState } from 'react';
import { Config } from '../types/config';
import { useApi } from '../services/api-service';

interface UseTorrentActionsResult {
  deleteTorrent: (hash: string) => Promise<void>;
  loading: boolean;
  error: string | null;
}

export function useTorrentActions(config: Config): UseTorrentActionsResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const api = useApi(config);

  const deleteTorrent = async (hash: string) => {
    setLoading(true);
    setError(null);

    try {
      await api.deleteTorrent(hash);
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
