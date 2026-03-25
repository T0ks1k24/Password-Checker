from pydantic import BaseModel
from typing import List

class PasswordRequest(BaseModel):
    password: str

class PasswordResponse(BaseModel):
    length: int
    entropy: float
    strength: str
    score: int
    breached: bool
    count: int
    safety_percent: int
    crack_time_display: str
    warning: str
    suggestions: List[str]
