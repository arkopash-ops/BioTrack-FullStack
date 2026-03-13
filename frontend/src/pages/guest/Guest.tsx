import React, { useEffect, useState } from "react";
import { Container, Paper, Typography, Button, Box } from "@mui/material";
import Grid from "@mui/system/Grid";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import SpeciesCard from "../../components/SpeciesCard";

type GuestSpecies = {
  _id: string;
  commonName: string;
  scientificName: string;
  imageUrl?: string | null;
};

const Guest: React.FC = () => {
  const navigate = useNavigate();
  const [species, setSpecies] = useState<GuestSpecies[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSpecies = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/species/public");
        if (res.data.success) {
          setSpecies(
            res.data.data.map((item: GuestSpecies) => ({
              _id: item._id,
              commonName: item.commonName,
              scientificName: item.scientificName,
              imageUrl: item.imageUrl ?? null,
            })),
          );
        }
      } catch (error: unknown) {
        console.error("Failed to fetch species:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSpecies();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12 }}>
          <Paper
            elevation={6}
            sx={{
              p: 4,
              width: "100%",
              backdropFilter: "blur(10px)",
              backgroundColor: "rgba(8,18,12,0.72)",
              borderRadius: "16px",
              border: "1px solid rgba(109,220,139,0.18)",
              textAlign: "center",
            }}
          >
            <Typography
              variant="h4"
              gutterBottom
              sx={{ color: "#e6f5ec", fontWeight: "bold" }}
            >
              Welcome, Guest!
            </Typography>

            <Typography variant="body1" sx={{ color: "#b7d7c4", mb: 3 }}>
              You are currently browsing as a guest. To access all features,
              please create an account.
            </Typography>

            <Button
              variant="contained"
              sx={{
                backgroundColor: "#2f9e5b",
                color: "#e6f5ec",
                "&:hover": { backgroundColor: "#257a47" },
              }}
              onClick={() => navigate("/register")}
            >
              Create Account
            </Button>

            <Button
              variant="text"
              sx={{
                color: "#b7d7c4",
                ml: 2,
                "&:hover": { textDecoration: "underline", color: "#8be0a6" },
              }}
              onClick={() => navigate("/login")}
            >
              Already have an account? Login
            </Button>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Typography variant="h5" sx={{ color: "#e6f5ec", fontWeight: "bold", mb: 2 }}>
            Species Preview
          </Typography>

          {loading ? (
            <Typography sx={{ color: "#b7d7c4" }}>Loading species...</Typography>
          ) : (
            <Box
              sx={{
                columnCount: { xs: 1, sm: 2, md: 3 },
                columnGap: 16,
              }}
            >
              {species.map((item) => (
                <Box
                  key={item._id}
                  sx={{
                    breakInside: "avoid",
                    mb: 2,
                    display: "inline-block",
                    width: "100%",
                  }}
                >
                  <SpeciesCard
                    commonName={item.commonName}
                    scientificName={item.scientificName}
                    imageUrl={item.imageUrl}
                    onClick={() => navigate("/login")}
                  />
                </Box>
              ))}
            </Box>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default Guest;
