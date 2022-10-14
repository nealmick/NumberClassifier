d = document.getElementById("table")
var mouseDown = false;
var lastClicked;
var lastClickedX;
var lastClickedY;
var isOnDiv = false;
var g = [];
var x = 28
var y = 28
var number = "0";
let res = [1,1,1,1,1,1,1,1,1,1]
g = makeGrid(g)
$(d).mouseenter(function(){isOnDiv=true;});
$(d).mouseleave(function(){isOnDiv=false;});
 //document.getElementById("res").innerText = aStr
 const labels = [
    '0',
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
  ];
const data = {
labels: labels,
datasets: [{
    label: 'output: ',
    data: res,
    backgroundColor: [
    'rgba(255, 99, 132, 0.2)',
    'rgba(255, 159, 64, 0.2)',
    'rgba(255, 205, 86, 0.2)',
    'rgba(75, 192, 192, 0.2)',
    'rgba(54, 162, 235, 0.2)',
    'rgba(153, 102, 255, 0.2)',
    'rgba(201, 203, 207, 0.2)',
    'rgba(201, 203, 207, 0.2)',
    'rgba(201, 203, 207, 0.2)',
    'rgba(201, 203, 207, 0.2)'
    ],
    borderColor: [
    'rgb(255, 99, 132)',
    'rgb(255, 159, 64)',
    'rgb(255, 205, 86)',
    'rgb(75, 192, 192)',
    'rgb(54, 162, 235)',
    'rgb(153, 102, 255)',
    'rgb(201, 203, 207)',
    'rgb(201, 203, 207)',
    'rgb(201, 203, 207)',
    'rgb(201, 203, 207)'
    ],
    borderWidth: 1
}]
};
const config = {
    type: 'bar',
    data: data,
    options: {
        plugins: {
            legend: {
              display: false
            }
          },
        scales: {
            x: {
              title: {
                display: true,
                text: 'Number'
              }
            },
            y: {
              title: {
                display: true,
                text: 'Value'
              },
              min: 10,
              max: -10,
              ticks: {
                suggestedMin: -10,    // minimum will be 0, unless there is a lower value.
                // OR //
                //beginAtZero: true   // minimum value will be 0.
                steps: 20,
                stepValue: 1,
                }

            }
        }
    },
  };

const myChart = new Chart(document.getElementById('myChart'),config);


document.body.onmousedown = function() { 
    mouseDown = true;
    if (isOnDiv){
        if (lastClicked){
            lastClicked.className='clicked';
            updateGrid(lastClickedX+7,lastClickedY+7)
        } 

    }
}
document.body.onmouseup = function() {
    mouseDown = false;
}


var grid = clickableGrid(x/2,y/2,function(el,row,col,i){
    //console.log("x:",col);
    //console.log("y:",row);


    if (mouseDown == true){
        el.className='clicked';
        updateGrid(col+7,row+7)
        //printGrid()
    }
    //if (lastClicked) lastClicked.className='';
    lastClicked = el;
    lastClickedX = col;
    lastClickedY = row;
});



d.appendChild(grid);
     
function clickableGrid( rows, cols, callback ){
    var i=0;
    var grid = document.createElement('table');
    grid.className = 'grid';
    for (var r=0;r<rows;++r){
        var tr = grid.appendChild(document.createElement('tr'));
        for (var c=0;c<cols;++c){
            var cell = tr.appendChild(document.createElement('td'));
            //cell.innerHTML = ++i;
            
            cell.addEventListener('mouseover',(function(el,r,c,i){
                return function(){
                    callback(el,r,c,i);
                }
            
            })(cell,r,c,i),false);

        }
    }
    return grid;
}


function updateGrid(foo,oof){
    a = '2'
    b = '1'
    g[oof][foo]=a

    if(g[oof+1][foo]!=2){
        g[oof+1][foo]=b
    }
    if(g[oof-1][foo]!=2){
        g[oof-1][foo]=b
    }
    if(g[oof][foo+1]!=2){
        g[oof][foo+1]=b
    }
    if(g[oof][foo-1]!=2){
        g[oof][foo-1]=b
    }
    /*
    
    
    
    g[oof+1][foo+1]=b
    g[oof][foo+1]=b
    g[oof-1][foo+1]=b
    
    g[oof+1][foo]=b


    g[oof-1][foo+0]=b

    g[oof+1][foo-1]=b
    g[oof][foo-1]=b
    g[oof-1][foo-1]=b
    */
    
    return g
}


function printGrid(){
    header = '-------------------------'

    console.log(header)

    for(foo=0;foo<x;foo+=1){
        let line = ''
        for(oof=0;oof<y;oof+=1){
            line+=String(g[foo][oof])
        }
        
        console.log(foo+1,line)
    }
}
function makeGrid(grid){
    grid = []
    for(foo=0;foo<x;foo+=1){
        grid.push([])
        for(oof=0;oof<y;oof+=1){
            grid[foo].push([])
            grid[foo][oof]='0'
        }
    }
    return grid
}

function restart(){
    location.reload();
  
  }

function prepareSend(g){
    let s = "";
    printGrid()
    for(foo=0;foo<x;foo+=1){
        for(oof=0;oof<y;oof+=1){
            s+=g[foo][oof]+'-';
        }
    }

    return s

}


function getNumber(number,res,myChart){
    state=2
    $.ajax(
        {
            type:"GET",
            url: "/nc/nc/",
            
            dataType: 'json',
            data:{
            asdf: prepareSend(g),
            },
            success: function(asdf) {
            number = asdf.asdf
            res = asdf.fdsa
            document.getElementById("num").innerText = 'Number is: '+number
            let aStr = ''
            for(i = 0; i<res.length;i+=1){
                
                res[i] = (res[i] + 3)*2
                if(res[i]<0 && res[i]>-.5){
                    res[i]-=.5
                }
                if(res[i]>0 && res[i]<.5){
                    res[i]+=.5
                }
                myChart.data.datasets[0].data[i]= res[i];
                myChart.update();

            }
           
            



        }
        })

        return number

}










