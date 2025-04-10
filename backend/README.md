
# Alumni Network Backend

This is a Flask backend that connects to a Neo4j database for the Alumni Network application.

## Setup Instructions

1. Install Neo4j Desktop or use a Neo4j Aura instance
2. Update the `.env` file with your Neo4j credentials
3. Create a Python virtual environment and install dependencies:

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

4. Initialize the Neo4j database with sample data:

```bash
python init_db.py
```

5. Start the Flask server:

```bash
python app.py
```

The API will be available at http://localhost:5000

## API Endpoints

- `GET /api/health` - Check if the API is running
- `GET /api/alumni` - Get all alumni
- `GET /api/alumni/:id` - Get alumni by ID
- `GET /api/departments` - Get all departments
- `GET /api/companies` - Get all companies
- `GET /api/skills` - Get all skills
- `GET /api/events` - Get all events
- `GET /api/alumni/department/:id` - Get alumni by department
- `GET /api/alumni/company/:id` - Get alumni by company
- `GET /api/alumni/skill/:id` - Get alumni by skill
- `GET /api/alumni/event/:id` - Get alumni by event
- `GET /api/graph` - Get graph data
- `POST /api/login` - Login (email, password)

## Demo Credentials

Email: sarah.j@example.com
Password: demo123
