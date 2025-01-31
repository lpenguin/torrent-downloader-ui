interface FileListProps {
  files: Array<{
    name: string;
    url?: string;
  }>;
  isOpen: boolean;
  onClose: () => void;
}

export function FileList({ files, isOpen, onClose }: FileListProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] flex flex-col">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">Downloaded Files</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <span className="sr-only">Close</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-4 overflow-auto flex-1">
          {files.length === 0 ? (
            <p className="text-gray-500 text-center">No files found</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {files.map((file, index) => (
                <li key={index} className="py-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-900">{file.name}</span>
                    {file.url && (
                      <a
                        href={file.url}
                        className="ml-4 text-sm font-medium text-indigo-600 hover:text-indigo-500"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Download
                      </a>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
