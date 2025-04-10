
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

# Sample data from original mockData
alumni_data = [
    {
        "id": "a1",
        "name": "Sarah Johnson",
        "avatar": "/avatars/sarah.jpg",
        "department": "d1",
        "company": "c1",
        "jobTitle": "Senior Software Engineer",
        "skills": ["s1", "s3", "s5"],
        "graduationYear": 2018,
        "email": "sarah.j@example.com",
        "events": ["e1", "e2"],
        "bio": "Experienced software engineer specializing in frontend development and machine learning applications.",
        "role": "alumni"
    },
    {
        "id": "a2",
        "name": "Michael Chen",
        "avatar": "/avatars/michael.jpg",
        "department": "d1",
        "company": "c2",
        "jobTitle": "Data Scientist",
        "skills": ["s2", "s4", "s5"],
        "graduationYear": 2019,
        "email": "michael.c@example.com",
        "events": ["e2", "e5"],
        "bio": "Data scientist working on predictive analytics and AI models for business intelligence.",
        "role": "alumni"
    },
    {
        "id": "a3",
        "name": "Jessica Williams",
        "avatar": "/avatars/jessica.jpg",
        "department": "d2",
        "company": "c3",
        "jobTitle": "Product Manager",
        "skills": ["s8", "s9", "s6"],
        "graduationYear": 2017,
        "email": "jessica.w@example.com",
        "events": ["e1", "e3", "e4"],
        "bio": "Product manager with a passion for user-centered design and agile methodologies.",
        "role": "alumni"
    },
    {
        "id": "a4",
        "name": "David Rodriguez",
        "avatar": "/avatars/david.jpg",
        "department": "d4",
        "company": "c5",
        "jobTitle": "Financial Analyst",
        "skills": ["s12", "s13", "s4"],
        "graduationYear": 2020,
        "email": "david.r@example.com",
        "events": ["e3", "e5"],
        "bio": "Financial analyst specializing in investment strategies and market analysis.",
        "role": "alumni"
    },
    {
        "id": "a5",
        "name": "Priya Patel",
        "avatar": "/avatars/priya.jpg",
        "department": "d3",
        "company": "c4",
        "jobTitle": "Marketing Director",
        "skills": ["s10", "s11", "s8"],
        "graduationYear": 2016,
        "email": "priya.p@example.com",
        "events": ["e1", "e4"],
        "bio": "Marketing professional with expertise in digital campaigns and brand development.",
        "role": "alumni"
    }
]

departments_data = [
    {"id": "d1", "name": "Computer Science", "faculty": "Engineering"},
    {"id": "d2", "name": "Business Administration", "faculty": "Business"},
    {"id": "d3", "name": "Economics", "faculty": "Social Sciences"},
    {"id": "d4", "name": "Finance", "faculty": "Business"}
]

companies_data = [
    {"id": "c1", "name": "Google", "industry": "Technology", "location": "Mountain View, CA"},
    {"id": "c2", "name": "Microsoft", "industry": "Technology", "location": "Redmond, WA"},
    {"id": "c3", "name": "Apple", "industry": "Technology", "location": "Cupertino, CA"},
    {"id": "c4", "name": "Facebook", "industry": "Technology", "location": "Menlo Park, CA"},
    {"id": "c5", "name": "JP Morgan", "industry": "Finance", "location": "New York, NY"}
]

skills_data = [
    {"id": "s1", "name": "JavaScript", "category": "Programming"},
    {"id": "s2", "name": "Python", "category": "Programming"},
    {"id": "s3", "name": "React", "category": "Web Development"},
    {"id": "s4", "name": "Data Analysis", "category": "Data Science"},
    {"id": "s5", "name": "Machine Learning", "category": "Data Science"},
    {"id": "s6", "name": "UI Design", "category": "Design"},
    {"id": "s7", "name": "User Research", "category": "Design"},
    {"id": "s8", "name": "Product Management", "category": "Management"},
    {"id": "s9", "name": "Agile", "category": "Management"},
    {"id": "s10", "name": "Digital Marketing", "category": "Marketing"},
    {"id": "s11", "name": "Social Media", "category": "Marketing"},
    {"id": "s12", "name": "Financial Modeling", "category": "Finance"},
    {"id": "s13", "name": "Investment Analysis", "category": "Finance"}
]

events_data = [
    {"id": "e1", "name": "Annual Alumni Reunion", "date": "2023-05-15", "location": "University Campus", "type": "Networking"},
    {"id": "e2", "name": "Tech Industry Panel", "date": "2023-07-22", "location": "Virtual", "type": "Panel Discussion"},
    {"id": "e3", "name": "Career Fair 2023", "date": "2023-09-10", "location": "University Campus", "type": "Career"},
    {"id": "e4", "name": "Leadership Workshop", "date": "2023-11-05", "location": "Downtown Conference Center", "type": "Workshop"},
    {"id": "e5", "name": "Entrepreneurship Summit", "date": "2024-01-20", "location": "Business School", "type": "Conference"}
]

