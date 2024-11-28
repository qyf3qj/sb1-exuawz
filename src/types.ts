export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface MDEmbedding {
  file_name: string;
  content: string;
  embedding: number[];
}

export interface ProcessedEmbedding {
  segment_id: string;
  page_number: number;
  content: string;
  embedding: number[];
}