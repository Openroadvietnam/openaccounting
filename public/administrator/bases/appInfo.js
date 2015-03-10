var appInfoService = angular.module('appInfoService',[]);
appInfoService.factory('appInfo',['$http',function($http){
	var info;
	return {
		get:function(id_app,fn){
			if(!info){
				var url ="/api/apps/" + id_app;
				$http.get(url).success(function(data){
					info = data;
					fn(null,info);
				}).error(function(error){
					fn(error);
				});
			}else{
				fn(null,info);
			}
		}
	}
}]);