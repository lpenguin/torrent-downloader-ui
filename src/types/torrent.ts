export interface TaskStatus {
    status: string;
    lastStatus?: string;
    startedAt?: Date;
    stoppedAt?: Date;
    exitCode?: number;
    error?: string;
    downloadComplete: boolean;
    downloadPath?: string;
    downloadUrl?: string;
    files?: DownloadedFile[];
    logs?: string[];
}

export interface DownloadedFile {
    name: string;
    path: string;
    url?: string;
}

export interface Torrent {
    sha256Hash: string;
    torrentName: string;
    taskIdPath: string;
    status?: TaskStatus;
}

export interface TorrentsResponse {
    torrents: Torrent[];
}
