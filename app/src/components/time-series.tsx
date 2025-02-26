import {LineChart} from "@mui/x-charts";
import {FC, HTMLProps, useEffect, useRef, useState} from "react";
import {SectionLabel, SectionTitle} from "./section.tsx";
import {Constants, ModelParameters, useParametersStore} from "../stores/model.ts";
import TimeSeriesParametersForm from "./time-series-parameters-form.tsx";
import styled from "styled-components";
import {Description} from "./form-field.tsx";


const LotkaVolterraChart: FC<ModelParameters> = ({r, a, b, m}) => {
  const dt = 1;
  const {changeId, steps} = useParametersStore();
  const chartContainerRef = useRef(null);
  const [chartWidth, setChartWidth] = useState(550); // Default width

  useEffect(() => {
    const handleResize = () => {
      if (chartContainerRef.current) {
        // max width 90% of document, or 550
        const width = Math.min(window.innerWidth * 0.95, 550);
        setChartWidth(width);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial sizing

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const [data, setData] = useState<{ time: number[], prey: number[], predators: number[] }>({
    time: [],
    prey: [],
    predators: []
  });
  const preyK = Constants.preyK;  // Carrying capacity for the prey

  const updateModel = () => {
    console.log('[Debug] Updating Time Series...');

    let N = Constants.initialN;  // Initial prey population
    let P = Constants.initialP;  // Initial predator population
    let time = [];
    let prey = [];
    let predators = [];

    for (let t = 0; t < steps; t++) {
      time.push(t * dt);
      prey.push(N);
      predators.push(P);

      const nFloor = Math.floor(N);
      const pFloor = Math.floor(P);

      if (nFloor > 0 && pFloor > 0) {
        // Lotka-Volterra Equations Corrected
        const dx = r * N * (1 - N / preyK) - a * N * P;  // Include logistic growth for prey
        const dy = b * a * N * P - m * P;
        N += dx * dt;
        P += dy * dt;
      } else if (nFloor === 0) {
        // If prey is extinct, predators die off
        const dy = -m * P;
        P += dy * dt;
      } else if (pFloor === 0) {
        // If predators are extinct, prey grows towards carrying capacity
        const dx = r * N * (1 - N / preyK);
        N += dx * dt;
      }

      if (N < 1) {
        N = 0;
      }

      if (P < 1) {
        P = 0;
      }

      // Handle simulation ends early: we fill the remaining steps if one population reaches zero
      if (nFloor === 0 && pFloor > 0) {
        console.log(`[Debug] Prey population reached zero at time ${t * dt}.`);
        continue; // Predator population will decrease over remaining time steps
      } else if (pFloor === 0 && nFloor > 0) {
        console.log(`[Debug] Predator population reached zero at time ${t * dt}.`);
        continue; // Prey population will increase towards carrying capacity over remaining time steps
      } else if (nFloor === 0 && pFloor === 0) {
        console.log(`[Debug] Both populations have reached zero at time ${t * dt}.`);
        break; // End loop early as both populations are extinct
      }
    }

    setData({time, prey, predators});
  }

  console.log('Time Length:', data.time.length);
  useEffect(updateModel, [changeId]);

  return (
      <div ref={chartContainerRef} style={{marginLeft: "-20px", marginTop: "10px"}}>
        <LineChart
            xAxis={[{data: data.time, label: "Time (t)"}]}
            yAxis={[{label: "Population"}]}
            series={[
              {data: data.prey, label: "Prey (N)", color: "#8fcbd5", showMark: false},
              {data: data.predators, label: "Predators (P)", color: "#ec9999", showMark: false},
            ]}
            key={chartWidth}
            width={chartWidth}
            height={350}
        />
      </div>
  );
};

const TimeSeriesExtra = styled.div`
    display: flex;
    margin-top: 5px;
`;

export const TimeSeries: FC<HTMLProps<HTMLDivElement>> = (props) => {
  const {set, setChanged, ...values} = useParametersStore();

  return (
      <div {...props}>
        <SectionTitle>Time Series</SectionTitle>
        <SectionLabel>How will the population change over time?</SectionLabel>
        <div>
          <LotkaVolterraChart {...values}/>
          <TimeSeriesExtra>
            <TimeSeriesParametersForm onValueChanged={() => setChanged()}/>
            <div>
              <h4 style={{marginBottom: "5px", marginTop: "0px", fontWeight: "bold"}}>Constants</h4>
              <div style={{color: "#fff", fontSize: "0.8em"}}>
                <strong style={{color: "#8fcbd5"}}>Initial Prey:</strong> {Constants.initialN}<br/>
                <strong style={{color: "#ec9999"}}>Initial Predators:</strong> {Constants.initialP}<br/>
                <strong style={{color: "#9bc5f6"}}>Carrying Capacity (K):</strong> {Constants.preyK}
              </div>
              <Description>Edit these values in the page URL!</Description>
            </div>
          </TimeSeriesExtra>
        </div>
      </div>
  );

}


export default TimeSeries;
