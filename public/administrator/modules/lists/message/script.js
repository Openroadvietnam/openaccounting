'use strict';
var messageModule = new baseInput('message','message',["email_owner","email_receiver","email_sender","content"],'Tin nhắn',"lists",function($http){
	var sv ={
		list:function(id_app,condition,fields,count,page,limit){
				var fields_find = ["email_owner","email_receiver","email_sender","content"];
				var url ="/api/message/colleagues/list?t=1" ;
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
			chat:function(id_app,email_dt){
				return $http.get("/api/message/chat/" + email_dt );
			},
			get:function(id_app,id){
				return $http.get("/api/message/" + id );
			},
			create:function(id_app,data){
				return $http.post("/api/message",data);
			},
			update:function(id_app,id,data){
				return $http.put("/api/message/" + id,data);
			},
			delete:function(id_app,id){
				return $http.delete("/api/message/" + id );
			},
	}
	return sv;
});
messageModule.module.controller('baseMessageChatController',function($scope,$location,$routeParams,$cookies,$rootScope,message,$window,user,app,$modal){
	checkIdApp("message",$cookies,user,$rootScope,$location,app,function(error,userinfo,appinfo){
			if(!error){
				var email_owner = $rootScope.user.email;
				var email_dt = $routeParams.email;
				user.getProfile(email_dt,function(error,profile){
					if(error) return alert(error);
					$scope.profile = profile;
				});
				socket.on('message',function(data) {
					if($scope.profile){
						data.picture_sender = $scope.profile.picture;
						data.name_sender =$scope.profile.name;
					}
					$scope.msgs.push(data);
				});
				$scope.data ={};
				$scope.data.email_receiver = email_dt;
				message.chat(undefined,email_dt).success(function(msgs){
					$scope.msgs = msgs;
				});
				$scope.send = function(){
					message.create(undefined,$scope.data).success(function(r){
						$scope.data.content = "";
						$scope.msgs.push(r);
					}).error(function(error){
						alert(error);
					});
				}
				$scope.enter2send = function(event){
					if(event.keyCode==13){
						$scope.send();
					}
				}
				$scope.deleteMsg = function(_id){
					if(confirm("Có chắc chắn xóa tin nhắn này không?")){
						message.delete(null,_id).success(function(){
							$scope.msgs = _.reject($scope.msgs,function(msg){
								return msg._id ==_id;
							});
						}).error(function(error){
							alert("Không thể xóa tin  nhắn này");
						});
					}
				}
				$scope.openProfile = function(email){
					messageModule.viewProfile($modal,email);
				}
			}
		}
	);
	
	
});
messageModule.module.controller('baseMessageHomeController',function($scope,$location,$routeParams,$cookieStore,$rootScope,message,$window){
	$scope.chat = function(r){
		var email_coll = r.email_coll;
		$location.url("message/chat/" + email_coll); 
	}
});
messageModule.initHomeController = function($controller,$scope){
	$controller("baseMessageHomeController",{$scope:$scope});
}
messageModule.module.config(['$routeProvider','$locationProvider',function($routeProvider,$locationProvider){
		$routeProvider.when("/message/chat/:email",{
				templateUrl:"modules/lists/message/templates/edit.html",
				controller:"baseMessageChatController"
			});
}]);
