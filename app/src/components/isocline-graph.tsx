import {FC, HTMLProps, useEffect, useRef, useState} from "react";
import {SectionLabel, SectionTitle} from "./section.tsx";
import {LineChart} from "@mui/x-charts";
import {useParametersStore} from "../stores/model.ts";
import styled from "styled-components";
import {Description, Label} from "./form-field.tsx";

const IsoclineText = styled.div`
    display: flex;
    justify-content: center;
    flex-direction: column;
    font-size: 0.9em;
    margin-left: 35px;
    margin-top: 10px;
`;

const PreyIsoclineChart: FC = () => {
  const {r, a, m, b} = useParametersStore();  // Accessing r, a, m, and b from the store

  const [data, setData] = useState<{
    preyIsoclinePrey: number[],
    preyIsoclinePredators: number[],
    predatorIsoclinePrey: number[],
    predatorIsoclinePredators: number[]
  }>({
    preyIsoclinePrey: [],
    preyIsoclinePredators: [],
    predatorIsoclinePrey: [],
    predatorIsoclinePredators: []
  });

  const iterations = 100;

  useEffect(() => {
    const calculateIsocline = () => {
      let preyIsoclinePrey = [];
      let preyIsoclinePredators = [];

      let predatorIsoclinePrey = [];
      let predatorIsoclinePredators = [];

      for (let X = 0; X <= iterations; X += 1) {

        // P* = r/a
        preyIsoclinePrey.push(r / a)
        preyIsoclinePredators.push(X)

        // N* = m/(ba)
        predatorIsoclinePrey.push(m / (b * a))
        predatorIsoclinePredators.push(X)
      }

      setData({
        preyIsoclinePrey: preyIsoclinePrey,
        preyIsoclinePredators: preyIsoclinePredators,
        predatorIsoclinePrey: predatorIsoclinePrey,
        predatorIsoclinePredators: predatorIsoclinePredators
      });
    };

    calculateIsocline();
  }, [r, a, m, b]);

  const chartContainerRef = useRef(null);
  const [chartWidth, setChartWidth] = useState(380); // Default width

  useEffect(() => {
    const handleResize = () => {
      if (chartContainerRef.current) {
        // max width 90% of document, or 550
        const width = Math.min(window.innerWidth * 0.95, 380);
        setChartWidth(width);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial sizing

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
      <div style={{marginLeft: "-20px", marginTop: "10px"}}>
        {/* Tooltip should be the equilibrium value (r/a)*/}
        <LineChart
            xAxis={[
              {id: 'preyIsocline', data: data.preyIsoclinePredators, label: "N* = m/ba", min: 0, max: iterations},
              {id: 'predatorIsocline', data: data.predatorIsoclinePrey, min: 0, max: iterations} // Correctly use predatorIsoclinePredators here
            ]}
            yAxis={[{id: 'yAxis', label: "P* = r/a", min: 0, max: iterations}]}
            series={[
              {
                xAxisId: 'preyIsocline', // Ensure this is referencing the right yAxisId
                data: data.preyIsoclinePrey,
                showMark: false,
                label: "Prey Isocline",
                disableHighlight: true,
                color: "#8fcbd5"
              },
              {
                xAxisId: 'predatorIsocline', // Ensure this is referencing the right yAxisId
                data: data.predatorIsoclinePredators,
                showMark: false,
                label: "Predator Isocline",
                disableHighlight: true,
                color: "#ec9999"
              },
            ]}
            ref={chartContainerRef}
            width={chartWidth}
            height={chartWidth}
        />

        <IsoclineText>
          <Label>Non-Trivial Isoclines</Label>
          <p style={{margin: 0}}>
            <span> <strong>P*</strong> = {data.preyIsoclinePrey[0]?.toFixed(2)}, &nbsp;</span>
            <span><strong>N*</strong> = {data.predatorIsoclinePrey[0]?.toFixed(2)}</span>
          </p>
          <Description style={{marginTop: "8px"}}>The values at which population growth stops.</Description>
        </IsoclineText>
      </div>
  );
};


export const IsoclineGraph: FC<HTMLProps<HTMLDivElement>> = (props) => {

  return (
      <div {...props}>
        <SectionTitle>Isoclines</SectionTitle>
        <SectionLabel>At what point does the population become stable?</SectionLabel>
        <PreyIsoclineChart/>
      </div>
  );

}