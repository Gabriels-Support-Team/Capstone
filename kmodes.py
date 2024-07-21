import numpy as np
import pandas as pd
import random
import seaborn as sns
import matplotlib.pyplot as plt

file_path = './ml-1m/users.dat'
columns = ['UserID', 'Gender', 'Age', 'Occupation', 'Zip-code']
users = pd.read_csv(file_path, sep='::', engine='python', names=columns, dtype={'UserID': str})

users = users[['Gender', 'Age', 'Occupation']]
users['Gender'] = users['Gender'].astype('category').cat.codes


def matching_dissimilarity(data_point, mode):
    return sum(data_point != mode)

def assign_clusters(data, modes):
    clusters = []
    for point in data:
        dissimilarities = []
        for mode in modes:
            dissimilarity = matching_dissimilarity(point, mode)
            dissimilarities.append(dissimilarity)
        closest_cluster = np.argmin(dissimilarities)
        clusters.append(closest_cluster)
    return clusters

def update_modes(data, clusters, k):
    new_modes = []
    for i in range(k):
        cluster_points = data[clusters == i]
        if len(cluster_points) == 0:
            new_modes.append(data[random.randint(0, len(data) - 1)])
        else:
            mode = []
            for j in range(cluster_points.shape[1]):
                feature_values = cluster_points[:, j]
                value_counts = np.bincount(feature_values)
                category_mode = value_counts.argmax()
                mode.append(category_mode)
            new_modes.append(np.array(mode))
    return new_modes

def k_modes(data, k, max_iters=100):
    initial_indices = np.random.choice(np.arange(len(data)), k, replace=False)
    modes = data[initial_indices]

    for iteration in range(max_iters):
        clusters = assign_clusters(data, modes)
        new_modes = update_modes(data, clusters, k)

        if np.array_equal(modes, new_modes):
            break
        modes = new_modes

    return clusters, modes



