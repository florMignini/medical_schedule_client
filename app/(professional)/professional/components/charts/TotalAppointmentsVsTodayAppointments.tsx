"use client";

import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import { getFullYear, getMonth } from "@/utils";
import { AppointmentsIncluded } from "@/interfaces";
import { filterTodayAppointments } from "@/utils/getChartsHelpers";
import { getProfessionalIncludesFromCookies } from "@/utils/getProfessionalIncludesFromCookies";

const chartConfig = {
  hoy: {
    label: "Hoy",
    color: "hsl(var(--chart-1))",
  },
  totales: {
    label: "Totales",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

const TotalAppointmentsVsTodayAppointments = ({
  appointments,
}: {
  appointments: AppointmentsIncluded[];
}) => {

  const filteredResult = filterTodayAppointments(appointments);
  const month = getMonth();
  const year = getFullYear();

  const chartData = [
    {
      name: "Turnos",
      hoy: filteredResult?.length,
      totales: appointments.length,
    },
  ];

  return (
    <Card className="w-full flex flex-col h-[200px] bg-gradient-to-br from-[#f9f9f9] to-[#f1f1f1] py-0">
      <CardHeader className="flex w-full h-[80px] bg-transparent items-center justify-start">
        <CardTitle>Turnos</CardTitle>
        <CardDescription>
          {month} - {year}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex w-full items-center justify-center p-0 min-[768px]:p-3">
        <ChartContainer
          config={chartConfig}
          className="mx-auto h-[130px] w-full"
        >
          <RadialBarChart
            data={chartData}
            startAngle={180}
            endAngle={0}
            innerRadius={65}
            outerRadius={80}
            barSize={12}
          >
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <PolarRadiusAxis
              tick={false}
              tickLine={false}
              axisLine={false}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) - 10}
                          className="text-gray-400 fill-foreground text-xl font-bold"
                        >
                          {filteredResult?.length}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 10}
                          className="text-muted-foreground fill-muted text-sm"
                        >
                          hoy
                        </tspan>
                      </text>
                    );
                  }
                  return null;
                }}
              />
            </PolarRadiusAxis>
            <RadialBar
              background
              dataKey="totales"
              cornerRadius={5}
              fill="hsl(var(--chart-2))"
            />
            <RadialBar
              dataKey="hoy"
              cornerRadius={5}
              fill="hsl(var(--chart-1))"
            />
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default TotalAppointmentsVsTodayAppointments;
