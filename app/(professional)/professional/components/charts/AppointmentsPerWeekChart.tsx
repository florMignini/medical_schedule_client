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
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { motion } from "framer-motion";

interface Props {
  appointments: AppointmentsIncluded[];
}

export default function AppointmentsPerWeekChart({ appointments }: Props) {
  const today = dayjs();
  const last7Days = [...Array(7)].map((_, i) =>
    today.subtract(i, "day").startOf("day")
  );

  const data = last7Days
    .map((day) => {
      const count = appointments.filter(({ appointment }) =>
        dayjs(appointment.schedule).isSame(day, "day")
      ).length;

      return {
        day: day.format("ddd DD/MM"), // Ej: Lun 29/07
        count,
      };
    })
    .reverse();

  return (
    <Card className="w-full bg-background border border-border rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300">
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <CardTitle className="text-lg font-semibold text-foreground">
              Turnos por semana
            </CardTitle>
            <CardDescription className="text-muted-foreground text-xs lg:text-sm">
              Cantidad de turnos agendados en los últimos 7 días
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="relative w-full h-auto">
        <div className="w-full aspect-[16/9] h-[290px] l:h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
              <XAxis
                dataKey="day"
                tick={{ fontSize: 12 }}
                tickMargin={8}
                axisLine={false}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fontSize: 12 }}
                axisLine={false}
              />
              <Tooltip
                cursor={{ fill: "rgba(0,0,0,0.05)" }}
                contentStyle={{
                  borderRadius: "8px",
                  background: "rgba(255,255,255,0.9)",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                  border: "1px solid rgba(0,0,0,0.1)",
                }}
              />
              <Bar
                dataKey="count"
                fill="hsl(var(--chart-3))"
                radius={[6, 6, 0, 0]}
                barSize={28}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
