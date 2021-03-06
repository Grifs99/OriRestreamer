import { Component, Input, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Information } from '../services/information';
import { environment } from '../../environments/environment';
import io from 'socket.io-client';
import * as $ from 'jquery';
import { Socket } from 'net';
import { read } from 'fs';
import { Chart } from 'chart.js';

@Component({
  templateUrl: './stats.html',
  styleUrls: ['./stats.css']
})

export class StatsCMP {
	constructor() { }

	ngOnInit(){
		this.socket.on('data', function(data: Information) {
			if(data.seed !== this.seed)
				return;

			var runner1 = jQuery.grep(this.players, function(n: any, i) {
				return n.name == data.player1_twitch;
			})[0];

			var runner2 = jQuery.grep(this.players, function(n: any, i) {
				return n.name == data.player2_twitch;
			})[0];

			$.ajax({
				url: "https://sheets.googleapis.com/v4/spreadsheets/1ZNRh0DrZsY1YMd1EIiEOwmdk-3uGxmTNgX7qamzeozw/values/Stream Stats!" + runner1.startColumn + ":"+ runner1.endColumn +"?key=AIzaSyDoT4WSyHDf4a1D0qc6lhdySl92d0tXVG0",
				dataType: "json",
				error: function(response) {
					console.log(response);
				},
				success: function( response: any ) {
					this.player1 = response.values[0];

					$.ajax({
						url: "https://sheets.googleapis.com/v4/spreadsheets/1ZNRh0DrZsY1YMd1EIiEOwmdk-3uGxmTNgX7qamzeozw/values/Stats Summary!" + runner1.statsStartColumn + ":"+ runner1.statsEndColumn +"?key=AIzaSyDoT4WSyHDf4a1D0qc6lhdySl92d0tXVG0",
						dataType: "json",
						error: function(response) {
							console.log(response);
						},
						success: function( response: any ) {
							console.log(response.values[0]);
							this.player1.stats = response.values[0];
						}.bind(this)
					});
				}.bind(this)
			});

			$.ajax({
				url: "https://sheets.googleapis.com/v4/spreadsheets/1ZNRh0DrZsY1YMd1EIiEOwmdk-3uGxmTNgX7qamzeozw/values/Stream Stats!" + runner2.startColumn + ":"+ runner2.endColumn +"?key=AIzaSyDoT4WSyHDf4a1D0qc6lhdySl92d0tXVG0",
				dataType: "json",
				error: function(response) {
					console.log(response);
				},
				success: function( response: any ) {
					this.player2 = response.values[0];

					$.ajax({
						url: "https://sheets.googleapis.com/v4/spreadsheets/1ZNRh0DrZsY1YMd1EIiEOwmdk-3uGxmTNgX7qamzeozw/values/Stats Summary!" + runner2.statsStartColumn + ":"+ runner2.statsEndColumn +"?key=AIzaSyDoT4WSyHDf4a1D0qc6lhdySl92d0tXVG0",
						dataType: "json",
						error: function(response) {
							console.log(response);
						},
						success: function( response: any ) {
							this.player2.stats = response.values[0];
						}.bind(this)
					});

					$.ajax({
						url: "https://sheets.googleapis.com/v4/spreadsheets/1ZNRh0DrZsY1YMd1EIiEOwmdk-3uGxmTNgX7qamzeozw/values/Radar!A3:F4?key=AIzaSyDoT4WSyHDf4a1D0qc6lhdySl92d0tXVG0",
						dataType: "json",
						error: function(response) {
						console.log(response);
						},
						success: function( response: any ) {
							this.player1.name = response.values[0][0];
							this.player2.name = response.values[1][0];
							let canvas = document.getElementById("statChart").getContext("2d");

							var chart = new Chart(canvas, {
								type: 'radar',
								data: {
									labels: ["Mid", "Late", "Consistency", "Tricks", "Early"],
									datasets: [{
										label: response.values[0][0],
										data: [response.values[0][1], response.values[0][2], response.values[0][3], response.values[0][4], response.values[0][5]],
										backgroundColor: 'rgba(255, 145, 0, 0)',
										borderColor: 'rgba(255, 145, 0, 1)',
										fillColor: 'rgba(255, 145, 0, 1)',
										borderWidth: 4,
										lineTension: 0.2,
									},
									{
										label: response.values[1][0],
										data: [response.values[1][1], response.values[1][2], response.values[1][3], response.values[1][4], response.values[1][5]],
										backgroundColor: 'rgba(70, 206, 247, 0)',
										borderColor: 'rgba(70, 206, 247, 1)',
										fillColor: 'rgba(70, 206, 247, 1)',
										borderWidth: 4,
										lineTension: 0.2
									}]
								},
								pointDot: false,
								options: {
									responsive: false,
									maintainAspectRatio: true,
									scale: {
										ticks: {
											beginAtZero: true,
											max: 1,
											display: false
										},
										pointLabels: {
											fontSize: 20,
											fontColor: 'rgba(255,255,255,1)',
											fontFamily: 'Segoe UI'
										},
										angleLines: { color: 'rgba(255,255,255,0.2)' },
										gridLines: { color: 'rgba(255,255,255,0.2)' }
									},
									legend: {
										display: false
									},
									tooltips: {
										enabled: false
									}
								}
							});

						this.p1Chart = chart.legend.legendItems[0].text;
						this.p2Chart = chart.legend.legendItems[1].text;
						console.log(chart);
						}.bind(this)
					});
				}.bind(this)
			});
			this.vm = data;
		}.bind(this));
	}

