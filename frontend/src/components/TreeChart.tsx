import { Box, Typography } from "@mui/material";
import { Tree, TreeNode as OrgTreeNode } from "react-organizational-chart";

export type TreeNode = {
  _id: string;
  name: string;
  rank: string;
  imageUrl?: string | null;
  onClick?: () => void;
  children?: TreeNode[];
};

type TreeChartProps = {
  node: TreeNode;
};

const NodeLabel = ({ node }: { node: TreeNode }) => (
  <Box
    sx={{
      display: "inline-flex",
      alignItems: "center",
      gap: 2,
      px: 2,
      py: 1.5,
      borderRadius: "16px",
      border: "1px solid rgba(109,220,139,0.35)",
      backgroundColor: "rgba(6,19,12,0.7)",
      boxShadow: "0 10px 24px rgba(0,0,0,0.2)",
      width: "fit-content",
      cursor: node.onClick ? "pointer" : "default",
      transition: node.onClick ? "transform 0.2s ease, box-shadow 0.2s ease" : "none",
      "&:hover": node.onClick
        ? { transform: "translateY(-1px)", boxShadow: "0 12px 26px rgba(0,0,0,0.25)" }
        : undefined,
      pointerEvents: "auto",
      userSelect: "none",
    }}
    role={node.onClick ? "button" : undefined}
    tabIndex={node.onClick ? 0 : undefined}
    onClick={node.onClick}
  >
    {node.imageUrl ? (
      <Box
        sx={{
          width: 120,
          height: 120,
          borderRadius: "12px",
          border: "1px solid rgba(109,220,139,0.35)",
          backgroundColor: "rgba(6,19,12,0.6)",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          component="img"
          src={node.imageUrl}
          alt={node.name}
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            display: "block",
          }}
        />
      </Box>
    ) : null}
    <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
      <Typography sx={{ color: "#b7d7c4", fontSize: 12, textTransform: "uppercase" }}>
        {node.rank}
      </Typography>
      <Typography sx={{ color: "#e6f5ec", fontWeight: 600 }}>
        {node.name}
      </Typography>
      {node.imageUrl ? (
        <Typography sx={{ color: "#b7d7c4", fontSize: 12 }}>
          Primary image
        </Typography>
      ) : null}
    </Box>
  </Box>
);

const renderTree = (node: TreeNode) => {
  const children = node.children ?? [];
  if (children.length === 0) {
    return <OrgTreeNode key={node._id} label={<NodeLabel node={node} />} />;
  }

  return (
    <OrgTreeNode key={node._id} label={<NodeLabel node={node} />}>
      {children.map(renderTree)}
    </OrgTreeNode>
  );
};

const TreeChart = ({ node }: TreeChartProps) => {
  return (
    <Box sx={{ color: "#e6f5ec" }}>
      <Tree
        label={<NodeLabel node={node} />}
        lineWidth="2px"
        lineColor="rgba(109,220,139,0.35)"
        lineBorderRadius="10px"
        nodePadding="8px"
      >
        {(node.children ?? []).map(renderTree)}
      </Tree>
    </Box>
  );
};

export default TreeChart;
