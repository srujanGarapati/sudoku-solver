let array;
document.getElementById("solve").addEventListener('click',function(e){
array = getInput();
//  array = [[5,3,0,0,7,0,0,0,0],
//           [6,0,0,1,9,5,0,0,0],
//           [0,9,8,0,0,0,0,6,0],
//           [8,0,0,0,6,0,0,0,3],
//           [4,0,0,8,0,3,0,0,1],
//           [7,0,0,0,2,0,0,0,6],
//           [0,6,0,0,0,0,2,8,0],
//           [0,0,0,4,1,9,0,0,5],
//           [0,0,0,0,8,0,0,7,9]]
//  array =    [[8,0,0,0,0,0,0,0,0],
//              [0,0,3,6,0,0,0,0,0],
//              [0,7,0,0,9,0,2,0,0],
//              [0,5,0,0,0,7,0,0,0],
//              [0,0,0,0,4,5,7,0,0],
//              [0,0,0,1,0,0,0,3,0],
//              [0,0,1,0,0,0,0,6,8],
//              [0,0,8,5,0,0,0,1,0],
//              [0,9,0,0,0,0,4,0,0]]
let reg = /^([0-9,]{161})$/
if(reg.exec(array.join(","))&&solve(array)){
  // console.log(array)
  giveOutput(array);
}else{
  alert("The given Sudoku puzzel is wrong please check");
}
e.preventDefault();
});
// var array = [[5,4,0,0,2,0,8,0,6],
//              [0,1,9,0,0,7,0,0,3],
//              [0,0,0,3,0,0,2,1,0],
//              [9,0,0,4,0,5,0,2,0],
//              [0,0,1,0,0,0,6,0,4],
//              [6,0,4,0,3,2,0,8,0],
//              [0,6,0,0,0,0,1,9,0],
//              [4,0,2,0,0,9,0,0,5],
//              [0,9,0,0,7,0,4,0,2]]

//This will solve the sudoku puzzel and return the solved array
function solve(array){

//This is column wise created array
let array1 = new Array(9)
for(let i=0;i<9;i++){
  array1[i] = new Array(9)
  for(let j=0;j<9;j++){
    array1[i][j] = array[j][i]
    if(array[i][j]!==0){
      //This will check for dupicate elements in any row of sudoku
      if(array[i].filter(ele=>ele===array[i][j]).length >1){
        return false
      }
    }
  }
}

//This is block wise(ie each 3*3 array is taken as one row) array created
let array2 = new Array(9)
for(i=0;i<9;i++){
  array2[i] = new Array()
}
for(i=0;i<9;i++){
  for(j=0;j<9;j++){
    let index = Math.floor(i/3)*3+Math.floor(j/3);
    array2[index].push(array[i][j]);
  }
}



// This will fill what are the possible single values in to the puzzel
let prevArray = array.join(",");
let bool = true;
do{
  possArray = new Array();
  for(i=0;i<9;i++){
    possArray[i] = new Set();
    for(j=0;j<9;j++){
      // possArray[i][j] = new Array();
       if(array[i][j]==0){
         let possiblity
        let ind=0
        
        for(let num=1;num<=9;num++){
          if(!array[i].includes(num)&&!array1[j].includes(num)&&!array2[Math.floor(i/3)*3+Math.floor(j/3)].includes(num)){
            possiblity=num;
            ind++;
            if(ind==2)
              break;  
          }
        }
        if(ind==1){
          array[i][j]=possiblity;
          array1[j][i]=possiblity;
           array2[Math.floor(i/3)*3+Math.floor(j/3)].push(possiblity);
        }
      }
    }
  }
  if(prevArray === array.join(",")){
    bool = false
  }
  prevArray = array.join(",");
  var count=0
  for(i=0;i<9;i++){
    if(!array[i].includes(0)){
      count++;
    }
  }
}while(count!=9&&bool);
return solveSudokuBackTracking(array,array1,array2,9)
}



//This will take input form front end
function getInput(){
let elements=document.getElementsByTagName("tr");
let sudoLength = 9;
let elementsArray = Array.from( elements )
elementsArray.forEach(function(element, index){
   array = new Array(sudoLength);
   let a=1;
   let b =0;
   while(a<=sudoLength){
     array[b]=new Array(sudoLength);
     let rowElements=document.getElementsByName("cell"+a);

     let rowElementsArray=Array.from( rowElements)
     rowElementsArray.forEach(function(element1, index1){
     array[b][index1] = Number(element1.firstElementChild.value)
     });
   a++;
	 b++;
   }
 });
return array;
}


//This will give output to front end
function giveOutput(solvedArray){
let count=0;
let rowElements=document.getElementsByTagName("td");
let rowElementsArray=Array.from( rowElements) 
  for(let i=0;i<9;i++){
    for(let j=0;j<9;j++){
      rowElementsArray[count].firstElementChild.value= solvedArray[i][j]
      count++;
    }
  }
}

//This will solve the remaining sudoku puzzel with back tracking
function solveSudokuBackTracking(array,array1,array2,n){
  let completed = true,a;
  for(a = 0; a<n ; a++){
    if(array[a].includes(0)){
      completed = false;
      break;
    }
  }
  if(completed){
    return completed;
  }
  let b= array[a].indexOf(0);
  for(let    digit = 1;digit<=n;digit++){
    if(!array[a].includes(digit)&&!array1[b].includes(digit)&&!array2[Math.floor(a/3)*3+Math.floor(b/3)].includes(digit)){
      // console.log(a,b)
      array[a][b]=digit;
      array1[b][a] = digit;
      array2[Math.floor(a/3)*3+Math.floor(b/3)].push(digit)
      if(solveSudokuBackTracking(array,array1,array2,n)){
        return true
      }else{
        array[a][b]=0;
        array1[b][a] = 0;
        array2[Math.floor(a/3)*3+Math.floor(b/3)].pop();
      }
    }
  }
  return false;
}