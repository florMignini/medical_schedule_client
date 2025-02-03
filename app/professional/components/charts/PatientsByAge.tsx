"use client";

import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
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

const chartConfig = {
  femenino: {
    label: "femenino",
    color: "hsl(var(--chart-1))",
  },
  masculino: {
    label: "masculino",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;
// data to render
const chartData = [
  { age: 20, femenino: 186, masculino: 80 },
  { age: 30, femenino: 305, masculino: 200 },
  { age: 40, femenino: 237, masculino: 120 },
  { age: 50, femenino: 73, masculino: 190 },
  { age: 60, femenino: 209, masculino: 130 },
  { age: 70, femenino: 214, masculino: 140 },
];

const PatientsByAge = () => {
  return (
    <Card className="w-[50%] md:w-[90%] mx-auto lg:mx-0 h-[300px] lg:h-auto">
      <CardHeader>
        <CardTitle>Pacientes por edad</CardTitle>
        <CardDescription>
          Total de pacientes por edad según género
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
        className="w-[50%] md:w-[90%] lg:mx-0 h-[200px] lg:h-[250px] mx-auto"
        config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 10,
              right: 10,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="age"
              tickLine={false}
              axisLine={false}
              tickMargin={5}
            //   tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Area
              dataKey="masculino"
              type="natural"
              fill="var(--color-masculino)"
              fillOpacity={0.4}
              stroke="var(--color-masculino)"
              stackId="a"
            />
            <Area
              dataKey="femenino"
              type="natural"
              fill="var(--color-femenino)"
              fillOpacity={0.4}
              stroke="var(--color-femenino)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      {/* <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              January - June 2024
            </div>
          </div>
        </div>
      </CardFooter> */}
    </Card>
  );
};

export default PatientsByAge;
