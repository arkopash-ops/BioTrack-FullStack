import { Box, Typography } from "@mui/material";
import { Tree, TreeNode as OrgTreeNode } from "react-organizational-chart";

export type TreeNode = {
  _id: string;
  name: string;
  rank: string;
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
      gap: 1,
      px: 2,
      py: 1,
      borderRadius: "999px",
      border: "1px solid rgba(109,220,139,0.35)",
      backgroundColor: "rgba(6,19,12,0.7)",
      boxShadow: "0 10px 24px rgba(0,0,0,0.2)",
      width: "fit-content",
    }}
  >
    <Typography sx={{ color: "#b7d7c4", fontSize: 12, textTransform: "uppercase" }}>
      {node.rank}
    </Typography>
    <Typography sx={{ color: "#e6f5ec", fontWeight: 600 }}>{node.name}</Typography>
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
