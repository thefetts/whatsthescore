var app = angular.module('sportsScores', []);

app.controller('appController', function($scope, $http) {
	$scope.data = {
		loadedScores: false,
		homeScore: 0,
		awayScore: 0,
		date: new Date(),
		year: 2000,
		month: 12,
		day: 25,
		error: null,
		updateTimestamp: null
	};

	$scope.initialize = function() {
		$scope.setDateValues();
		$scope.updateScores();
	};

	$scope.dateIsOk = function() {
		var d = new Date();
		if($scope.data.year > 2006) {
			var d2 = new Date($scope.data.year, $scope.data.month-1, $scope.data.day);
			if(d2 <= d) {
				return true;
			} else {
				$scope.data.error = 'future';
			}
		} else {
			$scope.data.error = 'old';
		}
		return false;
	};

	$scope.setDateValues = function() {
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
		$scope.data.error = null;
		var timeStamp = (new Date()).getTime().toString();
		$scope.data.updateTimestamp = timeStamp;

		if($scope.dateIsOk()) {
			var url = 'http://gd2.mlb.com/components/game/mlb'+
				'/year_'+$scope.data.year+
				'/month_'+$scope.data.month+
				'/day_'+$scope.data.day+
				'/master_scoreboard.json';

			$http.get(url).success(function(data) {
				var games = data.data.games.game;
				for(var i in games) {
					if(timeStamp !== $scope.data.updateTimestamp)
						return;

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
			}).error(function(data) {
				$scope.data.error = 'apiDown';
				$scope.data.loadedScores = true;
			});
		} else {
			$scope.data.loadedScores = true;
		}
	};

	$scope.initialize();
});
