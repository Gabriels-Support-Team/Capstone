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
    def merge_ratings(new_ratings):

        file_path = '../ml-1m/ratings.dat'
        df = pd.read_csv(file_path, sep='::', engine='python', names=['userID', 'itemID', 'rating', 'timestamp'], header=None)
        new_ratings_df = pd.DataFrame(new_ratings)
        df = df._append(new_ratings_df, ignore_index=True)
        return df



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
            if (uid == 'rOoKKGzDFxa2Av7KogZVszUTJuI3'):
                top_n[uid].append((iid, est))

        # Then sort the predictions for each user and retrieve the k highest ones.
        for uid, user_ratings in top_n.items():
            user_ratings.sort(key=lambda x: x[1], reverse=True)
            top_n[uid] = user_ratings[:n]

        return top_n


    # First train an SVD algorithm on the movielens dataset.

    def run_ml(df):
        # path to dataset file
        file_path = os.path.expanduser("./ml-1m/ratings.dat")

        # As we're loading a custom dataset, we need to define a reader. In the
        # movielens-100k dataset, each line has the following format:
        # 'user item rating timestamp', separated by '\t' characters.
        reader = Reader(line_format="user item rating timestamp", sep="::")

        data = Dataset.load_from_df(df[['userID', 'itemID', 'rating']], reader)

        # We can now use this dataset as we please, e.g. calling cross_validate
        trainset = data.build_full_trainset()
        algo = SVD()
        algo.fit(trainset)

        # Than predict ratings for all pairs (u, i) that are NOT in the training set.
        testset = trainset.build_anti_testset()
        predictions = algo.test(testset)

        top_n = get_top_n(predictions, n=10)
        return(top_n)

    # Read the data from stdin

    input_data = sys.stdin.read()
    new_ratings = json.loads(input_data)
    # Process the data

    complete_data = merge_ratings(new_ratings)
    recs = run_ml(complete_data)




if __name__ == "__main__":
    main()
