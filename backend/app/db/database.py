'''
This file is responsible for managing all database-related infrastructure for the backend.

This file handles the following:
- Database connection setup
- SQLAlchemy engine configuration
- Session creation
- Base model declaration
- Database health testing
- Dependency injection for FastAPI routes

'''

from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv
import os

#Load the .env file 
load_dotenv()


"""
IMPORTANT:
You MUST create a `.env` file in your project root
and define:

DATABASE_URL=your_database_connection_string

Example for PostgreSQL:
DATABASE_URL=postgresql://user:password@localhost:5432/journal_db

Alternatively, you can hardcode the URL directly,
but using .env is best practice for security.
"""

#Get the URL from the .env file
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL")

#Manages the actual database connection, the interface between SQLAlchemy and
# the database
engine = create_engine(SQLALCHEMY_DATABASE_URL)

#Creates database session intances.
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

#All database models will inherit from Base
Base = declarative_base()


#Test whether the database is reachable
def test_db_connection():
    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))
            return True
    except Exception as e:
        print(f"Database connection error: {e}")
        return False


'''
FastAPI dependency that provides a database session.
:
- Creates a new session
- Yields it to the route
- Automatically closes it after request completes
'''
def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        #Ensures sesion is always closed and prevents mem leaks
        db.close()
