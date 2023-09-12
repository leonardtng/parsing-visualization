import { Nonterminal, Rhs, Symbol } from "@/packages/grammar";
import { intern3 } from "@/packages/utils";

// export interface Item {
//   lhs: Nonterminal;
//   rhs: Rhs;
//   consumed: number;
// }

export class Item {
  lhs: Nonterminal;
  rhs: Rhs;
  consumed: number;

  private constructor(lhs: Nonterminal, rhs: Rhs, consumed: number) {
    this.lhs = lhs;
    this.rhs = rhs;
    this.consumed = consumed;
  }

  static make = intern3(
    (lhs: Nonterminal, rhs: Rhs, consumed: number) =>
      new Item(lhs, rhs, consumed)
  );

  consume(): [Symbol, Item] | null {
    if (this.consumed >= this.rhs.elements.length) return null;

    return [
      this.rhs.elements[this.consumed].symbol,
      Item.make(this.lhs, this.rhs, this.consumed + 1),
    ];
  }
}

// export const consume = (item: Item): [Symbol, Item] | null => {
//   const { lhs, rhs, consumed } = item;

//   if (consumed >= rhs.elements.length) return null;

//   return [
//     rhs.elements[consumed].symbol,
//     {
//       lhs,
//       rhs,
//       consumed: consumed + 1,
//     },
//   ];
// };
