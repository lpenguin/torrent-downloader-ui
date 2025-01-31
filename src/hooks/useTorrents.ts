import { useState, useEffect } from 'react';
import { Config } from '../types/config';
import { Torrent } from '../types/torrent';

export function useTorrents(config: Config) {
  const [torrents, setTorrents] = useState<Torrent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTorrents = async () => {
    if (!config.apiRootUrl) {
      setLoading(false);
      return;
    }

    try {
      setError(null);
      const credentials = btoa(`${config.username}:${config.password}`);
      const response = await fetch(`${config.apiRootUrl}/torrents`, {
        headers: {
          'Authorization': `Basic ${credentials}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setTorrents(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch torrents');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (config.apiRootUrl) {
      // Initial fetch
      fetchTorrents();

      // Set up polling every 5 seconds
      const interval = setInterval(fetchTorrents, 5000);
      return () => clearInterval(interval);
    } else {
      setLoading(false);
    }
  }, [config.apiRootUrl, config.username, config.password]);

  const refetch = () => {
    setLoading(true);
    fetchTorrents();
  };

  return { torrents, loading, error, refetch };
}
