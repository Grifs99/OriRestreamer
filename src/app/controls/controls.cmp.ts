import { Component } from '@angular/core';
import { Information } from '../services/information';
import { environment } from '../../environments/environment';
import * as $ from 'jquery';
import * as moment from 'moment';
import io from 'socket.io-client';

@Component({
	templateUrl: './controls.html',
	styleUrls: ['./controls.css']
})
export class ControlsCMP {
	constructor() {}

	ngOnInit(){
		this.seed = this.urlSeed;
		this.socket.on('data', function(data: Information){
			if (data.seed !== this.seed)
				return;

				if (this.updating)
					return;

			this.vm = data;

		}.bind(this));
	}

	playersList: any;
	urlSeed: string = window.location.href.split('=')[1];
	timerStarted = false;
	timer1Paused = false;
	timer2Paused = false;
	hasPlayer1Finished = false;
	hasPlayer2Finished = false;

	canStartTimer: boolean = !this.timer1Paused && !this.timer2Paused && !this.timerStarted;

	t1P1_Time = '0:00:00';
	t1P2_Time = '0:00:00';
	t2P1_Time = '0:00:00';
	t2P2_Time = '0:00:00';

	socket: any = io.connect(environment.socketPath);

	p1StatsSelectionId = 0;
	p2StatsSelectionId = 0;

	player1Stats: any;
	player2Stats: any;

	p1StatsText: string;
	p2StatsText: string;

	setBackground(background: string) {
		this._vm.background = background;
	}

	updateInfo(){
		this.socket.emit('data', this.vm);
	}

	player1Winner() {
		this.vm.soloWinner = 1;
		this.socket.emit('data', this.vm);
	}

	player2Winner() {
		this.vm.soloWinner = 2;
		this.socket.emit('data', this.vm);
	}

	resetWinner() {
		this.vm.soloWinner = 0;
		this.vm.currentSeries = [{ winner: 0, name: 'Match 1'}, {winner: 0, name: 'Match 2'}, {winner: 0, name: 'Match 3'}];
		this.vm.player1_winCount = 0;
		this.vm.player2_winCount = 0;
		this.p1_wins = 0;
		this.p2_wins = 0;
		this.socket.emit('data', this.vm);
	}

	setP1Name(event: any){
		this._vm.player1Id = event;
	}

	setP2Name(event: any){
		this._vm.player1Id = event;
	}

	private _vm: Information = new Information();
	public get vm(): Information {
		return this._vm;
	}

	public set vm(info: Information) {
		this._vm = info;
	}

	public get hidePlayer1Timer(): boolean {
		return this._vm.player1_timerVisible;
	}

	public set hidePlayer1Timer(timerSelected: boolean) {
		this._vm.player1_timerVisible = timerSelected;
	}

	public get hidePlayer2Timer(): boolean {
		return this._vm.player2_timerVisible;
	}

	public set hidePlayer2Timer(timerSelected: boolean) {
		this._vm.player2_timerVisible = timerSelected;
	}

	public set matchType(matchType: string){
		this._vm.matchType = matchType;
	}

	public get matchType(): string {
		return this._vm.matchType;
	}

	public set commentators(commentators: string){
		this._vm.commentators = commentators;
	}

	public get commentators(): string {
		return this._vm.commentators;
	}

	public set zoomBracket(zoomBracket: boolean){
		this._vm.zoomBracket = zoomBracket;
	}

	public get zoomBracket(): boolean {
		return this._vm.zoomBracket;
	}

public get seed(): string {
	return this._vm.seed;
}

public set seed(seed: string){
	this._vm.seed = seed;
}

	public get p1_name(): string {
		return this.getPlayerById(this._vm.player1Id).name;
	}

	public get p2_name(): string {
		return this.getPlayerById(this._vm.player2Id).name;
	}

	public get p1_twitch(): number {
		return this._vm.player1Id;
	}

	public set p1_twitch(p1: number){
		this._vm.player1Id = p1;
	}

	public get p2_twitch(): number {
		return this._vm.player2Id;
	}

