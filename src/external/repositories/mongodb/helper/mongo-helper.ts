import { MongoClient, Collection } from 'mongodb'

export const MongoHelper = {
  client: null as MongoClient,
  async connect (url: string): Promise<void> {
    this.client = await MongoClient.connect(url)
  },
  async disconnect (): Promise<void> {
    this.client.close()
  },
  async getCollection (name: string): Promise<Collection> {
    return this.client.db().collection(name)
  },
  async clearCollection (name: string): Promise<void> {
    return this.client.db().collection(name).deleteMany({})
  }
}
