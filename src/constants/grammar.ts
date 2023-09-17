import { Grammar, GrammarKey } from "@/types";
import { Json } from "@/packages";
import squareBrackets from "./grammar/square-brackets.json";
import matchingPairs from "./grammar/matching-pairs.json";

export const GRAMMARS: Grammar[] = [
  {
    key: GrammarKey.SQUARE_BRACKETS,
    label: "Square Brackets",
    data: squareBrackets as unknown as Json,
  },
  {
    key: GrammarKey.MATCHING_PAIRS,
    label: "Matching Pairs",
    data: matchingPairs as unknown as Json,
  },
];
