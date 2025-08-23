# Predicting SNARE proteins based on deep learning models
>Update time: 2025-08-23

This project aims to predict SNARE proteins using deep learning models. We collected 3,406 protein sequences (697 SNARE, 2,709 non-SNARE). After removing redundant sequences with BLAST (30% similarity threshold), we applied multiple feature extraction methods including AAC, DPC, PSSM, and one-hot encoding. Several classifiers (k-NN, SVM, CNN, and MCNN) were implemented and evaluated. Results show that CNN and MCNN achieved the best performance in terms of accuracy and F1-score. A web demo is also provided for user-friendly prediction.

---

## Environment
![Python Badge](https://img.shields.io/badge/Python-3.9.21-blue)

---

## Method
### Dataset
- Total sequences: 3,406
    - SNARE: 697
    - Non-SNARE: 2,709
- Training / Validation split: 80% / 20%

Source: [SNARE-MCNN dataset](https://github.com/khanhlee/snare-mcnn/tree/main/data/fasta)


### Feature Extraction
- AAC (Amino Acid Composition, 20D)
- DPC (Dipeptide Composition, 400D)
- PSSM (Position-Specific Scoring Matrix, 60D, window size = 13)
- Binary Matrix (One-hot encoding)


### Models and Classifiers
- k-Nearest Neighbors (k-NN)
- Support Vector Machine (SVM)
- Convolutional Neural Network (CNN)
- MCNN

---

## Results
CNN and MCNN consistently outperformed k-NN and SVM, achieving higher accuracy and F1-scores, while ROC curve analysis further confirmed the robustness of their predictive performance.
