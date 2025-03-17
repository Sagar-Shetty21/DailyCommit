// EditorJSComponent.tsx
"use client";

import React, { useEffect, useRef } from "react";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import Quote from "@editorjs/quote";
import Marker from "@editorjs/marker";
import CodeTool from "@editorjs/code";

interface EditorJSComponentProps {
    onReady: (editor: EditorJS) => void;
}

const EditorJSComponent: React.FC<EditorJSComponentProps> = ({ onReady }) => {
    const editorRef = useRef<EditorJS | null>(null);

    useEffect(() => {
        if (typeof window !== "undefined" && !editorRef.current) {
            const editor = new EditorJS({
                holder: "editorjs",
                autofocus: true,
                placeholder: "Start writing your daily thoughts here...",
                tools: {
                    header: Header as any,
                    list: List as any,
                    quote: Quote as any,
                    marker: Marker as any,
                    code: CodeTool as any,
                },
                onReady: () => {
                    editorRef.current = editor;
                    onReady(editor);
                },
            });
        }

        return () => {
            if (editorRef.current) {
                editorRef.current.destroy();
                editorRef.current = null;
            }
        };
    }, [onReady]);

    return <div id="editorjs" className="prose max-w-none"></div>;
};

export default EditorJSComponent;
