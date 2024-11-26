import os
from langchain_pinecone import PineconeVectorStore
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.document_loaders import PyPDFLoader
# from langchain_community.document_loaders import TextLoader
from langchain.schema import Document
from langchain.text_splitter import RecursiveCharacterTextSplitter
from pinecone import Pinecone

os.environ["PINECONE_API_KEY"] = "pcsk_3JC6xT_2xm7TneUZK8EiVtVbRmUkuaZDTNJdswxNLQEZkhNViZXoU79T5JHwgKzS4fmkKn"
os.environ["GROQ_API_KEY"]= "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"

# Create a Pinecone client instance
pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
index_name = "rag-huggingface"
embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
# loader = PyPDFLoader("Subjects_Splitup.pdf")
with open("pdfs/UNFAIR_MEANS_POLICY_extracted_text.txt", "r", encoding="utf-8") as f:
    text = f.read()

# Create a Document object
documents = [Document(page_content=text)]
# loader= TextLoader("B.Tech_admission_extracted_text.txt")
# documents = loader.load()
text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=50)
docs= text_splitter.split_documents(documents)
# vector_store = PineconeVectorStore.from_documents(docs, embeddings, index_name=index_name)
# print("Indexing completed.")

# Generate embeddings for the documents using embed_documents
embeddings_list = embeddings.embed_documents([doc.page_content for doc in docs])

# Get the existing Pinecone index using the Pinecone client
index = pc.Index(index_name)

# Prepare the vectors to upsert
vectors = [
    {"id": str(i), "values": embeddings_list[i], "metadata": {"text": docs[i].page_content}}
    for i in range(len(docs))
]

# Upsert the new embeddings into the existing Pinecone index
index.upsert(vectors=vectors)

# Optionally, print the total number of vectors in the index
index_stats = index.describe_index_stats()
print(f"Total vectors in the index: {index_stats['total_vector_count']}")

print("New embeddings added to the index.")