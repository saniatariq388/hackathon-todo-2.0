# MCP Server for Todo Application

This is the Model Context Protocol (MCP) server that exposes the todo application's backend operations as tools that can be consumed by an AI agent.

## Tools Provided

- `get_tasks`: Retrieve all tasks for the authenticated user
- `create_task`: Create a new todo item
- `update_task`: Update an existing task
- `delete_task`: Delete a task

## Configuration

The server connects to the backend API at `http://localhost:8000/api/v1` by default.