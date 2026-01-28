# # ai-agent/agent.py
# import os
# import httpx
# from dotenv import load_dotenv
# from openai import AsyncOpenAI

# load_dotenv()

# # Initialize OpenAI client
# client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# # Backend API URL
# BACKEND_URL = "http://127.0.0.1:8000/api/v1"


# async def call_backend_api(
#     endpoint: str,
#     method: str,
#     session_token: str,
#     **kwargs,
# ):
#     """
#     Call the backend API directly.
#     """
#     async with httpx.AsyncClient(follow_redirects=True) as http_client:
#         headers = {
#             "Authorization": f"Bearer {session_token}",
#             "Content-Type": "application/json",
#         }
#         url = f"{BACKEND_URL}{endpoint}"

#         try:
#             if method == "GET":
#                 response = await http_client.get(url, headers=headers)

#             elif method == "POST":
#                 payload = {
#                     "title": kwargs.get("title", ""),
#                     "description": kwargs.get("description"),
#                     "priority": kwargs.get("priority", "medium"),
#                 }

#                 if kwargs.get("due_date"):
#                     payload["due_date"] = kwargs["due_date"]

#                 if payload["description"] is None:
#                     del payload["description"]

#                 response = await http_client.post(
#                     url, json=payload, headers=headers
#                 )

#             elif method == "PUT":
#                 payload = {}

#                 for field in ["title", "description", "status", "priority", "due_date"]:
#                     if kwargs.get(field) is not None:
#                         payload[field] = kwargs[field]

#                 if not payload:
#                     return {"error": "No fields to update"}

#                 response = await http_client.put(
#                     url, json=payload, headers=headers
#                 )

#             elif method == "DELETE":
#                 response = await http_client.delete(url, headers=headers)

#             else:
#                 return {"error": f"Unsupported method: {method}"}

#             if response.status_code >= 400:
#                 return {
#                     "error": f"HTTP {response.status_code}: {response.text}"
#                 }

#             if not response.text:
#                 return {
#                     "error": f"Empty response from backend: status {response.status_code}"
#                 }

#             content_type = response.headers.get("content-type", "").lower()
#             if "text/html" in content_type:
#                 return {"error": "Received HTML response instead of JSON"}

#             return response.json()

#         except httpx.ConnectError:
#             return {
#                 "error": (
#                     "Cannot connect to backend. "
#                     "Make sure it is running on http://localhost:8000"
#                 )
#             }
#         except Exception as e:
#             print(f"General error in call_backend_api: {e}")
#             return {"error": f"Connection error: {str(e)}"}


# async def chat_with_agent(message: str, session_token: str):
#     """
#     Process a user message and return the agent's response.
#     """
#     system_prompt = """<system prompt unchanged>"""

#     try:
#         lower_msg = message.lower().strip()

#         # =====================
#         # LIST TASKS
#         # =====================
#         if any(k in lower_msg for k in ["list", "show", "my tasks", "tasks"]):
#             tasks = await call_backend_api("/tasks", "GET", session_token)

#             if "error" in tasks:
#                 return f"Error retrieving tasks: {tasks['error']}"

#             if not tasks:
#                 return "📝 You don't have any tasks yet."

#             formatted = []
#             for task in tasks:
#                 status = "✅" if task["status"] == "completed" else "⏳"
#                 priority = {
#                     "high": "🔴 ",
#                     "medium": "🟡 ",
#                     "low": "🟢 ",
#                 }.get(task.get("priority"), "")

#                 formatted.append(f"{status} {priority}{task['title']}")

#             return "📝 Here are your current tasks:\n" + "\n".join(formatted)

#         # =====================
#         # CREATE TASK
#         # =====================
#         elif any(k in lower_msg for k in ["add", "create", "new task"]):
#             title = message.replace("add task", "").replace(
#                 "create task", ""
#             ).strip()

#             if not title:
#                 return "What should be the task title?"

#             priority = "medium"
#             if "high priority" in lower_msg:
#                 priority = "high"
#             elif "low priority" in lower_msg:
#                 priority = "low"

#             result = await call_backend_api(
#                 "/tasks",
#                 "POST",
#                 session_token,
#                 title=title,
#                 priority=priority,
#             )

#             if "error" in result:
#                 return f"Error creating task: {result['error']}"

#             return f"➕ Task '{title}' has been added."

#         # =====================
#         # DELETE TASK
#         # =====================
#         elif any(k in lower_msg for k in ["delete", "remove"]):
#             all_tasks = await call_backend_api("/tasks", "GET", session_token)

#             if "error" in all_tasks:
#                 return f"Error retrieving tasks: {all_tasks['error']}"

#             words = message.split()
#             command_words = {"delete", "remove", "task", "please", "can", "you", "the"}
#             task_name = " ".join(
#                 w for w in words if w.lower() not in command_words
#             ).strip()

