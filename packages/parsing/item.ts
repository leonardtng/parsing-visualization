import { Nonterminal, Rhs, Symbol } from "@/packages/grammar";

export interface Item {
  lhs: Nonterminal;
  rhs: Rhs;
  consumed: number;
}

export const consume = (item: Item): [Symbol, Item] | null => {
  const { lhs, rhs, consumed } = item;

  if (consumed >= rhs.elements.length) return null;

  return [
    rhs.elements[consumed].symbol,
    {
      lhs,
      rhs,
      consumed: consumed + 1,
    },
  ];
};
