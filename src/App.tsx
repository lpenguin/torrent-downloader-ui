import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useConfig } from './hooks/useConfig';
import { useTorrents } from './hooks/useTorrents';
import { ConfigForm } from './components/ConfigForm';
import { TorrentList } from './components/TorrentList';
import { AddTorrent } from './components/AddTorrent';

function App() {
  const { config, isConfigured, saveConfig, clearConfig } = useConfig();
  const { torrents, loading, error, refetch } = useTorrents(config);

  if (!isConfigured) {
    return <ConfigForm initialConfig={config} onSave={saveConfig} />;
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <div className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h1 className="text-2xl font-semibold text-gray-900">Torrents</h1>
                  <div className="flex items-center space-x-4">
                    <AddTorrent config={config} onSuccess={refetch} />
                    <button
                      onClick={clearConfig}
                      className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900"
                    >
                      Logout
                    </button>
                  </div>
                </div>
                <TorrentList torrents={torrents} loading={loading} error={error} />
              </div>
            } />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
