/*Copyright (C) 2015  Sao Tien Phong (http://saotienphong.com.vn)

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published
by the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/
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