documentWidth=window.screen.availWidth;//当前屏幕设备中可以使用的宽度
gridContainerWidth=0.92*documentWidth;//棋盘格的宽度
cellSideLength=0.18*documentWidth;//每个小方格的宽度
cellSpace=0.04*documentWidth;//两个小方格之间的距离

function getPosTop( i , j ){
    return cellSpace + i*(cellSpace+cellSideLength);
}

function getPosLeft( i , j ){
    return cellSpace + j*(cellSpace+cellSideLength);
}

function getNumberBackgroundColor(number){
	switch(number){
		case 2:return "#eee4da";break;
		case 4:return "#ede0c8";break;
		case 8:return "#f2b179";break;
		case 16:return "#f59563";break;
		case 32:return "#f67c5f";break;
		case 64:return "#f65e3b";break;
		case 128:return "#edcf72";break;
		case 256:return "#edcc61";break;
		case 512:return "#9c0";break;
		case 1024:return "#33b5e5";break;
		case 2048:return "#09c";break;
	}
	return "black";
}

function getNumberColor(number){
	if(number<=4)
		return "#776e65";
	else
		return "white";
}

//判断有没有空格
function nospace(board){
	for(var i=0;i<4;i++)
		for(var j=0;j<4;j++)
			if(board[i][j]==0)
				return false;
	return true;//是 没有空间
}

function canMoveLeft(board){
	for(var i=0;i<4;i++)
		for(var j=1;j<4;j++)//第0列不需要判断
			if (board[i][j]!=0) //即内有数字的情况
				if(board[i][j-1]==0||board[i][j-1]==board[i][j])//左边有空格或者左右数字相等可以合并
					return true;
	return false;//遍历所有元素，都没有找到的话

}

function canMoveRight(board){
	for(var i=0;i<4;i++)
		for(var j=2;j>=0;j--)
			if(board[i][j]!=0)
				if(board[i][j+1]==0||board[i][j+1]==board[i][j])
					return true;
	return false;
}

function canMoveDown(board){
	for(var j=0;j<4;j++)
		for(var i=2;i>=0;i--)
			if(board[i][j]!=0)
				if(board[i+1][j]==0||board[i+1][j]==board[i][j])
					return true;
	return false;
}

function canMoveUp(board) {
	for(var j=0;j<4;j++)
		for(var i=1;i<=3;i++)
			if(board[i][j]!=0)
				if(board[i-1][j]==0||board[i-1][j]==board[i][j])
					return true;
	return false;
}

function noBlockHorizontal(row,col1,col2,board){
	for(var i=col1+1;i<col2;i++)
		if(board[row][i]!=0)//一旦存在一个不等于0的元素，则存在障碍物
			return false;
	return true;
}

function noBlockVertical(col,row1,row2,board) {
	for(var i=row1+1;i<row2;i++)
		if(board[i][col]!=0)
			return false;
	return true;
}

function nomove(board){
	if(canMoveLeft(board)||canMoveRight(board)||canMoveUp(board)||canMoveDown(board))
		return false;
	return true;
}

function updateScore(score){
	$('#score').text(score);
}