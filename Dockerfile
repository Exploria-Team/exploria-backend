# Step 1: Use the official Python image
FROM python:3.10-slim

# Step 2: Set the working directory
WORKDIR /app

# Step 3: Copy project files
COPY . /app

# Step 4: Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Step 5: Expose the port your app runs on
EXPOSE 8080

# Step 6: Command to run the application
CMD ["uvicorn", "api:app", "--host", "0.0.0.0", "--port", "8080"]