# mcp-server\main.py
from mcp.server.fastmcp import FastMCP
import httpx
from typing import Optional, List, Dict, Any
import asyncio

# Initialize FastMCP server
mcp = FastMCP("TodoManager")

BACKEND_URL = "http://localhost:8000/api/v1"


def safe_json(response: httpx.Response) -> Any:
    """Try parsing JSON safely, fallback to dict with error."""
    try:
        return response.json()
    except Exception:
        return {"error": "Invalid JSON from backend", "content": response.text}


@mcp.tool()
async def get_tasks(session_token: str):
    """Retrieve all tasks for the authenticated user."""
    try:
        async with httpx.AsyncClient(timeout=10) as client:
            response = await client.get(
                f"{BACKEND_URL}/tasks/",
                headers={"Authorization": f"Bearer {session_token}"}
            )
            response.raise_for_status()
            return safe_json(response)
    except httpx.HTTPStatusError as e:
        return {"error": f"Backend returned HTTP {e.response.status_code}", "details": e.response.text}
    except httpx.RequestError as e:
        return {"error": "Request to backend failed", "details": str(e)}
    except Exception as e:
        return {"error": "Unexpected error in get_tasks", "details": str(e)}


@mcp.tool()
async def create_task(session_token: str, title: str, description: Optional[str] = None):
    """Create a new todo item."""
    try:
        async with httpx.AsyncClient(timeout=10) as client:
            payload = {"title": title}
            if description:
                payload["description"] = description

            response = await client.post(
                f"{BACKEND_URL}/tasks/",
                json=payload,
                headers={"Authorization": f"Bearer {session_token}"}
            )
            response.raise_for_status()
            return safe_json(response)
    except httpx.HTTPStatusError as e:
        return {"error": f"Backend returned HTTP {e.response.status_code}", "details": e.response.text}
    except httpx.RequestError as e:
        return {"error": "Request to backend failed", "details": str(e)}
    except Exception as e:
        return {"error": "Unexpected error in create_task", "details": str(e)}


@mcp.tool()
async def update_task(session_token: str, task_id: int, title: Optional[str] = None,
                      status: Optional[str] = None, description: Optional[str] = None):
    """Update an existing task."""
    try:
        async with httpx.AsyncClient(timeout=10) as client:
            payload = {}
            if title is not None:
                payload["title"] = title
            if status is not None:
                payload["status"] = status
            if description is not None:
                payload["description"] = description

            response = await client.put(
                f"{BACKEND_URL}/tasks/{task_id}",
                json=payload,
                headers={"Authorization": f"Bearer {session_token}"}
            )
            response.raise_for_status()
            return safe_json(response)
    except httpx.HTTPStatusError as e:
        return {"error": f"Backend returned HTTP {e.response.status_code}", "details": e.response.text}
    except httpx.RequestError as e:
        return {"error": "Request to backend failed", "details": str(e)}
    except Exception as e:
        return {"error": "Unexpected error in update_task", "details": str(e)}


@mcp.tool()
async def delete_task(session_token: str, task_id: int):
    """Delete a task."""
    try:
        async with httpx.AsyncClient(timeout=10) as client:
            response = await client.delete(
                f"{BACKEND_URL}/tasks/{task_id}",
                headers={"Authorization": f"Bearer {session_token}"}
            )
            response.raise_for_status()
            return safe_json(response)
    except httpx.HTTPStatusError as e:
        return {"error": f"Backend returned HTTP {e.response.status_code}", "details": e.response.text}
    except httpx.RequestError as e:
        return {"error": "Request to backend failed", "details": str(e)}
    except Exception as e:
        return {"error": "Unexpected error in delete_task", "details": str(e)}


if __name__ == "__main__":
    try:
        asyncio.run(mcp.run())
    except RuntimeError as e:
        # Already running asyncio in this thread
        print("Asyncio error:", e)
    except Exception as e:
        import traceback
        print("Internal MCP server error:", e)
        traceback.print_exc()
