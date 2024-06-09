"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { toCalendarDate } from "@/utils/calendar-date";
import { formatReadableDate } from "@/utils/formatter";
import { CalendarDate, parseDate } from "@internationalized/date";
import { UserRole } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import { redirect } from "next/navigation";

export async function getForecastings(args: { productId: string }) {
  const session = await auth();

  if (!session) return redirect("/login");

  if (session.user.role !== UserRole.ADMIN)
    throw new Error(
      "Anda tidak memiliki akses untuk melihat data forecastings"
    );

  // Get sales of products
  const sales = await prisma.sales.findMany({
    where: { productId: args.productId },
    orderBy: {
      occurredAt: "asc",
    },
    select: {
      amount: true,
      occurredAt: true,
    },
  });

  // Group the sales per weeks
  // So when the sales on same day, they will be summed into one day
  // Then we can calculate total sales per week based on per day sales
  // After that, we can calculate the moving average based on last three weeks of sales
  // Record = { week: totalSales }
  let nextWeekDate: CalendarDate | null = null;
  let weekIndex = 1;
  const salesPerWeek: Map<number, Decimal> = new Map();

  sales.forEach((sale) => {
    const calendarDate = toCalendarDate(sale.occurredAt);

    if (!nextWeekDate) nextWeekDate = calendarDate.add({ weeks: 1 });

    if (calendarDate.compare(nextWeekDate) >= 0) {
      nextWeekDate = calendarDate.add({ weeks: 1 });
      weekIndex++;
    }

    const weekSalesSum = salesPerWeek.get(weekIndex) ?? new Decimal(0);
    const additionResult = weekSalesSum.add(sale.amount);

    salesPerWeek.set(weekIndex, additionResult);
  });

  // Calculate the moving average based on last three weeks of sales
  // Calculation started from week 3, because week 3 depends on week 1 & 2
  // So, we can't calculate moving average for week 1 & 2
  // Null is for week 1 & 2.
  const movingAverage: Map<number, number | null> = new Map();

  let offset1: Decimal | undefined = salesPerWeek.get(1);
  let offset2: Decimal | undefined = salesPerWeek.get(2);

  movingAverage.set(1, null);
  movingAverage.set(2, null);

  for (let i = 3; i <= salesPerWeek.size + 1; i++) {
    if (!offset1 || !offset2) {
      break;
    }

    const movingAverageValue = offset1.add(offset2).div(2);

    movingAverage.set(i, movingAverageValue.toNumber());

    const weekSales = salesPerWeek.get(i);

    offset1 = offset2;
    offset2 = weekSales;
  }

  const result: {
    week: number;
    sales: number;
    movingAverage: number;
  }[] = [];

  movingAverage.forEach((value, key) => {
    result.push({
      week: key,
      sales: salesPerWeek.get(key)?.toNumber() ?? 0,
      movingAverage: value ?? -1,
    });
  });

  return result;
}
