# from flask import Flask, jsonify, request
# from flask_cors import CORS
# import os
# from langchain.chains import RetrievalQA
# from langchain_groq import ChatGroq
# from langchain_community.embeddings import HuggingFaceBgeEmbeddings
# from langchain_pinecone import PineconeVectorStore

# app = Flask(__name__)
# CORS(app)

# chat_history=[]

# @app.route("/", methods = ['GET'])
# def server_status():
#     return jsonify({"status": "server running"})
# @app.route("/answer" , methods = ['POST'])
# def answer():
#     os.environ["PINECONE_API_KEY"] = "pcsk_3JC6xT_2xm7TneUZK8EiVtVbRmUkuaZDTNJdswxNLQEZkhNViZXoU79T5JHwgKzS4fmkKn"
#     os.environ["GROQ_API_KEY"]= "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"
#     data= request.json
#     index_name = "rag-huggingface"
#     query = data.get('query')
#     print(query)
    
#     history_context = "\n".join([f"{entry['role']}: {entry['content']}" for entry in chat_history])
#     if history_context:
#         query_with_context = f"Conversation so far:\n{history_context}\n\nUser: {query}\nAssistant:"
#     else:
#         query_with_context = query

    
#     llm=ChatGroq(
#         groq_api_key=os.environ["GROQ_API_KEY"],
#         model_name="llama-3.1-8b-instant",
#         temperature=0.5
#     )
#     knowledge = PineconeVectorStore.from_existing_index(index_name=index_name, embedding=HuggingFaceBgeEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2"))
#     qa= RetrievalQA.from_chain_type(
#         llm=llm,
#         chain_type="stuff",
#         retriever=knowledge.as_retriever()
#     )
#     answer = qa.run(query_with_context)
#     chat_history.append({"role": "user", "content": query})
#     chat_history.append({"role": "assistant", "content": answer})
#     response = {
#         "answer": answer,
#         "chat_history": chat_history
#     }
    
#     return jsonify(response)
#     # return jsonify({"answer": qa.invoke(query).get("result")})
# if __name__ == "__main__":
#     app.run(debug=True , port = 5001)
    
    
from flask import Flask, jsonify, request
from flask_cors import CORS
import os
from langchain.chains import RetrievalQA
from langchain_groq import ChatGroq
from langchain_community.embeddings import HuggingFaceBgeEmbeddings
from langchain_pinecone import PineconeVectorStore

app = Flask(__name__)
CORS(app)

chat_history = []

@app.route("/", methods=['GET'])
def server_status():
    return jsonify({"status": "server running"})

@app.route("/answer", methods=['POST'])
def answer():
    os.environ["PINECONE_API_KEY"] = "pcsk_3JC6xT_2xm7TneUZK8EiVtVbRmUkuaZDTNJdswxNLQEZkhNViZXoU79T5JHwgKzS4fmkKn"
    os.environ["GROQ_API_KEY"] = "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"
    
    data = request.json
    index_name = "rag-textloader"
    query = data.get('query')
    print(query)
    
    history_context = "\n".join([f"{entry['role']}: {entry['content']}" for entry in chat_history])
    if history_context:
        query_with_context = f"Conversation so far:\n{history_context}\n\nUser: {query}\nAssistant:"
    else:
        query_with_context = query

    llm = ChatGroq(
        groq_api_key=os.environ["GROQ_API_KEY"],
        model_name="llama-3.1-8b-instant",
        temperature=0.5
    )
    
    knowledge = PineconeVectorStore.from_existing_index(
        index_name=index_name, 
        embedding=HuggingFaceBgeEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
    )
    
    retriever = knowledge.as_retriever(search_kwargs={"k": 5})
    docs = retriever.get_relevant_documents(query_with_context)
    
    context = "\n\n".join([
        f"Source {i+1}:\n{doc.page_content}\n"
        f"Metadata: {doc.metadata}"
        for i, doc in enumerate(docs)
    ])
    
    augmented_query = f"Context:\n{context}\n\nQuestion: {query}"
    
    answer = llm.invoke(augmented_query).content
    
    citations = [
        {
            "content": doc.page_content,
            "metadata": doc.metadata
        } for doc in docs
    ]
    
    chat_history.append({"role": "user", "content": query})
    chat_history.append({"role": "assistant", "content": answer})
    
    response = {
        "answer": answer,
        "citations": citations,
        "chat_history": chat_history
    }
    
    return jsonify(response)

if __name__ == "__main__":
    app.run(debug=True, port=5001)