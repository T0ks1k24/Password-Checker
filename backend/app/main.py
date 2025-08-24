from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers.password import router as password_router


app = FastAPI(title="Password Strength & Breach Checker")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(password_router, prefix="/api")
