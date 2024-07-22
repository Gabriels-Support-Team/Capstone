import numpy as np
import pandas as pd
from sklearn.metrics import silhouette_score

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



#PREPROCESSING
df = pd.read_csv('./ml-1m/users.dat', sep='::', engine='python', names=['UserID', 'Gender', 'Age', 'Occupation', 'Zip-code'])
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
# Now 'data' is ready for use in clustering algorithms



# RUNNING THE MODEL
k = 20  # number of clusters
centroids, assignments = k_means(data, k)
df['Cluster'] = assignments
df['UserID'] = user_ids





