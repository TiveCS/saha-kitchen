export type NarrowArray<T> = T extends Array<infer U> ? U : never;
