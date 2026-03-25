from zxcvbn import zxcvbn

def password_strength(password: str) -> dict:
    results = zxcvbn(password)
    
    score = results.get("score", 0)
    entropy = results.get("guesses_log10", 0) * 3.3219  # convert log10 guesses to entropy bits roughly
    
    length = len(password)
    crack_time_display = results.get("crack_times_display", {}).get("offline_slow_hashing_1e4_per_second", "instant")
    
    feedback = results.get("feedback", {})
    warning = feedback.get("warning", "")
    suggestions = feedback.get("suggestions", [])

    # Map score (0-4) to strength string
    if score < 2:
        strength = "weak"
    elif score == 2:
        strength = "medium"
    else:
        strength = "strong"

    # Map score to a base safety percent, then adjust slightly with entropy for smoother progress bar
    # Score 0 = 0-20%, Score 1 = 20-40%, Score 2 = 40-60%, Score 3 = 60-80%, Score 4 = 80-100%
    base_percent = score * 20
    bonus = min(20, (entropy / 100) * 20) if score < 4 else min(20, (entropy / 150) * 20)
    safety_percent = min(100, int(base_percent + bonus))

    if not password:
        safety_percent = 0
        entropy = 0

    return {
        "length": length,
        "entropy": round(entropy, 2),
        "strength": strength,
        "score": score,
        "crack_time_display": crack_time_display,
        "warning": warning,
        "suggestions": suggestions,
        "safety_percent": safety_percent,
    }
