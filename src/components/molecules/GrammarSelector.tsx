import React, { SyntheticEvent } from "react";
import { Select } from "@/components";
import { useParsing } from "@/constants";

const GrammarSelector = () => {
  const { grammar, selectGrammar, grammarOptions } = useParsing();

  const handleChange = (_: SyntheticEvent | null, selected: string) => {
    selectGrammar(
      grammarOptions.find((option) => selected === option.key) ??
        grammarOptions[0]
    );
  };

  return (
    <Select
      options={grammarOptions}
      value={grammar.key}
      onChange={handleChange}
    />
  );
};

export default GrammarSelector;
