export declare class HealthController {
    check(): {
        status: string;
        engine: string;
        database: string;
        timestamp: string;
        uptimeSeconds: number;
        offlineSyncGateway: string;
    };
    ping(): void;
}
