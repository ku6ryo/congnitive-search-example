import { SearchIndexClient, AzureKeyCredential } from "@azure/search-documents"
import { randomUUID } from "crypto"
import "dotenv/config"
import readline from "readline/promises"

const endpoint = process.env.SEARCH_API_ENDPOINT || ""
const apiKey = process.env.SEARCH_API_KEY || ""

async function main() {
  if (!endpoint || !apiKey) {
    console.log("Make sure to set valid values for endpoint and apiKey with proper authorization.")
    return
  }

  const indexClient = new SearchIndexClient(endpoint, new AzureKeyCredential(apiKey))
  const indexName = "20231022-test-index"
  const index = await indexClient.getIndex(indexName)
  console.log(index)
  const searchClient = indexClient.getSearchClient(indexName)

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })
  while (true) {
    const text = await rl.question("input text: ")
    const indexDocumentsResult = await searchClient.mergeOrUploadDocuments([{
      id: randomUUID(),
      text,
    }])
    console.log(indexDocumentsResult)
  }
}

main().catch((err) => {
  console.error("The sample encountered an error:", err)
})
