import React, { SyntheticEvent } from "react";
import { Checkbox, Select } from "@/components";
import { useParsingContext } from "@/constants";

const GrammarSelector = () => {
  const {
    grammar,
    selectGrammar,
    grammarOptions,
    showMostRelevant,
    toggleShowMostRelevant,
  } = useParsingContext();

  const handleChange = (_: SyntheticEvent | null, selected: string) => {
    selectGrammar(
      grammarOptions.find((option) => selected === option.key) ??
        grammarOptions[0]
    );
  };

  return (
    <div className="flex flex-col gap-3">
      <Select
        options={grammarOptions}
        value={grammar.key}
        onChange={handleChange}
        customLabel={`Grammar: ${grammar.label}`}
      />

      <div
        className="flex justify-center items-center cursor-pointer gap-1"
        onClick={toggleShowMostRelevant}
      >
        <Checkbox
          id="show-most-relevant"
          className="[&_.checkboxBase]:!w-[13px] [&_.checkboxBase]:!h-[13px] 
            [&_.checkboxBase]:bg-transparent [&_.checkboxBase]:rounded-[4px] 
            [&_.checkboxInput]:w-[13px] [&_.checkboxInput]:h-[13px] [&_.checkboxBase]:border-strokeSecondary
            [&_.checkIcon]:w-[7px] [&_.checkIcon]:h-[7px] [&_*]:fill-fontPrimary"
          checked={showMostRelevant}
        />
        <span className="text-[11px]">Filter Relevant</span>
      </div>
    </div>
  );
};

export default GrammarSelector;
