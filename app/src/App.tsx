import './App.css'
import ModelParametersForm from "./components/model-parameters-form.tsx";
import {IsoclineGraph} from "./components/isocline-graph.tsx";
import TimeSeries from "./components/time-series.tsx";
import {useParametersStore} from "./stores/model.ts";

function App() {
  const {setChanged} = useParametersStore();

  return (
      <>
        <nav>
          <h1 style={{marginBottom: 0}}>Lotka-Volterra Isoclines</h1>
          <h2 style={{marginTop: "5px"}}>by Isaac Kogan (25/02/2025)</h2>
          <hr/>
        </nav>
        <main>
          <ModelParametersForm onValueChanged={() => setChanged()}/>
          <TimeSeries/>
          <div id={"isoclines"}>
            <IsoclineGraph/>
          </div>
        </main>
        <footer>
          MIT
        </footer>
      </>
  )
}

export default App
