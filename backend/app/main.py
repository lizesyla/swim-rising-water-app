from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import os
from app.solver import solve_swim_in_water

app = FastAPI(title="Swim in Rising Water API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# allowed_origins = [
#     origin.strip()
#     for origin in os.getenv("ALLOWED_ORIGINS", "http://localhost:5173").split(",")
#     if origin.strip()
# ]

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=allowed_origins,
#     allow_credentials=False,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

class GridModel(BaseModel):
    grid: List[List[int]]

@app.get("/")
def read_root():
    return {"message": "Serveri është online!"}

@app.post("/api/solve")
def solve_grid(data: GridModel):
    result = solve_swim_in_water(data.grid)
    return result
