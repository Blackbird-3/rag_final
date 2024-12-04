# # import os
# # from langchain_pinecone import PineconeVectorStore
# # from langchain_community.embeddings import HuggingFaceEmbeddings
# # from langchain_community.document_loaders import PyPDFLoader
# # # from langchain_community.document_loaders import TextLoader
# # from langchain.schema import Document
# # from langchain.text_splitter import RecursiveCharacterTextSplitter
# # from pinecone import Pinecone

# # os.environ["PINECONE_API_KEY"] = "pcsk_3JC6xT_2xm7TneUZK8EiVtVbRmUkuaZDTNJdswxNLQEZkhNViZXoU79T5JHwgKzS4fmkKn"
# # os.environ["GROQ_API_KEY"]= "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"

# # # Create a Pinecone client instance
# # pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
# # index_name = "rag-huggingface"
# # embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
# # # loader = PyPDFLoader("Subjects_Splitup.pdf")
# # with open("pdfs/UNFAIR_MEANS_POLICY_extracted_text.txt", "r", encoding="utf-8") as f:
# #     text = f.read()

# # # Create a Document object
# # documents = [Document(page_content=text)]
# # # loader= TextLoader("B.Tech_admission_extracted_text.txt")
# # # documents = loader.load()
# # text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=50)
# # docs= text_splitter.split_documents(documents)
# # # vector_store = PineconeVectorStore.from_documents(docs, embeddings, index_name=index_name)
# # # print("Indexing completed.")

# # # Generate embeddings for the documents using embed_documents
# # embeddings_list = embeddings.embed_documents([doc.page_content for doc in docs])

# # # Get the existing Pinecone index using the Pinecone client
# # index = pc.Index(index_name)

# # # Prepare the vectors to upsert
# # vectors = [
# #     {"id": str(i), "values": embeddings_list[i], "metadata": {"text": docs[i].page_content}}
# #     for i in range(len(docs))
# # ]

# # # Upsert the new embeddings into the existing Pinecone index
# # index.upsert(vectors=vectors)

# # # Optionally, print the total number of vectors in the index
# # index_stats = index.describe_index_stats()
# # print(f"Total vectors in the index: {index_stats['total_vector_count']}")

# # print("New embeddings added to the index.")

# import os
# from langchain_pinecone import PineconeVectorStore
# from langchain_community.embeddings import HuggingFaceEmbeddings
# from langchain.schema import Document
# from langchain.text_splitter import RecursiveCharacterTextSplitter
# from pinecone import Pinecone
# import uuid

# os.environ["PINECONE_API_KEY"] = "pcsk_3JC6xT_2xm7TneUZK8EiVtVbRmUkuaZDTNJdswxNLQEZkhNViZXoU79T5JHwgKzS4fmkKn"
# os.environ["GROQ_API_KEY"] = "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"

# # Create a Pinecone client instance
# pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
# index_name = "rag-textloader"
# embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")

# document_dir = "pdfs"  # Directory where all your text files are stored
# vectors = []  # List to store all vectors

# # Get the existing Pinecone index
# index = pc.Index(index_name)

# # Read the file
# # with open("pdfs/Career_Development_Policy-2019_extracted_text.txt", "r", encoding="utf-8") as f:
# #     text = f.read()

# # Create a Document object with enhanced metadata
# # documents = [
# #     Document(
# #         page_content=text, 
# #         metadata={
# #             "source": "Career_Development_POLICY",
# #             "document_type": "policy_document",
# #             "upload_date": "2019-08-27",  # Add current or relevant date
# #             "total_chars": len(text),
# #             "unique_id": str(uuid.uuid4())  # Unique identifier for traceability
# #         }
# #     )
# # ]

# for file_name in os.listdir(document_dir):
#     if file_name.endswith(".txt"):  # Process only text files
#         file_path = os.path.join(document_dir, file_name)
#         with open(file_path, "r", encoding="utf-8") as f:
#             text = f.read()

#         # Create a Document object with metadata
#         source_name = file_name.replace("_", " ").replace(".txt", "")
#         documents = [
#             Document(
#                 page_content=text,
#                 metadata={
#                     "source": source_name,
#                     "document_type": "policy_document",
#                     "upload_date": "2024-11-30",  # Use a relevant date
#                     "total_chars": len(text),
#                     "unique_id": str(uuid.uuid4())
#                 }
#             )
#         ]

# # Split documents with text splitter
# text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=50)
# docs = text_splitter.split_documents(documents)

