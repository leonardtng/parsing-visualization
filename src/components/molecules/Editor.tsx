import React, { LegacyRef, useContext, useEffect, useRef } from "react";
import AceEditor, { IMarker } from "react-ace";
import { ParsingContext } from "@/constants";
import "ace-builds/src-noconflict/ext-language_tools";
import { useBreakpoint } from "@/helpers";
import { MatchResult } from "@/packages";

const languages = [
  "javascript",
  "java",
  "python",
  "xml",
  "ruby",
  "sass",
  "markdown",
  "mysql",
  "json",
  "html",
  "handlebars",
  "golang",
  "csharp",
  "elixir",
  "typescript",
  "css",
];

const themes = [
  "monokai",
  "github",
  "tomorrow",
  "kuroir",
  "twilight",
  "xcode",
  "textmate",
  "solarized_dark",
  "solarized_light",
  "terminal",
];

languages.forEach((lang) => {
  require(`ace-builds/src-noconflict/mode-${lang}`);
  require(`ace-builds/src-noconflict/snippets/${lang}`);
});

themes.forEach((theme) => require(`ace-builds/src-noconflict/theme-${theme}`));

const Editor = () => {
  const isWeb = useBreakpoint("md");

  const { onInputChange, mergeHighlights, highlightedBlock } =
    useContext(ParsingContext);

  const ref = useRef();

  function createMarkersFromRegexMatches(matches: MatchResult[]) {
    const ace = ref.current as unknown as AceEditor;

    if (!ace || matches.length === 0) return [];

    if (mergeHighlights) {
      const [start, end] = matches.reduce(
        (acc, match) => {
          const start = match.indices[0][0];
          const end = match.indices[0][1];

          if (start < acc[0]) {
            acc[0] = start;
          }

          if (end > acc[1]) {
            acc[1] = end;
          }

          return acc;
        },
        [Infinity, 0]
      );

      const startRow = ace.editor.session.doc.indexToPosition(start, 0).row;
      const startCol = ace.editor.session.doc.indexToPosition(start, 0).column;
      const endRow = ace.editor.session.doc.indexToPosition(end, 0).row;
      const endCol = ace.editor.session.doc.indexToPosition(end, 0).column;

      return [
        {
          startRow: startRow,
          startCol,
          endRow,
          endCol: endCol, // Adjust for zero-based index
          type: "text" as "text",
          className: "ace-marker", // Custom CSS class to style the highlight
        },
      ] as IMarker[];
    } else {
      const markers: IMarker[] = matches.map((match) => {
        // Calculate the row and column for the start of the match

        const startRow = ace.editor.session.doc.indexToPosition(
          match.indices[0][0],
          0
        ).row;

        const startCol = ace.editor.session.doc.indexToPosition(
          match.indices[0][0],
          0
        ).column;

        // Calculate the row and column for the end of the match
        const endRow = ace.editor.session.doc.indexToPosition(
          match.indices[0][1],
          0
        ).row;

        const endCol = ace.editor.session.doc.indexToPosition(
          match.indices[0][1],
          0
        ).column;

        return {
          startRow: startRow,
          startCol,
          endRow,
          endCol: endCol, // Adjust for zero-based index
          type: "text" as "text",
          className: "ace-marker", // Custom CSS class to style the highlight
          match,
        } as IMarker;
      });

      return markers;
    }
  }

  const markers = createMarkersFromRegexMatches(
    highlightedBlock.map((block) => block.matchResult)
  );

  return (
    <div className="flex-1 w-full max-w-[500px] md:max-w-none h-full md:h-auto">
      <AceEditor
        ref={ref as any}
        theme="monokai"
        onChange={onInputChange}
        name="editor"
        editorProps={{ $blockScrolling: true }}
        height={isWeb ? "100%" : "250px"}
        width="100%"
        markers={markers}
        highlightActiveLine={false}
      />
    </div>
  );
};

export default Editor;
