var tictac = new Vue({

	el: '#tictac',

	data: {
		players: ['X', 'O'],
		playerTurn: 0,
		playerControl: ['HUMAN', 'CPU'],
		winner: '',
		cpuWin: 0,
		humanWin: 0,
		draw: 0,
		board: [[{},{},{}],[{},{},{}],[{},{},{}]]
	},

	methods: {
        //Default Empty Board
		defaultBoard: function(){

            var emptyBoard = [[],[],[]];

            for(var row = 0; row < 3; row++){
                for(var col = 0; col < 3; col++){
                    this.$set(emptyBoard[row],col, {val: null,win: null});
                }
                
            }
            return emptyBoard;
        },

        //Initiates New Game by clearing the board
        newGame: function(){
            this.board = this.defaultBoard();
            this.winner = '';
            if(this.playerControl[this.playerTurn] == 'CPU'){
                this.mark(this.playGame());
            }
        },

        //Resets the whole game and scores
        resetGame: function(){
            this.board = this.defaultBoard();
            this.winner = '';
            this.playerTurn = 0;
            this.cpuWin = 0;
            this.humanWin = 0;
            this.draw = 0;
        },

        //Declares the game as a draw and increment draw score
        drawGame: function(){
            this.winner = 'Draw!';
            this.draw += 1;
        },

        //Update the score for winner and returns the winningset
        winGame: function(winningSet) {
            this.winner = 'Winner!'
            
            if (this.playerTurn == 1) {
                this.cpuWin += 1;
            }
            else {
                this.humanWin += 1;
            }
            winningSet.forEach(function(el){
                el.win = 'winner'
            });
        },
		mark: function(event){

			if(event == null){
                this.drawGame();
                return;
            }
            if (this.winner == '') {

            	var row = event.target.attributes['data-rowId'].value;
	            var col = event.target.attributes['data-colId'].value;

	            if(this.board[row][col].val == undefined || this.board[row][col].val == null) {

		            this.$set(this.board[row],col,{val: this.players[this.playerTurn]});

		            var boardStatus = this.scoreBoard();
					
					if (boardStatus.score == 10) {
					    this.winGame(boardStatus.winningSet);
					    return;
					}
					if(boardStatus.emptySpaces == 0){
                        this.drawGame();
                        return;
                    }

                    this.playerTurn = (this.playerTurn == 0) ? 1 : 0;

                    if(this.playerControl[this.playerTurn] == 'CPU'){
                        this.mark(this.playGame());
                    }
	            }
            }
        },

        scoreBoard: function(boardToScore, playerToScore){

            // Returns a score of 10 if the current player wins
            var score = 0;
            var sets = [];
            var winningSet = null;
            var player = playerToScore || this.players[this.playerTurn];
            var board = boardToScore || this.board;
            var emptySpaces = 9;
            
            // Looks for three in a row horizontally
            for(row = 0; row < 3; row++){
                var newSet = [];
                for(col = 0; col < 3; col++){
                    newSet.push(board[row][col]);
                }
                sets.push(newSet);
            }
            
            // Looks for three in a row vertically
            for(col = 0; col < 3; col++){
                var newSet = [];
                for(row = 0; row < 3; row++){
                    newSet.push(board[row][col]);
                }
                sets.push(newSet);
            }
            
            // Looks for three in a row diagonally
            var diagonalLeftToRight = [board[0][0], board[1][1], board[2][2]];
            var diagonalRightToLeft = [board[2][0], board[1][1], board[0][2]];

            sets.push(diagonalLeftToRight);
            sets.push(diagonalRightToLeft);

            sets.forEach(function(set){
                var consecutive = 0;
                set.forEach(function(item){
                    consecutive += ((item.val == player) ? 1 : 0);
                });
                if(consecutive == 3) { 
                    score = 10;
                    winningSet = set;
                }
            });
            //Counts remaining emptyspaces on the board
            for(row = 0; row < 3; row++) {
                for (column = 0; column < 3; column++) {
                    if(board[row][column].val != undefined && board[row][column].val != null){
                        emptySpaces--;
                    }
                }
            }
            
            return {score: score, winningSet: winningSet, emptySpaces: emptySpaces};
        },

        // Logic for CPU to play 
        playGame: function(){
            var player = this.players[this.playerTurn];
            var opponent = this.players[((this.playerTurn == 0) ? 1 : 0)];
            
            // Find any spots where CPU can win right now
            for(var row = 0; row < 3; row++){
                for(var column = 0; column < 3; column++){
                    var board = JSON.parse(JSON.stringify(this.board));
                    if(board[row][column].val == undefined || board[row][column].val == ''){
                        board[row][column] = {val: player};
                        var score = this.scoreBoard(board, player).score;
                        if(score == 10){ 
                             return {
                               target: {
                                   attributes: {
                                       'data-rowId': {value: row},
                                       'data-colId': {value: column}
                                   }
                               } 
                            };
                        }
                    }
                }
            }
            
            // Find any spots where CPU could lose right now
            for(var row = 0; row < 3; row++){
                for(var column = 0; column < 3; column++){
                    var board = JSON.parse(JSON.stringify(this.board));
                    if(board[row][column].val == undefined || board[row][column].val == null){
                        board[row][column] = {val: opponent};
                        var score = this.scoreBoard(board, opponent).score;
                        if(score == 10){
                            return {
                                target: {
                                    attributes: {
                                        'data-rowId': {value: row},
                                        'data-colId': {value: column}
                                    }
                                }
                            };
                        }
                    }
                }
            }
            
            // Just go to a random spot
            for(var row = 0; row < 3; row++){
                for(var column = 0; column < 3; column++){
                    var board = JSON.parse(JSON.stringify(this.board));
                    if(board[row][column].val == undefined || board[row][column].val == null){
                        return {
                            target: {
                                attributes: {
                                    'data-rowId': {value: row},
                                    'data-colId': {value: column}
                                }
                            }
                        };
                        
                    }
                }
            }
            
            return null;
        }
	}
})