  public vm: Information = new Information();

  socket: any = io.connect(environment.socketPath);
  seed: string = window.location.href.split('=')[1];
  player1: any;
  player2: any;

  players = [
    {
        "name": "acridstingray3",
        "preferredName": "Acrid",
        "startColumn": "B3",
        "endColumn": "J3",
        "statsStartColumn": "B3",
        "statsEndColumn": "CP3",
        "seed": "52"
    },
    {
        "name": "AHuntersPixxel",
        "preferredName": "Pixxel",
        "startColumn": "B4",
        "endColumn": "J4",
        "statsStartColumn": "B4",
        "statsEndColumn": "CP4",
        "seed": "55"
    },
    {
        "name": "Axetox",
        "preferredName": "Noxitu",
        "startColumn": "B5",
        "endColumn": "J5",
        "statsStartColumn": "B5",
        "statsEndColumn": "CP5",
        "seed": "44"
    },
    {
      "name": "bdbrufus",
      "preferredName": "Rufus",
      "startColumn": "B6",
      "endColumn": "J6",
      "statsStartColumn": "B6",
      "statsEndColumn": "CP6",
      "seed": "47"
    },
    {
      "name": "Brynhold2",
      "preferredName": "Brynhold",
      "startColumn": "B7",
      "endColumn": "J7",
      "statsStartColumn": "B7",
      "statsEndColumn": "CP7",
      "seed": "19"
    },
    {
      "name": "Cereberon",
      "preferredName": "Cereberon",
      "startColumn": "B8",
      "endColumn": "J8",
      "statsStartColumn": "B8",
      "statsEndColumn": "CP8",
      "seed": "39"
    },
    {
      "name": "CheeseLover",
      "preferredName": "Cheese Lover",
      "startColumn": "B9",
      "endColumn": "J9",
      "statsStartColumn": "B9",
      "statsEndColumn": "CP9",
      "seed": "8"
    },
    {
      "name": "chicken_supreme",
      "preferredName": "Chicken Supreme",
      "startColumn": "B10",
      "endColumn": "J10",
      "statsStartColumn": "B10",
      "statsEndColumn": "CP10",
      "seed": "23"
    },
    {
      "name": "Cleanfel",
      "preferredName": "Clean",
      "startColumn": "B11",
      "endColumn": "J11",
      "statsStartColumn": "B11",
      "statsEndColumn": "CP11",
      "seed": "57"
    },
    {
      "name": "Covert_Muffin",
      "preferredName": "CovertCupcake",
      "startColumn": "B12",
      "endColumn": "J12",
      "statsStartColumn": "B12",
      "statsEndColumn": "CP12",
      "seed": "13"
    },
    {
      "name": "Cubby131313",
      "preferredName": "Cubby",
      "startColumn": "B13",
      "endColumn": "J13",
      "statsStartColumn": "B13",
      "statsEndColumn": "CP13",
      "seed": "26"
    },
    {
      "name": "cutieroo1",
      "preferredName": "Cutieroo",
      "startColumn": "B14",
      "endColumn": "J14",
      "statsStartColumn": "B14",
      "statsEndColumn": "CP14",
      "seed": "67"
    },
    {
      "name": "Dileira",
      "preferredName": "Dileira",
      "startColumn": "B15",
      "endColumn": "J15",
      "statsStartColumn": "B15",
      "statsEndColumn": "CP15",
      "seed": "22"
    },
    {
      "name": "elojimmini",
      "preferredName": "Elojimmini",
      "startColumn": "B16",
      "endColumn": "J16",
      "statsStartColumn": "B16",
      "statsEndColumn": "CP16",
      "seed": "3"
    },
    {
      "name": "ephpls",
      "preferredName": "Eph",
      "startColumn": "B17",
      "endColumn": "J17",
      "statsStartColumn": "B17",
      "statsEndColumn": "CP17",
      "seed": "46"
    },
    {
      "name": "Eviona2",
      "preferredName": "Eviona",
      "startColumn": "B18",
      "endColumn": "J18",
      "statsStartColumn": "B18",
      "statsEndColumn": "CP18",
      "seed": "11"
    },
    {
      "name": "Evooki",
      "preferredName": "Evooki",
      "startColumn": "B19",
      "endColumn": "J19",
      "statsStartColumn": "B19",
      "statsEndColumn": "CP19",
      "seed": "69"
    },
    {
      "name": "FluffyPrower",
      "preferredName": "Fluffy",
      "startColumn": "B20",
      "endColumn": "J20",
      "statsStartColumn": "B20",
      "statsEndColumn": "CP20",
      "seed": "30"
    },
    {
      "name": "Grifs99",
      "preferredName": "Grifs",
      "startColumn": "B21",
      "endColumn": "J21",
      "statsStartColumn": "B21",
      "statsEndColumn": "CP21",
      "seed": "33"
    },
    {
      "name": "Grimelios",
      "preferredName": "Grimelios",
      "startColumn": "B22",
      "endColumn": "J22",
      "statsStartColumn": "B22",
      "statsEndColumn": "CP22",
      "seed": "35"
    },
    {
      "name": "Hedidiit",
      "preferredName": "Hedidit",
      "startColumn": "B23",
      "endColumn": "J23",
      "statsStartColumn": "B23",
      "statsEndColumn": "CP23",
      "seed": "65"
    },
    {
      "name": "HydraSR",
      "preferredName": "Hydra",
      "startColumn": "B24",
      "endColumn": "J24",
      "statsStartColumn": "B24",
      "statsEndColumn": "CP24",
      "seed": "1"
    },
    {
      "name": "ICED37",
      "preferredName": "ICED",
      "startColumn": "B25",
      "endColumn": "J25",
      "statsStartColumn": "B25",
      "statsEndColumn": "CP25",
      "seed": "60"
    },
    {
      "name": "IMRaziel",
      "preferredName": "Raziel",
      "startColumn": "B26",
      "endColumn": "J26",
      "statsStartColumn": "B26",
      "statsEndColumn": "CP26",
      "seed": "4"
    },
    {
      "name": "j_halcyon",
      "preferredName": "J Halcyon",
      "startColumn": "B27",
      "endColumn": "J27",
      "statsStartColumn": "B27",
      "statsEndColumn": "CP27",
      "seed": "59"
    },
    {
      "name": "JHobz296",
      "preferredName": "JHobz",
      "startColumn": "B28",
      "endColumn": "J28",
      "statsStartColumn": "B28",
      "statsEndColumn": "CP28",
      "seed": "29"
    },
    {
      "name": "kirefel",
      "preferredName": "Kirefel",
      "startColumn": "B29",
      "endColumn": "J29",
      "statsStartColumn": "B29",
      "statsEndColumn": "CP29",
      "seed": "49"
    },
    {
      "name": "LostDedew",
      "preferredName": "LostDedew",
      "startColumn": "B30",
      "endColumn": "J30",
      "statsStartColumn": "B30",
      "statsEndColumn": "CP30",
      "seed": "25"
    },
    {
      "name": "Lucidus16",
      "preferredName": "Lucidus",
      "startColumn": "B31",
      "endColumn": "J31",
      "statsStartColumn": "B31",
      "statsEndColumn": "CP31",
      "seed": ""
    },
    {
      "name": "LurkingAssassin",
      "preferredName": "Lurking Assassin",
      "startColumn": "B32",
      "endColumn": "J32",
      "statsStartColumn": "B32",
      "statsEndColumn": "CP32",
      "seed": "50"
    },
    {
      "name": "madinsane_",
      "preferredName": "madinsane",
      "startColumn": "B33",
      "endColumn": "J33",
      "statsStartColumn": "B33",
      "statsEndColumn": "CP33",
      "seed": "40"
    },
    {
      "name": "mathluco",
      "preferredName": "mathluco",
      "startColumn": "B34",
      "endColumn": "J34",
      "statsStartColumn": "B34",
      "statsEndColumn": "CP34",
      "seed": "54"
    },
    {
      "name": "MeldonTaragon",
      "preferredName": "Meldon Taragon",
      "startColumn": "B35",
      "endColumn": "J35",
      "statsStartColumn": "B35",
      "statsEndColumn": "CP35",
      "seed": "38"
    },
    {
      "name": "millsmess123",
      "preferredName": "millsmess",
      "startColumn": "B36",
      "endColumn": "J36",
      "statsStartColumn": "B36",
      "statsEndColumn": "CP36",
      "seed": "62"
    },
    {
      "name": "Monkley6",
      "preferredName": "Monkley",
      "startColumn": "B37",
      "endColumn": "J37",
      "statsStartColumn": "B37",
      "statsEndColumn": "CP37",
      "seed": "17"
    },
    {
      "name": "MrGreeZ",
      "preferredName": "MrGreeZ",
      "startColumn": "B38",
      "endColumn": "J38",
      "statsStartColumn": "B38",
      "statsEndColumn": "CP38",
      "seed": "32"
    },
    {
      "name": "MrRandomson",
      "preferredName": "MrRandomson",
      "startColumn": "B39",
      "endColumn": "J39",
      "statsStartColumn": "B39",
      "statsEndColumn": "CP39",
      "seed": "20"
    },
    {
      "name": "ogndrahcir",
      "preferredName": "ogndrahcir",
      "startColumn": "B40",
      "endColumn": "J40",
      "statsStartColumn": "B40",
      "statsEndColumn": "CP40",
      "seed": "16"
    },
    {
      "name": "oshiimine",
      "preferredName": "oshiimine",
      "startColumn": "B41",
      "endColumn": "J41",
      "statsStartColumn": "B41",
      "statsEndColumn": "CP41",
      "seed": "28"
    },
    {
      "name": "Phant_TV",
      "preferredName": "Phant",
      "startColumn": "B42",
      "endColumn": "J42",
      "statsStartColumn": "B42",
      "statsEndColumn": "CP42",
      "seed": "36"
    },
    {
      "name": "qqstafoo",
      "preferredName": "Stafoo",
      "startColumn": "B43",
      "endColumn": "J43",
      "statsStartColumn": "B43",
      "statsEndColumn": "CP43",
      "seed": "12"
    },
    {
      "name": "rainbowpoogle",
      "preferredName": "Rainbow Poogle",
      "startColumn": "B44",
      "endColumn": "J44",
      "statsStartColumn": "B44",
      "statsEndColumn": "CP44",
      "seed": "61"
    },
    {
      "name": "RedR3dRum",
      "preferredName": "RedR3dRum",
      "startColumn": "B45",
      "endColumn": "J45",
      "statsStartColumn": "B45",
      "statsEndColumn": "CP45",
      "seed": "43"
    },
    {
      "name": "Roryrai",
      "preferredName": "Roryrai",
      "startColumn": "B46",
      "endColumn": "J46",
      "statsStartColumn": "B46",
      "statsEndColumn": "CP46",
      "seed": "21"
    },
    {
      "name": "shedd_",
      "preferredName": "shedd",
      "startColumn": "B47",
      "endColumn": "J47",
      "statsStartColumn": "B47",
      "statsEndColumn": "CP47",
      "seed": "7"
    },
    {
      "name": "sickynar",
      "preferredName": "Sickynar",
      "startColumn": "B48",
      "endColumn": "J48",
      "statsStartColumn": "B38",
      "statsEndColumn": "CP48",
      "seed": "58"
    },
    {
      "name": "sigmasin",
      "preferredName": "sigma",
      "startColumn": "B49",
      "endColumn": "J49",
      "statsStartColumn": "B49",
      "statsEndColumn": "CP49",
      "seed": "6"
    },
    {
      "name": "Skulblaka17",
      "preferredName": "Skulblaka",
      "startColumn": "B50",
      "endColumn": "J50",
      "statsStartColumn": "B50",
      "statsEndColumn": "CP50",
      "seed": "45"
    },
    {
      "name": "SkyFouxx",
      "preferredName": "SkyFouxx",
      "startColumn": "B51",
      "endColumn": "J51",
      "statsStartColumn": "B51",
      "statsEndColumn": "CP51",
      "seed": "41"
    },
    {
      "name": "sloaters27",
      "preferredName": "sloaters",
      "startColumn": "B52",
      "endColumn": "J52",
      "statsStartColumn": "B52",
      "statsEndColumn": "CP52",
      "seed": "31"
    },
    {
      "name": "SmashyLe",
      "preferredName": "Smashy",
      "startColumn": "B53",
      "endColumn": "J53",
      "statsStartColumn": "B53",
      "statsEndColumn": "CP53",
      "seed": "18"
    },
    {
      "name": "SomniRespiratoryFlux",
      "preferredName": "Flux",
      "startColumn": "B54",
      "endColumn": "J54",
      "statsStartColumn": "B54",
      "statsEndColumn": "CP54",
      "seed": "68"
    },
    {
      "name": "SonikBuster",
      "preferredName": "SonikBuster",
      "startColumn": "B55",
      "endColumn": "J55",
      "statsStartColumn": "B55",
      "statsEndColumn": "CP55",
      "seed": "64"
    },
    {
      "name": "TAS_Snoop",
      "preferredName": "Snoopy",
      "startColumn": "B56",
      "endColumn": "J56",
      "statsStartColumn": "B56",
      "statsEndColumn": "CP56",
      "seed": "37"
    },
    {
      "name": "Terra21",
      "preferredName": "Terra",
      "startColumn": "B57",
      "endColumn": "J57",
      "statsStartColumn": "B57",
      "statsEndColumn": "CP57",
      "seed": "14"
    },
    {
      "name": "TheRooseIsLoose89",
      "preferredName": "TheRooseIsLoose",
      "startColumn": "B58",
      "endColumn": "J58",
      "statsStartColumn": "B58",
      "statsEndColumn": "CP58",
      "seed": "15"
    },
    {
      "name": "thesparik",
      "preferredName": "Sparik",
      "startColumn": "B59",
      "endColumn": "J59",
      "statsStartColumn": "B59",
      "statsEndColumn": "CP59",
      "seed": "27"
    },
    {
      "name": "TheStimon456",
      "preferredName": "Stimon",
      "startColumn": "B60",
      "endColumn": "J60",
      "statsStartColumn": "B60",
      "statsEndColumn": "CP60",
      "seed": "24"
    },
    {
      "name": "ThisIsNotSully",
      "preferredName": "ThisIsNotSully",
      "startColumn": "B61",
      "endColumn": "J61",
      "statsStartColumn": "B61",
      "statsEndColumn": "CP61",
      "seed": "34"
    },
    {
      "name": "Tritonite_",
      "preferredName": "Tritonite",
      "startColumn": "B62",
      "endColumn": "J62",
      "statsStartColumn": "B62",
      "statsEndColumn": "CP62",
      "seed": "48"
    },
    {
      "name": "trojandude12",
      "preferredName": "Trojandude",
      "startColumn": "B63",
      "endColumn": "J63",
      "statsStartColumn": "B63",
      "statsEndColumn": "CP63",
      "seed": "9"
    },
    {
      "name": "UncleRonny",
      "preferredName": "Ronny",
      "startColumn": "B64",
      "endColumn": "J64",
      "statsStartColumn": "B64",
      "statsEndColumn": "CP64",
      "seed": "2"
    },
    {
      "name": "Vennguard",
      "preferredName": "Vennguard",
      "startColumn": "B65",
      "endColumn": "J65",
      "statsStartColumn": "B65",
      "statsEndColumn": "CP65",
      "seed": "63"
    },
    {
      "name": "Vulajin",
      "preferredName": "Vulajin",
      "startColumn": "B66",
      "endColumn": "J66",
      "statsStartColumn": "B66",
      "statsEndColumn": "CP66",
      "seed": "10"
    },
    {
      "name": "Willson",
      "preferredName": "Willson",
      "startColumn": "B67",
      "endColumn": "J67",
      "statsStartColumn": "B67",
      "statsEndColumn": "CP67",
      "seed": "5"
    },
    {
      "name": "xaviershay",
      "preferredName": "Xavier",
      "startColumn": "B68",
      "endColumn": "J68",
      "statsStartColumn": "B68",
      "statsEndColumn": "CP68",
      "seed": "53"
    },
    {
      "name": "Xeirla",
      "preferredName": "Xeirla",
      "startColumn": "B69",
      "endColumn": "J69",
      "statsStartColumn": "B69",
      "statsEndColumn": "CP69",
      "seed": "70"
    },
    {
      "name": "xephros",
      "preferredName": "Xeph",
      "startColumn": "B70",
      "endColumn": "J70",
      "statsStartColumn": "B70",
      "statsEndColumn": "CP70",
      "seed": "56"
    },
    {
      "name": "Yoco21",
      "preferredName": "Yoco",
      "startColumn": "B71",
      "endColumn": "J71",
      "statsStartColumn": "B71",
      "statsEndColumn": "CP71",
      "seed": "66"
    },
    {
      "name": "Zacknir",
      "preferredName": "Zacknir",
      "startColumn": "B72",
      "endColumn": "J72",
      "statsStartColumn": "B72",
      "statsEndColumn": "CP72",
      "seed": "42"
    },
    {
      "name": "Zic3",
      "preferredName": "Zic",
      "startColumn": "B73",
      "endColumn": "J73",
      "statsStartColumn": "B73",
      "statsEndColumn": "CP73",
      "seed": "51"
    },
 ]
}
