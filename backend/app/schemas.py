from pydantic import BaseModel


class PasswordRequest(BaseModel):
    password: str


class PasswordResponse(BaseModel):
    length: int
    entropy: float
    strength: str
    breached: bool
    count: int
    safety_percent: int
