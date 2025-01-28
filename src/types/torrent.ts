export interface TaskStatus {
    status: string;
    lastStatus?: string;
    startedAt?: Date;
    stoppedAt?: Date;
    exitCode?: number;
    error?: string;
    downloadComplete: boolean;
    downloadPath?: string;
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
