from math import sqrt
from typing import Sequence

def cosine_similarity(a: Sequence[float], b: Sequence[float]) -> float:
    """Calculate the cosine similarity between two vectors."""
    dot_product = sum(x * y for x, y in zip(a, b))
    norm_a = sqrt(sum(x ** 2 for x in a))
    norm_b = sqrt(sum(y ** 2 for y in b))
    if norm_a == 0 or norm_b == 0: # avoid division by zero
        return 0.0
    return dot_product / (norm_a * norm_b)