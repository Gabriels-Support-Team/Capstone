from collections import defaultdict

from surprise import Dataset, SVD
import os
import csv
from surprise import BaselineOnly, Dataset, Reader
from surprise.model_selection import cross_validate
import pandas as pd
import sys
import json
import numpy as np
import pandas as pd
from sklearn.metrics import silhouette_score


def main():
    def init_centroids(data, k):
        # first step: randomly pick first centroid from the data points
        centroids = [data[np.random.randint(data.shape[0])]]
        for new_centroid in range(1, k):
            points_min_distance_from_centroid = []
            for point in data:
                # Calculate distance from this data point to each centroid
                # keep minimum distance stored
                min_distance = np.inf
                for cent in centroids:
                    #squaring distance increases probabiity that further point will be chosen
                    distance = np.linalg.norm(point - cent) ** 2
                    if distance < min_distance:
                        min_distance = distance
                points_min_distance_from_centroid.append(min_distance)
            
            points_min_distance_from_centroid = np.array(points_min_distance_from_centroid)
            # select next centroid with probability proportional to the square of the distance
            probs = points_min_distance_from_centroid / points_min_distance_from_centroid.sum()
            #this creates boundaries for each point
            cumulative_probs = probs.cumsum()
            random_centroid_picker = np.random.rand()
            for data_index, probability in enumerate(cumulative_probs):
                #if the random number falls within the bucket choose that point as the next centroid
                if random_centroid_picker < probability:
                    centroids.append(data[data_index])
                    break
        return np.array(centroids)

    def assign_clusters(data, centroids):
        #first expand the centroids array to prepare for broadcasting
        expanded_centroids = centroids[:, np.newaxis]
        # calculate the difference between each data point and each centroid
        # shape: (k, # samples, #features)
        differences = data - expanded_centroids
        # square the differences
        # This operation is performed element-wise, so the resulting array shape remains (k, #samples, #features)
        squared_differences = differences ** 2
        # sum the squared differences across the features (columns)
        # This results in a (k, #samples) array where each element is the squared euclidean distance
        # from a data point to a centroid
        squared_distances = squared_differences.sum(axis=2)

        # compute the square root of the squared distances
        # array shape is still (k, n_samples)
        distances = np.sqrt(squared_distances)
        # find the index of the centroid with the minimum distance for each data point
        # np.argmin(distances, axis=0) finds the index of the minimum distance along axis 0 (centroids)
        # result is a (# samples) array where each element is the index of the nearest centroid for that sample
        cluster_assignments = np.argmin(distances, axis=0)
        return cluster_assignments
    def update_centroids(data, assignments, k):
        new_centroids = []
        for i in range(k):
            #collect all data points assigned to cluster i
            cluster_points = data[assignments == i]
            # find the mean of all these data points
            centroid = cluster_points.mean(axis=0)
            # we update centriods to the mean of the new cluster so that we can rerun the assignments
            new_centroids.append(centroid)
        return np.array(new_centroids)
    def k_means(data, k, max_iterations=100):
        """The K-means algorithm."""
        centroids = init_centroids(data, k)
        for _ in range(max_iterations):
            assignments = assign_clusters(data, centroids)
            new_centroids = update_centroids(data, assignments, k)
            if np.all(centroids == new_centroids):
                break
            centroids = new_centroids
        return centroids, assignments

    
    def get_user_ids_in_same_cluster(df, target_cluster):
        matching_users = df[df['Cluster'] == target_cluster]
        user_ids = set(matching_users['UserID'])
        return user_ids
    
    def filter_ratings_by_user_ids(ratings_file_path, user_ids):
        ratings_df = pd.read_csv(ratings_file_path, sep='::', engine='python', names=['userID', 'itemID', 'rating', 'timestamp'], header=None)
        # Filter ratings data to only be ratings attached to users who are in age group
        filtered_ratings = ratings_df[ratings_df['userID'].isin(user_ids)]
        return filtered_ratings
    
    
    def merge_ratings(filtered_ratings, new_ratings):
        #Add logged in Users' ratings to the static ratings dataset
        new_ratings_df = pd.DataFrame(new_ratings)
        filtered_ratings = filtered_ratings._append(new_ratings_df, ignore_index=True)
        return filtered_ratings


    def get_top_n(predictions, n=10):
        """Return the top-N recommendation for each user from a set of predictions.

        Args:
            predictions(list of Prediction objects): The list of predictions, as
                returned by the test method of an algorithm.
            n(int): The number of recommendation to output for each user. Default
                is 10.

        Returns:
        A dict where keys are user (raw) ids and values are lists of tuples:
            [(raw item id, rating estimation), ...] of size n.
        """

        # First map the predictions to each user.
        top_n = defaultdict(list)
        for uid, iid, true_r, est, _ in predictions:
            top_n[uid].append((iid, est))

        # Then sort the predictions for each user and retrieve the k highest ones.
        for uid, user_ratings in top_n.items():
            user_ratings.sort(key=lambda x: x[1], reverse=True)
            top_n[uid] = user_ratings[:n]

        return top_n

    def run_ml(df,user_id):
        # As we're loading a custom dataset, we need to define a reader. In the
        # movielens-100k dataset, each line has the following format:
        # 'user item rating timestamp', separated by '\t' characters.
        
        reader = Reader(line_format="user item rating timestamp", sep="::")
        data = Dataset.load_from_df(df[['userID', 'itemID', 'rating']], reader)

        # We can now use this dataset as we please, e.g. calling cross_validate
        trainset = data.build_full_trainset()
        algo = SVD()
        algo.fit(trainset)

        # Then predict ratings for all pairs (u, i) that are NOT in the training set.
        testset = trainset.build_anti_testset()
        predictions = algo.test(testset)

        top_n = get_top_n(predictions, n=10)
        result = [{'itemID': item[0], 'rating': item[1]} for item in top_n[user_id]]

        if(user_id in top_n):
            result = [{'itemID': item[0], 'rating': item[1]} for item in top_n[user_id]]
            print(json.dumps(result))


    ratings_file_path = '/Users/gabrielalvarado/meta/Capstone/Capstone/ml-1m/ratings.dat'
    users_file_path = '/Users/gabrielalvarado/meta/Capstone/Capstone/ml-1m/users.dat'
    input_data = sys.stdin.read()
    data = json.loads(input_data)
    new_ratings = data['ratings']
    new_user = data['userDetails']
    #PREPROCESSING
    df = pd.read_csv(users_file_path, sep='::', engine='python', names=['UserID', 'Gender', 'Age', 'Occupation', 'Zip-code'])
    new_user_df = pd.DataFrame([{
    'UserID': new_user['id'],
    'Gender': new_user['gender'],
    'Age': new_user['age'],
    'Occupation': new_user['occupation'],
    'Zip-code': None  
}])
    df=df._append(new_user_df, ignore_index=True)
    user_ids = df['UserID']
    df = df.drop(['UserID', 'Zip-code'], axis=1)

    # age standardized 
    age_mean = df['Age'].mean()
    age_std = df['Age'].std()
    df['Age'] = (df['Age'] - age_mean) / age_std

    #  one-hot encode 'Gender' and 'Occupation'
    gender_dummies = pd.get_dummies(df['Gender'], prefix='Gender')
    df = pd.concat([df, gender_dummies], axis=1)
    df.drop('Gender', axis=1, inplace=True)

    occupation_dummies = pd.get_dummies(df['Occupation'], prefix='Occupation')
    df = pd.concat([df, occupation_dummies], axis=1)
    df.drop('Occupation', axis=1, inplace=True)
    for column in gender_dummies.columns.tolist() + occupation_dummies.columns.tolist():
        df[column] = df[column].astype(int)
    # ensure 'age' remains as float to preserve the standardization
    df['Age'] = df['Age'].astype(float)

    data = df.values

    # RUNNING THE MODEL
    k = 20  # number of clusters
    centroids, assignments = k_means(data, k)
    df['Cluster'] = assignments
    df['UserID'] = user_ids
   
    user_id = sys.argv[1]
    target_cluster = df.loc[df['UserID'] == user_id, 'Cluster'].iloc[0]


    cluster_users = get_user_ids_in_same_cluster(df, target_cluster)
    filtered_ratings = filter_ratings_by_user_ids(ratings_file_path, cluster_users)
    complete_data = merge_ratings(filtered_ratings, new_ratings)
    recs = run_ml(complete_data, user_id)



if __name__ == "__main__":
    main()
