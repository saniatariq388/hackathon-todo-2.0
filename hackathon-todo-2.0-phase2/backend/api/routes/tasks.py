from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select

from backend.core.db import get_session
from backend.core.security import get_current_user
from backend.models import User, Task
from backend.schemas import TaskCreate, TaskRead, TaskUpdate

router = APIRouter(prefix="/tasks", tags=["tasks"])

@router.post("/", response_model=TaskRead)
def create_task(
    *,
    session: Session = Depends(get_session),
    task_in: TaskCreate,
    current_user: User = Depends(get_current_user)
):
    print(f"\n{'='*60}")
    print(f"➕ CREATE TASK REQUEST")
    print(f"User: {current_user.email} (ID: {current_user.id})")
    print(f"Task: {task_in.title}")
    print(f"{'='*60}\n")

    db_task = Task.model_validate(task_in, update={"user_id": current_user.id})
    session.add(db_task)
    session.commit()
    session.refresh(db_task)

    print(f"✅ Task created with ID: {db_task.id}\n")
    return db_task

@router.get("/", response_model=List[TaskRead])
def read_tasks(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    print(f"\n{'='*60}")
    print(f"📥 FETCH TASKS REQUEST")
    print(f"User: {current_user.email} (ID: {current_user.id})")

    statement = select(Task).where(Task.user_id == current_user.id)
    tasks = session.exec(statement).all()

    print(f"✅ Found {len(tasks)} tasks")
    print(f"{'='*60}\n")

    return tasks

@router.get("/{id}", response_model=TaskRead)
def read_task(
    *,
    id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    print(f"\n{'='*60}")
    print(f"🔍 READ TASK REQUEST - ID: {id}")
    print(f"User: {current_user.email} (ID: {current_user.id})")

    task = session.get(Task, id)
    if not task:
        print(f"❌ Task {id} not found")
        raise HTTPException(status_code=404, detail="Task not found")
    if task.user_id != current_user.id:
        print(f"❌ User {current_user.id} doesn't have permission to access task {id}")
        raise HTTPException(status_code=403, detail="Not enough permissions")

    print(f"✅ Task {id} retrieved successfully")
    print(f"{'='*60}\n")
    return task

@router.put("/{id}", response_model=TaskRead)
def update_task(
    *,
    id: int,
    session: Session = Depends(get_session),
    task_in: TaskUpdate,
    current_user: User = Depends(get_current_user)
):
    print(f"\n{'='*60}")
    print(f"✏️ UPDATE TASK REQUEST - ID: {id}")
    print(f"User: {current_user.email} (ID: {current_user.id})")
    print(f"Update data: {task_in.model_dump(exclude_unset=True)}")

    db_task = session.get(Task, id)
    if not db_task:
        print(f"❌ Task {id} not found")
        raise HTTPException(status_code=404, detail="Task not found")
    if db_task.user_id != current_user.id:
        print(f"❌ User {current_user.id} doesn't have permission to update task {id}")
        raise HTTPException(status_code=403, detail="Not enough permissions")

    task_data = task_in.model_dump(exclude_unset=True)
    for key, value in task_data.items():
        setattr(db_task, key, value)

    session.add(db_task)
    session.commit()
    session.refresh(db_task)

    print(f"✅ Task {id} updated successfully")
    print(f"Updated task: {db_task}")
    print(f"{'='*60}\n")
    return db_task

@router.delete("/{id}")
def delete_task(
    *,
    id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    print(f"\n{'='*60}")
    print(f"🗑️ DELETE TASK REQUEST - ID: {id}")
    print(f"User: {current_user.email} (ID: {current_user.id})")

    db_task = session.get(Task, id)
    if not db_task:
        print(f"❌ Task {id} not found")
        raise HTTPException(status_code=404, detail="Task not found")
    if db_task.user_id != current_user.id:
        print(f"❌ User {current_user.id} doesn't have permission to delete task {id}")
        raise HTTPException(status_code=403, detail="Not enough permissions")

    session.delete(db_task)
    session.commit()

    print(f"✅ Task {id} deleted successfully")
    print(f"{'='*60}\n")
    return {"status": "success"}
