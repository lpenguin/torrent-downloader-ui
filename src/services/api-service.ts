import { Config } from '../types/config';
import { Torrent } from '../types/torrent';

export class ApiService {
  private config: Config;

  constructor(config: Config) {
    this.config = config;
  }

  private getHeaders(additionalHeaders: Record<string, string> = {}) {
    const credentials = btoa(`${this.config.username}:${this.config.password}`);
    return {
      'Authorization': `Basic ${credentials}`,
      ...additionalHeaders,
    };
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.headers.get('content-type')?.includes('application/json')
      ? response.json()
      : response.text() as Promise<T>;
  }

  private isArrayOfTorrents(data: unknown): data is Torrent[] {
    return Array.isArray(data) && data.every(item => 
      typeof item === 'object' && item !== null && 
      'sha256Hash' in item && 'torrentName' in item
    );
  }

  async getTorrents(): Promise<Torrent[]> {
    const response = await fetch(`${this.config.apiRootUrl}/torrents`, {
      headers: this.getHeaders(),
    });
    const data = await this.handleResponse<unknown>(response);
    
    if (!this.isArrayOfTorrents(data)) {
      console.error('Invalid torrents response:', data);
      return []; // Return empty array instead of throwing to prevent UI crashes
    }
    
    return data;
  }

  private getContentDisposition(filename: string): string {
    // Use only RFC 5987 encoded filename for consistent Unicode handling
    const encodedFilename = `UTF-8''${encodeURIComponent(filename).replace(/['()]/g, escape)}`;
    return `attachment; filename*=${encodedFilename}`;
  }

  async uploadTorrent(file: File): Promise<void> {
    const response = await fetch(`${this.config.apiRootUrl}/upload`, {
      method: 'POST',
      headers: this.getHeaders({
        'Content-Disposition': this.getContentDisposition(file.name)
      }),
      body: file,
    });

    return this.handleResponse<void>(response);
  }

  private getMagnetDisplayName(magnetLink: string): string {
    try {
      const url = new URL(magnetLink);
      const dn = url.searchParams.get('dn');
      return dn ? decodeURIComponent(dn) : 'unknown.torrent';
    } catch {
      return 'unknown.torrent';
    }
  }

  async uploadMagnet(magnetLink: string): Promise<void> {
    if (!magnetLink.startsWith('magnet:')) {
      throw new Error('Invalid magnet link format');
    }

    const filename = this.getMagnetDisplayName(magnetLink);
    const response = await fetch(`${this.config.apiRootUrl}/upload-magnet`, {
      method: 'POST',
      headers: this.getHeaders({ 
        'Content-Type': 'text/plain',
        'Content-Disposition': this.getContentDisposition(filename)
      }),
      body: magnetLink,
    });

    return this.handleResponse<void>(response);
  }

  async deleteTorrent(hash: string): Promise<void> {
    const response = await fetch(`${this.config.apiRootUrl}/torrents/${hash}/delete`, {
      method: 'DELETE',
      headers: this.getHeaders({ 'Content-Type': 'application/json' }),
    });
    return this.handleResponse<void>(response);
  }
}

// Create a hook for using the API service
import { useMemo } from 'react';

export function useApi(config: Config) {
  return useMemo(() => new ApiService(config), [
    config.apiRootUrl,
    config.username,
    config.password,
  ]);
}
