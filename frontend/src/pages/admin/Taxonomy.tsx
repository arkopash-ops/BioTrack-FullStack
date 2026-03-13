import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import TreeChart from "../../components/TreeChart";
import type { TreeNode } from "../../components/TreeChart";

const Taxonomy = () => {
  const [tree, setTree] = useState<TreeNode | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [searchSlug, setSearchSlug] = useState("animalia");

  useEffect(() => {
    const fetchTree = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get<{ data: TreeNode }>(
          `http://localhost:8080/api/taxonomy/tree/${searchSlug}`,
          { withCredentials: true },
        );
        setTree(res.data.data);
      } catch (err) {
        console.error("Failed to fetch taxonomy tree:", err);
        setError(
          searchSlug !== "animalia"
            ? "No taxonomy data found for that search."
            : "Unable to load taxonomy tree.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTree();
  }, [searchSlug]);

  const displayedTree = useMemo(() => tree, [tree]);

  return (
    <Box sx={{ px: 3, py: 4, color: "#e6f5ec" }}>
      <Stack spacing={2}>
        <Typography variant="h4" sx={{ color: "#e6f5ec", fontWeight: "bold" }}>
          Taxonomy
        </Typography>
        <Typography sx={{ color: "#b7d7c4" }}>
          Organize and review taxonomic classifications for tracked species.
        </Typography>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <TextField
            fullWidth
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                setSearchSlug(query.trim() ? query.trim() : "animalia");
              }
            }}
            placeholder="Search by slug..."
            variant="outlined"
            slotProps={{
              input: {
                sx: {
                  color: "#e6f5ec",
                  borderRadius: "10px",
                  backgroundColor: "rgba(6,19,12,0.6)",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(109,220,139,0.35)",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(109,220,139,0.6)",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#8be0a6",
                  },
                },
              },
              htmlInput: {
                "aria-label": "Search taxonomy",
              },
            }}
          />
          <Button
            variant="contained"
            onClick={() =>
              setSearchSlug(query.trim() ? query.trim() : "animalia")
            }
            sx={{
              px: 4,
              textTransform: "none",
              fontWeight: 600,
              backgroundColor: "#2f7d4b",
              "&:hover": {
                backgroundColor: "#3b9960",
              },
            }}
          >
            Search
          </Button>
        </Stack>
        {loading ? (
          <Typography sx={{ color: "#b7d7c4" }}>
            Loading taxonomy tree...
          </Typography>
        ) : error ? (
          <Typography sx={{ color: "#b7d7c4" }}>{error}</Typography>
        ) : displayedTree ? (
          <TreeChart node={displayedTree} />
        ) : (
          <Typography sx={{ color: "#b7d7c4" }}>
            {searchSlug !== "animalia"
              ? "No taxonomy entries match that search."
              : "No taxonomy data available yet."}
          </Typography>
        )}
      </Stack>
    </Box>
  );
};

export default Taxonomy;
