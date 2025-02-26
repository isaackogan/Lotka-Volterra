import {z, ZodType} from "zod";
import {create} from "zustand/react";

export interface ModelParameters {

  // Prey Params
  r: number;

  // Predator Params
  b: number
  m: number

  // Mutual Params
  a: number
}

export interface TimeSeriesParameters {
  steps: number;
}

export const Maxima: ModelParameters & TimeSeriesParameters = {
  r: 2.0,
  a: 1.0,
  b: 1.0,
  m: 1.0,
  steps: 500
}

export const Minima: ModelParameters & TimeSeriesParameters = {
  r: 0.1,
  a: 0.01,
  b: 0.01,
  m: 0.01,
  steps: 10
}

export const Defaults: ModelParameters & TimeSeriesParameters = {
  r: 0.5,
  a: 0.01,
  b: 0.82,
  m: 0.1,
  steps: 100
}

export const modelParametersSchema: ZodType<ModelParameters> = z.object({

  r: z.number()
      .min(Minima.r, `r must be greater than ${Minima.r}`)
      .max(Maxima.r, `r must be less than ${Maxima.r}`),

  a: z.number()
      .min(Minima.a, `a must be greater than ${Minima.a}`)
      .max(Maxima.a, `a must be less than ${Maxima.a}`),

  b: z.number()
      .min(Minima.b, `b must be greater than ${Minima.b}`)
      .max(Maxima.b, `b must be less than ${Maxima.b}`),

  m: z.number()
      .min(Minima.m, `m must be greater than ${Minima.m}`)
      .max(Maxima.m, `m must be less than ${Maxima.m}`),

});

export const timeSeriesParametersSchema = z.object({

  // Default 500
  steps: z.number()
      .min(Minima.steps, `steps must be greater than ${Minima.steps}`)
      .max(Maxima.steps, `steps must be less than ${Maxima.steps}`),
});

export type Parameters = ModelParameters & TimeSeriesParameters;

export type ParametersStore = Parameters & {
  set: (key: keyof Parameters, value: number) => void;
  changeId: number;
  setChanged: () => void;
}

export type ConstantParameters = {
  initialN: number;
  initialP: number;
  preyK: number;
}

const url = new URL(window.location.href);

const searchN = url.searchParams.get('N') && parseInt(url.searchParams.get('N')!);
const searchP = url.searchParams.get('P') && parseInt(url.searchParams.get('P')!);
const searchK = url.searchParams.get('K') && parseInt(url.searchParams.get('K')!);

const DefaultConstants: ConstantParameters = {
  initialN: 40,
  initialP: 30,
  preyK: 100
}

if (!searchN || !searchP || !searchK) {
  url.searchParams.set('N', DefaultConstants.initialN.toString());
  url.searchParams.set('P', DefaultConstants.initialP.toString());
  url.searchParams.set('K', DefaultConstants.preyK.toString());
  window.history.replaceState({}, '', url.toString());
}

export const Constants: ConstantParameters = {
  initialN: parseInt(url.searchParams.get('N')!),
  initialP: parseInt(url.searchParams.get('P')!),
  preyK: parseInt(url.searchParams.get('K')!)
}


export const useParametersStore = create<ParametersStore>((set) => ({
  r: Defaults.r,
  a: Defaults.a,
  b: Defaults.b,
  m: Defaults.m,
  steps: Defaults.steps,
  set: (key, value) => set({[key]: value}),
  changeId: 0,
  setChanged: () => set((state) => ({changeId: state.changeId + 1}))
}));
