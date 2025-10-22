from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class Req(BaseModel):
    skill: str
    level: str

@app.post("/generate_projects")
def generate(r: Req):
    def card(i):
        return {
            "title": f"{r.skill} mini {i}",
            "learning_goals": [r.skill],
            "steps": ["read doc", "build demo", "write README"],
            "acceptance": ["demo runs", "readme present"],
            "est_minutes": 60,
            "tags": [r.skill.lower(), r.level.lower()]
        }
    return {"skill": r.skill, "level": r.level, "projects": [card(1), card(2), card(3)]}
