import type { NextApiRequest, NextApiResponse } from "next";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { OpenAIEmbeddings } from "langchain/embeddings";
import { PineconeStore, SupabaseVectorStore } from "langchain/vectorstores";
import { DirectoryLoader, PDFLoader } from "langchain/document_loaders";
import fs from "fs/promises";
import { CustomPDFLoader } from "@/utils/customPDFLoader";
import { createClient } from "@supabase/supabase-js";
import { pinecone } from '@/utils/pinecone-client';

/* Name of directory to retrieve your files from */

type Data = {
  name: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    const privateKey = process.env.NEXT_PUBLIC_SUPABASE_API_KEY;
    if (!privateKey) throw new Error(`Expected env var SUPABASE_KEY`);

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!url) throw new Error(`Expected env var SUPABASE_URL`);

    /* Name of directory to retrieve your files from */
    const filePath = "public/docs";

    /*load raw docs from the all files in the directory */
    const directoryLoader = new DirectoryLoader(filePath, {
      ".pdf": (path) => new CustomPDFLoader(path),
    });

    // const loader = new PDFLoader(filePath);
    const rawDocs = await directoryLoader.load();

    /* Split text into chunks */
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });

    const docs = await textSplitter.splitDocuments(rawDocs);

    const simplifiedDocs = docs.map((doc) => {
      return {
        text: doc.pageContent || "",
        pdf: {
          title: doc.metadata.title || "",
          author: doc.metadata.author || "",
        },
      };
    });
    console.log("split simple docs", simplifiedDocs);

    console.log("creating vector store...");
    /*create and store the embeddings in the vectorStore*/
    const embeddings = new OpenAIEmbeddings();

    const index = pinecone.Index('chatbot'); //change to your own index name

    //embed the PDF documents
    await PineconeStore.fromDocuments(docs, embeddings, {
      pineconeIndex: index,
      textKey: 'text',
    });
    console.log("ingestion complete");
    res.status(200);
  } catch (error) {
    console.log(error);
  }
}
