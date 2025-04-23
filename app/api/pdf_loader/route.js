import { NextResponse } from 'next/server';
import { WebPDFLoader } from '@langchain/community/document_loaders/web/pdf';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';

const pdfUrl="https://sleek-ladybug-725.convex.cloud/api/storage/6ecd26a0-0a10-49f9-9851-cab949463698"

export async function GET(request) {
    const response = await fetch(pdfUrl);
    const data = await response.blob();
    const pdfLoader = new WebPDFLoader(data);
    const docs = await pdfLoader.load();

    let pdfTextContent = "";
    docs.forEach((doc) => {
        pdfTextContent += doc.pageContent;
    });

    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 100,
        chunkOverlap: 20,
    });

    const output = await splitter.createDocuments([pdfTextContent]);

    let splitterList = [];
    output.forEach((doc) => {
        splitterList.push(doc.pageContent);
    });

    return NextResponse.json({result:splitterList});
}