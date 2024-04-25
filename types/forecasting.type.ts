import { getForecastings } from "@/actions/forecastings.action";
import { NarrowArray } from "@/utils/type";

export type GetForecastingMany = Awaited<ReturnType<typeof getForecastings>>;
export type GetForecastingSingle = NarrowArray<GetForecastingMany>;
