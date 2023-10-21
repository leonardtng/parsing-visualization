import React, { useContext } from "react";
import AceEditor from "react-ace";
import { ParsingContext } from "@/constants";
import "ace-builds/src-noconflict/ext-language_tools";

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
  const { onInputChange } = useContext(ParsingContext);

  return (
    <div className="w-full max-w-[500px]">
      <AceEditor
        theme="monokai"
        onChange={onInputChange}
        name="editor"
        editorProps={{ $blockScrolling: true }}
        height="250px"
        width="100%"
      />
    </div>
  );
};

export default Editor;
