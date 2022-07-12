import Graph from "react-graph-vis";
import { useState } from "react";
import { toast } from "react-toastify";
import AdjMock from "../../scripts/adj-mock";
import { buildEdges, buildNodes, getMinRoute } from "../../scripts/graph";

export function Area() {
  var white = true;
  var yellow = false;
  var clean = false;
  var inspected;

  const changeGraphState = (id) => {
    if (clean) {
      for (var i = 0; i < AdjMock.length; i++) {
        graph.nodes[i].color = "green";
        graph.nodes[i].label = "";
      }
      clean = false;
    }

    const node = graph.nodes.find((node) => {
      return node.id === id;
    });
    const color = node.color;

    if (color === "green" && white) {
      node.color = "white";
      white = false;
      yellow = true;
    } else if (color === "green" && yellow) {
      node.color = "yellow";
      yellow = false;
    } else if (color === "yellow") {
      node.color = "green";
      yellow = true;
    } else if (color === "white") {
      white = true;
      node.color = "green";
    } else {
      node.color = "green";
    }

    setState(({ graph, ...rest }) => {
      return {
        graph,
        ...rest,
      };
    });
  };

  const getShortestRouteByDijkstra = () => {
    const source = graph.nodes.filter((node) => node.color === "white")[0].id;
    const target = graph.nodes.filter((node) => node.color === "yellow")[0].id;

    var row = [];
    var distance = Array(AdjMock.length);
    inspected = Array(AdjMock.length).fill(-1);

    var v = source;
    distance[v] = 0;
    inspected[v] = v;

    for (var count = 0; count < AdjMock.length - 1; count++) {
      for (var i = 0; i < AdjMock[v].edges.length; i++) {
        let u = AdjMock[v].edges[i];

        if (inspected[u.id] !== -1) {
          continue;
        }

        row.push({ from: v, to: u.id, dist: distance[v] + u.weight });
      }

      let node = getMinRoute(row, inspected);
      if (node === null) {
        break;
      }
      v = node.to;

      distance[v] = node.dist;
      inspected[v] = node.from;
    }

    var x = target;
    if (inspected[x] >= 0) {
      var cnt = 0;
      while (x !== source) {
        x = inspected[x];
        cnt++;
      }
      cnt--;
      x = target;
      while (x !== source) {
        x = inspected[x];
        if (
          graph.nodes[x].color !== "white" &&
          graph.nodes[x].color !== "yellow"
        ) {
          graph.nodes[x].color = "rgb(255, 204, 102)";
          graph.nodes[x].label = `${cnt--}`;
          graph.nodes[x].font = "20px arial white";
        }
      }
      toast.dismiss();
      toast.success("Caminho encontrado!");
    } else {
      toast.error("Não há caminho até o destino!");
    }

    yellow = false;
    white = true;
    clean = true;

    setState(({ graph, ...rest }) => {
      return {
        graph,
        ...rest,
      };
    });
  };

  const [state, setState] = useState({
    counter: 5,
    graph: {
      nodes: buildNodes(),
      edges: buildEdges(),
    },
    events: {
      selectNode: ({ nodes }) => {
        changeGraphState(nodes[0]);
      },
      doubleClick: () => {
        if (!yellow && !white) {
          getShortestRouteByDijkstra(graph, () => {});
        }
      },
    },
  });

  const { graph, events } = state;

  return (
    <>
      <Graph
        key={Math.random()}
        graph={graph}
        options={{
          layout: {
            hierarchical: false,
            randomSeed: 16,
          },
          edges: {
            color: "black",
          },
          nodes: {
            fixed: false,
          },
          height: "100%",
          interaction: {
            selectConnectedEdges: false,
            multiselect: true,
          },
          physics: {
            enabled: false,
          },
        }}
        events={events}
        style={{
          width: "100%",
          maxWidth: "35rem",
          height: "45rem",
          backgroundColor: "#d3ddf0",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      />
    </>
  );
}
