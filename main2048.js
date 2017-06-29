var board=new Array();
var score=0;
var hasConflicted=new Array();

var startx=0;
var starty=0;
var endx=0;
var endy=0;


$(document).ready(function(){
	prepareForMobile();
	newgame();
});

function prepareForMobile(){

	if(documentWidth>500){//控制网页端的显示大小
		gridContainerWidth=500;
		cellSpace=20;
		cellSideLength=100;
	}

	$("#grid-container").css("width",gridContainerWidth-2*cellSpace);
	$("#grid-container").css("height",gridContainerWidth-2*cellSpace);
	$("#grid-container").css("padding",cellSpace);
	$("#grid-container").css("border-radius",0.02*gridContainerWidth);

	$(".grid-cell").css("width",cellSideLength);
	$(".grid-cell").css("height",cellSideLength);
	$(".grid-cell").css("border-radius",0.02*cellSideLength);
}

function newgame(){
	//初始化棋盘格
	init();
	//在随机两个格子生成数字
	generateOneNumber();//随机找一个格子生成数字，调用两次
	generateOneNumber();
}

function init(){
	for(var i=0;i<4;i++)
		for(var j=0;j<4;j++){
			var gridCell=$('#grid-cell-'+i+"-"+j);
			gridCell.css('top',getPosTop(i,j));
			gridCell.css('left',getPosLeft(i,j));
		}

	for(var i=0;i<4;i++){
		board[i]=new Array();//将每一个子元素定义成数组，这样构成二维数组
		hasConflicted[i]=new Array();//像board一样变成二维数组
		for(var j=0;j<4;j++)
			board[i][j]=0;//在游戏刚开始的时候初始化每一个board的值
			hasConflicted[i][j]=false;
	}
	updateBoardView();
	score=0;
}

function updateBoardView(){//通知前端，对grid-cell里的元素进行显示上的设定
	$(".number-cell").remove();//如果当前元素里有了number-cell
	//设定双重循环来遍历数组，设定board的值
	for(var i=0;i<4;i++)
		for(var j=0;j<4;j++){
			$("#grid-container").append('<div class="number-cell" id="number-cell-'+i+'-'+j+'"></div>')//首先对每一个board元素生成一个number-cell
			var theNumberCell=$("#number-cell-"+i+"-"+j);

			if(board[i][j]==0){
				theNumberCell.css("width","0px");//不显示
				theNumberCell.css("height","0px");
				theNumberCell.css("top",getPosTop(i,j)+cellSideLength/2);//位置居中
				theNumberCell.css("left",getPosLeft(i,j)+cellSideLength/2);
			}
			else{
				theNumberCell.css("width",cellSideLength);//显示
				theNumberCell.css("height",cellSideLength);
				theNumberCell.css("top",getPosTop(i,j));//位置居中
				theNumberCell.css("left",getPosLeft(i,j));
				theNumberCell.css("background-color",getNumberBackgroundColor(board[i][j]));//背景色也不同
				theNumberCell.css("color",getNumberColor(board[i][j]));//获取到前景色
				theNumberCell.text(board[i][j]);//显示它的值
			}
			hasConflicted[i][j]=false;
		}
		$(".number-cell").css("line-height",cellSideLength+"px");
		$(".number-cell").css("font-size",0.6*cellSideLength+"px");
}

function generateOneNumber(){
	if(nospace(board))
		return false;//如果当前没有空格，则不能生成新数字

	//随机生成一个位置
	var randx=parseInt(Math.floor(Math.random()*4));
	var randy=parseInt(Math.floor(Math.random()*4));
	
	var times=0;

	while(times<50){
		if(board[randx][randy]==0)
			break;
		randx=parseInt(Math.floor(Math.random()*4));
		randy=parseInt(Math.floor(Math.random()*4));

		times++;
	}
	//经过50次循环，人工生成一个位置
	if(times==50){
		for(var i=0;i<4;i++)
			for(var j=0;j<4;j++){
				if(board[i][j]==0){
					randx=i;
					randy=j;//人工找到一个空的位置
				}
			}

	}
	//随机一个数字
	var randNumber=Math.random()<0.5?2:4;//判断与0.5的关系

	//在位置上把数字显示出来
	board[randx][randy]=randNumber;
	showNumberWithAnimation(randx,randy,randNumber);

	return true;
}

$(document).keydown(function(event){
	event.preventDefault();//阻挡按键的默认效果
	switch(event.keyCode){
		case 37://left
			if(moveLeft()){
				setTimeout("generateOneNumber()",210);
				setTimeout("isgameover()",300);
			}
			break;

		case 38://up
			if(moveUp()){
				setTimeout("generateOneNumber()",210);
				setTimeout("isgameover()",300);
			}
			break;

		case 39://right
			if(moveRight()){
				setTimeout("generateOneNumber()",210);
				setTimeout("isgameover()",300);
			}
			break;

		case 40://down
			if(moveDown()){
				setTimeout("generateOneNumber()",210);
				setTimeout("isgameover()",300);
			}
			break;

		default://default
			break;
	}
})

document.addEventListener("touchstart",function(event){
	startx=event.touches[0].pageX;
	starty=event.touches[0].pageY;
})

document.addEventListener("touchmove",function(event){
	event.preventDefault();
})

