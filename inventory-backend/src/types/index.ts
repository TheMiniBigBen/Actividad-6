export interface InventoryItem {
    id: string;
    name: string;
    quantity: number;
    category: string;
    qrCode: string;
}

export interface CreateInventoryItemRequest {
    name: string;
    quantity: number;
    category: string;
    qrCode: string;
}

export interface UpdateInventoryItemRequest {
    name?: string;
    quantity?: number;
    category?: string;
    qrCode?: string;
}

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
}