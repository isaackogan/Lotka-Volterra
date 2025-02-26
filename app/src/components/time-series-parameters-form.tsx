import {useForm} from "react-hook-form";
import FormField from "./form-field.tsx";
import {Defaults, Maxima, Minima, TimeSeriesParameters, timeSeriesParametersSchema} from "../stores/model.ts";
import {zodResolver} from "@hookform/resolvers/zod";
import styled from "styled-components";
import {FC} from "react";
import {useDebouncedChange} from "../hooks/use-debounced-change.ts";


const TimeSeriesParametersFormContainer = styled.form`
    display: flex;
    flex-direction: column;
    row-gap: 20px;
`;


interface TimeSeriesParametersFormProps {
  onValueChanged: () => void;
}


const TimeSeriesParametersForm: FC<TimeSeriesParametersFormProps> = ({onValueChanged}) => {
  const {
    register,
    handleSubmit,
    formState: {errors},
  } = useForm<TimeSeriesParameters>({
    resolver: zodResolver(timeSeriesParametersSchema), // Apply the zodResolver
  });

  const onChangeNoticed = useDebouncedChange(onValueChanged, 250);
  const Steps = 100;

  return (
      <TimeSeriesParametersFormContainer onChange={handleSubmit(onChangeNoticed)}>
        <FormField
            onValueChanged={onChangeNoticed}
            label={"Steps (s=t)"}
            description={"The units of time to run the simulation for. The units are arbitrary & meaningless."}
            type="range"
            placeholder="b"
            name="steps"
            register={register}
            error={errors.steps}
            min={Minima.steps}
            max={Maxima.steps}
            defaultValue={Defaults.steps}
            floatPrecision={0}
            step={(Maxima.steps - Minima.steps) / Steps}
        />
      </TimeSeriesParametersFormContainer>
  );
}

export default TimeSeriesParametersForm;