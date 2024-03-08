import React, { useContext } from "react";
import AceEditor from "react-ace";
import { ParsingContext } from "@/constants";
import "ace-builds/src-noconflict/ext-language_tools";
import { useBreakpoint } from "@/helpers";

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

  const { onInputChange } = useContext(ParsingContext);

  return (
    <div className="flex-1 w-full max-w-[500px] md:max-w-none h-full md:h-auto">
      <AceEditor
        theme="monokai"
        onChange={onInputChange}
        name="editor"
        editorProps={{ $blockScrolling: true }}
        height={isWeb ? "100%" : "250px"}
        width="100%"
      />
    </div>
  );
};

export default Editor;
