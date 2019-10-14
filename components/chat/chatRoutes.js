angular.module('chat')
.config(function($stateProvider) {
	$stateProvider
	.state("chatAgent", {
		url: "/chatAgent/:userKey",
		views: {
			"": {
				controller: 'chatAgentController',
				templateUrl: 'components/chat/agent/agent.html'
			}
		}
	});
	
});