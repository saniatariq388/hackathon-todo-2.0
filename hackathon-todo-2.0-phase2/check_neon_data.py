import os
import sys
from dotenv import load_dotenv
from sqlalchemy import create_engine, text
from sqlalchemy.exc import SQLAlchemyError

# Load environment variables
load_dotenv()

def check_neon_connection():
    """Test connection to Neon database"""
    print("="*60)
    print("[INFO] NEON DATABASE CONNECTION CHECK")
    print("="*60)

    # Get database URL from environment
    database_url = os.getenv("DATABASE_URL")

    if not database_url:
        print("[ERROR] DATABASE_URL not found in environment variables")
        print("Please check your .env file or environment settings")
        return False

    print(f"Database URL: {database_url.replace('@', '[@]').replace(':', '[COLON]')[:50]}...")

    try:
        # Create engine and test connection
        engine = create_engine(database_url)

        # Test basic connection
        with engine.connect() as connection:
            result = connection.execute(text("SELECT 1"))
            print("[SUCCESS] Basic connection test: SUCCESS")

        # Check if tables exist
        with engine.connect() as connection:
            tables_query = text("""
                SELECT table_name
                FROM information_schema.tables
                WHERE table_schema = 'public'
            """)
            tables_result = connection.execute(tables_query)
            tables = [row[0] for row in tables_result.fetchall()]

            print(f"[INFO] Tables found: {tables}")

        # Check users table if it exists
        if 'user' in tables or 'users' in tables:
            user_table = 'user' if 'user' in tables else 'users'

            # Count users
            with engine.connect() as connection:
                # Quote table name if it's 'user' since it's a reserved keyword in PostgreSQL
                quoted_user_table = f'"{user_table}"' if user_table == 'user' else user_table
                count_query = text(f"SELECT COUNT(*) FROM {quoted_user_table}")
                user_count = connection.execute(count_query).scalar()
                print(f"[INFO] Users in {user_table} table: {user_count}")

            # Get sample users
            with engine.connect() as connection:
                # Get column names to handle different schema
                columns_query = text(f"SELECT column_name FROM information_schema.columns WHERE table_name = '{user_table}'")
                columns = [row[0] for row in connection.execute(columns_query).fetchall()]

                # Determine the right columns to select based on available columns
                if 'id' in columns and 'email' in columns and 'name' in columns and ('created_at' in columns or 'createdAt' in columns):
                    if 'created_at' in columns:
                        sample_query = text(f'SELECT id, email, name, created_at FROM "{user_table}" LIMIT 5')
                    else:
                        sample_query = text(f'SELECT id, email, name, "createdAt" FROM "{user_table}" LIMIT 5')
                elif 'id' in columns and 'email' in columns:
                    sample_query = text(f'SELECT id, email FROM "{user_table}" LIMIT 5')
                else:
                    # Just get all columns if standard ones aren't available
                    sample_query = text(f'SELECT * FROM "{user_table}" LIMIT 5')

                try:
                    sample_users = connection.execute(sample_query).fetchall()
                    if sample_users:
                        print("[INFO] Sample user records:")
                        for user in sample_users:
                            print(f"   - Data: {user}")
                except Exception as e:
                    print(f"[WARNING] Could not fetch sample user data: {str(e)}")

        # Check tasks table if it exists
        if 'task' in tables or 'tasks' in tables:
            task_table = 'task' if 'task' in tables else 'tasks'

            # Count tasks
            with engine.connect() as connection:
                count_query = text(f"SELECT COUNT(*) FROM {task_table}")
                task_count = connection.execute(count_query).scalar()
                print(f"[INFO] Tasks in {task_table} table: {task_count}")

            # Get sample tasks
            with engine.connect() as connection:
                # Get column names to handle different schema
                columns_query = text(f"SELECT column_name FROM information_schema.columns WHERE table_name = '{task_table}'")
                task_columns = [row[0] for row in connection.execute(columns_query).fetchall()]

                # Determine the right columns to select based on available columns
                if 'id' in task_columns and 'title' in task_columns and 'status' in task_columns and 'user_id' in task_columns:
                    # Determine user table name again for the join
                    actual_user_table = 'user' if 'user' in tables else 'users'
                    if 'created_at' in task_columns:
                        sample_query = text(f"""
                            SELECT t.id, t.title, t.status, t.created_at, u.email
                            FROM "{task_table}" t
                            LEFT JOIN "{actual_user_table}" u
                            ON t.user_id = u.id
                            LIMIT 5
                        """)
                    else:
                        sample_query = text(f"""
                            SELECT t.id, t.title, t.status, t."created_at", u.email
                            FROM "{task_table}" t
                            LEFT JOIN "{actual_user_table}" u
                            ON t.user_id = u.id
                            LIMIT 5
                        """)
                elif 'id' in task_columns and 'title' in task_columns:
                    sample_query = text(f'SELECT id, title FROM "{task_table}" LIMIT 5')
                else:
                    # Just get all columns if standard ones aren't available
                    sample_query = text(f'SELECT * FROM "{task_table}" LIMIT 5')

                try:
                    sample_tasks = connection.execute(sample_query).fetchall()
                    if sample_tasks:
                        print("[INFO] Sample task records:")
                        for task in sample_tasks:
                            print(f"   - Data: {task}")
                except Exception as e:
                    print(f"[WARNING] Could not fetch sample task data: {str(e)}")

        print("="*60)
        print("[SUCCESS] NEON DATABASE CONNECTION: SUCCESSFUL")
        print("="*60)
        return True

    except SQLAlchemyError as e:
        print(f"[ERROR] SQLALCHEMY ERROR: {str(e)}")
        return False
    except Exception as e:
        print(f"[ERROR] GENERAL ERROR: {str(e)}")
        return False

if __name__ == "__main__":
    success = check_neon_connection()
    sys.exit(0 if success else 1)