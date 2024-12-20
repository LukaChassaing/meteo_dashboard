export interface Measurement {
    temperature: number;
    humidity: number;
    location: string;
    timestamp: string;
}

export interface LocationStats {
    location: string;
    current: {
        temperature: number;
        humidity: number;
    };
    daily: {
        average: {
            temperature: number;
            humidity: number;
        };
        min_temperature: number;
        max_temperature: number;
    };
}