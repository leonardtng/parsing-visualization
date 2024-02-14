interface JsonTree {
  name: string;
  children?: JsonTree[];
}

class MountainPeak {
  symbol: string;
  children: string[];

  constructor(symbol: string) {
    this.symbol = symbol;
    this.children = [];
  }

  addChild(child: string) {
    this.children.push(child);
  }
}

class Tree {
  symbol: string | null;
  children: MountainPeak[];

  constructor(symbol: string | null) {
    this.symbol = symbol;
    this.children = [];
  }

  addChild(child: MountainPeak) {
    this.children.push(child);
  }

  removeChild(child: MountainPeak) {
    const index = this.children.indexOf(child);
    if (index !== -1) {
      this.children.splice(index, 1);
    }
  }

  toJsonTreeArray() {
    const jsonTree: JsonTree = {
      name: this.symbol || "",
      children: [],
    };

    // Add children to the JSON
    this.children.forEach((child) => {
      jsonTree.children?.push({
        name: child.symbol,
        children: child.children.map((grandChild) => {
          return {
            name: grandChild,
          };
        }),
      });
    });

    return [jsonTree];

    // Check if parse was successful
    // if (this.symbol === "") {
    //   // Create individual JSON for each child
    //   return this.children.map((child) => {
    //     const jsonTree: any = {
    //       name: child.symbol,
    //       children: [],
    //     };

    //     // Add children to the JSON
    //     child.children.forEach((grandChild) => {
    //       jsonTree.children.push({
    //         name: grandChild,
    //       });
    //     });

    //     return jsonTree;
    //   });
    // } else {
    //   // Create JSON for the root
    //   const jsonTree: any = {
    //     name: this.symbol,
    //     children: [],
    //   };

    //   // Add children to the JSON
    //   this.children.forEach((child) => {
    //     jsonTree.children.push({
    //       name: child.symbol,
    //       children: child.children.map((grandChild) => {
    //         return {
    //           name: grandChild,
    //         };
    //       }),
    //     });
    //   });

    //   return [jsonTree];
    // }
  }
}

export function buildParseTree(grid: (string | null)[][]): Tree | null {
  const gridSize = grid.length;

  if (gridSize === 0) return null;

  function generateCoordinatePairs(start: number, end: number) {
    const pairs = [];

    for (let i = start; i < end; i++) {
      pairs.push([i, i + 1]);
    }

    return pairs;
  }

  function traverseDiagonals(
    startRow: number,
    startCol: number,
    parent: Tree | null = null,
    right?: boolean
  ) {
    if (startRow === startCol) return;

    const item = grid[startRow][startCol];

    if (item !== null) {
      // check if is peak by finding if there is already another peak to the top / right of item
      for (let row = 0; row <= startRow; row++) {
        for (let col = startCol; col <= gridSize - 1; col++) {
          if (row === startRow && col === startCol) continue;

          // This means that there this item is part of a peak
          if (grid[row][col] !== null && grid[row][col] !== parent?.symbol) {
            return;
          }
        }
      }

      // This is a peak
      const peak = new MountainPeak(item);

      if (startCol !== startRow + 1) {
        const tokenCoordinates = generateCoordinatePairs(startRow, startCol);

        tokenCoordinates.forEach(([start, end]) => {
          const symbols = grid[start][end];

          if (symbols !== null) {
            peak.addChild(symbols);
          }
        });
      }

      parent?.addChild(peak);
      return;
    }

    if (!right) traverseDiagonals(startRow, startCol - 1, parent);
    traverseDiagonals(startRow + 1, startCol, parent, true);
  }

  // The start symbol is at the top-right corner of the grid
  const root = new Tree(grid[0][gridSize - 1]);

  traverseDiagonals(0, gridSize - 2, root);
  traverseDiagonals(1, gridSize - 1, root, true);

  return root;
}

// [0,8] => [0, 7] [1,8] => [0, 6] [1,7] [2,8] => [0, 5] [1,6] [2,7] [3,8]
