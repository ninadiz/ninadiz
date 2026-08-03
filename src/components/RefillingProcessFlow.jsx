import { useEffect, useMemo, useState } from "react";
import {
  ReactFlow,
  Background,
  BaseEdge,
  Controls,
  Handle,
  Panel,
  Position,
  MarkerType,
  getSmoothStepPath,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import {
  Headphones,
  PenTool,
  Code2,
  Monitor,
  ClipboardCheck,
  CheckCircle2,
  Rocket,
  FlaskConical,
  Factory,
  Maximize2,
  Minimize2,
} from "lucide-react";
import "./RefillingProcessFlow.css";

const COL = [0, 260, 520, 780, 1040, 1300, 1560, 1820];
const TRUNK_Y = 40;
const MOBILE_Y = -110;
const WEBGUI_Y = 190;
const MERGE_Y = (MOBILE_Y + WEBGUI_Y) / 2;
const RND_Y = 430;

const BLUE = "#0369a1";
const TEAL = "#0f766e";
const INDIGO = "#4338ca";
const BROWN = "#92400e";
const ROOT_COLOR = "#0f172a";

const NODE_DEFS = [
  {
    id: "feedback",
    actor: "Support",
    subheader: "Problem",
    description: "80% of customers ask support about refilling procedure just they recieved devices",
    icon: Headphones,
    color: ROOT_COLOR,
    x: COL[0],
    y: TRUNK_Y,
  },

  {
    id: "thinking",
    actor: "Design",
    subheader: "Solution",
    description: "Users need step-by-step assistance during refilling, not a wall of technical documentation.",
    icon: PenTool,
    color: BLUE,
    x: COL[1],
    y: TRUNK_Y,
  },
  {
    id: "design-wizards",
    actor: "Design",
    subheader: "Figma Artifacts",
    description: "Create in-app refilling wizards that guide the user through each step.",
    icon: PenTool,
    color: BLUE,
    x: COL[2],
    y: TRUNK_Y,
    bottomTarget: true,
  },

  {
    id: "mobile-team",
    actor: "Mobile Team",
    subheader: "Build Scope",
    description: "New refilling UI flows built for the mobile app.",
    icon: Code2,
    color: TEAL,
    x: COL[4],
    y: MOBILE_Y,
  },
  {
    id: "usability-mobile",
    actor: "Usability Testing",
    subheader: "Validation",
    description: "Tested with the Factory team and external focus groups before release.",
    icon: ClipboardCheck,
    color: TEAL,
    x: COL[5],
    y: MERGE_Y,
  },
  {
    id: "qa-mobile",
    actor: "QA Testing",
    subheader: "Quality Gate",
    description: "Full regression pass across every supported device and firmware version.",
    icon: CheckCircle2,
    color: TEAL,
    x: COL[6],
    y: MERGE_Y,
    hideCard: true,
  },
  {
    id: "release-mobile",
    actor: "Release",
    subheader: "Ship",
    description: "Rolled out to the Mobile App.",
    icon: Rocket,
    color: TEAL,
    x: COL[7],
    y: MERGE_Y,
    hideCard: true,
  },

  {
    id: "firmware-developer",
    actor: "Firmware Developer",
    subheader: "Build Scope",
    description: "Firmware updates that both the Mobile App and WebGUI build on.",
    icon: Code2,
    color: BLUE,
    x: COL[3],
    y: TRUNK_Y,
  },

  {
    id: "webgui-team",
    actor: "WebGUI team",
    subheader: "Build Scope",
    description: "New refilling UI flows built for WebGUI.",
    icon: Monitor,
    color: INDIGO,
    x: COL[4],
    y: WEBGUI_Y,
  },

  {
    id: "rnd-eng",
    actor: "R&D & Engineering",
    subheader: "Root Cause",
    description: "Investigate the root cause — from tank design limits to electrolyte chemistry.",
    icon: FlaskConical,
    color: BROWN,
    x: COL[1],
    y: RND_Y,
  },
  {
    id: "factory",
    actor: "Factory",
    subheader: "Production Impact",
    description: "Construction & chemistry updates needed to support the new refilling flow.",
    icon: Factory,
    color: BROWN,
    x: COL[2],
    y: RND_Y,
  },
  {
    id: "design-instructions",
    actor: "Design",
    subheader: "Documentation",
    description: "Instructions get version-controlled to match every device and firmware combination.",
    icon: PenTool,
    color: BROWN,
    x: COL[3],
    y: RND_Y,
    topSource: true,
  },
];

const EDGE_DEFS = [
  ["feedback", "thinking", BLUE],
  ["thinking", "design-wizards", BLUE],

  ["mobile-team", "usability-mobile", TEAL],
  ["webgui-team", "usability-mobile", INDIGO],
  ["usability-mobile", "qa-mobile", TEAL],
  ["qa-mobile", "release-mobile", TEAL],

  ["rnd-eng", "factory", BROWN],
  ["factory", "design-instructions", BROWN],
];

const DESIGN_BRANCH_DEFS = [
  { source: "design-wizards", target: "mobile-team", color: TEAL },
  { source: "design-wizards", target: "firmware-developer", color: BLUE },
  { source: "design-wizards", target: "webgui-team", color: INDIGO },
];

const CARD_HEIGHT = 112; // matches .process-node__card min-height
const IDENTITY_HEIGHT = 26; // matches .process-node__icon diameter
const IDENTITY_GAP = 8; // matches .process-node__identity margin-top
const HIDDEN_CARD_IDENTITY_SHIFT = -(CARD_HEIGHT / 2 + IDENTITY_GAP + IDENTITY_HEIGHT / 2);
const CARD_CENTER = CARD_HEIGHT / 2;

function ProcessNode({ data }) {
  const Icon = data.icon;
  return (
    <div className="process-node">
      <Handle type="target" position={Position.Left} style={{ opacity: 0, top: CARD_CENTER }} />
      <Handle type="source" position={Position.Right} style={{ opacity: 0, top: CARD_CENTER }} />
      {data.topSource && (
        <Handle type="source" position={Position.Top} id="top" style={{ opacity: 0 }} />
      )}
      {data.bottomTarget && (
        <Handle type="target" position={Position.Bottom} id="bottom" style={{ opacity: 0 }} />
      )}
      {data.bottomSource && (
        <Handle type="source" position={Position.Bottom} id="bottom" style={{ opacity: 0 }} />
      )}
      {data.topTarget && (
        <Handle type="target" position={Position.Top} id="top" style={{ opacity: 0 }} />
      )}

      <div
        className="process-node__card"
        style={{ borderTopColor: data.color, visibility: data.hideCard ? "hidden" : "visible" }}
      >
        <div className="process-node__subheader" style={{ color: data.color }}>
          {data.subheader}
        </div>
        <div className="process-node__description">{data.description}</div>
      </div>

      <div
        className="process-node__identity"
        style={data.hideCard ? { position: "relative", top: `${HIDDEN_CARD_IDENTITY_SHIFT}px` } : undefined}
      >
        <div className="process-node__icon" style={{ background: data.color }}>
          <Icon color="#fff" size={14} strokeWidth={2} />
        </div>
        <div className="process-node__actor">{data.actor}</div>
      </div>
    </div>
  );
}

const nodeTypes = { process: ProcessNode };

function DesignBranchEdge({ sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, style, markerEnd }) {
  const [path] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    borderRadius: 8,
    centerX: sourceX + 30,
  });
  return <BaseEdge path={path} style={style} markerEnd={markerEnd} />;
}

