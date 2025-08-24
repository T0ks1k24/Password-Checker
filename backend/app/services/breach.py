import requests
import hashlib
import logging

logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s"
)


def check_password(password: str) -> dict:
    sha1_hash = hashlib.sha1(password.encode("utf-8")).hexdigest().upper()
    prefix, suffix = sha1_hash[:5], sha1_hash[5:]

    logging.info("Checking password hash prefix: %s", prefix)

    url = f"https://api.pwnedpasswords.com/range/{prefix}"
    try:
        response = requests.get(url)
        response.raise_for_status()
    except requests.RequestException as e:
        logging.error("Error contacting HIBP API: %s", e)
        return {"breached": False, "count": 0}

    for line in response.text.splitlines():
        hash_suffix, count = line.split(":")
        if hash_suffix == suffix:
            logging.warning("Password found in breaches! Count: %s", count)
            return {"breached": True, "count": int(count)}

    logging.info("Password not found in breaches")
    return {"breached": False, "count": 0}
