from fastapi import APIRouter
from app.services.strength import password_strength
from app.services.breach import check_password
from app.schemas import PasswordRequest, PasswordResponse

router = APIRouter()


@router.post("/check-password", response_model=PasswordResponse)
def analyze_password(data: PasswordRequest):
    strength = password_strength(data.password)
    breach = check_password(data.password)
    
    # If breached, safety score drops significantly
    safety = strength["safety_percent"]
    if breach["breached"]:
        safety = min(safety, 10)  # max 10% safety if breached

    return {
        "length": strength["length"],
        "entropy": strength["entropy"],
        "strength": "weak" if breach["breached"] else strength["strength"],
        "score": 0 if breach["breached"] else strength["score"],
        "breached": breach["breached"],
        "count": breach.get("count", 0),
        "safety_percent": safety,
        "crack_time_display": strength["crack_time_display"],
        "warning": "This password has been found in a data breach!" if breach["breached"] else strength["warning"],
        "suggestions": strength["suggestions"],
    }
