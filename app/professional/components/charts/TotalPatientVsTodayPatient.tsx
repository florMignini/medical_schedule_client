"use client";
import { TrendingUp } from "lucide-react";
import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { AppointmentsIncluded, PatientsIncluded } from "@/interfaces";
import { filterTodayAppointments } from "@/utils/getChartsHelpers";

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

const TotalPatientVsTodayPatient = ({
  patients,
  appointments,
}: {
  patients: PatientsIncluded[],
  appointments: AppointmentsIncluded[];
}) => {
  // today appointments === today patients
const filteredResult = filterTodayAppointments(appointments);
  const month = getMonth();
  const year = getFullYear();
  const chartData = [{ month, hoy: filteredResult.length, totales: patients.length }];
  const totalVisitors = chartData[0].hoy + chartData[0].totales;
  return (
    <Card className="w-full flex flex-col h-[180px] bg-gradient-to-br from-[#f9f9f9] to-[#f1f1f1] py-0">
      <CardHeader className="flex w-full h-[80px] bg-transparent items-center justify-start">
        <CardTitle>Pacientes</CardTitle>
        <CardDescription>{month} - {year}</CardDescription>
      </CardHeader>
      <CardContent className="flex w-full items-center">
        <ChartContainer
          config={chartConfig}
          className="mx-auto h-[130px] w-full"
        >
          <RadialBarChart
          className="w-[100%]"
            data={chartData}
            endAngle={180}
            innerRadius={70}
            outerRadius={50}
          >
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <PolarRadiusAxis 
            className=""
            tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text 
                      x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) - 10}
                          className="text-gray-400 fill-foreground text-xl font-bold"
                        >
                          {totalVisitors.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 4}
                          className="text-gray-400 fill-muted-foreground"
                        >
                          Pacientes
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </PolarRadiusAxis>
            <RadialBar
              dataKey="hoy"
              stackId="a"
              cornerRadius={5}
              fill="var(--color-hoy)"
              className="stroke-transparent"
            />
            <RadialBar
              dataKey="totales"
              fill="var(--color-totales)"
              stackId="a"
              cornerRadius={5}
              className="stroke-transparent"
            />
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default TotalPatientVsTodayPatient;
