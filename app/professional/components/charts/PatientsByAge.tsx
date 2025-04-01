"use client";

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
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
import { filtrarByAgeRange } from "@/utils/getChartsHelpers";

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


const PatientsByAge = ({patients} : any) => {

const patient20F = filtrarByAgeRange(patients, 20, 29, "F");
const patient20M = filtrarByAgeRange(patients, 20, 29, "M");
const patient30F = filtrarByAgeRange(patients, 30, 39, "F");
const patient30M = filtrarByAgeRange(patients, 30, 39, "M");
const patient40F = filtrarByAgeRange(patients, 40, 49, "F");
const patient40M = filtrarByAgeRange(patients, 40, 49, "M");
const patient50F = filtrarByAgeRange(patients, 50, 59, "F");
const patient50M = filtrarByAgeRange(patients, 50, 59, "M");
const patient60F = filtrarByAgeRange(patients, 60, 69, "F");
const patient60M = filtrarByAgeRange(patients, 60, 69, "M");
const patient70F = filtrarByAgeRange(patients, 70, 79, "F");
const patient70M = filtrarByAgeRange(patients, 70, 79, "M");
const patient80F = filtrarByAgeRange(patients, 80, 89, "F");
const patient80M = filtrarByAgeRange(patients, 80, 89, "M");

  // data to render
const chartData = [
  { age: 20, femenino: patient20F.length, masculino: patient20M.length },
  { age: 30, femenino: patient30F.length, masculino: patient30M.length },
  { age: 40, femenino: patient40F.length, masculino: patient40M.length },
  { age: 50, femenino: patient50F.length, masculino: patient50M.length },
  { age: 60, femenino: patient60F.length, masculino: patient60M.length },
  { age: 70, femenino: patient70F.length, masculino: patient70M.length },
  { age: 80, femenino: patient80F.length, masculino: patient80M.length },
];
  return (
    <Card className="w-full z-40 mx-auto text-black bg-white lg:mx-0 h-[250px] lg:h-auto border border-[#E4E7EC] rounded-lg shadow-[0px_6px_15px_rgba(0,0,0,0.3)]">
      <CardHeader className="px-auto py-1">
        <CardTitle>Pacientes por edad</CardTitle>
        <CardDescription>
          Total de pacientes por edad según género
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
        className="w-full lg:mx-0 h-[200px] lg:h-[200px] mx-auto"
        config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 10,
              right: 10,
              top: 30,
              bottom: 5,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="age"
              tickLine={false}
              axisLine={false}
              tickMargin={5}
              // tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
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
    </Card>
  );
};

export default PatientsByAge;
