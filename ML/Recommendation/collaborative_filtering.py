import numpy as np
import tensorflow as tf
from ML.Recommendation.TF_Object.tf_object import CollaborativeFilteringLayer, CollaborativeFilteringModel

class CollaborativeFiltering:
    def __init__(self):
        # Y_mean for denormalizing prediction results
        self.Y_mean = np.load('ML/Recommendation/Vector/Y_mean.npy')

        # Load the neural network model
        self.model = tf.keras.models.load_model('ML/Model/collaborative_filtering.h5', custom_objects={
            'CollaborativeFilteringModel': CollaborativeFilteringModel,
            'CollaborativeFilteringLayer': CollaborativeFilteringLayer
        })

    def make_recommendations(self, user_id):
        """Make and sort predictions for a given user."""
        # Prepare user ID as a TensorFlow constant
        user_id = tf.constant(user_id, dtype=tf.int32)

        # Make predictions
        my_pred = self.model(user_id)

        # Convert to numpy and restore the mean
        my_pred = my_pred.numpy() + self.Y_mean

        # Sort the predictions
        sorted_index = np.argsort(-my_pred, axis=0).reshape(-1)
        sorted_my_pred = my_pred[sorted_index].reshape(-1)

        # Take the top 5 predictions
        top_5_index = sorted_index[:5]
        top_5_predictions = sorted_my_pred[:5]

        # Create a list of dictionaries with index as key and prediction as value
        prediction_list = [{"destination_id": int(idx), "prediction": float(pred)} for idx, pred in zip(top_5_index, top_5_predictions)]

        return prediction_list