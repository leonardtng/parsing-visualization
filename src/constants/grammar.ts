import { Grammar, GrammarKey } from "@/types";
import { Json } from "@/packages";
import json from "./grammar/json.json";
import java from "./grammar/java.json";
import squareBrackets from "./grammar/square-brackets.json";
import matchingPairs from "./grammar/matching-pairs.json";
import ambiguous from "./grammar/ambiguous.json";

export const GRAMMARS: Grammar[] = [
  {
    key: GrammarKey.JAVA,
    label: "Java (Simplified)",
    data: java as unknown as Json,
  },
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
  {
    key: GrammarKey.AMBIGUOUS,
    label: "Ambiguous",
    data: ambiguous as unknown as Json,
  },
];
