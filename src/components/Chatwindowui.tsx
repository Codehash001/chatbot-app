import Image from "next/image";
import { Select, SelectItem } from "@nextui-org/react";
import { animals } from "./data";

import { Input } from "@nextui-org/react";

import { useRef, useState, useEffect, useMemo, useCallback } from "react";
import styles from "@/styles/Home.module.css";
import { Message } from "@/types/chat";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import ReactMarkdown from "react-markdown";
import LoadingDots from "@/components/ui/LoadingDots";
import { Document } from "langchain/document";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { ScrollShadow } from "@nextui-org/react";

export default function ChatwindowUI() {
  const [query, setQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [sourceDocs, setSourceDocs] = useState<Document[]>([]);
  const [allfiles, setallFiles] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedTempFiles, SetSelectedTempFiles] = useState<File[]>([]);
  const [SelectedTempFilesCount, SetSelectedTempFilesCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [messageState, setMessageState] = useState<{
    messages: Message[];
    pending?: string;
    history: [string, string][];
    pendingSourceDocs?: Document[];
  }>({
    messages: [
      {
        message: "Hi, what would you like to learn about this doc?",
        type: "apiMessage",
      },
    ],
    history: [],
    pendingSourceDocs: [],
  });

  const { messages, pending, history, pendingSourceDocs } = messageState;

  const messageListRef = useRef<HTMLDivElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const [selectedDataset, setSelectedDataset] = useState("");
  const [nav, setNav] = useState(false);

  const handleDatasetChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;
    setSelectedDataset(value);
  };

  useEffect(() => {
    textAreaRef.current?.focus();
  }, []);

  //handle form submission
  async function handleSubmit(e: any) {
    e.preventDefault();

    setError(null);

    if (!query) {
      alert("Please input a question");
      return;
    }

    const question = query.trim();

    setMessageState((state) => ({
      ...state,
      messages: [
        ...state.messages,
        {
          type: "userMessage",
          message: question,
        },
      ],
      pending: undefined,
    }));

    setLoading(true);
    setQuery("");
    setMessageState((state) => ({ ...state, pending: "" }));

    const ctrl = new AbortController();

    try {
      fetchEventSource("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question,
          history,
        }),
        signal: ctrl.signal,
        onmessage: (event) => {
          if (event.data === "[DONE]") {
            setMessageState((state) => ({
              history: [...state.history, [question, state.pending ?? ""]],
              messages: [
                ...state.messages,
                {
                  type: "apiMessage",
                  message: state.pending ?? "",
                  sourceDocs: state.pendingSourceDocs,
                },
              ],
              pending: undefined,
              pendingSourceDocs: undefined,
            }));
            setLoading(false);
            ctrl.abort();
          } else {
            const data = JSON.parse(event.data);
            if (data.sourceDocs) {
              setMessageState((state) => ({
                ...state,
                pendingSourceDocs: data.sourceDocs,
              }));
            } else {
              setMessageState((state) => ({
                ...state,
                pending: (state.pending ?? "") + data.data,
              }));
            }
          }
        },
      });
    } catch (error) {
      setLoading(false);
      setError("An error occurred while fetching the data. Please try again.");
    }
  }

  //prevent empty submissions
  const handleEnter = useCallback(
    (e: any) => {
      if (e.key === "Enter" && query) {
        handleSubmit(e);
      } else if (e.key == "Enter") {
        e.preventDefault();
      }
    },
    [query]
  );

  const chatMessages = useMemo(() => {
    return [
      ...messages,
      ...(pending
        ? [
            {
              type: "apiMessage",
              message: pending,
              sourceDocs: pendingSourceDocs,
            },
          ]
        : []),
    ];
  }, [messages, pending, pendingSourceDocs]);

  //scroll to bottom of chat
  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const handleNav = () => {
    setNav(!nav);
  };

  return (
    <>
      <div className="h-full px-10 py-5 space-y-4">
        <h1 className="font-bold text-4xl font-sans">Chat with your Notes</h1>
        {/* <div className="flex items-start relative rounded-md border min-h-[10px] p-5 space-x-3 bg-blue-50">
                <Image
                        src="/icons/user.png"
                        alt="Me"
                        width={40}
                        height={40}
                        className='rounded-full -mt-3'
                        priority
                      />
                    <h1>Hello</h1>
                </div>
                <div className="flex items-start relative rounded-md border min-h-[10px] p-5 space-x-3 bg-white">
                <Image
                        src="/icons/bot.png"
                        alt="Me"
                        width="50"
                        height="50"
                        className='rounded-full -mt-3'
                        priority
                      />
                    <h1 >Hello</h1>
                </div> */}

        {/* message */}
        <ScrollShadow hideScrollBar className="h-[500px] space-y-4" ref={messageListRef}>
          {chatMessages.map((message, index) => {
            let icon;
            let className;
            if (message.type === "apiMessage") {
              icon = (
                <Image
                  src="/icons/bot.png"
                  alt="AI"
                  width="50"
                  height="50"
                  className="rounded-full -mt-3"
                  priority
                />
              );
              className =
                "bg-blue-50 flex items-start relative rounded-md border min-h-[10px] p-5 space-x-3";
            } else {
              icon = (
                <Image
                  src="/icons/user.png"
                  alt="Me"
                  width="40"
                  height="40"
                  className="rounded-full -mt-3"
                  priority
                />
              );
              // The latest message sent by the user will be animated while waiting for a response
              className =
                loading && index === chatMessages.length - 1
                  ? "flex items-start relative rounded-md border min-h-[10px] p-5 space-x-3 bg-gray-50 opacity-70"
                  : "flex items-start relative rounded-md border min-h-[10px] p-5 space-x-3";
            }
            return (
              <>
                <div key={`chatMessage-${index}`} className={className}>
                  {icon}
                  <div>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: message.message.replaceAll("\n", "<br/>"),
                      }}
                    />
                                      {message.sourceDocs && message.sourceDocs.length > 0 && (
                  <div className="py-3 mt-4">
                   <h1 className="px-4 py-1 rounded-full bg-purple-400 inline-block text-white font-semibold"> Source : {message.sourceDocs[0].metadata.pdf_name}</h1>
                  </div>
                )}
                  </div>
                </div>
              </>
            );
          })}
        </ScrollShadow>

        {/* end message */}
        <form onSubmit={handleSubmit}>
          <Input
            disabled={loading}
            type="text"
            variant="bordered"
            defaultValue="summarize my note"
            className="w-full"
            onKeyDown={handleEnter}
            id="userInput"
            name="userInput"
            placeholder={
              loading ? "Waiting for response..." : "summarize my note"
            }
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </form>
      </div>
    </>
  );
}