def init_database():
    driver = GraphDatabase.driver(NEO4J_URI, auth=(NEO4J_USER, NEO4J_PASSWORD))
    with driver.session() as session:
        # Clear existing data
        session.run("MATCH (n) DETACH DELETE n")
        
        # Create constraints for unique IDs
        try:
            session.run("CREATE CONSTRAINT alumni_id IF NOT EXISTS FOR (a:Alumni) REQUIRE a.id IS UNIQUE")
            session.run("CREATE CONSTRAINT department_id IF NOT EXISTS FOR (d:Department) REQUIRE d.id IS UNIQUE")
            session.run("CREATE CONSTRAINT company_id IF NOT EXISTS FOR (c:Company) REQUIRE c.id IS UNIQUE")
            session.run("CREATE CONSTRAINT skill_id IF NOT EXISTS FOR (s:Skill) REQUIRE s.id IS UNIQUE")
            session.run("CREATE CONSTRAINT event_id IF NOT EXISTS FOR (e:Event) REQUIRE e.id IS UNIQUE")
        except:
            # For older Neo4j versions
            session.run("CREATE CONSTRAINT ON (a:Alumni) ASSERT a.id IS UNIQUE")
            session.run("CREATE CONSTRAINT ON (d:Department) ASSERT d.id IS UNIQUE")
            session.run("CREATE CONSTRAINT ON (c:Company) ASSERT c.id IS UNIQUE")
            session.run("CREATE CONSTRAINT ON (s:Skill) ASSERT s.id IS UNIQUE")
            session.run("CREATE CONSTRAINT ON (e:Event) ASSERT e.id IS UNIQUE")
        
        # Create Alumni nodes
        for alumni in alumni_data:
            properties = ', '.join([f"`{k}`: ${k}" for k in alumni.keys()])
            query = f"CREATE (a:Alumni {{{properties}}})"
            session.run(query, **alumni)
            
        # Create Department nodes
        for dept in departments_data:
            properties = ', '.join([f"`{k}`: ${k}" for k in dept.keys()])
            query = f"CREATE (d:Department {{{properties}}})"
            session.run(query, **dept)
            
        # Create Company nodes
        for company in companies_data:
            properties = ', '.join([f"`{k}`: ${k}" for k in company.keys()])
            query = f"CREATE (c:Company {{{properties}}})"
            session.run(query, **company)
            
        # Create Skill nodes
        for skill in skills_data:
            properties = ', '.join([f"`{k}`: ${k}" for k in skill.keys()])
            query = f"CREATE (s:Skill {{{properties}}})"
            session.run(query, **skill)
            
        # Create Event nodes
        for event in events_data:
            properties = ', '.join([f"`{k}`: ${k}" for k in event.keys()])
            query = f"CREATE (e:Event {{{properties}}})"
            session.run(query, **event)
            
        # Create relationships between Alumni and Departments
        for alumni in alumni_data:
            session.run("""
                MATCH (a:Alumni {id: $alumniId}), (d:Department {id: $departmentId})
                CREATE (a)-[:STUDIED_IN]->(d)
            """, {"alumniId": alumni["id"], "departmentId": alumni["department"]})
            
        # Create relationships between Alumni and Companies
        for alumni in alumni_data:
            session.run("""
                MATCH (a:Alumni {id: $alumniId}), (c:Company {id: $companyId})
                CREATE (a)-[:WORKS_AT]->(c)
            """, {"alumniId": alumni["id"], "companyId": alumni["company"]})
            
        # Create relationships between Alumni and Skills
        for alumni in alumni_data:
            for skill_id in alumni["skills"]:
                session.run("""
                    MATCH (a:Alumni {id: $alumniId}), (s:Skill {id: $skillId})
                    CREATE (a)-[:HAS_SKILL]->(s)
                """, {"alumniId": alumni["id"], "skillId": skill_id})
                
        # Create relationships between Alumni and Events
        for alumni in alumni_data:
            for event_id in alumni["events"]:
                session.run("""
                    MATCH (a:Alumni {id: $alumniId}), (e:Event {id: $eventId})
                    CREATE (a)-[:ATTENDED]->(e)
                """, {"alumniId": alumni["id"], "eventId": event_id})
        
        print("Database initialized successfully!")
    
    driver.close()

if __name__ == "__main__":
    init_database()
