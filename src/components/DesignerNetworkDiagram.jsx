import { useEffect, useMemo, useState } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  Handle,
  Panel,
  Position,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import {
  PenTool,
  Headphones,
  FlaskConical,
  Wrench,
  ClipboardCheck,
  Printer,
  TestTube,
  Code2,
  Cpu,
  Smartphone,
  Monitor,
  Bug,
  Maximize2,
  Minimize2,
} from "lucide-react";
import "./DesignerNetworkDiagram.css";

const TRUNCATE_AT = 62;

const DESIGNER = { id: "designer", label: "Designer", color: "#0f172a", icon: PenTool };

const DIRECT_TEAMS = [
  { id: "support", label: "Support", comment: "Отслеживание фидбека от пользователей", color: "#1d4ed8", icon: Headphones },
  { id: "rnd", label: "R&D", comment: "Электролит деградирует быстрее, если не промывать бак", color: "#92400e", icon: FlaskConical },
  { id: "chemistry", label: "Chemistry team", comment: "Рекомендации по приготовлению электролита с учётом разбавления остаточным количеством воды в баке", color: "#65a30d", icon: TestTube },
  { id: "engineering", label: "Engineering team", comment: "Конструкция бака не позволяет слить его полностью — 0,7 л всегда остаётся внутри", color: "#047857", icon: Wrench },
  { id: "fat", label: "FAT team", comment: "Тестируют каждое устройство после сборки, нужен «режим эксперта по заправке» для пропуска части шагов", color: "#be185d", icon: ClipboardCheck },
  { id: "assembly", label: "Assembly team", comment: "Хотят печатать QSG on site в нужном количестве (version management)", color: "#0891b2", icon: Printer },
];

const SOFTWARE = { id: "software", label: "Software Team", color: "#0369a1", icon: Code2 };
const SUB_TEAMS = [
  { id: "firmware", label: "Firmware dev", comment: "Цикл разработки и тестирования 3–6 месяцев, лучше обсуждать фичи заранее", color: "#6d28d9", icon: Cpu },
  { id: "mobile", label: "Mobile App", color: "#0f766e", icon: Smartphone },
  { id: "webgui", label: "WebGUI", color: "#4338ca", icon: Monitor },
  { id: "qa", label: "QA", color: "#c2410c", icon: Bug },
];

const ADJACENT_LINKS = [["chemistry", "rnd"]];

function polar(cx, cy, r, deg) {
  const rad = (deg * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function buildPositions() {
  const positions = { designer: { x: 0, y: 0 } };
  const ring = [...DIRECT_TEAMS.map((t) => t.id), "software"];
  const step = 360 / ring.length;
  ring.forEach((id, i) => {
    const angle = -90 + i * step;
    const r = id === "software" ? 460 : 300;
    positions[id] = polar(0, 0, r, angle);
  });
  const softwareAngle = -90 + ring.indexOf("software") * step;
  const fan = [-42, -14, 14, 42];
  SUB_TEAMS.forEach((t, i) => {
    const s = positions.software;
    positions[t.id] = polar(s.x, s.y, 155, softwareAngle + fan[i]);
  });
  return positions;
}

function TeamNode({ data }) {
  const Icon = data.icon;
  const [expanded, setExpanded] = useState(false);
  const size = data.size || 60;

  return (
    <div className="designer-network__node">
      <Handle type="target" position={Position.top} style={{ opacity: 0 }} />
      <div
        className="designer-network__bubble"
        style={{ width: size, height: size, background: data.color }}
      >
        <Icon color="#fff" size={size * 0.45} strokeWidth={1.9} />
      </div>
      <div className="designer-network__label">{data.label}</div>

      {data.comment && (
        <div
          className={`designer-network__comment${expanded ? " designer-network__comment--expanded" : ""}`}
          style={{ borderLeftColor: data.color }}
          onClick={() => setExpanded((e) => !e)}
        >
          {expanded
            ? data.comment
            : data.comment.length > TRUNCATE_AT
            ? data.comment.slice(0, TRUNCATE_AT).trim() + "…"
            : data.comment}
        </div>
      )}
      <Handle type="source" position={Position.bottom} style={{ opacity: 0 }} />
    </div>
  );
}

const nodeTypes = { team: TeamNode };

export default function DesignerNetworkDiagram() {
  const { nodes, edges } = useMemo(() => {
    const positions = buildPositions();
    const allTeams = [DESIGNER, ...DIRECT_TEAMS, SOFTWARE, ...SUB_TEAMS];

    const nodes = allTeams.map((t) => ({
      id: t.id,
      type: "team",
      position: positions[t.id],
      data: {
        label: t.label,
        color: t.color,
        icon: t.icon,
        comment: t.comment,
        size: t.id === "designer" ? 76 : t.id === "software" ? 60 : 56,
      },
      draggable: true,
    }));

    const mainEdges = DIRECT_TEAMS.map((t) => ({
      id: `designer-${t.id}`,
      source: "designer",
      target: t.id,
      type: "straight",
      style: { stroke: "#94a3b8", strokeWidth: 1.75 },
    }));

    const trunkEdge = {
      id: "designer-software",
      source: "designer",
      target: "software",
      type: "straight",
      style: { stroke: "#94a3b8", strokeWidth: 1.75 },
    };

    const subEdges = SUB_TEAMS.map((t) => ({
      id: `software-${t.id}`,
      source: "software",
      target: t.id,
      type: "straight",
      style: { stroke: "#94a3b8", strokeWidth: 1.5 },
    }));

    const adjacentEdges = ADJACENT_LINKS.map(([a, b]) => ({
      id: `${a}-${b}-adjacent`,
      source: a,
      target: b,
      type: "straight",
      style: { stroke: "#94a3b8", strokeWidth: 1.5, strokeDasharray: "5 3" },
    }));

    return { nodes, edges: [...mainEdges, trunkEdge, ...subEdges, ...adjacentEdges] };
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
    <div className={`designer-network${isFullscreen ? " designer-network--fullscreen" : ""}`}>
      <ReactFlow
        key={isFullscreen ? "fullscreen" : "inline"}
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
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
            className="designer-network__fullscreen-toggle"
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
