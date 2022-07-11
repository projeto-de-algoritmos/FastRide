import { ToastContainer } from 'react-toastify';
import { Area } from '../components/Graph/Graph';
import 'react-toastify/dist/ReactToastify.css';
import './Home.css';

function Home() {
  return (
    <>
      <ToastContainer />
      <div>
        <div>
          <p>Menor caminho</p>
            <p>1. Clique em um nó para referenciar o ponto de origem.</p>
            <p>2. Clique em um nó para referenciar o ponto de chegada.</p>
            <p>3. Clique 2 vezes na área branca do grafo para visualizar o caminho mais curto.</p>
        </div>
        <Area />
      </div>
    </>
  );
}

export default Home;
