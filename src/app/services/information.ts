export class Information {
    seed: string = null;

    player1Id: number = 4;
    player2Id: number = 5;
    player3Id: number = 5;
    player4Id: number = 4;
    player1_timerVisible: boolean = false;
    player2_timerVisible: boolean = false;
    player1_finishTime: string = '0:00:00';
    player2_finishTime: string = '0:00:00';
    player1_stats: number = 0;
    player2_stats: number = 0;
    currentAudioOnPlayer: number = 1;
    commentators: string = 'ComentatorOne, ComentatorTwo';
    background: string = 'SwampAfterCleanWater';
	groupName: string = 'Qualifier/Quarterfinal/Semifinal/Grand Final';
	matchType: string = this.groupName;
    zoomBracket: boolean = false;
    bestOf: number = 1;
	tournament: number = 2;
	bracket: string = "Top 8";
    randomizer: boolean = false;
    player1_winCount: number = 0;
	player2_winCount: number = 0;

	soloWinner: number = 0;

	currentSeries: Array<any> = [];

    players: Array<any> = [
        {
			'id': 4,
			'name': 'Grifs99',
			'preferredName': 'Grifs99',
			'pronoun': 'He/Him',
			'seed': '',
			'statsStartColumn': 'B7',
			'statsEndColumn': 'K7'
		},
		{
			'id': 5,
			'name': 'Frigs',
			'pronoun': 'He/Him',
			'preferredName': 'Frigs',
			'seed': '',
			'statsStartColumn': 'B9',
			'statsEndColumn': 'K9'
		}
      ];
}