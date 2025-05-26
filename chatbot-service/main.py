from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from transformers import pipeline
import json

app = FastAPI()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the model
qa_pipeline = pipeline(
    "question-answering",
    model="deepset/roberta-base-squad2",
    tokenizer="deepset/roberta-base-squad2"
)

# Load predefined context about the blog platform
with open("blog_context.json", "r", encoding="utf-8") as f:
    BLOG_CONTEXT = json.load(f)

class ChatRequest(BaseModel):
    message: str

@app.post("/chat")
async def chat(request: ChatRequest):
    try:
        # Find relevant context based on the question
        context = BLOG_CONTEXT.get("general_context", "")
        for topic, topic_context in BLOG_CONTEXT.items():
            if any(keyword in request.message.lower() for keyword in topic.split("_")):
                context = topic_context
                break

        # Get answer from the model
        result = qa_pipeline(
            question=request.message,
            context=context
        )

        # Format response
        response = {
            "answer": result["answer"],
            "confidence": round(result["score"], 4)
        }

        return response

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    return {"status": "healthy"}