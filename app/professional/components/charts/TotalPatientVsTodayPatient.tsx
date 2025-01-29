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
const chartData = [{ month: "january", hoy: 1260, totales: 570 }];
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

const TotalPatientVsTodayPatient = () => {
  const totalVisitors = chartData[0].hoy + chartData[0].totales;
  return (
    <Card className="flex flex-col h-[180px] bg-gradient-to-br from-[#f9f9f9] to-[#f1f1f1]">
      <CardHeader className="items-center pb-2">
        <CardTitle>Pacientes</CardTitle>
        <CardDescription>este mes - este año</CardDescription>
      </CardHeader>
      <CardContent className="flex w-full items-center pb-2">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square w-full"
        >
          <RadialBarChart
          className="w-[100%]"
            data={chartData}
            endAngle={180}
            innerRadius={50}
            outerRadius={70}
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
      {/* <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter> */}
    </Card>
  );
};

export default TotalPatientVsTodayPatient;
