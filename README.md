# NumberClassifier
PyTorch NumberClassifier with web app interface.  User inputs drawn number, the drawing is then classified 0-9.  The model output classifications are then displayed on a graph.  Each drawing is represented as a 28 x 28 grid. The neural network is made up of 2 fully connected layers using the rectified linear unit activation function. The output layer is 10 softmax values representing the targets 0-9. The model was built with PyTorch and trained on over 60,00 examples from the MNIST dataset.


#### Install:
```bash
git clone https://github.com/nealmick/numberclassifier
cd numberclassifier
pip install -r requirements.txt
python3 manage.py runserver
```
