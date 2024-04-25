import { getUsers } from "@/actions/users.action";
import { NarrowArray } from "@/utils/type";

export type GetUsersCount = Awaited<ReturnType<typeof getUsers>>["count"];
export type GetUsersMany = Awaited<ReturnType<typeof getUsers>>["users"];
export type GetUsersSingle = NarrowArray<GetUsersMany>;
