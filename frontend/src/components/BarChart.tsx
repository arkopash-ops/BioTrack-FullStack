import { Box, Stack, Typography } from "@mui/material";

type BarChartItem = {
  label: string;
  value: number;
};

type BarChartProps = {
  items: BarChartItem[];
  height?: number;
  minBarHeight?: number;
  maxValue?: number;
  barColor?: string;
  barShadow?: string;
  barWidth?: number | string;
  labelColor?: string;
  valueColor?: string;
};

const BarChart = ({
  items,
  height = 180,
  minBarHeight = 20,
  maxValue,
  barColor = "#2ecc71",
  barShadow = "0 8px 20px rgba(46,204,113,0.25)",
  barWidth = "70%",
  labelColor = "#e0f7e9",
  valueColor = "#e0f7e9",
}: BarChartProps) => {
  const computedMax = maxValue ?? Math.max(...items.map((item) => item.value), 1);
  const availableHeight = Math.max(height - minBarHeight, 1);

  return (
    <Stack direction="row" spacing={2} alignItems="flex-end" sx={{ height }}>
      {items.map((item) => {
        const scaledHeight = (item.value / computedMax) * availableHeight + minBarHeight;
        const barHeight = Math.max(minBarHeight, scaledHeight);
        return (
          <Stack key={item.label} alignItems="center" spacing={1} sx={{ flex: 1 }}>
            <Typography sx={{ color: valueColor }}>{item.value}</Typography>
            <Box
              sx={{
                width: barWidth,
                height: barHeight,
                borderRadius: "12px",
                backgroundColor: barColor,
                boxShadow: barShadow,
              }}
            />
            <Typography sx={{ color: labelColor }}>{item.label}</Typography>
          </Stack>
        );
      })}
    </Stack>
  );
};

export default BarChart;
