import DesignerNetworkDiagram from "../components/DesignerNetworkDiagram.jsx";
import RefillingProcessFlow from "../components/RefillingProcessFlow.jsx";

export const embeds = {
  "designer-network-map": DesignerNetworkDiagram,
  "refilling-process-flow": RefillingProcessFlow,
};

export function getEmbed(key) {
  return embeds[key];
}
