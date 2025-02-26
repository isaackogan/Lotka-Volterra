import {useForm} from "react-hook-form";
import FormField from "./form-field.tsx";
import {Defaults, Maxima, Minima, ModelParameters, modelParametersSchema} from "../stores/model.ts";
import {zodResolver} from "@hookform/resolvers/zod";
import styled from "styled-components";
import {SectionLabel, SectionTitle} from "./section.tsx";
import {FC} from "react";
import {useDebouncedChange} from "../hooks/use-debounced-change.ts";


const ModelParametersFormContainer = styled.form`
    display: flex;
    flex-direction: column;
    row-gap: 20px;
`;


interface ModelParametersFormProps {
  onValueChanged: () => void;
}


const ModelParametersForm: FC<ModelParametersFormProps> = ({onValueChanged}) => {
  const {
    register,
    handleSubmit,
    formState: {errors},
  } = useForm<ModelParameters>({
    resolver: zodResolver(modelParametersSchema), // Apply the zodResolver
  });

  const onChangeNoticed = useDebouncedChange(onValueChanged, 250);
  const Steps = 1000;

  return (
      <ModelParametersFormContainer onChange={handleSubmit(onChangeNoticed)}>
        <div>
          <SectionTitle>Model Parameters</SectionTitle>
          <SectionLabel>Drag the sliders and observe the shift!</SectionLabel>
        </div>

        <FormField
            onValueChanged={onChangeNoticed}
            label={"Prey Growth Rate (r)"}
            description={"The intrinsic rate at which the prey population grows. Unit of (1/t)."}
            type="range"
            placeholder="r"
            name="r"
            register={register}
            error={errors.r}
            min={Minima.r}
            max={Maxima.r}
            defaultValue={Defaults.r}
            step={(Maxima.r - Minima.r) / Steps}
        />
        <FormField
            onValueChanged={onChangeNoticed}
            label={"Attack Rate (a)"}
            description={"The rate at which prey are consumed. Unit of (consumed/prey*predator*time)."}
            type="range"
            placeholder="a"
            name="a"
            register={register}
            error={errors.a}
            min={Minima.a}
            max={Maxima.a}
            defaultValue={Defaults.a}
            step={(Maxima.a - Minima.a) / Steps}
        />
        <FormField
            onValueChanged={onChangeNoticed}
            label={"Predator Mortality Rate (m)"}
            description={"The rate at which predators are killed. Unit of (1/t)."}
            type="range"
            placeholder="m"
            name="m"
            register={register}
            error={errors.m}
            min={Minima.m}
            max={Maxima.m}
            defaultValue={Defaults.m}
            step={(Maxima.m - Minima.m) / Steps}
        />
        <FormField
            onValueChanged={onChangeNoticed}
            label={"Predator Conversion Ratio (b)"}
            description={"The rate at which prey are converted to predators. Unit of (predator/consumed prey)."}
            type="range"
            placeholder="b"
            name="b"
            register={register}
            error={errors.b}
            min={Minima.b}
            max={Maxima.b}
            defaultValue={Defaults.b}
            step={(Maxima.b - Minima.b) / Steps}
        />
      </ModelParametersFormContainer>
  );
}

export default ModelParametersForm;