#             if not task_name:
#                 return "Which task would you like to delete?"

#             matches = [
#                 t for t in all_tasks if task_name.lower() in t["title"].lower()
#             ]

#             if not matches:
#                 return f"❌ No task found with name '{task_name}'."

#             if len(matches) > 1:
#                 names = "\n".join(f"• {t['title']}" for t in matches)
#                 return (
#                     f"Multiple tasks match '{task_name}':\n{names}\n"
#                     "Please be more specific."
#                 )

#             task = matches[0]
#             result = await call_backend_api(
#                 f"/tasks/{task['id']}",
#                 "DELETE",
#                 session_token,
#             )

#             if "error" in result:
#                 return f"❌ Error deleting task: {result['error']}"

#             return f"🗑️ Task '{task['title']}' has been deleted."

#         # =====================
#         # FALLBACK TO LLM
#         # =====================
#         response = await client.chat.completions.create(
#             model="gpt-4o-mini",
#             messages=[
#                 {"role": "system", "content": system_prompt},
#                 {"role": "user", "content": message},
#             ],
#             max_tokens=150,
#         )

#         return response.choices[0].message.content

#     except Exception as e:
#         return f"Sorry, I encountered an error: {str(e)}"



#---------------------------------



# ai-agent/agent.py
import os
import httpx
from dotenv import load_dotenv
from openai import AsyncOpenAI

load_dotenv()

# Initialize OpenAI client
client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Backend API URL
BACKEND_URL = "http://127.0.0.1:8000/api/v1"


async def call_backend_api(
    endpoint: str,
    method: str,
    session_token: str,
    **kwargs,
):
    """
    Call the backend API directly.
    """
    async with httpx.AsyncClient(follow_redirects=True) as http_client:
        headers = {
            "Authorization": f"Bearer {session_token}",
            "Content-Type": "application/json",
        }
        url = f"{BACKEND_URL}{endpoint}"

        try:
            if method == "GET":
                response = await http_client.get(url, headers=headers)

            elif method == "POST":
                payload = {
                    "title": kwargs.get("title", ""),
                    "description": kwargs.get("description"),
                    "priority": kwargs.get("priority", "medium"),
                }

                if kwargs.get("due_date"):
                    payload["due_date"] = kwargs["due_date"]

                if payload["description"] is None:
                    del payload["description"]

                response = await http_client.post(
                    url, json=payload, headers=headers
                )

            elif method == "PUT":
                payload = {}

                for field in ["title", "description", "status", "priority", "due_date"]:
                    if kwargs.get(field) is not None:
                        payload[field] = kwargs[field]

                if not payload:
                    return {"error": "No fields to update"}

                response = await http_client.put(
                    url, json=payload, headers=headers
                )

            elif method == "DELETE":
                response = await http_client.delete(url, headers=headers)

            else:
                return {"error": f"Unsupported method: {method}"}

            if response.status_code >= 400:
                return {
                    "error": f"HTTP {response.status_code}: {response.text}"
                }

            if not response.text:
                return {
                    "error": f"Empty response from backend: status {response.status_code}"
                }

            content_type = response.headers.get("content-type", "").lower()
            if "text/html" in content_type:
                return {"error": "Received HTML response instead of JSON"}

            return response.json()

        except httpx.ConnectError:
            return {
                "error": (
                    "Cannot connect to backend. "
                    "Make sure it is running on http://localhost:8000"
                )
            }
        except Exception as e:
            print(f"General error in call_backend_api: {e}")
            return {"error": f"Connection error: {str(e)}"}


