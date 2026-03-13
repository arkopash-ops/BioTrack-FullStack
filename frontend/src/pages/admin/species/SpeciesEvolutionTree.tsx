import { Box, Button, Stack, Typography } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import TreeChart from "../../../components/TreeChart";
import type { TreeNode } from "../../../components/TreeChart";

type SpeciesTreeNode = {
  _id: string;
  scientificName?: string;
  commonName?: string;
  slug?: string;
  images?: { url: string }[];
  successor?: SpeciesTreeNode[];
};

const formatSpeciesName = (node: SpeciesTreeNode) => {
  const commonName = node.commonName?.trim();
  const scientificName = node.scientificName?.trim();

  if (commonName && scientificName) {
    return `${commonName} (${scientificName})`;
  }
  if (commonName) return commonName;
  if (scientificName) return scientificName;
  return "Unknown species";
};

const toTreeNode = (node: SpeciesTreeNode, onNodeClick?: (slug?: string) => void): TreeNode => ({
  _id: node._id,
  name: formatSpeciesName(node),
  rank: "Species",
  imageUrl: node.images?.[0]?.url ?? null,
  onClick: node.slug ? () => onNodeClick?.(node.slug) : undefined,
  children: (node.successor ?? []).map((child) => toTreeNode(child, onNodeClick)),
});

const SpeciesEvolutionTree = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [tree, setTree] = useState<TreeNode | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTree = async () => {
      if (!slug) {
        setError("Missing species slug.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const res = await axios.get<{ data: SpeciesTreeNode }>(
          `http://localhost:8080/api/species/tree/${slug}`,
          { withCredentials: true },
        );
        setTree(toTreeNode(res.data.data, (nextSlug) => {
          if (nextSlug) {
            navigate(`/admin/species/${nextSlug}`);
          }
        }));
      } catch (err) {
        console.error("Failed to fetch species tree:", err);
        setError("Unable to load evolution tree.");
      } finally {
        setLoading(false);
      }
    };

    fetchTree();
  }, [slug]);

  const displayedTree = useMemo(() => tree, [tree]);

  return (
    <Box sx={{ px: 3, py: 4, color: "#e6f5ec" }}>
      <Stack spacing={2}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Button
            variant="outlined"
            onClick={() => navigate(`/admin/species/${slug}`)}
            sx={{
              textTransform: "none",
              borderColor: "rgba(109,220,139,0.45)",
              color: "#b7d7c4",
              "&:hover": { borderColor: "#8be0a6", color: "#e6f5ec" },
            }}
          >
            Back to Species
          </Button>
          <Typography variant="h4" sx={{ color: "#e6f5ec", fontWeight: "bold" }}>
            Evolution Tree
          </Typography>
        </Stack>
        <Typography sx={{ color: "#b7d7c4" }}>
          Explore the evolutionary lineage for this species.
        </Typography>
        {loading ? (
          <Typography sx={{ color: "#b7d7c4" }}>Loading evolution tree...</Typography>
        ) : error ? (
          <Typography sx={{ color: "#b7d7c4" }}>{error}</Typography>
        ) : displayedTree ? (
          <TreeChart node={displayedTree} />
        ) : (
          <Typography sx={{ color: "#b7d7c4" }}>
            No evolution data available yet.
          </Typography>
        )}
      </Stack>
    </Box>
  );
};

export default SpeciesEvolutionTree;
