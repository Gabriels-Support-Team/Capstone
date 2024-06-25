import numpy as np

# Example ratings matrix
ratings = np.array([
    [5, 4, 0, 1],
    [4, 0, 4, 1],
    [1, 2, 3, 5],
    [1, 0, 4, 4],
    [0, 1, 5, 4],
])

U, S, Vt = np.linalg.svd(ratings, full_matrices=False)

print("U (User features):")
print(U)
print("\nS (Singular values):")
print(S)
print("\nVt (Movie features):")
print(Vt)