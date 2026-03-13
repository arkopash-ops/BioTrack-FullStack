import { Box, Stack, Typography } from "@mui/material";

type PieChartItem = {
  label: string;
  value: number;
  color?: string;
};

type PieChartProps = {
  items: PieChartItem[];
  size?: number;
  colors?: string[];
  borderColor?: string;
  labelColor?: string;
};

const PieChart = ({
  items,
  size = 180,
  colors = ["#8A0303", "#d84c0b", "#0a42da", "#00ff00", "#ecaf06"],
  borderColor = "rgba(255,255,255,0.15)",
  labelColor = "#e0f7e9",
}: PieChartProps) => {
  const total = items.reduce((sum, item) => sum + item.value, 0);

  const { segments, legend } = items.reduce(
    (acc, item, index) => {
      const color = item.color ?? colors[index % colors.length];
      const percentage = total > 0 ? (item.value / total) * 100 : 0;
      const start = acc.current;
      const end = acc.current + percentage;
      acc.current = end;
      acc.segments.push(`${color} ${start}% ${end}%`);
      acc.legend.push({ ...item, color });
      return acc;
    },
    { segments: [] as string[], legend: [] as PieChartItem[], current: 0 },
  );

  return (
    <Stack direction={{ xs: "column", sm: "row" }} spacing={3} alignItems="center">
      <Box
        sx={{
          width: size,
          height: size,
          borderRadius: "50%",
          background: `conic-gradient(${segments.join(", ")})`,
          border: `1px solid ${borderColor}`,
        }}
      />
      <Stack spacing={1}>
        {legend.map((item) => (
          <Stack key={item.label} direction="row" spacing={1} alignItems="center">
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                backgroundColor: item.color,
              }}
            />
            <Typography sx={{ color: labelColor }}>
              {item.label}: {item.value}
            </Typography>
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
};

export default PieChart;
