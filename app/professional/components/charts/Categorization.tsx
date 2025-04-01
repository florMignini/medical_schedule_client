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
    <Card className=" w-full z-40 mx-auto flex justify-between text-black bg-white lg:mx-0 h-[200px] lg:h-auto border border-[#E4E7EC] rounded-lg shadow-[0px_6px_15px_rgba(0,0,0,0.3)]">
      <CardHeader className="w-[40%] min-[425px]:w-[60%] min-[768px]:w-full flex items-end justify-center pr-0">
        <CardTitle className="text-base min-[425px]:text-2xl min-[768px]:text-3xl">Categorizacion</CardTitle>
        <CardDescription>Turnos y seguimientos</CardDescription>
      </CardHeader>
      <CardContent className="w-[60%] p-0 flex items-start justify-start">
        <ChartContainer
          config={chartConfig}
          className="w-[100%] flex items-start justify-start min-[768px]:w-full lg:mx-0 h-[200px] lg:h-[250px] mx-auto p-0"
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
                          className="flex flex-col backdrop-blur-lg"
                        >
                          Turnos
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
