import { SearchIndexClient, AzureKeyCredential } from "@azure/search-documents"
import { randomUUID } from "crypto"
import "dotenv/config"
import readline from "readline/promises"

const endpoint = process.env.API_ENDPOINT || ""
const apiKey = process.env.API_KEY || ""
const indexName = process.env.INDEX_NAME || ""

async function main() {
  if (!endpoint || !apiKey) {
    console.log("Make sure to set valid values for endpoint and apiKey with proper authorization.")
    return
  }

  const indexClient = new SearchIndexClient(endpoint, new AzureKeyCredential(apiKey))
  const index = await indexClient.getIndex(indexName)
  console.log(index)
  const searchClient = indexClient.getSearchClient(indexName)

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })
  const text = await rl.question(`Delete index ${indexName}? y to confirm: `)
  if (text.toLocaleLowerCase() === "y") {
    while (await searchClient.getDocumentsCount() > 0) {
      const r = await searchClient.search("*")
      const docs = [] as Pick<unknown, never>[]
      for await (const result of r.results) {
        docs.push(result.document)
      }
      console.log(docs)
      await searchClient.deleteDocuments(docs)
    }
  }
  process.exit(0)
}

main().catch((err) => {
  console.error("The sample encountered an error:", err)
})
