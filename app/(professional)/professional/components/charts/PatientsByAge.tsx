"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
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
import { useActivefilter } from "@/utils/useActiveFilter";
import { ResponsiveContainer } from "recharts";

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

const PatientsByAge = ({ patients }: any) => {
  const activePatients = useActivefilter(patients);

  const patient20F = filtrarByAgeRange(activePatients, 20, 29, "F");
  const patient20M = filtrarByAgeRange(activePatients, 20, 29, "M");
  const patient30F = filtrarByAgeRange(activePatients, 30, 39, "F");
  const patient30M = filtrarByAgeRange(activePatients, 30, 39, "M");
  const patient40F = filtrarByAgeRange(activePatients, 40, 49, "F");
  const patient40M = filtrarByAgeRange(activePatients, 40, 49, "M");
  const patient50F = filtrarByAgeRange(activePatients, 50, 59, "F");
  const patient50M = filtrarByAgeRange(activePatients, 50, 59, "M");
  const patient60F = filtrarByAgeRange(activePatients, 60, 69, "F");
  const patient60M = filtrarByAgeRange(activePatients, 60, 69, "M");
  const patient70F = filtrarByAgeRange(activePatients, 70, 79, "F");
  const patient70M = filtrarByAgeRange(activePatients, 70, 79, "M");
  const patient80F = filtrarByAgeRange(activePatients, 80, 89, "F");
  const patient80M = filtrarByAgeRange(activePatients, 80, 89, "M");

  const chartData = [
    { age: 20, femenino: patient20F.length, masculino: patient20M.length },
    { age: 30, femenino: patient30F.length, masculino: patient30M.length },
    { age: 40, femenino: patient40F.length, masculino: patient40M.length },
    { age: 50, femenino: patient50F.length, masculino: patient50M.length },
    { age: 60, femenino: patient60F.length, masculino: patient60M.length },
    { age: 70, femenino: patient70F.length, masculino: patient70M.length },
    { age: 80, femenino: patient80F.length, masculino: patient80M.length },
  ];

  const hasData = chartData.some(
    (item) => item.femenino > 0 || item.masculino > 0
  );
console.log(hasData)
  return (
    <Card className="w-full z-40 flex-col mx-auto flex justify-between text-black bg-white lg:mx-0 h-auto border border-[#E4E7EC] rounded-lg shadow-[0px_6px_15px_rgba(0,0,0,0.3)]">
      <CardHeader>
        <CardTitle>Pacientes por rango etario</CardTitle>
        <CardDescription>
          Cantidad de pacientes por edad y género
        </CardDescription>
      </CardHeader>
      <CardContent className="font-semibold text-gray-500">
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height={hasData ? 300 : 100}>
            {hasData ? (
              <AreaChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="femenino" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="hsl(var(--chart-1))"
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor="hsl(var(--chart-1))"
                      stopOpacity={0}
                    />
                  </linearGradient>
                  <linearGradient id="masculino" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="hsl(var(--chart-2))"
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor="hsl(var(--chart-2))"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <XAxis dataKey="age" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="femenino"
                  stroke="hsl(var(--chart-1))"
                  fillOpacity={1}
                  fill="url(#femenino)"
                />
                <Area
                  type="monotone"
                  dataKey="masculino"
                  stroke="hsl(var(--chart-2))"
                  fillOpacity={1}
                  fill="url(#masculino)"
                />
              </AreaChart>
            ) : (
              <div className="text-base py-10 text-center">
                Aún no posee información disponible
              </div>
            )}
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default PatientsByAge;
