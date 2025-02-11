import { loadSummarizationChain } from 'langchain/chains';
import { ChatOllama } from 'langchain/chat_models/ollama';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { getPageContent } from '@src/pages/utils/getPageContent';

async function summarizeCurrentPage() {
  try {
    const pageContent = await getPageContent();

    if (!pageContent) return;

    const llm = new ChatOllama({
      baseUrl: 'http://localhost:11435', // change if you are using a different endpoint
      temperature: 0.3, // change if you want to experiment with different temperatures
      model: 'mistral', // change if you want to use a different model
    });
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 2000,
    });
    const docs = await textSplitter.createDocuments([pageContent.textContent]);
    const chain = loadSummarizationChain(llm, {
      type: 'map_reduce', // you can choose from map_reduce, stuff or refine
      verbose: true, // to view the steps in the console
    });
    const response = await chain.call({
      input_documents: docs,
    });
    return response.text;
  } catch (error) {
    console.error(error);
  }
}
export { summarizeCurrentPage };