document.addEventListener("touchend",function(event){
	endx=event.changedTouches[0].pageX;
	endy=event.changedTouches[0].pageY;

	var deltax=endx-startx;
	var deltay=endy-starty;

	//不认为这是用户的滑动操作
	if(Math.abs(deltax)<0.3*documentWidth&&Math.abs(deltay)<0.3*documentWidth)
		return;


	//x,Math.abs()取绝对值
	if(Math.abs(deltax)>=Math.abs(deltay)){
		if(deltax>0){
			//moveRight
			if(moveRight()){
				setTimeout("generateOneNumber()",210);
				setTimeout("isgameover()",300);
			}
		}
		else{
			//moveLeft
			if(moveLeft()){
				setTimeout("generateOneNumber()",210);
				setTimeout("isgameover()",300);
			}
		}
	}

	//y
	else{
		if(deltay>0){
			//moveDown
			if(moveDown()){
				setTimeout("generateOneNumber()",210);
				setTimeout("isgameover()",300);
			}
		}
		else{
			//moveUp
			if(moveUp()){
				setTimeout("generateOneNumber()",210);
				setTimeout("isgameover()",300);
			}
		}

	}
})

function isgameover(){
	if(nospace(board)&&nomove(board)){
	gameover();
	}
}

function gameover(){
	alert('gameover!');
}

function moveLeft(){
	if(!canMoveLeft(board))//不可移动
		return false;

	//moveLeft
	for(var i=0;i<4;i++)
		for(var j=1;j<4;j++){//遍历十二个元素
			if(board[i][j]!=0){

				for(var k=0;k<j;k++){

					if(board[i][k]==0&&noBlockHorizontal(i,k,j,board)){//第一种情况，k位置为空
						//move
						showMoveAnimation(i,j,i,k);//从ij移动到ik
						board[i][k]=board[i][j];
						board[i][j]=0;
						continue;
					}
					else if(board[i][k]==board[i][j]&&noBlockHorizontal(i,k,j,board)&&!hasConflicted[i][k]){//在ik这个位置没有发生过碰撞，第二种情况，相同叠加
						//move
						showMoveAnimation(i,j,i,k);
						//add
						board[i][k]+=board[i][j];
						board[i][j]=0;
						//add score
						score+=board[i][k];
						updateScore(score);

						hasConflicted[i][k]=true;
						continue;
					}
				}
			}
		}
	setTimeout("updateBoardView()",200);
	return true;
}

function moveRight(){//从board[i][j]移动到board[i][k]
	if(!canMoveRight(board))
		return false;

	for(var i=0;i<4;i++)
		for(var j=2;j>=0;j--){
			if(board[i][j]!=0){

				for(var k=3;k>0;k--){
					if(board[i][k]==0&&noBlockHorizontal(i,k,j,board)){
						showMoveAnimation(i,j,i,k);
						board[i][k]=board[i][j];
						board[i][j]=0;
						continue;
					}
					else if(board[i][k]==board[i][j]&&noBlockHorizontal(i,k,j,board)&&!hasConflicted[i][k]){
						showMoveAnimation(i,j,i,k);
						board[i][k]+=board[i][j];
						board[i][j]=0;
						//add score
						score+=board[i][k];
						updateScore(score);

						hasConflicted[i][k]=true;
						continue;
					}
				}
			}
		}
	setTimeout("updateBoardView()",200);
	return true;
}

function moveUp(){//从board[i][j]移动到board[k][j]
	if(!canMoveUp(board))
		return false;

	for(var j=0;j<4;j++)
		for(var i=1;i<=3;i++){
			if(board[i][j]!=0){
				for(var k=0;k<i;k++){
					if (board[k][j]==0&&noBlockVertical(i,j,k,board)) {
						showMoveAnimation(i,j,k,j);
						board[k][j]=board[i][j];
						board[i][j]=0;

						continue;
					}

					else if(board[k][j]==board[i][j]&&noBlockVertical(i,j,k,board)&&!hasConflicted[k][j]){
						 showMoveAnimation(i,j,k,j);
						 board[k][j]+=board[i][j];
						 board[i][j]=0;
						 //add score
						 score+=board[k][j];
						 updateScore(score);

						 hasConflicted[k][j]=true;
						 continue;
					}
				}
			}
		}
	setTimeout("updateBoardView()",200);
	return true;
}

function moveDown(){
	if(!canMoveDown(board))
		return false;

	for(var j=0;j<4;j++)
		for(var i=2;i>=0;i--){
			if(board[i][j]!=0){
				for(var k=3;k>i;k--){
					if(board[k][j]==0&&noBlockVertical(j,i,k,board)){
						showMoveAnimation(i,j,k,j);
						board[k][j]=board[i][j];
						board[i][j]=0;
						continue;
					}

					else if(board[k][j]==board[i][j]&&noBlockVertical(j,i,k,board)&&!hasConflicted[k][j]){
						showMoveAnimation(i,j,k,j);
						board[k][j]+=board[i][j];
						board[i][j]=0;
						//add score
						score+=board[k][j];
						updateScore(score);

						hasConflicted[k][j]=true;
						continue;
					}
				}
			}
		}
	setTimeout("updateBoardView()",200);
	return true;
}

