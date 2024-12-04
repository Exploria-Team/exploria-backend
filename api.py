from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import numpy as np
from ML.Recommendation.content_based import ContentBased
from ML.Recommendation.collaborative_filtering import CollaborativeFiltering
from ML.Recommendation.hybrid_recommendation import HybridRecommendation
import keras
import joblib
import tensorflow as tf

# Initialize FastAPI app
app = FastAPI()

# Request models
class ContentBasedRecommendationRequest(BaseModel):
    user_category_averages: list

class CollaborativeRecommendationRequest(BaseModel):
    user_id: int

class NormalHybridRecommendationRequest(BaseModel):
    user_id: int
    user_category_averages: list

class DistanceHybridRecommendationRequest(BaseModel):
    user_id: int
    user_category_averages: list
    dest_id: int

# Initialize the recommendation class
content_based = ContentBased()
collaborative_filtering = CollaborativeFiltering()
# Initiate HybridRecommendation instance
hybrid_recom = HybridRecommendation()

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
    
@app.post("/recommendation/normal-hybrid")
def get_normal_hybrid_recommendations(request: NormalHybridRecommendationRequest):
    """Get normal hybrid recommendations for a user."""
    try:
        #### NORMAL HYBRID RECOMMENDATION
        # Prepare user data
        user_id = request.user_id
        current_user_data = request.user_category_averages

        # Get (normal) hybrid recommendation for that user
        recommended_id = hybrid_recom.get_recommendation(
            user_id,
            current_user_data,
        )
        result = hybrid_recom.tourism_df.loc[hybrid_recom.tourism_df['Place_Id'].isin(recommended_id)].set_index('Place_Id').reindex(recommended_id).reset_index()

        # Displays recommended results from highest to lowest (free to take as much tourism data as you want)
        return {"recommendations": list(result['Place_Id'])[:5]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/recommendation/distance-hybrid")
def get_normal_hybrid_recommendations(request: DistanceHybridRecommendationRequest):
    """Get normal hybrid recommendations for a user."""
    try:
        #### NORMAL HYBRID RECOMMENDATION
        # Prepare user data
        user_id = request.user_id
        chosen_spot_id = request.dest_id
        current_user_data = request.user_category_averages
        choosen_spot_distance_df = hybrid_recom.distance_df.loc[hybrid_recom.distance_df['Place_Id_Source'] == chosen_spot_id]

        # Get (normal) hybrid recommendation for that user
        recommended_id = hybrid_recom.get_recommendation(
            user_id,
            current_user_data,
            chosen_spot_id,
            choosen_spot_distance_df
        )
        result = hybrid_recom.tourism_df.loc[hybrid_recom.tourism_df['Place_Id'].isin(recommended_id)].set_index('Place_Id').reindex(recommended_id).reset_index()

        # Displays recommended results from highest to lowest (free to take as much tourism data as you want)
        return {"recommendations": list(result['Place_Id'])[:5]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))