import { Grammar, GrammarKey } from "@/types";
import { Json } from "@/packages";
import json from "./grammar/json.json";
import squareBrackets from "./grammar/square-brackets.json";
import matchingPairs from "./grammar/matching-pairs.json";

export const GRAMMARS: Grammar[] = [
  {
    key: GrammarKey.JSON,
    label: "JSON",
    data: json as unknown as Json,
  },
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
