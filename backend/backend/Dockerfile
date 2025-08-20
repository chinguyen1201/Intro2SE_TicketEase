# Use Python 3.11 slim image
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    curl \
    unixodbc-dev \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements file first (if exists) for better caching
COPY requirements.txt* ./

# Install Python dependencies
RUN if [ -f requirements.txt ]; then pip install --no-cache-dir -r requirements.txt; fi

# Install FastAPI and other common dependencies
RUN pip install --no-cache-dir \
    fastapi \
    uvicorn[standard] \
    pyodbc \
    python-multipart \
    python-dotenv

# Copy application code
COPY . .

# Expose port
EXPOSE 5000

# Command to run the application
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "5000"]
