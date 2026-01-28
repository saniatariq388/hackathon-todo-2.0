# test_agent_chat.py
import requests
import json

def test_chat():
    url = "http://localhost:8001/chat"
    token = "3978c8a4-3b48-4366-a908-f49b22710d13"

    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }

    payload = {
        "message": "Please add a task named 'Buy Milk' and then list all my tasks"
    }

    print(f"Sending request to {url}...")
    try:
        response = requests.post(url, headers=headers, json=payload)
        response.raise_for_status()

        result = response.json()
        print("\nAgent Response:")
        print(result["response"])

    except requests.exceptions.RequestException as e:
        print(f"Error: {e}")
        if hasattr(e.response, 'text'):
            print(f"Response text: {e.response.text}")

if __name__ == "__main__":
    test_chat()