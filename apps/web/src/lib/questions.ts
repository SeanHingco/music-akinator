// apps/web/src/lib/questions.ts
export type AxisKey =
  | "warm_bright"
  | "lofi_polished"
  | "acoustic_electronic"
  | "intimate_anthemic";

export type Question = {
  id: string;
  axis: AxisKey;
  prompt: string;
  weight?: number;
};

export const QUESTIONS: Question[] = [
  {
    id: "q_warm_bright_1",
    axis: "warm_bright",
    prompt: "cozy, warm music or crisp, bright music?",
  },
  {
    id: "q_lofi_polished_1",
    axis: "lofi_polished",
    prompt: "raw lo-fi texture or clean, polished production?",
  },
  {
    id: "q_acoustic_electronic_1",
    axis: "acoustic_electronic",
    prompt: "organic, acoustic sounds or synthetic, electronic sounds?",
  },
  {
    id: "q_intimate_anthemic_1",
    axis: "intimate_anthemic",
    prompt: "personal, intimate songs or grand, anthemic tracks?",
  },
];
