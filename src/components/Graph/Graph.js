import Graph from "react-graph-vis";
import { useState } from "react";
import { toast } from "react-toastify";
import AdjMock from '../../scripts/adj-mock';
import { buildEdges, buildNodes, getMinRoute } from '../../scripts/graph';

export function Area() {
  var black = true;
  var green = false;
  var clean = false;
  var inspected;

  const changeGraphState = (id) => {
    if (clean) {
      for (var i = 0; i < AdjMock.length; i++) {
        graph.nodes[i].color = "gray";
        graph.nodes[i].label = "";
      }
      clean = false;
    }

    const node = graph.nodes.find(node => { return node.id === id });
    const color = node.color;

    if (color === "gray" && black) {
      node.color = "black";
      black = false;
      green = true;
    } else if (color === "gray" && green) {
      node.color = "green";
      green = false;
    } else if (color === "green") {
      node.color = "gray";
      green = true;
    } else if (color === "black") {
      black = true;
      node.color = "gray";
    } else {
      node.color = "gray";
    }

    setState(({ graph, ...rest }) => {
      return {
        graph,
        ...rest
      }
    });
  }

  const getShortestRouteByDijkstra = () => {
    const source = graph.nodes.filter(node => node.color === "black")[0].id;
    const target = graph.nodes.filter(node => node.color === "green")[0].id;

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

        row.push({ from: v, to: u.id, dist: distance[v] + u.weight })
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
        cnt++
      }
      cnt--;
      x = target;
      while (x !== source) {
        x = inspected[x];
        if (graph.nodes[x].color !== "black" && graph.nodes[x].color !== "green") {
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

    green = false;
    black = true;
    clean = true;

    setState(({ graph, ...rest }) => {
      return {
        graph,
        ...rest
      }
    });
  }

  const [state, setState] = useState({
    counter: 5,
    graph: {
      nodes: buildNodes(),
      edges: buildEdges()
    },
    events: {
      selectNode: ({ nodes }) => {
        changeGraphState(nodes[0]);
      },
      doubleClick: () => {
        if (!green && !black) {
          getShortestRouteByDijkstra(graph, () => {
          });
        }
      }
    }
  })

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
            color: "black"
          },
          nodes: {
            fixed: false
          },
          height: "100%",
          interaction: {
            selectConnectedEdges: false,
            multiselect: true
          },
          physics: {
            enabled: false
          }
        }}
        events={events}
        style={{
          width: "90%",
          maxWidth: "35rem",
          height: "35rem",
          backgroundColor: "white",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      />
    </>
  );
}

