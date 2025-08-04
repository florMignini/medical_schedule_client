"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import dayjs from "dayjs";
import { AppointmentsIncluded } from "@/interfaces";

interface Props {
  appointments: AppointmentsIncluded[];
}

export default function AppointmentsPerWeekChart({ appointments }: Props) {
  const today = dayjs();
  const last7Days = [...Array(7)].map((_, i) => today.subtract(i, "day").startOf("day"));
console.log(appointments)
  const data = last7Days
    .map((day) => {
      const count = appointments.filter(({appointment}) =>
        dayjs(appointment.schedule).isSame(day, "day")
      ).length;

      return {
        day: day.format("ddd DD/MM"), // Ej: Lun 29/07
        count,
      };
    })
    .reverse();

  return (
    <div className="w-full h-[350px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="count" fill="#60A5FA" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
