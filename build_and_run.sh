# Teardown
echo "Stopping existing containers..."
echo 'Teacherpass123!' | sudo -S docker compose down --rmi local --remove-orphans || true
echo 'Teacherpass123!' | sudo -S docker rm -f flag-red71-app || true

# Build and Run
echo "Building and starting services..."
echo 'Teacherpass123!' | sudo -S docker compose up -d --build

echo "Services started."
echo "Public Access: http://localhost:9052"
