import React, { useState } from "react";
import CodeEditor from "@uiw/react-textarea-code-editor";

export default function ApiGenerator() {
    const [code, setCode] = useState("");
    return (
        <CodeEditor
            value={code}
            language="js"
            placeholder="Please enter your prompt"
            onChange={(evn) => setCode(evn.target.value)}
            padding={15}
            style={{
                backgroundColor: "#f5f5f5",
                fontFamily: "ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace"
            }}
        />
    );
}
