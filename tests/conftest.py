import pytest
import requests
import time
import sys


@pytest.fixture(scope="session")
def base_url():
    """Base URL for the API"""
    return "http://localhost:3000"


@pytest.fixture(scope="session")
def api_url(base_url):
    """API base URL"""
    return f"{base_url}/api"


@pytest.fixture(scope="function")
def session():
    """Create a requests session for each test"""
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    yield s
    s.close()


def pytest_runtest_setup(item):
    # Called before running each test
    print(f"\n[pytest] START TEST: {item.nodeid}", file=sys.stderr)


def pytest_runtest_teardown(item, nextitem):
    # Called after each test
    print(f"[pytest] END TEST: {item.nodeid}\n", file=sys.stderr)


@pytest.fixture(scope="function")
def create_user(api_url, session):
    """Factory fixture to create users"""
    created_users = []
    
    def _create_user(name="Test User", email=None):
        if email is None:
            email = f"user_{int(time.time() * 1000)}@example.com"
        
        print(f"[fixture:create_user] Creating user name={name} email={email}", file=sys.stderr)
        response = session.post(
            f"{api_url}/users",
            json={"name": name, "email": email}
        )
        if response.status_code == 201:
            created_users.append(response.json()["id"])
        return response
    
    yield _create_user
    
    # Cleanup: delete created users
    for user_id in created_users:
        try:
            session.delete(f"{api_url}/users/{user_id}")
        except:
            pass


@pytest.fixture(scope="function")
def create_project(api_url, session):
    """Factory fixture to create projects"""
    created_projects = []
    
    def _create_project(name="Test Project", user_id=None):
        if user_id is None:
            # Create a user first
            user_response = session.post(
                f"{api_url}/users",
                json={"name": "Project Owner", "email": f"owner_{int(time.time() * 1000)}@example.com"}
            )
            user_id = user_response.json()["id"]
        
        print(f"[fixture:create_project] Creating project name={name} userId={user_id}", file=sys.stderr)
        response = session.post(
            f"{api_url}/projects",
            json={"name": name, "userId": user_id}
        )
        if response.status_code == 201:
            created_projects.append(response.json()["id"])
        return response
    
    yield _create_project
    
    # Cleanup: delete created projects
    for project_id in created_projects:
        try:
            session.delete(f"{api_url}/projects/{project_id}")
        except:
            pass


@pytest.fixture(scope="function")
def create_task(api_url, session):
    """Factory fixture to create tasks"""
    created_tasks = []
    
    def _create_task(title="Test Task", project_id=None, description="Test description", status="todo"):
        if project_id is None:
            # Create a user and project first
            user_response = session.post(
                f"{api_url}/users",
                json={"name": "Task Owner", "email": f"taskowner_{int(time.time() * 1000)}@example.com"}
            )
            user_id = user_response.json()["id"]
            
            project_response = session.post(
                f"{api_url}/projects",
                json={"name": "Task Project", "userId": user_id}
            )
            project_id = project_response.json()["id"]
        
        payload = {
            "title": title,
            "projectId": project_id,
            "description": description
        }
        if status:
            payload["status"] = status
            
        print(f"[fixture:create_task] Creating task title={title} projectId={project_id} status={status}", file=sys.stderr)
        response = session.post(
            f"{api_url}/tasks",
            json=payload
        )
        if response.status_code == 201:
            created_tasks.append(response.json()["id"])
        return response
    
    yield _create_task
    
    # Cleanup: delete created tasks
    for task_id in created_tasks:
        try:
            session.delete(f"{api_url}/tasks/{task_id}")
        except:
            pass
