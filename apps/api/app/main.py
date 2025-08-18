from typing import List
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from app.core.scoring import cosine_similarity

# start API
app = FastAPI(title="Music Akinator API", version="0.1.0")

# middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)
# ---- schemas ----
class AxisVector(BaseModel):
    warm_bright: float = Field(..., ge=-1, le=1)
    lofi_polished: float = Field(..., ge=-1, le=1)
    acoustic_electronic: float = Field(..., ge=-1, le=1)
    intimate_anthemic: float = Field(..., ge=-1, le=1)

class RecRequest(BaseModel):
    user_axes: AxisVector
    limit: int = 5

class Track(BaseModel):
    id: str
    title: str
    artist: str
    axes: AxisVector
    score: float = Field(..., ge=-1, le=1)

class RecResponse(BaseModel):
    results: List[Track]

# ---- Helpers ----
def _vec(ax: AxisVector) -> List[float]:
    """Convert AxisVector to a list of floats."""
    return [ax.warm_bright, ax.lofi_polished, ax.acoustic_electronic, ax.intimate_anthemic]

# ---- Routes ----

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/recommendations", response_model=RecResponse)
def recommendations(req: RecRequest) -> RecResponse:
    # temp data
    demo = [
        Track(
            id="t1",
            title="Sunset Echoes",
            artist="Luma",
            axes=AxisVector(warm_bright=0.2, lofi_polished=-0.1, acoustic_electronic=0.3, intimate_anthemic=-0.2),
            score=0.72,
        ),
        Track(
            id="t2",
            title="City Bloom",
            artist="Kayu",
            axes=AxisVector(warm_bright=-0.3, lofi_polished=0.4, acoustic_electronic=-0.2, intimate_anthemic=0.1),
            score=0.61,
        ),
        Track(
            id="t3",
            title="Neon Dawn",
            artist="Aria",
            axes=AxisVector(warm_bright=0.5, lofi_polished=0.2, acoustic_electronic=0.6, intimate_anthemic=0.3),
            score=0.55,
        ),
    ]
    scored = [
        t.model_copy(update={"score": cosine_similarity(_vec(req.user_axes), _vec(t.axes))})
        for t in demo
    ]
    scored.sort(key=lambda x: x.score, reverse=True)
    return RecResponse(results=scored[: req.limit])