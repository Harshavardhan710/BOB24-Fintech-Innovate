# BOB-AI-customer-service


# Project Setup Guide

## Overview

This project has two main components:
1. **Frontend (React)**: Located in the `bob-chat-bot` directory.
2. **Backend (FastAPI)**: Located in the `bob-generative-api` directory.

## Prerequisites

Ensure you have the following installed:
- **Python 3.11+**
- **Node.js and npm (or yarn)**

## Backend Setup (FastAPI)

### 1. Navigate to the Backend Directory

```bash
cd bob-generative-api
```

### 2. Create and Activate a Virtual Environment

Create a virtual environment:

```bash
python -m venv envbob
```

Activate the virtual environment:

- **Windows:**

  ```bash
  envbob\Scripts\activate
  ```

- **macOS/Linux:**

  ```bash
  source venv/bin/activate
  ```

### 3. Install Python Dependencies

Install the required Python packages:

```bash
pip install -r requirements.txt
```

### 4. Configure Environment Variables

Create  `.env` using sample and ensure it contains the necessary environment variables for your application.

### 5. Run the Backend Server

Start the FastAPI server:

```bash
uvicorn app.main:app --host 127.0.0.1 --port 8000
```

Verify the backend is running by visiting `http://127.0.0.1:8000` and checking the API documentation at `http://127.0.0.1:8000/docs`.

## Frontend Setup (React)

### 1. Navigate to the Frontend Directory

```bash
cd ../bob-chat-bot
```

### 2. Install JavaScript Dependencies

Install the required packages using npm or yarn:

- **Using npm:**

  ```bash
  npm install
  ```

- **Using yarn:**

  ```bash
  yarn install
  ```

### 3. Start the React Development Server

Start the development server:

- **Using npm:**

  ```bash
  npm start
  ```

- **Using yarn:**

  ```bash
  yarn start
  ```

The React app should now be accessible at `http://localhost:3000`.

## Configuration

### CORS Configuration

The FastAPI backend is set up to allow requests from `http://localhost:3000`. Ensure this matches your React app's URL.

### Environment Variables

Make sure `.env` in the backend directory is correctly configured with all necessary environment variables. You might also need to configure environment variables for the frontend if your application requires them.

## Common Issues

- **CORS Issues:** If you encounter CORS errors, double-check the `allow_origins` list in `main.py` to ensure it matches your frontend URL.
- **Port Conflicts:** Ensure the backend and frontend are running on different ports (8000 for backend, 3000 for frontend).
- **Dependency Issues:** Make sure all dependencies in `requirements.txt` and `package.json` are correctly installed.

## Conclusion

You should now have both the FastAPI backend and React frontend set up and running. You can develop and test your application with these instructions. If you encounter any issues, refer to the documentation for FastAPI, React, or the respective libraries you're using.

