"use client";

import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  LineChart as RLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart as RPieChart,
  Pie,
  Cell,
  BarChart as RBarChart,
  Bar,
} from "recharts";
import { ArrowLeft } from "lucide-react";

export default function EsgDashboardPage() {
  const router = useRouter();

  // Android entries -> Recharts data
  const lineData = useMemo(
    () => [
      { x: 1, y: 10 },
      { x: 2, y: 25 },
      { x: 3, y: 15 },
      { x: 4, y: 30 },
      { x: 5, y: 20 },
    ],
    []
  );

  const pieData = useMemo(
    () => [
      { name: "Repair/Reuse", value: 70 },
      { name: "Disposal", value: 30 },
    ],
    []
  );

  const barData = useMemo(
    () => [
      { label: "T1", esg: 60 },
      { label: "T2", esg: 75 },
      { label: "T3", esg: 85 },
      { label: "T4", esg: 90 },
      { label: "T5", esg: 95 },
    ],
    []
  );

  const PIE_COLORS = ["#4CAF50", "#F44336"]; // green, red

  return (
    <div className="min-h-screen bg-tertiary">
      <h1 className="text-xl sm:text-2xl text-center py-5 font-semibold tracking-tight">ESG Dashboard</h1>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Environmental Metrics</h2>
          <ScrollArea className="w-full whitespace-nowrap rounded-xl border bg-white">
            <div className="flex p-4 gap-4">
              <MetricCard
                title="Installed Capacity"
                subtitle="Correlates waste volume to scale of deployment"
              />
              <MetricCard
                title="Panel Lifespan Estimate"
                subtitle="Projection of end-of-life timing"
              />
              <MetricCard
                title="Hazardous/Toxic Content"
                subtitle="Harmful hazardous materials"
              />
              {/* add more cards here if needed */}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </section>

        {/* Charts Overview */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold">Charts Overview</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Line Chart */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-base">Waste Volume (Line Chart)</CardTitle>
              </CardHeader>
              <CardContent className="h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RLineChart data={lineData} margin={{ top: 16, right: 24, bottom: 8, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="x" tickLine={false} axisLine={false} />
                    <YAxis tickLine={false} axisLine={false} />
                    <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                    <Legend />
                    <Line type="monotone" dataKey="y" name="Waste Volume" stroke="#ef4444" strokeWidth={2} dot={{ r: 4 }} />
                  </RLineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Pie Chart */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-base">Repair/Reuse vs Disposal (Pie Chart)</CardTitle>
              </CardHeader>
              <CardContent className="h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RPieChart>
                    <Tooltip />
                    <Legend />
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={70}
                      outerRadius={110}
                      paddingAngle={3}
                    >
                      {pieData.map((_, i) => (
                        <Cell key={`cell-${i}`} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                  </RPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Bar Chart (full width on lg) */}
            <Card className="shadow-sm lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-base">ESG Score Over Time (Bar Chart)</CardTitle>
              </CardHeader>
              <CardContent className="h-[360px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RBarChart data={barData} margin={{ top: 16, right: 24, bottom: 8, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="label" tickLine={false} axisLine={false} />
                    <YAxis tickLine={false} axisLine={false} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="esg" name="ESG Score" radius={[6, 6, 0, 0]} fill="#60a5fa" />
                  </RBarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </div>
  );
}

function MetricCard({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <Card className="shrink-0">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-muted-foreground leading-relaxed">{subtitle}</p>
      </CardContent>
    </Card>
  );
}
