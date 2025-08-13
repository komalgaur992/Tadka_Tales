<<<<<<< HEAD
# Tadka_Tales
AI-powered voice assistant for step-by-step Indian cooking guidance | Built with React
=======
# Tadka Tales - Django Backend

This is the Django REST Framework backend for the Tadka Tales project, a modern recipe and cooking application.

## Features

- **User Authentication**: Email/password signup and JWT for session management.
- **Recipe Management**: Full CRUD operations for recipes, including steps and images.
- **Favorites**: Users can mark and view their favorite recipes.
- **User Profiles**: Users can view and update their profiles.
- **Step-by-Step Mode**: Fetch individual recipe steps for a guided cooking experience.
- **Voice Assistant**: A mock endpoint to simulate voice commands.
- **API Documentation**: Interactive API documentation powered by `drf-spectacular`.

## Setup and Installation

Follow these steps to get the development environment running.

### Prerequisites

- Python 3.10+
- Pip (Python package installer)

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Tadka_Tales
```

### 2. Create a Virtual Environment

```bash
python3 -m venv venv
source venv/bin/activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Set Up Environment Variables

Create a `.env` file in the root directory and add the following variables. For development, you can use the provided default values.

```
SECRET_KEY='django-insecure-your-secret-key'
DEBUG=True

# For development, we are using SQLite
DB_ENGINE=django.db.backends.sqlite3
DB_NAME=db.sqlite3
```

### 5. Run Database Migrations

```bash
python3 manage.py migrate
```

### 6. Create a Superuser

This will allow you to access the Django admin panel.

```bash
python3 manage.py createsuperuser
```

### 7. Run the Development Server

```bash
python3 manage.py runserver
```

The backend will be running at `http://127.0.0.1:8000/`.

## API Endpoints

The main API is available under the `/api/` prefix.

- **Admin Panel**: `http://127.0.0.1:8000/admin/`
- **API Docs**: `http://127.0.0.1:8000/api/docs/`

### Example Usage (using cURL)

**Register a new user:**
```bash
curl -X POST -H "Content-Type: application/json" -d '{"email": "test@example.com", "password": "strongpassword123"}' http://127.0.0.1:8000/api/v1/register/
```

**Log in to get JWT tokens:**
```bash
curl -X POST -H "Content-Type: application/json" -d '{"email": "test@example.com", "password": "strongpassword123"}' http://127.0.0.1:8000/api/v1/login/
```

**Create a new recipe (with authentication):**
```bash
curl -X POST -H "Authorization: Bearer <your_access_token>" -H "Content-Type: application/json" -d '{"title": "My New Recipe", "description": "A delicious dish."}' http://127.0.0.1:8000/api/recipes/
```

## Features

- Django 4.2.7 with Django REST Framework
- Core app with `/ping` API endpoint
- SQLite database (default)
- Environment-based configuration
- Basic test coverage

## Project Structure

```
tadka_backend/
├── manage.py                 # Django management script
├── requirements.txt          # Python dependencies
├── .env                     # Environment variables
├── tadka_backend/           # Main project directory
│   ├── __init__.py
│   ├── settings.py          # Django settings
│   ├── urls.py              # Main URL configuration
│   ├── wsgi.py              # WSGI application
│   └── asgi.py              # ASGI application
└── core/                    # Core app
    ├── __init__.py
    ├── apps.py              # App configuration
    ├── models.py            # Database models
    ├── views.py             # API views
    ├── urls.py              # App URL patterns
    ├── admin.py             # Django admin configuration
    └── tests.py             # Test cases
```

## Setup Instructions

1. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

2. **Run Database Migrations**
   ```bash
   python manage.py migrate
   ```

3. **Create Superuser (Optional)**
   ```bash
   python manage.py createsuperuser
   ```

4. **Start Development Server**
   ```bash
   python manage.py runserver
   ```

## API Endpoints

### Ping Endpoint
- **URL:** `GET /api/ping/`
- **Description:** Health check endpoint
- **Response:**
  ```json
  {
    "status": "success",
    "message": "pong",
    "timestamp": "2025-08-04T20:53:37.123456",
    "server": "Tadka Backend API"
  }
  ```

## Testing

Run the test suite:
```bash
python manage.py test
```

## Development

The server will be available at:
- Main API: http://127.0.0.1:8000/api/
- Admin Panel: http://127.0.0.1:8000/admin/
- Ping Endpoint: http://127.0.0.1:8000/api/ping/

## Environment Variables

Configure the following in your `.env` file:
- `SECRET_KEY`: Django secret key
- `DEBUG`: Debug mode (True/False)
- `ALLOWED_HOSTS`: Comma-separated list of allowed hosts
>>>>>>> aee6d4db (Fix: added .env to gitignore)
