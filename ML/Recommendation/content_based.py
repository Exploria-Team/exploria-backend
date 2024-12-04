import numpy as np
import tensorflow as tf
from sklearn.preprocessing import StandardScaler
import joblib
from ML.Recommendation.TF_Object.tf_object import L2NormalizeLayer  

class ContentBased:
    def __init__(self):
        # Initialize and load data, scaler, and model
        self.tourism_data_vecs = np.load('ML/Recommendation/Vector/tourism_vector.npy')

        self.user_scaler = joblib.load('ML/Scaler/user_scaler.gz')
        self.tourism_scaler = joblib.load('ML/Scaler/tourism_scaler.gz')
        self.target_scaler = joblib.load('ML/Scaler/target_scaler.gz')

        self.model = tf.keras.models.load_model('ML/Model/content_based.h5', custom_objects={
            'L2NormalizeLayer': L2NormalizeLayer
        })

    def make_recommendations(self, user_category_averages):
        """Make and sort predictions for a user."""
        # Prepare User Data
        current_user_data = user_category_averages
        current_user_vecs = np.tile(current_user_data, (self.tourism_data_vecs.shape[0], 1))
        scaled_current_user_vecs = self.user_scaler.transform(current_user_vecs)

        # Prepare Tourism Data
        scaled_tourism_vecs = self.tourism_scaler.transform(self.tourism_data_vecs)

        # Make prediction
        y_pred = self.model.predict([scaled_current_user_vecs, scaled_tourism_vecs])
        y_pred = self.target_scaler.inverse_transform(y_pred)

        # Sort the prediction results
        sorted_index = np.argsort(-y_pred, axis=0).reshape(-1)
        sorted_y_pred = y_pred[sorted_index].reshape(-1)

        # Take the top 5 predictions
        top_5_index = sorted_index[:5]
        top_5_predictions = sorted_y_pred[:5]

        # Create a dictionary with index as key and prediction as value
        prediction_list = [{"destination_id": int(idx), "prediction": float(pred)} for idx, pred in zip(top_5_index, top_5_predictions)]

        return prediction_list