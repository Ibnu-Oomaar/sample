export declare class WarehousesController {
    findAll(): {
        id: string;
        code: string;
        name: string;
        city: string;
        capacitySqm: number;
        totalCapacityPallets: number;
        currentOccupancyPallets: number;
        isActive: boolean;
    }[];
    findOne(id: string): {
        id: string;
        code: string;
        name: string;
        city: string;
        capacitySqm: number;
        totalCapacityPallets: number;
        currentOccupancyPallets: number;
        zones: {
            code: string;
            name: string;
            currentPallets: number;
            capacityPallets: number;
        }[];
    };
}
