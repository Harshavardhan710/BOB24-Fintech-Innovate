from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from gen_ai import generate_description

app = FastAPI()

# Define allowed origins (you can specify the exact domains you want to allow)
origins = [
    "http://localhost:3000",  # React frontend URL
    "http://127.0.0.1:3000",
    # Add any other origins you want to allow
]

# Add the CORS middleware to the FastAPI app
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Message(BaseModel):
    message: str
    location: dict

@app.post("/api/bob-genai")
def chat(message: Message):
    reply = generate_description(f"{message.message}",location=f"{message.location}")
    return {"answer": reply}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
