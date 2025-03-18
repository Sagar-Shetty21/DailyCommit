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
    const containerRef = useRef<HTMLDivElement>(null);
    const initializedRef = useRef<boolean>(false);

    useEffect(() => {
        // Skip initialization if already initialized or window is not defined
        if (typeof window === "undefined" || initializedRef.current) {
            return;
        }

        // Mark as initialized to prevent duplicate initialization
        initializedRef.current = true;

        // Check if the editor container exists
        if (!containerRef.current) {
            console.error("Editor container not found");
            return;
        }

        // Clear the container in case it has content from a previous mount
        containerRef.current.innerHTML = "";

        const editor = new EditorJS({
            holder: containerRef.current,
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
                if (onReady) onReady(editor);
            },
        });

        return () => {
            if (editorRef.current) {
                try {
                    editorRef.current.destroy();
                } catch (e) {
                    console.error("Editor.js destruction error:", e);
                }
                editorRef.current = null;
            }
        };
    }, [onReady]);

    return <div ref={containerRef} className="prose max-w-none" />;
};

export default EditorJSComponent;
