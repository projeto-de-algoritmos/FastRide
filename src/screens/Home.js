import { ToastContainer } from "react-toastify";
import { Area } from "../components/Graph/Graph";
import "react-toastify/dist/ReactToastify.css";
import "./Home.css";

function Home() {
  return (
    <>
      <ToastContainer />
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div style={{ width: "30%", padding: 30 }}>
          <h1>Menor caminho entre ilhas</h1>
          <p>1. Clique em um nó para referenciar o ponto de origem.</p>
          <p>2. Clique em um nó para referenciar o ponto de chegada.</p>
          <p>
            3. Clique 2 vezes na área do grafo para visualizar o caminho mais
            curto.
          </p>
        </div>
        <div style={{ width: "70%" }}>
          <Area />
        </div>
      </div>
    </>
  );
}

export default Home;
