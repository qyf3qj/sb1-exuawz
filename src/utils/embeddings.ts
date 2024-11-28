import type { MDEmbedding, ProcessedEmbedding } from '../types';

async function loadProcessedBatch(batchNumber: number): Promise<ProcessedEmbedding[]> {
  try {
    const response = await fetch(`/data/processed_batch_${batchNumber}.json`);
    return await response.json();
  } catch (error) {
    console.error(`Error loading batch ${batchNumber}:`, error);
    return [];
  }
}

async function loadAllProcessedEmbeddings(): Promise<ProcessedEmbedding[]> {
  const batchPromises = Array.from({ length: 38 }, (_, i) => loadProcessedBatch(i + 1));
  const batchResults = await Promise.all(batchPromises);
  return batchResults.flat();
}

async function loadEmbeddings(): Promise<{
  mdEmbeddings: MDEmbedding[];
  processedEmbeddings: ProcessedEmbedding[];
}> {
  const [mdResponse, processedEmbeddings] = await Promise.all([
    fetch('/data/md_embeddings.json'),
    loadAllProcessedEmbeddings()
  ]);

  const mdEmbeddings = await mdResponse.json();

  return { mdEmbeddings, processedEmbeddings };
}

export function cosineSimilarity(vecA: number[], vecB: number[]): number {
  const minLength = Math.min(vecA.length, vecB.length);
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  
  for (let i = 0; i < minLength; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

export function getEmbedding(text: string): number[] {
  // Placeholder implementation - in a real app, this would call an embedding API
  return Array(5).fill(0).map(() => (Math.random() - 0.5) * 0.1);
}

export async function getContext(query: string): Promise<string> {
  const queryEmbedding = getEmbedding(query);
  const { mdEmbeddings, processedEmbeddings } = await loadEmbeddings();
  
  let maxSimilarity = -1;
  let bestMatch = '';

  // Check MD embeddings
  mdEmbeddings.forEach((item) => {
    const similarity = cosineSimilarity(queryEmbedding, item.embedding);
    if (similarity > maxSimilarity) {
      maxSimilarity = similarity;
      bestMatch = item.content;
    }
  });

  // Check processed embeddings
  processedEmbeddings.forEach((item) => {
    const similarity = cosineSimilarity(queryEmbedding, item.embedding);
    if (similarity > maxSimilarity) {
      maxSimilarity = similarity;
      bestMatch = item.content;
    }
  });

  return bestMatch;
}