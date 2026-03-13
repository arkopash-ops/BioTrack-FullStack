import type { MouseEventHandler } from "react";
import { Paper, Typography, Stack, Box } from "@mui/material";

type SpeciesCardProps = {
  commonName: string;
  scientificName: string;
  imageUrl?: string | null;
  onClick?: MouseEventHandler<HTMLDivElement>;
};

const SpeciesCard = ({
  commonName,
  scientificName,
  imageUrl,
  onClick,
}: SpeciesCardProps) => {
  return (
    <Paper
      onClick={onClick}
      elevation={6}
      sx={{
        p: 3,
        borderRadius: "16px",
        backdropFilter: "blur(10px)",
        backgroundColor: "rgba(255,255,255,0.1)",
        border: "1px solid rgba(255,255,255,0.12)",
        cursor: onClick ? "pointer" : "default",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        "&:hover": onClick
          ? { transform: "translateY(-2px)", boxShadow: "0 12px 30px rgba(0,0,0,0.25)" }
          : undefined,
      }}
    >
      <Stack spacing={1}>
        {imageUrl ? (
          <Box
            component="img"
            src={imageUrl}
            alt={commonName}
            sx={{
              width: "100%",
              height: "auto",
              display: "block",
              borderRadius: "12px",
              border: "1px solid rgba(255,255,255,0.12)",
            }}
          />
        ) : (
          <Box
            sx={{
              width: "100%",
              height: 140,
              borderRadius: "12px",
              overflow: "hidden",
              background:
                "linear-gradient(135deg, rgba(46,204,113,0.2), rgba(15,32,39,0.6))",
              border: "1px solid rgba(255,255,255,0.12)",
            }}
          />
        )}
        <Typography variant="subtitle2" sx={{ color: "#e0f7e9", letterSpacing: 0.5 }}>
          Common Name
        </Typography>
        <Typography variant="h6" sx={{ color: "#fff", fontWeight: "bold" }}>
          {commonName}
        </Typography>
        <Typography variant="subtitle2" sx={{ color: "#e0f7e9", mt: 1, letterSpacing: 0.5 }}>
          Scientific Name
        </Typography>
        <Typography variant="body1" sx={{ color: "#fff" }}>
          {scientificName}
        </Typography>
      </Stack>
    </Paper>
  );
};

export default SpeciesCard;
