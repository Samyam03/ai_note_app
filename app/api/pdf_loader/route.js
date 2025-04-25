import { NextResponse } from 'next/server';
import { WebPDFLoader } from '@langchain/community/document_loaders/web/pdf';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';



export async function GET(request) {
    const  requestUrl = request.url;
    const {searchParams} = new URL(requestUrl);
    const pdfUrl = searchParams.get('pdfUrl');
    console.log(pdfUrl);

    const response = await fetch(pdfUrl);
    const data = await response.blob();
    const pdfLoader = new WebPDFLoader(data);
    const docs = await pdfLoader.load();

    let pdfTextContent = "";
    docs.forEach((doc) => {
        pdfTextContent += doc.pageContent;
    });

    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1500,
        chunkOverlap: 200,
    });

    const output = await splitter.createDocuments([pdfTextContent]);

    let splitterList = [];
    output.forEach((doc) => {
        splitterList.push(doc.pageContent);
    });

    return NextResponse.json({result:splitterList});
}