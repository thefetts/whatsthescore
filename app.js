var app = angular.module('sportsScores', []);

app.controller('appController', function($scope, $http) {
	$scope.data = {
		loadedScores: false,
		homeScore: 0,
		awayScore: 0,
		date: new Date(),
		year: 2000,
		month: 12,
		day: 25
	};

	$scope.initialize = function() {
		$scope.setDateValues();
		$scope.updateScores();
	};

	$scope.setDateValues = function() {
		// Year, Month and Date are required for MLB's API
		$scope.data.year = $scope.data.date.getFullYear();

		var month = $scope.data.date.getMonth() + 1;
		$scope.data.month = month > 9 ? month : '0'+month;

		var day = $scope.data.date.getDate();
		$scope.data.day = day > 9 ? day : '0'+day;
	};

	$scope.updateScores = function() {
		$scope.data.homeScore = 0;
		$scope.data.awayScore = 0;
		$scope.data.loadedScores = false;

		var url = 'http://gd2.mlb.com/components/game/mlb'+
			'/year_'+$scope.data.year+
			'/month_'+$scope.data.month+
			'/day_'+$scope.data.day+
			'/master_scoreboard.json';

		$http.get(url).success(function(data) {
			var games = data.data.games.game;
			for(var i in games) {
				var game = games[i];
				if(game.linescore && game.linescore.r) {
					if(game.linescore.r.home) {
						$scope.data.homeScore += parseInt(game.linescore.r.home, 10);
					}
					if(game.linescore.r.away) {
						$scope.data.awayScore += parseInt(game.linescore.r.away, 10);
					}
				}
			}
			$scope.data.loadedScores = true;
		});
	};

	$scope.initialize();
});
