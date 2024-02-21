import { Json } from "@/packages";

export enum GrammarKey {
  JAVA = "JAVA",
  JSON = "JSON",
  SQUARE_BRACKETS = "SQUARE_BRACKETS",
  MATCHING_PAIRS = "MATCHING_PAIRS",
  AMBIGUOUS = "AMBIGUOUS",
}

export interface Grammar {
  key: GrammarKey;
  label: string;
  data: Json;
}
