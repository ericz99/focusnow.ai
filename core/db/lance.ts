"use server";

import { connect } from "vectordb";

export const getClient = async () => {
  const db = await connect("data/sample-lancedb");
  return db;
};
