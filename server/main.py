from pydantic import BaseModel
from fastapi import FastAPI

from fastapi.middleware.cors import CORSMiddleware

import secrets
from base64 import b64encode, b64decode

from Crypto.Cipher import AES
from Crypto.Util.Padding import pad, unpad

app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def encrypt(data: str) -> str:
    secret_key = b64decode("LefjQ2pEXmiy/nNZvEJ43i8hJuaAnzbA1Cbn1hOuAgA=")
    iv = "1020304050607080" 
    cipher = AES.new(secret_key, AES.MODE_CBC, iv.encode('utf-8'))
    padded_data = pad(data.encode('utf-8'), AES.block_size)
    encrypted_data = cipher.encrypt(padded_data)
    return b64encode(encrypted_data).decode('utf-8')

def decrypt(data: str) -> str:
    secret_key = "LefjQ2pEXmiy/nNZvEJ43i8hJuaAnzbA1Cbn1hOuAgA="
    iv = "1020304050607080"
    ciphertext = b64decode(data)
    derived_key = b64decode(secret_key)
    cipher = AES.new(derived_key, AES.MODE_CBC, iv.encode('utf-8'))
    decrypted_data = cipher.decrypt(ciphertext)
    return unpad(decrypted_data, 16).decode("utf-8")

class EncryptedPayload(BaseModel):
    encrypted_data: str

@app.post("/encrypted")
def receive_encrypted_payload(payload: EncryptedPayload):
    data = decrypt(payload.encrypted_data)
    return {"decrypted_data": data}

@app.get("/decrypted")
def send_encrypt():
    data = encrypt("sdgfsdfgdf")
    return {"encrypted_data": data}
