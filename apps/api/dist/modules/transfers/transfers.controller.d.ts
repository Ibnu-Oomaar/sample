import { TransferStatus } from '@ekaydi/shared-types';
export declare class TransfersController {
    findAll(): {
        id: string;
        transferNo: string;
        sourceWarehouseName: string;
        destWarehouseName: string;
        status: TransferStatus;
        totalQuantity: number;
    }[];
    advanceStatus(id: string, body: {
        status: TransferStatus;
    }): {
        id: string;
        status: TransferStatus;
        timestamp: string;
        updatedBy: string;
    };
}
