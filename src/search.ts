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
  while (true) {
    const text = await rl.question("query: ")
    const searchResult = await searchClient.search(text)
    for await (const result of searchResult.results) {
      console.log(result.document)
    }
  }
}

main().catch((err) => {
  console.error("The sample encountered an error:", err)
})
