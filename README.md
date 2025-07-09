# Parsing Visualization

This project provides a tool that displays comprehensive parsing and parse error visualizations. It processes input code and generates an interactive force-directed parse tree using the Cocke-Younger-Kasami (CYK) Algorithm. The parsing tool is language-agnostic, and can parse any language or expression if provided with the appropriate grammar.

## 🌟 Features

- **Real-time Parsing Visualization**: See how your input is parsed step-by-step
- **Multiple Visualization Modes**:
  - Force-Directed Graph/Tree view
  - Chart/Table view showing the Earley parsing chart
- **Interactive Code Editor**: Syntax-highlighted editor with live parsing feedback
- **Multiple Grammar Support**: Natively supports Java (simplified) with easy extensibility
- **Custom Grammar Support**: Add your own language grammars

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/leonardtng/parsing-visualization.git
cd parsing-visualization
```

2. Install dependencies:

```bash
yarn install
```

3. Run the development server:

```bash
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🔧 Adding Custom Grammars

To visualize parsing for languages other than the built-in ones:

1. Clone the repository
2. Create a new grammar file in `/src/constants/grammar/` folder
3. Follow the grammar JSON format (see example below)
4. Add your grammar to the `GRAMMARS` array in `/src/constants/grammar.ts`

### Grammar File Format

Grammar files must follow this JSON structure:

```json
{
  "start": "StartSymbol",
  "productionMap": {
    "Nonterminal": [
      ["rule_label", ["symbol1", "symbol2", "..."]],
      ["another_rule", ["symbolA", "symbolB"]]
    ]
  },
  "directory": {
    "Nonterminal": "Human-readable name",
    "symbol": "Description"
  },
  "whitespace": "\\s+",
  "terminalRules": [
    ["terminal_name", "regex_pattern"],
    ["keyword", "exact_match"]
  ],
  "defaultInput": "Sample input text for this grammar"
}
```

### Example: Simple Expression Grammar

Create `src/constants/grammar/expression.json`:

```json
{
  "start": "E",
  "productionMap": {
    "E": [
      ["addition", ["E", "+", "T"]],
      ["term", ["T"]]
    ],
    "T": [
      ["multiplication", ["T", "*", "F"]],
      ["factor", ["F"]]
    ],
    "F": [
      ["parentheses", ["(", "E", ")"]],
      ["number", ["num"]]
    ]
  },
  "directory": {
    "E": "Expression",
    "T": "Term",
    "F": "Factor"
  },
  "whitespace": "\\s+",
  "terminalRules": [
    ["+", "\\+"],
    ["*", "\\*"],
    ["(", "\\("],
    [")", "\\)"],
    ["num", "\\d+"]
  ],
  "defaultInput": "2 + 3 * 4"
}
```

Then add it to `src/constants/grammar.ts`:

```typescript
import expression from "./grammar/expression.json";

export const GRAMMARS: Grammar[] = [
  // ... existing grammars
  {
    key: GrammarKey.EXPRESSION,
    label: "Mathematical Expression",
    data: expression as unknown as Json,
  },
];
```

Don't forget to add the enum value to `src/types/parsing.ts`:

```typescript
export enum GrammarKey {
  // ... existing keys
  EXPRESSION = "EXPRESSION",
}
```

## 📦 Built-in Grammars

- **Java (Simplified)**: A subset of Java syntax including classes, methods, variables, and control structures
- **JSON**: Complete JSON parser
- **Square Brackets**: Simple bracket matching
- **Matching Pairs**: Generic A-B pair matching
- **Levels**: Nested structure demonstration
- **Ambiguous**: Example of ambiguous grammar (for demo purposes)

## 🙏 Acknowledgments

- Built on top of the Cocke–Younger–Kasami (CYK) parsing algorithm
