from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import numpy as np
from ML.Recommendation.content_based import ContentBased
from ML.Recommendation.collaborative_filtering import CollaborativeFiltering

# Initialize FastAPI app
app = FastAPI()

# Request models
class ContentBasedRecommendationRequest(BaseModel):
    user_category_averages: list

class CollaborativeRecommendationRequest(BaseModel):
    user_id: int

# Initialize the recommendation class
content_based = ContentBased()
collaborative_filtering = CollaborativeFiltering()

@app.post("/recommendation/content-based")
def get_content_based_recommendations(request: ContentBasedRecommendationRequest):
    """Get content-based recommendations for a user."""
    try:
        recommendations = content_based.make_recommendations(request.user_category_averages)
        return {"recommendations": recommendations}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/recommendation/collaborative")
def get_collaborative_recommendations(request: CollaborativeRecommendationRequest):
    """Get collaborative filtering recommendations for a user."""
    try:
        recommendations = collaborative_filtering.make_recommendations(request.user_id)
        return {"recommendations": recommendations}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
