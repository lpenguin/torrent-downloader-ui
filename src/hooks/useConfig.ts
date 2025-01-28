import { useState, useEffect } from 'react';
import { Config, DEFAULT_CONFIG } from '../types/config';

const CONFIG_KEY = 'torrent_downloader_config';

export function useConfig() {
  const [config, setConfig] = useState<Config>(DEFAULT_CONFIG);
  const [isConfigured, setIsConfigured] = useState(false);

  useEffect(() => {
    const savedConfig = localStorage.getItem(CONFIG_KEY);
    if (savedConfig) {
      setConfig(JSON.parse(savedConfig));
      setIsConfigured(true);
    }
  }, []);

  const saveConfig = (newConfig: Config) => {
    localStorage.setItem(CONFIG_KEY, JSON.stringify(newConfig));
    setConfig(newConfig);
    setIsConfigured(true);
  };

  const clearConfig = () => {
    localStorage.removeItem(CONFIG_KEY);
    setConfig(DEFAULT_CONFIG);
    setIsConfigured(false);
  };

  return {
    config,
    isConfigured,
    saveConfig,
    clearConfig,
  };
}
