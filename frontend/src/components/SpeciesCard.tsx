import type { MouseEventHandler } from "react";
import { Paper, Typography, Stack, Box } from "@mui/material";

type SpeciesCardProps = {
  commonName: string;
  scientificName: string;
  status?: string;
  imageUrl?: string | null;
  actions?: React.ReactNode;
  onClick?: MouseEventHandler<HTMLDivElement>;
};

const SpeciesCard = ({
  commonName,
  scientificName,
  status,
  imageUrl,
  actions,
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
        backgroundColor: "rgba(8,18,12,0.72)",
        border: "1px solid rgba(109,220,139,0.18)",
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
              border: "1px solid rgba(109,220,139,0.18)",
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
                "linear-gradient(135deg, rgba(59,191,122,0.25), rgba(6,19,12,0.8))",
              border: "1px solid rgba(109,220,139,0.18)",
            }}
          />
        )}
        <Typography variant="subtitle2" sx={{ color: "#b7d7c4", letterSpacing: 0.5 }}>
          Common Name
        </Typography>
        <Typography variant="h6" sx={{ color: "#e6f5ec", fontWeight: "bold" }}>
          {commonName}
        </Typography>
        <Typography variant="subtitle2" sx={{ color: "#b7d7c4", mt: 1, letterSpacing: 0.5 }}>
          Scientific Name
        </Typography>
        <Typography variant="body1" sx={{ color: "#e6f5ec" }}>
          {scientificName}
        </Typography>
        {status ? (
          <>
            <Typography
              variant="subtitle2"
              sx={{ color: "#b7d7c4", mt: 1, letterSpacing: 0.5 }}
            >
              Status
            </Typography>
            <Typography variant="body1" sx={{ color: "#e6f5ec" }}>
              {status}
            </Typography>
          </>
        ) : null}
        {actions ? <Box sx={{ pt: 1 }}>{actions}</Box> : null}
      </Stack>
    </Paper>
  );
};

export default SpeciesCard;
