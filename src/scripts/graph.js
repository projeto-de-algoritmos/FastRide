import { toast } from "react-toastify";
import AdjMock from './adj-mock';

export const buildNodes = () => {
  const nodes = []
  for (var i = 0; i < AdjMock.length; i++) {
    nodes.push({ id: i, color: "gray" });
  }
  return nodes;

}

export const buildEdges = () => {
  const edges = []
  for (var i = 0; i < AdjMock.length; i++) {
    for (var j = 0; j < AdjMock[i].edges.length; j++) {
      edges.push({ from: i, to: AdjMock[i].edges[j].id, label: `${AdjMock[i].edges[j].weight}` });
    }
  }
  return edges;
}

export const getMinRoute = (row, explored) => {
  var min = 99999;
  var index = -1;

  for (var i = 0; i < row.length; i++) {
    if (explored[row[i].to] >= 0) {
      row.splice(i, 1);
      i--;
      continue;
    }

    if (row[i].dist < min) {
      min = row[i].dist;
      index = i;
    }
  }

  if (index !== -1) {
    return row[index];
  } else {
    return null;
  }
}