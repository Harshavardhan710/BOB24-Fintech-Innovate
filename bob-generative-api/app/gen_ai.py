import os
from openai import AzureOpenAI
from dotenv import load_dotenv
from .config import AZURE_OPENAI_ENDPOINT,AZURE_OPENAI_API_KEY,AZURE_OPENAI_MODEL
# Load environment variables from .env file
load_dotenv()

azure_endpoint = AZURE_OPENAI_ENDPOINT
api_key = AZURE_OPENAI_API_KEY
model_name = AZURE_OPENAI_MODEL


client = AzureOpenAI(
    azure_endpoint=azure_endpoint,
    api_key=api_key,
    api_version="2024-05-01-preview",
)

def generate_description(input_text,location):
    completion = client.chat.completions.create(
        model=model_name,
        messages=[
            {
                "role": "system",
                "content": f"You are a customer support agent for Bank of Baroda whose primary goal is to help users with issues or queries they have about the bank's services. You are friendly and concise. You only provide factual answers to queries related to Bank of Baroda's services."
            },
            
            {
                "role": "user",
                "content": input_text
            },
            
            {
                "role": "assistant",
                "content": "Bank of Baroda offers a wide range of services including savings and current accounts based on location coordinates, loans, credit cards, internet banking, mobile banking, and investment services. For more details, please visit our official website or contact our customer service."
            }
        ],
    )
    answer = completion.choices[0].message.content
    return answer
