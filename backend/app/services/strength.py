import re
import math
from .breach import check_password


def password_strength(password: str) -> dict:
    breach_info = check_password(password)
    if breach_info.get("breached"):
        return {
            "length": len(password),
            "entropy": 5.0,
            "strength": "weak",
            "safety_percent": 0,
        }

    length = len(password)
    lower = bool(re.search(r"[a-z]", password))
    upper = bool(re.search(r"[A-Z]", password))
    digits = bool(re.search(r"\d", password))
    symbols = bool(re.search(r"[!@#$%^&*(),.?\":{}|<>]", password))

    charset_size = 0
    if lower:
        charset_size += 26
    if upper:
        charset_size += 26
    if digits:
        charset_size += 10
    if symbols:
        charset_size += 32

    entropy = length * math.log2(charset_size) if charset_size else 0

    safety_percent = min(round(entropy * 1.5), 100)

    strength = "weak" if entropy < 40 else "medium" if entropy < 60 else "strong"

    return {
        "length": length,
        "entropy": round(entropy, 2),
        "strength": strength,
        "safety_percent": safety_percent,
    }
