import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Stats {
    totalOrders: bigint;
    closedOrders: bigint;
    completeDelivery: bigint;
    pendingDelivery: bigint;
    bricksDue: bigint;
    totalDueAmount: bigint;
}
export interface UpdateStatRequest {
    totalOrders?: bigint;
    closedOrders?: bigint;
    completeDelivery?: bigint;
    pendingDelivery?: bigint;
    bricksDue?: bigint;
    totalDueAmount?: bigint;
}
export interface backendInterface {
    decrementField(field: string, amount: bigint): Promise<void>;
    getStats(): Promise<Stats>;
    incrementField(field: string, amount: bigint): Promise<void>;
    updateStats(request: UpdateStatRequest): Promise<void>;
}
