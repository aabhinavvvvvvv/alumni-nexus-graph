
from flask import Flask, jsonify, request
from flask_cors import CORS
from neo4j import GraphDatabase
import os
from dotenv import load_dotenv
import json

# Load environment variables
load_dotenv()

# Neo4j connection parameters
NEO4J_URI = os.getenv("NEO4J_URI", "bolt://localhost:7687")
NEO4J_USER = os.getenv("NEO4J_USER", "neo4j")
NEO4J_PASSWORD = os.getenv("NEO4J_PASSWORD", "password")

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Neo4j driver
driver = GraphDatabase.driver(NEO4J_URI, auth=(NEO4J_USER, NEO4J_PASSWORD))

def get_db_session():
    return driver.session()

# Helper function to convert Neo4j records to dictionaries
def record_to_dict(record):
    return {key: record[key] for key in record.keys()}

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy", "message": "Flask backend is running"}), 200

# API Routes
@app.route('/api/alumni', methods=['GET'])
def get_all_alumni():
    try:
        with get_db_session() as session:
            result = session.run("""
                MATCH (a:Alumni)
                RETURN a
                ORDER BY a.name
            """)
            alumni = [record_to_dict(record["a"]) for record in result]
            return jsonify(alumni), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/alumni/<alumni_id>', methods=['GET'])
def get_alumni_by_id(alumni_id):
    try:
        with get_db_session() as session:
            result = session.run("""
                MATCH (a:Alumni {id: $id})
                RETURN a
            """, {"id": alumni_id})
            record = result.single()
            if not record:
                return jsonify({"error": "Alumni not found"}), 404
            return jsonify(record_to_dict(record["a"])), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/departments', methods=['GET'])
def get_all_departments():
    try:
        with get_db_session() as session:
            result = session.run("""
                MATCH (d:Department)
                RETURN d
                ORDER BY d.name
            """)
            departments = [record_to_dict(record["d"]) for record in result]
            return jsonify(departments), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/companies', methods=['GET'])
def get_all_companies():
    try:
        with get_db_session() as session:
            result = session.run("""
                MATCH (c:Company)
                RETURN c
                ORDER BY c.name
            """)
            companies = [record_to_dict(record["c"]) for record in result]
            return jsonify(companies), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/skills', methods=['GET'])
def get_all_skills():
    try:
        with get_db_session() as session:
            result = session.run("""
                MATCH (s:Skill)
                RETURN s
                ORDER BY s.name
            """)
            skills = [record_to_dict(record["s"]) for record in result]
            return jsonify(skills), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/events', methods=['GET'])
def get_all_events():
    try:
        with get_db_session() as session:
            result = session.run("""
                MATCH (e:Event)
                RETURN e
                ORDER BY e.name
            """)
            events = [record_to_dict(record["e"]) for record in result]
            return jsonify(events), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/alumni/department/<department_id>', methods=['GET'])
def get_alumni_by_department(department_id):
    try:
        with get_db_session() as session:
            result = session.run("""
                MATCH (a:Alumni)-[:STUDIED_IN]->(d:Department {id: $id})
                RETURN a
            """, {"id": department_id})
            alumni = [record_to_dict(record["a"]) for record in result]
            return jsonify(alumni), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/alumni/company/<company_id>', methods=['GET'])
def get_alumni_by_company(company_id):
    try:
        with get_db_session() as session:
            result = session.run("""
                MATCH (a:Alumni)-[:WORKS_AT]->(c:Company {id: $id})
                RETURN a
            """, {"id": company_id})
            alumni = [record_to_dict(record["a"]) for record in result]
            return jsonify(alumni), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/alumni/skill/<skill_id>', methods=['GET'])
def get_alumni_by_skill(skill_id):
    try:
        with get_db_session() as session:
            result = session.run("""
                MATCH (a:Alumni)-[:HAS_SKILL]->(s:Skill {id: $id})
                RETURN a
            """, {"id": skill_id})
            alumni = [record_to_dict(record["a"]) for record in result]
            return jsonify(alumni), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/alumni/event/<event_id>', methods=['GET'])
def get_alumni_by_event(event_id):
    try:
        with get_db_session() as session:
            result = session.run("""
                MATCH (a:Alumni)-[:ATTENDED]->(e:Event {id: $id})
                RETURN a
            """, {"id": event_id})
            alumni = [record_to_dict(record["a"]) for record in result]
            return jsonify(alumni), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/graph', methods=['GET'])
def get_graph_data():
    try:
        with get_db_session() as session:
            # Get all nodes
            result_nodes = session.run("""
                MATCH (n)
                WHERE n:Alumni OR n:Department OR n:Company OR n:Skill OR n:Event
                RETURN n, labels(n) as labels
            """)
            
            # Get all relationships
            result_links = session.run("""
                MATCH (source)-[r]->(target)
                WHERE (source:Alumni OR source:Department OR source:Company OR source:Skill OR source:Event)
                AND (target:Alumni OR target:Department OR target:Company OR target:Skill OR target:Event)
                RETURN source.id as source, target.id as target, type(r) as type
            """)
            
            # Process nodes
            nodes = []
            for record in result_nodes:
                node = record_to_dict(record["n"])
                label = node.get('name', '')
                node_type = record["labels"][0].lower()
                
                size = 5
                if node_type == 'alumni':
                    size = 10
                elif node_type == 'department' or node_type == 'company':
                    size = 8
                elif node_type == 'event':
                    size = 7
                
                nodes.append({
                    'id': node.get('id', ''),
                    'label': label,
                    'type': node_type,
                    'size': size
                })
            
            # Process relationships
            links = []
            for record in result_links:
                links.append({
                    'source': record["source"],
                    'target': record["target"],
                    'type': record["type"],
                    'label': record["type"]
                })
            
            return jsonify({"nodes": nodes, "links": links}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        
        with get_db_session() as session:
            result = session.run("""
                MATCH (a:Alumni {email: $email})
                RETURN a
            """, {"email": email})
            
            user = result.single()
            if not user:
                return jsonify({"error": "Invalid email or password"}), 401
                
            # In a real application, you'd check the password hash here
            # For demo purposes, we're just checking if the password matches
            user_data = record_to_dict(user["a"])
            
            # This is just for demo - in production you'd use a password hash
            if password == 'demo123':  # Always use the demo password for this example
                # Remove password from user_data if it exists
                if 'password' in user_data:
                    del user_data['password']
                return jsonify({"message": "Login successful", "user": user_data}), 200
            else:
                return jsonify({"error": "Invalid email or password"}), 401
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