	public set p2_twitch(p2: number){
		this._vm.player2Id = p2;
	}
 
	public get p1_wins(): number {
		return this._vm.player1_winCount;
	}

	//Bug with angular that calls setters twice

	p1WinsSet: boolean = false;
	p2WinsSet: boolean = false;

	public set p1_wins(wins: number){
		if(wins === 0){
			this._vm.player1_winCount = 0;
			return;
		}

		if(!this.p1WinsSet){
			this.p1WinsSet = true;
			return;
		}
		else{
			for(let i = 0; i < this._vm.currentSeries.length; i++){
				if(this._vm.currentSeries[i].winner === 0){
					this._vm.currentSeries[i].winner = 1;
					console.log(this._vm.currentSeries);
					this._vm.player1_winCount = wins;
					this.p1WinsSet = false;
					return;
				}
			}
	
			this._vm.player1_winCount = wins;
		}
	}

	public get p2_wins(): number {
		return this._vm.player2_winCount;
	}

	public set p2_wins(wins: number){
		if(wins === 0){
			this._vm.player2_winCount = 0;
			return;
		}

		if(!this.p2WinsSet){
			this.p2WinsSet = true;
			return;
		}
		else{
			for(let i = 0; i < this._vm.currentSeries.length; i++){
				if(this._vm.currentSeries[i].winner === 0){
					this._vm.currentSeries[i].winner = 2;
					this._vm.player2_winCount = wins;
					this.p2WinsSet = false;
					return;
				}
			}
		}
	}

	public get bestOf(): number {
		return this._vm.bestOf;
	}

	public set tournament(tournament: number){
		this._vm.tournament = tournament;
	}

	public get tournament(): number {
		return this._vm.tournament;
	}
	
	public set bracket(bracket: string){
		this._vm.bracket = bracket;
	}

	public get bracket(): string {
		return this._vm.bracket;
	}

	public set bestOf(bestOf: number){
		this._vm.bestOf = bestOf;
	}

	public get p1_seed(): string {
		return this.getPlayerById(this._vm.player1Id).seed;
	}

	public get p2_seed(): string {
		return this.getPlayerById(this._vm.player2Id).seed;
	}

	public get randomizer(){
		return this._vm.randomizer;
	}

	public set randomizer(randomizer: boolean){
		this._vm.randomizer = randomizer;
	}

	public get p1_audio(): boolean {
		return this._vm.currentAudioOnPlayer == 1;
	}

	public set p1_audio(audioSelected: boolean) {
		this._vm.currentAudioOnPlayer = audioSelected ? 1 : this._vm.currentAudioOnPlayer;
	}

	public get p2_audio(): boolean {
		return this._vm.currentAudioOnPlayer == 2;
	}

	public set p2_audio(audioSelected: boolean) {
		this._vm.currentAudioOnPlayer = audioSelected ? 2 : this._vm.currentAudioOnPlayer;
	}

	getPlayerById(id: number) {
		return  jQuery.grep(this.vm.players, function(n: any, i) {
			return n.id == id;
		}.bind(this))[0];
	  }

	setP1Stats(){
		this.socket.emit('p1Stats', this._vm, this.p1StatsText);
	}

	setP2Stats() {
		this.socket.emit('p2Stats', this._vm, this.p2StatsText);
	}

	setBothStats(){
		this.setP1Stats();
		this.setP2Stats();
	}


	matchTypes = [{
		name: 'Best of 1',
		value: 1
	},
	{
		name: 'Best of 3',
		value: 3
	}];

	tournaments = [{
		name: 'All Skills',
		value: 1
	},
	{
		name: 'All Cells',
		value: 2
	}];

	brackets = [{
		value: 'Singles (Left)',
		name: 'Left'
	},
	{
		value: 'Singles (Right)',
		name: 'Right'
	},
	{
		value: 'Top 8',
		name: 'Top 8'
	}];

	stats = [{
		index: 0,
		name: 'Free Text',
		convertToPercentage: false
	}
];
}
