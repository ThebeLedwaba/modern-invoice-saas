import requests
import sys

BASE_URL = "http://localhost:8000/api/auth"

def test_auth():
    # 1. Register
    username = "script_user_13" 
    email = "script_user_13@example.com"
    password = "password123"
    
    print(f"Registering {username}...")
    try:
        resp = requests.post(f"{BASE_URL}/register", json={
            "username": username,
            "email": email,
            "password": password,
            "full_name": "Script User"
        })
        if resp.status_code == 201:
            print("Registration success.")
        elif resp.status_code == 400 and "already exists" in resp.text:
            print("User already exists, proceeding to login.")
        else:
            print(f"Registration failed: {resp.status_code} {resp.text}")
            return
    except Exception as e:
        print(f"Registration connection failed: {e}")
        return

    # 2. Login
    print("Logging in...")
    try:
        resp = requests.post(f"{BASE_URL}/login", data={
            "username": username,
            "password": password
        })
        if resp.status_code != 200:
            print(f"Login failed: {resp.status_code} {resp.text}")
            return
        
        data = resp.json()
        token = data["access_token"]
        print("Login success, token received.")
    except Exception as e:
        print(f"Login connection failed: {e}")
        return

    # 3. Get Me
    print("Getting /me info...")
    try:
        resp = requests.get(f"{BASE_URL}/me", headers={
            "Authorization": f"Bearer {token}"
        })
        if resp.status_code == 200:
            print("Get Me success! User:", resp.json())
        else:
             print(f"Get Me failed: {resp.status_code} {resp.text}")
    except Exception as e:
        print(f"Get Me connection failed: {e}")

if __name__ == "__main__":
    test_auth()
