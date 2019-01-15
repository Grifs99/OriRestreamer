import { Tracker } from './tracker';

export class Information {
    seed: string = null;

    player1: string = 'Vulajin';
    player2: string = 'Vulajin';
    player1_twitch: string = 'Vulajin';
    player2_twitch: string = 'Vulajin';
    player1_seed: string = null;
    player2_seed: string = null;
    player1_timerVisible: boolean = false;
    player2_timerVisible: boolean = false;
    player1_finishTime: string = '0:00:00';
    player2_finishTime: string = '0:00:00';
    player1_stats: number = 0;
    player2_stats: number = 0;
    currentAudioOnPlayer: number = 1;
    commentators: string = '';
    background: string = 'iceless';
    groupName: string = 'Round of 32/Round of 16/Quarterfinal/Semifinal/Final';
	matchType: string = this.groupName;
    zoomBracket: boolean = false;
    bestOf: number = 3;
	tournament: number = 1;
	bracket: string = "Singles (Left)";
    randomizer: boolean = false;
    player1_winCount: number = 0;
	player2_winCount: number = 0;

	soloWinner: number = 0;

	currentSeries: Array<any> = [{ winner: 0, name: 'Match 1'}, {winner: 0, name: 'Match 2'}, {winner: 0, name: 'Match 3'}];

    players: Array<any> = [
		{
			'id': 1,
			'name': 'Vulajin',
			'preferredName': 'Vulajin',
			'allSkills': true,
			'allCells': false,
			'seed': null
		}
      ];
}