# # Generate embeddings for the documents
# embeddings_list = embeddings.embed_documents([doc.page_content for doc in docs])

# for i, doc in enumerate(docs):
#     vectors.append({
#         "id": f"{source_name}_{i}",  # Unique ID for each vector
#         "values": embeddings_list[i],
#         "metadata": {
#             "text": doc.page_content,
#             "source": doc.metadata.get('source', 'unknown'),
#             "document_type": doc.metadata.get('document_type', 'text'),
#             "chunk_number": i + 1,
#             "total_chunks": len(docs),
#             "chars_in_chunk": len(doc.page_content)
#         }
#     })
#     print("Indexing completed for document", source_name)



# # Prepare vectors with enhanced metadata
# # vectors = [
# #     {
# #         "id": f"doc_{documents[0].metadata['source']}_{i}",  # Unique ID for each vector chunk
# #         "values": embeddings_list[i], 
# #         "metadata": {
# #             "text": docs[i].page_content,
# #             "source": docs[i].metadata.get('source', 'unknown'),
# #             "document_type": docs[i].metadata.get('document_type', 'text'),
# #             "chunk_number": i,
# #             "total_chunks": len(docs),
# #             "chars_in_chunk": len(docs[i].page_content)
# #         }
# #     }
# #     for i in range(len(docs))
# # ]

# # Upsert the new embeddings into the Pinecone index
# index.upsert(vectors=vectors)

# # Print index statistics
# index_stats = index.describe_index_stats()
# print(f"Total vectors in the index: {index_stats['total_vector_count']}")
# print("New embeddings added to the index with enhanced metadata.")

import os
from langchain_pinecone import PineconeVectorStore
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain.schema import Document
from langchain.text_splitter import RecursiveCharacterTextSplitter
from pinecone import Pinecone
import uuid

# Set environment variables for Pinecone
os.environ["PINECONE_API_KEY"] = "pcsk_3JC6xT_2xm7TneUZK8EiVtVbRmUkuaZDTNJdswxNLQEZkhNViZXoU79T5JHwgKzS4fmkKn"

# Initialize Pinecone client and embeddings
pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
index_name = "rag-textloader"
embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=50)
index = pc.Index(index_name)

# Define file paths for all six documents
file_paths = [
    "pdfs/B.Tech_admission.txt",
    "pdfs/Career_Development_Policy-2019.txt",
    "pdfs/Code_of_Ethical_&_Professional_Conduct.txt",
    "pdfs/Disciplinary_Policy.txt",
    "pdfs/Mentor-Mentee_Policy-2019.txt",
    "pdfs/UNFAIR_MEANS_POLICY.txt"
]

# Process each file explicitly
for file_path in file_paths:
    file_name = os.path.basename(file_path)
    source_name = os.path.splitext(file_name)[0]  # Extract source name from file name
    
    print(f"Processing {file_name}...")

    # Read file content
    with open(file_path, "r", encoding="utf-8") as f:
        text = f.read()

    # Create Document object
    document = Document(
        page_content=text,
        metadata={
            "source": source_name,
            "document_type": "policy_document",
            "upload_date": "2024-11-30",  # Add the current date
            "total_chars": len(text),
            "unique_id": str(uuid.uuid4())
        }
    )

    # Split document into chunks
    docs = text_splitter.split_documents([document])
    print(f"Split {file_name} into {len(docs)} chunks.")

    # Generate embeddings for chunks
    embeddings_list = embeddings.embed_documents([doc.page_content for doc in docs])
    print(f"Generated {len(embeddings_list)} embeddings for {file_name}.")

    # Prepare vectors for Pinecone
    vectors = [
        {
            "id": f"{source_name}_{uuid.uuid4()}_chunk_{i}",
            "values": embeddings_list[i],
            "metadata": {
                "text": docs[i].page_content,
                "source": docs[i].metadata.get('source', 'unknown'),
                "document_type": docs[i].metadata.get('document_type', 'text'),
                "chunk_number": i,
                "total_chunks": len(docs),
                "chars_in_chunk": len(docs[i].page_content)
            }
        }
        for i in range(len(docs))
    ]
    print(f"Prepared {len(vectors)} vectors for {file_name}.")

    # Upsert vectors to Pinecone
    index.upsert(vectors=vectors)
    print(f"Uploaded {len(vectors)} vectors to Pinecone for {file_name}.")

# Verify index stats
index_stats = index.describe_index_stats()
print(f"Total vectors in the index: {index_stats['total_vector_count']}")
print("All documents successfully processed and embedded.")
