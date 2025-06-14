"use client";
import * as React from "react";
import { Pie, PieChart, Cell } from "recharts";
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

const Categorization = ({ appointments, followsUp }: any) => {
  const chartData = [
    { meets: "turnos", amount: appointments, fill: "hsl(var(--chart-1))" },
    { meets: "seguimientos", amount: followsUp, fill: "hsl(var(--chart-2))" },
  ];

  const totalMeets = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.amount, 0);
  }, [appointments, followsUp]);

  const noData = totalMeets === 0;

  return (
    <Card className="w-full bg-white z-40 flex-col lg:flex-wrap mx-auto flex  justify-between text-black lg:mx-0 h-auto">
      <CardHeader className="w-[40%] h-auto min-[425px]:w-[60%] min-[768px]:w-full flex items-start justify-center px-5 py-0 pt-2">
        <div>
          <CardTitle className="text-base min-[425px]:text-2xl min-[768px]:text-3xl">
            Categorización
          </CardTitle>
          <CardDescription>Turnos y seguimientos</CardDescription>
        </div>
      </CardHeader>

      <CardContent className="w-[95%] h-[150px] lg:h-[210px] p-0 flex items-center justify-center mx-auto">
        {noData ? (
          <span className="text-base font-semibold text-start">Aún no posee información disponible</span>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="w-full flex items-center justify-center h-full mx-auto text-black font-mono font-semibold p-0"
          >
            <PieChart width={200} height={200}>
              <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
              <Pie
                data={chartData}
                dataKey="amount"
                nameKey="meets"
                innerRadius={40}
                outerRadius={60}
                stroke="none"
                label={({ cx, cy }) => (
                  <text
                    x={cx}
                    y={cy}
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    {`${totalMeets} total`}
                  </text>
                )}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
            </PieChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default Categorization;
