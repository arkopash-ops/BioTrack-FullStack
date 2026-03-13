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
  barColor = "#3bbf7a",
  barShadow = "0 8px 20px rgba(59,191,122,0.35)",
  barWidth = "70%",
  labelColor = "#b7d7c4",
  valueColor = "#e6f5ec",
}: BarChartProps) => {
  const computedMax = maxValue ?? Math.max(...items.map((item) => item.value), 1);
  const reservedSpace = 48;
  const availableHeight = Math.max(height - minBarHeight - reservedSpace, 1);

  return (
    <Stack direction="row" spacing={2} alignItems="flex-end" sx={{ height }}>
      {items.map((item) => {
        const scaledHeight = (item.value / computedMax) * availableHeight + minBarHeight;
        const barHeight = Math.max(minBarHeight, scaledHeight);
        return (
          <Stack
            key={item.label}
            alignItems="center"
            spacing={1}
            sx={{ flex: 1, height: "100%", justifyContent: "flex-end" }}
          >
            <Typography sx={{ color: valueColor, mb: 0.5 }}>{item.value}</Typography>
            <Box
              sx={{
                width: barWidth,
                height: barHeight,
                borderRadius: "12px",
                backgroundColor: barColor,
                boxShadow: barShadow,
              }}
            />
            <Typography sx={{ color: labelColor, mt: 0.5 }}>{item.label}</Typography>
          </Stack>
        );
      })}
    </Stack>
  );
};

export default BarChart;
