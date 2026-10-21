"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  formatWeekRange,
  getPlannerWeek,
} from "@/features/meal-planning/meal-planning-utils";

export function usePlannerWeek() {
  const [weekOffset, setWeekOffset] = useState(0);
  const [days, setDays] = useState([]);
  const [selectedDayKey, setSelectedDayKey] = useState("");

  useEffect(() => {
    const currentDays = getPlannerWeek(0);
    setDays(currentDays);
    setSelectedDayKey(
      currentDays.find((day) => day.isToday)?.key || currentDays[0].key,
    );
  }, []);

  const moveToWeek = useCallback((offset) => {
    const nextDays = getPlannerWeek(offset);
    setWeekOffset(offset);
    setDays(nextDays);
    setSelectedDayKey(
      nextDays.find((day) => day.isToday)?.key || nextDays[0].key,
    );
  }, []);

  const previousWeek = useCallback(
    () => moveToWeek(weekOffset - 1),
    [moveToWeek, weekOffset],
  );
  const nextWeek = useCallback(
    () => moveToWeek(weekOffset + 1),
    [moveToWeek, weekOffset],
  );
  const thisWeek = useCallback(() => moveToWeek(0), [moveToWeek]);
  const weekLabel = useMemo(() => formatWeekRange(days), [days]);

  return {
    days,
    weekOffset,
    selectedDayKey,
    setSelectedDayKey,
    weekLabel,
    previousWeek,
    nextWeek,
    thisWeek,
  };
}