const edgeTypes = { designBranch: DesignBranchEdge };

export default function RefillingProcessFlow() {
  const { nodes, edges } = useMemo(() => {
    const nodes = NODE_DEFS.map((n) => ({
      id: n.id,
      type: "process",
      position: { x: n.x, y: n.y },
      data: n,
      draggable: true,
    }));

    const edges = EDGE_DEFS.map(([source, target, color]) => ({
      id: `${source}-${target}`,
      source,
      target,
      type: "smoothstep",
      style: { stroke: color, strokeWidth: 1.75 },
      markerEnd: { type: MarkerType.ArrowClosed, color, width: 16, height: 16 },
    }));

    DESIGN_BRANCH_DEFS.forEach(({ source, target, color }) => {
      edges.push({
        id: `${source}-${target}`,
        source,
        target,
        type: "designBranch",
        style: { stroke: color, strokeWidth: 1.75 },
        markerEnd: { type: MarkerType.ArrowClosed, color, width: 16, height: 16 },
      });
    });

    edges.push({
      id: "design-instructions-design-wizards",
      source: "design-instructions",
      sourceHandle: "top",
      target: "design-wizards",
      targetHandle: "bottom",
      type: "smoothstep",
      label: "next iteration",
      labelStyle: { fill: BROWN, fontSize: 11, fontFamily: "var(--font-sans)" },
      labelBgStyle: { fill: "#fff" },
      labelBgPadding: [4, 2],
      style: { stroke: BROWN, strokeWidth: 1.5, strokeDasharray: "5 3" },
      markerEnd: { type: MarkerType.ArrowClosed, color: BROWN, width: 16, height: 16 },
    });

    edges.push({
      id: "firmware-developer-mobile-team",
      source: "firmware-developer",
      target: "mobile-team",
      type: "designBranch",
      style: { stroke: TEAL, strokeWidth: 1.5, strokeDasharray: "5 3" },
      markerEnd: { type: MarkerType.ArrowClosed, color: TEAL, width: 16, height: 16 },
    });

    edges.push({
      id: "firmware-developer-webgui-team",
      source: "firmware-developer",
      target: "webgui-team",
      type: "designBranch",
      style: { stroke: INDIGO, strokeWidth: 1.5, strokeDasharray: "5 3" },
      markerEnd: { type: MarkerType.ArrowClosed, color: INDIGO, width: 16, height: 16 },
    });

    return { nodes, edges };
  }, []);

  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (!isFullscreen) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape") setIsFullscreen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [isFullscreen]);

  return (
    <div className={`refilling-flow${isFullscreen ? " refilling-flow--fullscreen" : ""}`}>
      <ReactFlow
        key={isFullscreen ? "fullscreen" : "inline"}
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        fitViewOptions={{ padding: 0.15 }}
        minZoom={0.2}
        maxZoom={1.5}
        proOptions={{ hideAttribution: true }}
      >
        <Background color="#cbd5e1" gap={24} />
        <Controls showInteractive={false} />
        <Panel position="top-right">
          <button
            type="button"
            className="refilling-flow__fullscreen-toggle"
            onClick={() => setIsFullscreen((f) => !f)}
            aria-label={isFullscreen ? "Exit fullscreen" : "Expand to fullscreen"}
          >
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
        </Panel>
      </ReactFlow>
    </div>
  );
}
