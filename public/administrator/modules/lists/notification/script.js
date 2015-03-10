var notificationModule = new baseInput('notification','notification',["email_owner","email_sender","email_receiver","content","title"],'Thông báo');
notificationModule.module.controller('basenotificationHomeController',function($scope,$location,$cookieStore,$rootScope,notification,$window){
	
});
notificationModule.initHomeController = function($controller,$scope){
	
	$controller("basenotificationHomeController",{$scope:$scope});
}

notificationModule.module.factory('notification',function($http){
	fields_find =["email_receiver","email_owner","email_sender","content","title"];
	return {
		list:function(id_notification,condition,fields,count,page,limit){
				var url ="/api/notification?t=1" ;
				if(count==1){
					url = url + "&count=1";
				}
				if(page){
					url = url + "&page=" + page.toString();
				}
				if(limit){
					url = url + "&limit=" + limit.toString();
				}
				if(angular.isObject(condition)){
					var q =JSON.stringify(condition);
					
					url = url + "&q=" + q;
				}else{
					if(!(!condition || condition.trim()=="" || !fields_find || fields_find.length==0)){
					
						var query = "";
						fields_find.forEach(function(field){
							if(query==""){
								query = field + "=" + condition;
							}else{
								query =query + "&" +  field + "=" + condition;
							}
						});
						if(query!=""){
							url = url + "&" + query;
						}
						
					}
				}
				if(fields){
					url = url + "&fields=" + fields;
				}
				return $http.get(url);
				
			},
			get:function(id_notification,id){
				return $http.get("/api/notification/" + id );
			},
			create:function(id_notification,data){
				return $http.post("/api/notification",data);
			},
			update:function(id_notification,id,data){
				return $http.put("/api/notification/" + id,data);
			},
			delete:function(id_notification,id){
				return $http.delete("/api/notification/" + id );
			},
			active:function(id){
				return $http.get("/api/notification/active/" + id );
			},
			notaccept:function(id){
				return $http.get("/api/notification/notaccept/" + id );
			}
	}
});
