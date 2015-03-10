var baseService = function($http,url_service,fields_find,services){
	var sv =  {
			list:function(id_app,condition,fields,count,page,limit){
				var url = url_service() + "?t=1" ;
				
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
			next:function(id_app,field){
				return $http.get(url_service() + "/next/" + field);
			},
			get:function(id_app,id){
				return $http.get(url_service() + "/" + id );
			},
			create:function(id_app,data){
				return $http.post(url_service(),data);
			},
			update:function(id_app,id,data){
				return $http.put(url_service() + "/" + id,data);
			},
			delete:function(id_app,id){
				return $http.delete(url_service() + "/" + id );
			},
			getSocai:function(id_app,id){
				return $http.get(url_service() + "/socai/" + id);
			},
			getVsocai:function(id_app,id){
				return $http.get(url_service() + "/vsocai/" + id);
			}
			
		}
	if(services){
		_.extend(sv,services($http));
	}
	return sv;
}