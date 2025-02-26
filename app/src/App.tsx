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
        </nav>
        <hr/>
        <main>
          <ModelParametersForm onValueChanged={() => setChanged()}/>
          <TimeSeries/>
          <div id={"isoclines"}>
            <IsoclineGraph/>
          </div>
        </main>
        <hr/>
        <footer>
          <span><a target={"_blank"}
                   href={"https://github.com/isaackogan/Lotka-Volterra"}>View Source</a> on GitHub</span>
          <span><strong style={{color: "#9bc5f6"}}>L-V Predator Model - </strong><span>N/dt= rN-aNP</span></span>
          <span><strong style={{color: "#9bc5f6"}}>L-V Prey Model - </strong><span>dP/dt = baNP - mp</span></span>
        </footer>
      </>
  )
}

export default App
