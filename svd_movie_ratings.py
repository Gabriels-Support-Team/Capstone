from collections import defaultdict

from surprise import Dataset, SVD
import os
import csv
from surprise import BaselineOnly, Dataset, Reader
from surprise.model_selection import cross_validate
import pandas as pd
import sys
import json
def main():
    def determine_age_group(age):
        if age < 18:
            return 1
        elif age >= 18 and age <= 24:
            return 18
        elif age >= 25 and age <= 34:
            return 25
        elif age >= 35 and age <= 44:
            return 35
        elif age >= 45 and age <= 49:
            return 45
        elif age >= 50 and age <= 55:
            return 50
        else:
            return 56
        
    def get_user_ids_in_same_age_group(users_file_path, target_age_group):
        users_df = pd.read_csv(users_file_path, sep='::', engine='python', names=['userID', 'gender', 'age', 'occupation', 'Zip'], header=None)
        # find all users that are in the target age group
        matching_users = users_df[users_df['age'] == target_age_group]
        # create and return a set of target user IDs 
        user_ids = set(matching_users['userID'])
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


    if len(sys.argv) < 2:
        print("No UserID", file=sys.stderr)
        sys.exit(2)
    ratings_file_path = '/Users/gabrielalvarado/meta/Capstone/Capstone/ml-1m/ratings.dat'
    users_file_path = '/Users/gabrielalvarado/meta/Capstone/Capstone/ml-1m/users.dat'
     
    user_id = sys.argv[1]
    user_age = sys.argv[2]
    age_group = determine_age_group(int(user_age))
    input_data = sys.stdin.read()
    new_ratings = json.loads(input_data)
    age_bucket_users = get_user_ids_in_same_age_group(users_file_path, age_group)
    filtered_ratings = filter_ratings_by_user_ids(ratings_file_path, age_bucket_users)
    complete_data = merge_ratings(filtered_ratings, new_ratings)
    recs = run_ml(complete_data, user_id)



if __name__ == "__main__":
    main()
