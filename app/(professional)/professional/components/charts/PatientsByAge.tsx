"use client";

import {
  Area,
  AreaChart,
  Line,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";
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
import { PatientsIncluded } from "@/interfaces";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider"; // asumiendo que usás shadcn/ui
import { cn } from "@/lib/utils";

const chartConfig: ChartConfig = {
  femenino: {
    label: "Femenino",
    color: "hsl(var(--chart-1))",
  },
  masculino: {
    label: "Masculino",
    color: "hsl(var(--chart-2))",
  },
};

interface PatientsByAgeProps {
  patients: PatientsIncluded[];
}

export default function PatientsByAge({ patients }: PatientsByAgeProps) {
  const [chartType, setChartType] = useState<"area" | "line">("area");
  const [ageRange, setAgeRange] = useState<[number, number]>([20, 89]);

  const activePatients = useActivefilter(patients);

  const chartData = useMemo(() => {
    const [minAge, maxAge] = ageRange;
    const data = [];

    for (let age = minAge; age <= maxAge; age += 10) {
      const femenino = filtrarByAgeRange(activePatients, age, age + 9, "F")
        .length;
      const masculino = filtrarByAgeRange(activePatients, age, age + 9, "M")
        .length;
      data.push({ age: `${age}`, femenino, masculino });
    }

    return data;
  }, [activePatients, ageRange]);

  const hasData = chartData.some(
    (item) => item.femenino > 0 || item.masculino > 0
  );

  return (
    <Card className="w-full bg-background border border-border p-1 rounded-2xl shadow-lg">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div>
            <CardTitle className="text-lg font-bold text-foreground">
              Pacientes por rango etario
            </CardTitle>
            <CardDescription className="text-muted-foreground text-xs lg:text-sm">
              Visualización de pacientes activos segmentados por edad y género
            </CardDescription>
          </div>
          <div className="flex gap-2">
            {(["area", "line"] as const).map((type) => (
              <Button
                key={type}
                variant={chartType === type ? "default" : "outline"}
                size="sm"
                onClick={() => setChartType(type)}
                className={cn(
                  "rounded-full text-xs",
                  chartType === type && "shadow"
                )}
              >
                {type === "area" ? "Área" : "Línea"}
              </Button>
            ))}
          </div>
        </div>
        <div className="mt-4">
          <p className="text-xs text-muted-foreground p-1 mb-1">
            Rango etario: {ageRange[0]} a {ageRange[1]} años
          </p>
          <Slider
            min={20}
            max={90}
            step={10}
            defaultValue={ageRange}
            value={ageRange}
            onValueChange={(val) =>
              setAgeRange([val[0], val[1] === val[0] ? val[0] + 10 : val[1]])
            }
            className="w-full max-w-sm"
          />
        </div>
      </CardHeader>

      <CardContent className="h-[200px]">
        <ChartContainer config={chartConfig}>
          {hasData ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={chartType + ageRange.join("-")}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="h-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  {chartType === "area" ? (
                    <AreaChart
                      data={chartData}
                      margin={{ top: 20, right: 30, left: 10, bottom: 0 }}
                    >
                      <defs>
                        {["femenino", "masculino"].map((key) => (
                          <linearGradient
                            id={key}
                            key={key}
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="5%"
                              stopColor={`hsl(var(--chart-${
                                key === "femenino" ? "1" : "2"
                              }))`}
                              stopOpacity={0.6}
                            />
                            <stop
                              offset="95%"
                              stopColor={`hsl(var(--chart-${
                                key === "femenino" ? "1" : "2"
                              }))`}
                              stopOpacity={0}
                            />
                          </linearGradient>
                        ))}
                      </defs>
                      <XAxis dataKey="age" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Area
                        type="monotone"
                        dataKey="femenino"
                        stroke="hsl(var(--chart-1))"
                        fill="url(#femenino)"
                        strokeWidth={2}
                      />
                      <Area
                        type="monotone"
                        dataKey="masculino"
                        stroke="hsl(var(--chart-2))"
                        fill="url(#masculino)"
                        strokeWidth={2}
                      />
                    </AreaChart>
                  ) : (
                    <LineChart
                      data={chartData}
                      margin={{ top: 20, right: 30, left: 10, bottom: 0 }}
                    >
                      <XAxis dataKey="age" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line
                        type="monotone"
                        dataKey="femenino"
                        stroke="hsl(var(--chart-1))"
                        strokeWidth={2}
                        dot={{ r: 5, strokeWidth: 2 }}
                        activeDot={{
                          r: 8,
                          className: "animate-ping fill-current text-[color:var(--chart-1)]",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="masculino"
                        stroke="hsl(var(--chart-2))"
                        strokeWidth={2}
                        dot={{ r: 5, strokeWidth: 2 }}
                        activeDot={{
                          r: 8,
                          className: "animate-ping fill-current text-[color:var(--chart-2)]",
                        }}
                      />
                    </LineChart>
                  )}
                </ResponsiveContainer>
              </motion.div>
            </AnimatePresence>
          ) : (
            <div className="text-center py-10 text-muted-foreground">
              Aún no hay información para mostrar
            </div>
          )}
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
