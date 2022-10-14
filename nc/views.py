
import numpy as np
import torch
import torchvision
import torch.nn as nn
import torch.nn.functional as F
import torch.optim as optim
import matplotlib.pyplot as plt
import random
from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
x = 28
y = 28
n_epochs = 1
batch_size_train = 64
batch_size_test = 1000
learning_rate = 0.01
momentum = 0.5
log_interval = 10

random_seed = 1
torch.backends.cudnn.enabled = False
torch.manual_seed(random_seed)

test_loader = torch.utils.data.DataLoader(
  torchvision.datasets.MNIST('files', train=False, download=False,
                             transform=torchvision.transforms.Compose([
                               torchvision.transforms.ToTensor(),
                               torchvision.transforms.Normalize(
                                 (0.1307,), (0.3081,))
                             ])),
  batch_size=batch_size_test, shuffle=True)


class Net(nn.Module):
    def __init__(self):
        super(Net, self).__init__()
        self.conv1 = nn.Conv2d(1, 10, kernel_size=5)
        self.conv2 = nn.Conv2d(10, 20, kernel_size=5)
        self.conv2_drop = nn.Dropout2d()
        self.fc1 = nn.Linear(320, 50)
        self.fc2 = nn.Linear(50, 10)

    def forward(self, x):
        x = F.relu(F.max_pool2d(self.conv1(x), 2))
        x = F.relu(F.max_pool2d(self.conv2_drop(self.conv2(x)), 2))
        x = x.view(-1, 320)
        x = F.relu(self.fc1(x))
        x = F.dropout(x, training=self.training)
        x = self.fc2(x)
        return F.log_softmax(x)
network = Net()
network.eval()



def index(request):
    context = {}
    return render(request, 'nc/index.html',context)
def getNumber(request):
    url = request.build_absolute_uri()
    url = url.split('asdf=')[1]
    url = url.split('-')
    url.pop(-1)
    grid = makeGrid()
    grid = updateGrid(grid,url)
    printGrid(grid)


    network.load_state_dict(torch.load('results/model.pth'))

    #test(grid)
    p = nc(grid)
    

    return JsonResponse({'asdf': p[0],'fdsa' : p[1]})




def nc(grid):
    correct = 0
    output = None
    data = None
    cnt = 0
    p = None
    with torch.no_grad():
        for data, target in test_loader:
            #if cnt ==1:
                #break
            cnt+=1
            output = network(convertData(data,grid))###
            
    res = []
    for foo in range(len(target)):
        if foo == 1:
            break
        printGrid2(data[0][0])
        print('output: ',int(output.max(1, keepdim=True)[1][foo]))
        for asdf in range(len(output[0])):
            res.append(round(float(output[0][asdf]),4))

            print(asdf,'-' ,round(float(output[0][asdf]),4))
        p = int(output.max(1, keepdim=True)[1][foo])
        #print('output: ',int(output.max(1, keepdim=True)[1][foo]),'target:', int(target[foo]))
    return [p,res]
def convertData(data,grid):
    #print('testing')
    #printGrid2(data[0][0])

    x=28
    y=28
    for foo in range(0,x,1):
        for oof in range(0,y,1):
            data[0][0][foo][oof] = int(grid[foo][oof])
    #printGrid2(data[0][0])

    return data
def test(grid):
    network.eval()
    test_loss = 0
    correct = 0
    output = None
    data = None
    target= None
    with torch.no_grad():
        for data, target in test_loader:


            output = network(data)
            test_loss += F.nll_loss(output, target, size_average=False).item()
            pred = output.data.max(1, keepdim=True)[1]
            correct += pred.eq(target.data.view_as(pred)).sum()

    

    test_loss /= len(test_loader.dataset)

    print('\nTest set: Avg. loss: {:.4f}, Accuracy: {}/{} ({:.0f}%)\n'.format(
        test_loss, correct, len(test_loader.dataset),
        100. * correct / len(test_loader.dataset)))

    for foo in range(len(target)):
        if foo == 5:
            break

        print(data[foo][0][0][0])

        #torch.tensor(np.array())
        printGrid2(data[foo][0])
        print('output: ',int(output.max(1, keepdim=True)[1][foo]),'target:', int(target[foo]))



def updateGrid(grid,url):
    l = np.array(url)
    grid = l.reshape(28,28).tolist()
    return grid

def makeGrid():
    grid = []
    for foo in range(0,x,1):
        grid.append([])
        for oof in range(0,y,1):
            grid[foo].append([])
            grid[foo][oof]='0'
    return grid

def printGrid(grid):
    for foo in range(0,x,1):
        line = ''
        for oof in range(0,y,1):
            line+=grid[foo][oof]
        print(line)
def printGrid2(grid):
    x=28
    y=28
    for foo in range(0,x,1):
        line = ''
        for oof in range(0,y,1):
            line+=str(int(grid[foo][oof]))
        print(line)