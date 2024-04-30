import {
  Pinecone,
  Index,
  type RecordMetadata,
  type PineconeRecord,
  type QueryOptions,
  type QueryResponse,
} from "@pinecone-database/pinecone";

export type PineconeQueryResponse = {
  matches: {
    id: string;
    score: number;
    metadata?: Record<string, string>;
  }[];
};

export class PineconeVectorDB {
  client: Pinecone;
  index: Index<RecordMetadata>;

  constructor() {
    if (!process.env.PINECONE_API_KEY)
      throw new Error(
        "Need valid Pinecone API Key in .env in order to start pinecone db"
      );

    if (!process.env.PINECONE_INDEX)
      throw new Error(
        "Need valid Pinecone Index in .env in order to start pinecone db"
      );

    this.client = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY,
    });

    this.index = this.client.Index(process.env.PINECONE_INDEX);
  }

  async upsert(req: Readonly<PineconeRecord>, isUpdate?: boolean) {
    try {
      if (!isUpdate) {
        await this.index.upsert([req]);
      } else {
        await this.index.update(req);
      }
    } catch (error) {
      const output = "Upsert had an unexpected error!";
      return output;
    }
  }

  async batchUpsert(batchReq: readonly PineconeRecord[], isUpdate?: boolean) {
    try {
      for (const req of batchReq) {
        if (!isUpdate) {
          this.index.upsert([req]);
        } else {
          this.index.update(req);
        }
      }
    } catch (error) {
      const output = "Batch Upsert had an unexpected error!";
      return output;
    }
  }

  async query(
    req: QueryOptions & {
      id?: string;
      vector?: number[];
    }
  ): Promise<PineconeQueryResponse | null> {
    if (req.id && req.vector)
      throw new Error("Must include be either id or vector, not both");

    try {
      let resp: QueryResponse<RecordMetadata> | null = null;

      if (req.id) {
        const { id, topK } = req;

        resp = await this.index.query({
          id,
          topK,
          includeMetadata: true,
          includeValues: true,
        });
      }

      if (req.vector) {
        const { vector, topK } = req;

        resp = await this.index.query({
          vector,
          topK,
          includeMetadata: true,
          includeValues: true,
        });
      }

      if (!resp) return null;

      // # build our return value
      const queryResp = {
        matches: resp.matches.map((r) => ({
          id: r.id,
          score: r.score!,
          metadata: r.metadata!,
        })),
      } as PineconeQueryResponse;

      return queryResp;
    } catch (error) {
      console.log(error);
    }

    return null;
  }
}

export const pinecone = new PineconeVectorDB();
