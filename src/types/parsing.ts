import { Json } from "@/packages";

export enum GrammarKey {
  SQUARE_BRACKETS = "SQUARE_BRACKETS",
  MATCHING_PAIRS = "MATCHING_PAIRS",
}

export interface Grammar {
  key: GrammarKey;
  label: string;
  data: Json;
}
