"use client";
import * as React from "react";
import { TrendingUp } from "lucide-react";
import { Label, Pie, PieChart } from "recharts";
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
  categorizacion: {
    label: "categorizacion",
  },
  turnos: {
    label: "turno",
    color: "hsl(var(--chart-1))",
  },
  seguimientos: {
    label: "seguimiento",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;
const Categorization = ({appointments, followsUp} : any) => {

  const chartData = [
    { meets: "turnos", amount: appointments, fill: "var(--color-turnos)" },
    { meets: "seguimientos", amount: followsUp, fill: "var(--color-seguimientos)" },
  ];
  const totalMeets = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.amount, 0);
  }, []);
  return (
    <Card className="w-[50%] md:w-[90%] mx-auto lg:mx-0 h-[250px] lg:h-auto">
      <CardHeader className="items-start pb-0">
        <CardTitle>Categorizacion</CardTitle>
        <CardDescription>Turnos y seguimientos</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="w-[50%] md:w-[90%] lg:mx-0 h-[150px] lg:h-[250px] mx-auto"
        >
          <PieChart
          >
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="amount"
              nameKey="meets"
              innerRadius={40}
              strokeWidth={1}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-2xl font-bold"
                        >
                          {totalMeets.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 15}
                          className="flex flex-col fill-muted-foreground"
                        >
                          Citas
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
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

export default Categorization;
