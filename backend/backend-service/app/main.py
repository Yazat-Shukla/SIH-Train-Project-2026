from fastapi import FastAPI

from app.api.routes.ai import router as ai_router
from app.api.routes.assets import router as assets_router
from app.api.routes.blocks import router as blocks_router
from app.api.routes.priorities import router as priorities_router
from app.api.routes.schedules import router as schedules_router
from app.api.routes.tasks import router as tasks_router
from app.api.routes.trains import router as trains_router


app = FastAPI(
    title="BlackFire Backend API",
    version="1.0.0",
    description="FastAPI backend for BlackFire railway maintenance planning.",
)


app.include_router(tasks_router)
app.include_router(assets_router)
app.include_router(trains_router)
app.include_router(blocks_router)
app.include_router(priorities_router)
app.include_router(schedules_router)
app.include_router(ai_router)


@app.get("/health", tags=["System"])
def health_check():
    return {
        "status": "ok",
        "service": "blackfire-backend",
    }