async def chat_with_agent(message: str, session_token: str):
    """
    Process a user message and return the agent's response.
    """
    system_prompt = """You are a helpful todo assistant. Help users manage their tasks."""

    try:
        lower_msg = message.lower().strip()

        # =====================
        # LIST TASKS
        # =====================
        if any(k in lower_msg for k in ["list", "show", "my tasks", "tasks"]):
            tasks = await call_backend_api("/tasks", "GET", session_token)

            if "error" in tasks:
                return f"Error retrieving tasks: {tasks['error']}"

            if not tasks:
                return "📝 You don't have any tasks yet."

            formatted = []
            for task in tasks:
                status = "✅" if task["status"] == "completed" else "⏳"
                priority = {
                    "high": "🔴 ",
                    "medium": "🟡 ",
                    "low": "🟢 ",
                }.get(task.get("priority"), "")

                formatted.append(f"{status} {priority}{task['title']}")

            return "📝 Here are your current tasks:\n" + "\n".join(formatted)

        # =====================
        # CREATE TASK
        # =====================
        elif any(k in lower_msg for k in ["add", "create", "new task"]):
            title = message.replace("add task", "").replace(
                "create task", ""
            ).strip()

            if not title:
                return "What should be the task title?"

            priority = "medium"
            if "high priority" in lower_msg:
                priority = "high"
            elif "low priority" in lower_msg:
                priority = "low"

            result = await call_backend_api(
                "/tasks",
                "POST",
                session_token,
                title=title,
                priority=priority,
            )

            if "error" in result:
                return f"Error creating task: {result['error']}"

            return f"➕ Task '{title}' has been added."

        # =====================
        # UPDATE TASK (SMART VERSION)
        # =====================
        elif any(k in lower_msg for k in ["update", "change", "edit", "modify"]):
            # Get all tasks first
            all_tasks = await call_backend_api("/tasks", "GET", session_token)
            
            if "error" in all_tasks:
                return f"Error retrieving tasks: {all_tasks['error']}"

            # Try to find "to" keyword which separates old and new
            if " to " in lower_msg:
                parts = message.split(" to ", 1)
                old_part = parts[0]
                new_title = parts[1].strip()
                
                # Remove command words from old part
                command_words = ["update", "change", "edit", "modify", "task"]
                words = old_part.split()
                old_title_parts = [word for word in words if word.lower() not in command_words]
                old_title = " ".join(old_title_parts).strip()
                
                # Remove quotes if present
                old_title = old_title.strip('"').strip("'")
                new_title = new_title.strip('"').strip("'")
                
                # Check if priority is specified in new title
                priority = None
                lower_new_title = new_title.lower()
                if "with high priority" in lower_new_title or "high priority" in lower_new_title:
                    priority = "high"
                    new_title = new_title.replace("with high priority", "").replace("high priority", "").strip()
                elif "with low priority" in lower_new_title or "low priority" in lower_new_title:
                    priority = "low"
                    new_title = new_title.replace("with low priority", "").replace("low priority", "").strip()
                
                # Try to find task by old title or ID
                task_to_update = None
                
                # Check if old_title is a number (task ID)
                if old_title.isdigit():
                    task_id = int(old_title)
                    task_to_update = next((task for task in all_tasks if task['id'] == task_id), None)
                else:
                    # Find by name (case-insensitive partial match)
                    matching_tasks = [task for task in all_tasks if old_title.lower() in task['title'].lower()]
                    
                    if len(matching_tasks) == 1:
                        task_to_update = matching_tasks[0]
                    elif len(matching_tasks) > 1:
                        task_list = "\n".join([f"• {task['title']}" for task in matching_tasks])
                        return f"Multiple tasks match '{old_title}':\n{task_list}\n\nPlease be more specific."
                
                if not task_to_update:
                    return f"❌ No task found matching '{old_title}'."
                
                if not new_title:
                    return f"What should be the new title for '{task_to_update['title']}'?"
                
                # Update the task
                update_params = {"title": new_title}
                if priority:
                    update_params["priority"] = priority
                
                result = await call_backend_api(
                    f"/tasks/{task_to_update['id']}", 
                    "PUT", 
                    session_token, 
                    **update_params
                )
                
                if "error" in result:
                    return f"❌ Error updating task: {result['error']}"
                
                priority_text = f" with {priority} priority" if priority else ""
                return f"✏️ Task '{task_to_update['title']}' has been updated to '{new_title}'{priority_text}."
            else:
                return "Please use the format: 'update [old task name] to [new task name]'"

        # =====================
        # DELETE TASK
        # =====================
        elif any(k in lower_msg for k in ["delete", "remove"]):
            all_tasks = await call_backend_api("/tasks", "GET", session_token)

            if "error" in all_tasks:
                return f"Error retrieving tasks: {all_tasks['error']}"

            words = message.split()
            command_words = {"delete", "remove", "task", "please", "can", "you", "the"}
            task_name = " ".join(
                w for w in words if w.lower() not in command_words
            ).strip()

            if not task_name:
                return "Which task would you like to delete?"

            matches = [
                t for t in all_tasks if task_name.lower() in t["title"].lower()
            ]

            if not matches:
                return f"❌ No task found with name '{task_name}'."

            if len(matches) > 1:
                names = "\n".join(f"• {t['title']}" for t in matches)
                return (
                    f"Multiple tasks match '{task_name}':\n{names}\n"
                    "Please be more specific."
                )

            task = matches[0]
            result = await call_backend_api(
                f"/tasks/{task['id']}",
                "DELETE",
                session_token,
            )

            if "error" in result:
                return f"❌ Error deleting task: {result['error']}"

            return f"🗑️ Task '{task['title']}' has been deleted."

        # =====================
        # FALLBACK TO LLM
        # =====================
        response = await client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": message},
            ],
            max_tokens=150,
        )

        return response.choices[0].message.content

    except Exception as e:
        return f"Sorry, I encountered an error: {str(e)}"