"use client"

import { Label, PolarGrid, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts"
import { ChartConfig, ChartContainer } from "@/components/ui/chart"

export const description = "A radial chart with text"

interface RadialChartProps {
  score: number; // Score out of 10
  isSmall: boolean; // Whether the chart is small
}

const chartConfig = {
  safari: {
    label: "Safari",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

// Function to set color dynamically based on score
const getScoreColor = (score: number) => {
  if (score >= 8) return "hsl(var(--chart-2))"; // Green for scores 8 and above
  if (score >= 5) return "hsl(var(--chart-4))"; // Yellow for scores between 5 and 7.9
  return "hsl(var(--chart-5))"; // Red for scores below 5
}

export function RadialChart({ score, isSmall }: RadialChartProps) {
  // Set the color based on the score
  const chartData = [
    { browser: "safari", score: score, fill: getScoreColor(score) },
  ];

  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square max-h-[200px] bg-white rounded-full "
    >
      <RadialBarChart
        data={chartData}
        startAngle={0} // Start from 12 o'clock
        endAngle={score / 10 * 360} // Full circle (360 degrees)
        innerRadius={isSmall ? 40 : 70}
        outerRadius={isSmall ? 70 : 100}
        barSize={isSmall ? 7 : 10}
      >
        <PolarGrid
          gridType="circle"
          radialLines={false}
          stroke="none"
          className="first:fill-muted last:fill-background"
          polarRadius={isSmall ? [44, 36] : [76, 64]}
        />
        <RadialBar
          dataKey="score"
          background
          cornerRadius={10}
          max={100} // Set the max score to 100% (which represents 10 out of 10)
        />
        <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
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
                      y={(viewBox.cy || 0) + 10} // Adjust this to fine-tune vertical position if needed
                      className={`fill-foreground font-bold ${isSmall ? 'text-2xl' : 'text-4xl'}`} // Adjust font size based on isSmall
                      >
                      {chartData[0].score.toLocaleString()}
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={viewBox.cy}
                      className="fill-muted-foreground"
                    >
                    </tspan>
                  </text>
                );
              }
            }}
          />
        </PolarRadiusAxis>
      </RadialBarChart>
    </ChartContainer>
  );
}
