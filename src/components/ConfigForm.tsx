import { useState } from 'react';
import { Config } from '../types/config';

interface ConfigFormProps {
  initialConfig: Config;
  onSave: (config: Config) => void;
}

export function ConfigForm({ initialConfig, onSave }: ConfigFormProps) {
  const [config, setConfig] = useState<Config>(initialConfig);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(config);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-slate-800">Torrent Downloader Configuration</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="apiRootUrl" className="block text-sm font-medium text-slate-700 mb-1">
              API Root URL
            </label>
            <input
              type="url"
              id="apiRootUrl"
              value={config.apiRootUrl}
              onChange={(e) => setConfig({ ...config, apiRootUrl: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="https://api.example.com"
              required
            />
          </div>
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-slate-700 mb-1">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={config.username}
              onChange={(e) => setConfig({ ...config, username: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter username"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={config.password}
              onChange={(e) => setConfig({ ...config, password: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
          >
            Save Configuration
          </button>
        </form>
      </div>
    </div>
  );
}
