from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from ML.Recommendation.hybrid_recommendation import HybridRecommendation

# Initialize FastAPI app
app = FastAPI()

# Request models
class NormalHybridRecommendationRequest(BaseModel):
    user_id: int
    user_category_averages: list

class DistanceHybridRecommendationRequest(BaseModel):
    user_id: int
    user_category_averages: list
    dest_id: int

# Initialize the recommendation class
hybrid_recom = HybridRecommendation()

    
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
        return {"recommendations": list(result['Place_Id'])}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/recommendation/distance-hybrid")
def get_distance_hybrid_recommendations(request: DistanceHybridRecommendationRequest):
    """Get distance hybrid recommendations for a user."""
    try:
        #### distance HYBRID RECOMMENDATION
        # Prepare user data
        user_id = request.user_id
        chosen_spot_id = request.dest_id
        current_user_data = request.user_category_averages
        choosen_spot_distance_df = hybrid_recom.distance_df.loc[hybrid_recom.distance_df['Place_Id_Source'] == chosen_spot_id]

        # Get (distance) hybrid recommendation for that user
        recommended_id = hybrid_recom.get_recommendation(
            user_id,
            current_user_data,
            chosen_spot_id,
            choosen_spot_distance_df
        )
        result = hybrid_recom.tourism_df.loc[hybrid_recom.tourism_df['Place_Id'].isin(recommended_id)].set_index('Place_Id').reindex(recommended_id).reset_index()

        # Displays recommended results from highest to lowest (free to take as much tourism data as you want)
        return {"recommendations": list(result['Place_Id'])}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))