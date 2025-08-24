from fastapi import APIRouter
from app.services.strength import password_strength
from app.services.breach import check_password
from app.schemas import PasswordRequest, PasswordResponse

router = APIRouter()


@router.post("/check-password", response_model=PasswordResponse)
def analyze_password(data: PasswordRequest):
    strength = password_strength(data.password)
    breach = check_password(data.password)
    return {
        "length": strength["length"],
        "entropy": strength["entropy"],
        "strength": strength["strength"],
        "breached": breach["breached"],
        "count": breach.get("count", 0),
        "safety_percent": strength["safety_percent"],
    }
