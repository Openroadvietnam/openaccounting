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
accApp.directive('format', ['$filter', function ($filter) {
    return {
        require: '?ngModel',
        link: function (scope, elem, attrs, ctrl) {
            if (!ctrl) return;
            ctrl.$formatters.unshift(function (a) {
				if(ctrl.$modelValue==undefined || ctrl.$modelValue==""){
					ctrl.$modelValue =0;
					return 0;
				}
                return $filter(attrs.format)(ctrl.$modelValue);
            });


            ctrl.$parsers.unshift(function (viewValue) {
				if(viewValue ==undefined || viewValue==""){
					viewValue =0;
					return viewValue;
				}
                var plainNumber = viewValue.replace(/[^\d|\-+|\.+]/g, '');
                elem.val($filter('number')(plainNumber));
                return Number(plainNumber);
            });
        }
    };
}]);
accApp.directive('ngTygia',['dmnt',function(dmnt){
	return {
		restrict:'A',
		require:'^ngModel',
		scope:{
			ngModel:'=',
			ngTygia:'=',
			ngDataLoaded:'='
		},
		controller:function($scope,dmnt){
			$scope.getTyGia = function(ma_nt,fn){
				dmnt.list(id_app,{ma_nt:ma_nt},'ty_gia')
					.success(function(result){
						if(result.length==1){
							fn(result[0].ty_gia);
						}
					});
			}
		},
		link:function(scope,elem,attrs,ctr){
			scope.$watch('ngTygia',function(nvalue){
				
				if(scope.ngDataLoaded==true){
					old_ma_nt = nvalue;
					scope.getTyGia(nvalue,function(ty_gia){
						scope.ngModel = ty_gia;
					});
				}
			});
		}
	}
}]);
accApp.directive("ngData",function(){
	return {
		controller:function($scope){}
	}
});
accApp.directive('ngSum',function(){
	return{
		scope:{
			ngSum:'@',
			ngData:'=',
			ngModel:'='
		},
		link:function(scope,elem,attrs,ctr){
			scope.$watch('ngData',function(newData){
				var kq =0;
				if(newData){
					angular.forEach(newData,function(r){
						var v = Number(r[scope.ngSum]);
						kq = kq+v;
					});
				}
				scope.ngModel = kq;			
				
			},true);
			
		}
	}
});
accApp.directive('ngDatepicker',['$window',function($window){
	return {
		restrict:'E',
		require:'^ngModel',
		scope:{
			ngModel:'='
		},
		templateUrl:'bases/templates/ng-datepicker.html',
		link:function(scope,elem,attrs,ctr){
			scope.openDatePicker=function($event){
				$event.preventDefault();
				$event.stopPropagation();
				scope.opened = true;
			}
		}
	}
}]);
accApp.directive('ngRequiredCn',['dmtk',function(dmtk){
	var tk_cn = false;
	var setValidity = function(scope,ctr){
		if(tk_cn==true && (!ctr.$viewValue || ctr.$viewValue =="")){
			ctr.$setValidity('ngRequiredCn',false);
		}else{
			ctr.$setValidity('ngRequiredCn',true);
		}
	}
	return {
		restrict:'A',
		require:'?ngModel',
		link:function(scope,elem,attrs,ctr){
			scope.$watch(attrs.ngRequiredCn,function(tk){
				if(tk){
					if(scope.tks){
						tk_cn = (_.filter(scope.tks,function(t){return (t.tk==tk && t.tk_cn);}).length>0);
						setValidity(scope,ctr);
					}else{
						dmtk.list(id_app,{tk:tk,tk_cn:true},'tk_cn')
							.success(function(data){
								if(data.length==0){
									tk_cn = false
								}else{
									tk_cn = true;
								}
								setValidity(scope,ctr);
							});
					}
				}else{
					tk_cn = false;
					setValidity(scope,ctr);
				}
				
			});
			scope.$watch(attrs.ngModel,function(viewValue){
				setValidity(scope,ctr);
			});
			
		}
	}
}]);
accApp.directive('ngRequiredQ',[function(){
	return {
		restrict:'A',
		require:'?ngModel',
		link:function(scope,elem,attrs,ctr){
			scope.$watch(attrs.ngRequiredQ,function(tk){
				if(tk){
					ctr.$setValidity('ngRequired',false);
				}else{
					ctr.$setValidity('ngRequired',true);
				}
				
			});
			
			
		}
	}
}]);
accApp.directive('ngPage',[function(){
	return {
		restrict:'E',
		templateUrl:'bases/templates/ng-page.html'
	}
}]);
accApp.directive('stplistheader',function($location){
	return {
		restrict:'E',
		templateUrl:"bases/templates/list-header.html",
		link:function(scope,elem,attrs,contr){
			if(attrs.hasOwnProperty('boxSearch')){
				scope.boxSearch = attrs.boxSearch;
			}else{
				scope.boxSearch = true;
			}
			
			if(attrs.hasOwnProperty('btnadd')){
				
				btnAdd = eval("({" +  attrs.btnadd + "})");
				if(btnAdd.show==undefined){
					btnAdd.show = true;
				}
				if(btnAdd.text==undefined){
					btnAdd.text = "Mới";
				}
				scope.add_show=btnAdd.show;
				scope.add_text =btnAdd.text;
			}else{
				scope.add_show=true;
				scope.add_text ="Mới";
			}
			if(attrs.btndelete){
				btnDelete = eval("({" +  attrs.btndelete + "})");
				if(btnDelete.show==undefined){
					btnDelete.show = true;
				}
				if(btnDelete.text==undefined){
					btnDelete.text = "Xóa";
				}
				scope.delete_show=btnDelete.show;
				scope.delete_text =btnDelete.text;
			}else{
				scope.delete_text ="Xóa";
				scope.delete_show=true;
			}
			
			if(attrs.btn1){
				btn1 = eval("({" +  attrs.btn1 + "})");
				scope.btn1_show=true;
				scope.btn1_text =btn1.text;
				scope.btn1_click = btn1.click;
			}
			if(attrs.btn2){
				btn2 = eval("({" +  attrs.btn2 + "})");
				scope.btn2_show=true;
				scope.btn2_text =btn2.text;
				scope.btn2_click = btn2.click;
			}
			if(attrs.btn3){
				btn3 = eval("({" +  attrs.btn3 + "})");
				scope.btn3_show=true;
				scope.btn3_text =btn3.text;
				scope.btn3_click = btn3.click;
			}
			if(attrs.btn4){
				btn4 = eval("({" +  attrs.btn4 + "})");
				scope.btn4_show=true;
				scope.btn4_text =btn4.text;
				scope.btn4_click = btn4.click;
			}
			if(attrs.btn5){
				btn5 = eval("({" +  attrs.btn5 + "})");
				scope.btn5_show=true;
				scope.btn5_text =btn5.text;
				scope.btn5_click = btn5.click;
			}
			if(attrs.btnimport){
				btnimport = eval("({" +  attrs.btnimport + "})");
				scope.import_show=true;
				scope.import_text =btnimport.text?btnimport.text:"Import";
			}
		}
	};
});
accApp.directive('stpvoucherheader',function(){
	return {
		restrict:'E',
		templateUrl:"bases/templates/voucher-header.html",
		link:function(scope,elem,attrs,control){
			if(attrs.btn1){
				btn1 = eval("({" +  attrs.btn1 + "})");
				scope.btn1_show=true;
				scope.btn1_text =btn1.text;
				scope.btn1_click = btn1.click;
			}
			if(attrs.btn2){
				btn2 = eval("({" +  attrs.btn2 + "})");
				scope.btn2_show=true;
				scope.btn2_text =btn2.text;
				scope.btn2_click = btn2.click;
			}
			if(attrs.btn3){
				btn3 = eval("({" +  attrs.btn3 + "})");
				scope.btn3_show=true;
				scope.btn3_text =btn3.text;
				scope.btn3_click = btn3.click;
			}
			if(attrs.btn4){
				btn4 = eval("({" +  attrs.btn4 + "})");
				scope.btn4_show=true;
				scope.btn4_text =btn4.text;
				scope.btn4_click = btn4.click;
			}
			if(attrs.btn5){
				btn5 = eval("({" +  attrs.btn5 + "})");
				scope.btn5_show=true;
				scope.btn5_text =btn5.text;
				scope.btn5_click = btn5.click;
			}
			if(attrs.options){
				options = eval("({" +  attrs.options + "})");
				scope.options_show=true;
				scope.options_text =options.text;
			}
		}
	};
});
accApp.directive('headerFormInput',function ($filter) {
    return {
		restrict:'E',
		templateUrl:"bases/templates/header-form-input.html"
	};
});
accApp.directive('headerDialogSelect',function ($filter) {
    return {
		restrict:'E',
		templateUrl:"bases/templates/header-dialog-select.html",
		link:function(scope,elem,attrs){
			if(attrs.hasOwnProperty("title")){
				scope.title= attrs["title"];
			}else{
				scope.title ="Danh sách"
			}
			if(attrs.hasOwnProperty("placeholder")){
				scope.placeholder= attrs["placeholder"];
			}else{
				scope.placeholder ="Gõ từ cần tìm..."
			}
		}
	};
});
accApp.directive('footerFormInput',function ($filter) {
    return {
		restrict:'E',
		templateUrl:"bases/templates/footer-form-input.html"
	};
});
accApp.directive('rptHeader',function ($filter,$window) {
    return {
		restrict:'E',
		templateUrl:"bases/templates/rpt-header.html",
		link:function(scope,elem,attrs,controller){
			if(attrs.kbm){
				scope.kbm_yn = true;
				scope.openKbm = function(){
					$window.open("/#" + attrs.kbm,"Khai báo mẫu","width=" + $window.innerWidth.toString() + ",height=500");
				}
				
			}
			scope.btnok_text ="Xem";
			scope.btnok_show = true;
			
			if(attrs.btnok){
				btnok = eval("({" +  attrs.btnok + "})");
				if(btnok.text){
					scope.btnok_text = btnok.text;
				}
				if(btnok.show){
					scope.btnok_show = btnok.show;
				}
			}
			if(attrs.btn1){
				btn1 = eval("({" +  attrs.btn1 + "})");
				scope.btn1_show=true;
				scope.btn1_text =btn1.text;
				scope.btn1_click = btn1.click;
			}
			if(attrs.btn2){
				btn2 = eval("({" +  attrs.btn2 + "})");
				scope.btn2_show=true;
				scope.btn2_text =btn2.text;
				scope.btn2_click = btn2.click;
			}
			if(attrs.btn3){
				btn3 = eval("({" +  attrs.btn3 + "})");
				scope.btn3_show=true;
				scope.btn3_text =btn3.text;
				scope.btn3_click = btn3.click;
			}
			if(attrs.btn4){
				btn4 = eval("({" +  attrs.btn4 + "})");
				scope.btn4_show=true;
				scope.btn4_text =btn4.text;
				scope.btn4_click = btn4.click;
			}
			if(attrs.btn5){
				btn5 = eval("({" +  attrs.btn5 + "})");
				scope.btn5_show=true;
				scope.btn5_text =btn5.text;
				scope.btn5_click = btn5.click;
			}
		}
	};
});
accApp.directive('navbarPrint',function ($filter) {
    return {
		restrict:'E',
		templateUrl:"bases/templates/navbar-print.html"
	};
});
accApp.directive('ngTypeahead',['$http',function($http){
	return {
		restrict:'E',
		scope:{
			ngModel:'=',
			ngDisabled:'=',
			ngShow:'=',
			label:'=',
			onSelect:'&',
			fieldModel:'@',
			module:'@'
		},
		template:function(elem,attrs){
			
			var html ="<div class='input-group'>";
					//input
					html = html + "<input type='text' ng-model='ngModel' ng-blur='blur()' ng-change='label=undefined' typeahead-on-select = 'getItem($item, $model, $label)'";
					if(attrs.hasOwnProperty("ngRequired")){
						html = html + " ng-required='" + attrs.ngRequired + "'";
					}
					if(attrs.hasOwnProperty("ngDisabled")){
						html = html + " ng-disabled='ngDisabled'";
					}
					if(attrs.hasOwnProperty("ngShow")){
						html = html + " ng-show='ngShow'";
					}
					if(attrs.hasOwnProperty("group")){
						html = html + "typeahead-min-length='3' typeahead-template-url='modules/" + attrs.group + "/" + attrs.module + "/templates/typeahead.html' ";
					}else{
						html = html + "typeahead-min-length='3' typeahead-template-url='modules/lists/" + attrs.module + "/templates/typeahead.html' ";
					
					}
					
					if(attrs.hasOwnProperty("placeholder")){
						html = html + " placeholder='" + attrs.placeholder + "' ";
					}
					html = html + " typeahead='item." + attrs.fieldModel + " as item." + attrs.fieldModel + " for item in getList($viewValue,10)' class='form-control'>";
					//list
					html = html + "<div class='input-group-btn'><button tabindex='-1' ";
					if(attrs.hasOwnProperty("ngDisabled")){
						html = html + " ng-disabled='ngDisabled'";
					}
					html = html +" class='btn btn-default form-control' ng-click='showList()'><i class='fa fa-list'></i></button></div>";
				html = html + "</div>";
			
			return html;
		},
		controller:function($scope,$modal,$window,$interval){
			var module = eval("(" + $scope.module +"Module)");
			$scope.pathService = module.server_path;
			$scope.fieldsSearch = module.fields_find;
			var list = function(id_app,condition,fields,limit){
				if($scope.pathService=="colleague" || $scope.pathService =="app"){
					var url = "/api/" + $scope.pathService + "?t=1"
				}else{
					var url = "/api/" + id_app + "/" + $scope.pathService + "?t=1"
				}
				
				if(limit){
					url = url + "&limit=" + limit;
				}
				if(condition){
					if(angular.isObject(condition)){
						var q =JSON.stringify(condition);
						url = url + "&q=" + q;
					}else{
						url = url + "&" + condition;
					}
				}
				if(!fields && $scope.fields){
					fields = $scope.fields;
				}
				if(fields){
					url = url + "&fields=" + fields;
				}
				return $http.get(url);
			}
			$scope.prepareCondition = function(value){
				var condition={};
				if($scope.condition){
					_.extend(condition,$scope.condition);
				}
				condition.$or =[];
				$scope.fieldsSearch.forEach(function(field){
					
					if(field.toLowerCase().indexOf('tk')==0){
						f = eval("({" +  field + ":{$regex:'^" + value + "',$options:'i'}" + "})");
						
					}else{
						f = eval("({" +  field + ":{$regex:'" + value + "',$options:'i'}" + "})");
					}
					
					condition.$or.push(f);
				});
				
				return condition;
			}
			$scope.getList = function(value,limit,fn){
				var condition = $scope.prepareCondition(value);
				return list(id_app,condition,null,limit).then(function(res){
					var items = res.data;
					if(fn){
						fn(items);
					}
					return items;
				});
			}
			$scope.getItem = function($item, $model, $label){
				if($scope.onSelect){
					$scope.onSelect({$item:$item});
				}
				if($scope.fieldLabel){
					$scope.label = $item[$scope.fieldLabel];
				}
				
			}
			$scope.blur = function(){
				if($scope.ngModel&&!$scope.label && $scope.fieldLabel){
					var condition = eval("(" + "{" + $scope.fieldModel + ":'" + $scope.ngModel + "'}" + ")");
					list(id_app,condition,$scope.fieldLabel).success(function(d){
						if(d.length==1){
							$scope.label = d[0][$scope.fieldLabel];
						}else{
							$scope.ngModel = undefined;
						}
					});
				}
			}
			$scope.showList = function () {
				var modalInstance = $modal.open({
				  templateUrl: 'modules/' + $scope.group + '/' + $scope.module + '/templates/dialog-select.html',
				  controller:  function($scope, $modalInstance,parentScope){
						$scope.getList = function(value,limit){
							parentScope.getList(value,limit,function(data){
								$scope.items = data;
							});
						}
						$scope.keyup = function($event,value){
							if($event.keyCode==13 && value){
								$scope.getList(value);
							}
						}
						$scope.select = function (item){
							parentScope.ngModel = item[parentScope.fieldModel];
							if(parentScope.fieldLabel){
								parentScope.label = item[parentScope.fieldLabel];
							}
							
							if(parentScope.onSelect){
								parentScope.onSelect({$item:item});
							}
							$modalInstance.close();
						}
						$scope.cancel = function () {
							$modalInstance.dismiss('cancel');
						}
						$scope.openList = function () {
							var url = "#/" + parentScope.module;
							var w = $window.open(url,"Danh mục","width=" + $window.innerWidth.toString() + ",height=400")
							$modalInstance.dismiss('cancel');
						}
						$scope.quickadd = function(){
							module.quickadd($modal,function(item){
								parentScope.ngModel = item[parentScope.fieldModel];
								if(parentScope.fieldLabel){
									parentScope.label = item[parentScope.fieldLabel];
								}
							});
							$modalInstance.dismiss('cancel');
						}
						$scope.getList("",10);
					},
				  size: "lg",
				  resolve: {
					parentScope: function () {
					  return $scope;
					}
				  }
				});

			}
		},
		link:function(scope,elem,attrs,controller){
			if(attrs.hasOwnProperty("condition")){
				scope.condition = eval("({" + attrs.condition + "})");
			}
			if(attrs.hasOwnProperty("fields")){
				scope.fields = attrs.fields;
			}
			if(attrs.hasOwnProperty("fieldLabel")){
				scope.fieldLabel = attrs.fieldLabel;
			}
			if(attrs.hasOwnProperty("group")){
				scope.group = attrs.group;
			}else{
				scope.group = "lists";
			}
			scope.$watch("ngModel",function(newValue,oldValue){
				if(!scope.ngModel){
					scope.label = "";
				}
			});
		}
	}
}]);
accApp.factory("$cache_lists",function(){
	return {};
});
accApp.directive('ngSelector',['$http','$cache_lists',function($http,$cache){
	return {
		restrict:'E',
		scope:{
			ngModel:'=',
			ngChange:'&',
			ngDisabled:'=',
			module:'@',
			fields:'@',
			fieldModel:'@',
			fieldLabel:'@'
		},
		template: function(elem,attrs){
			var html = "<div class='input-group'><select ng-model='ngModel' ng-disabled ='ngDisabled' ng-change='ngChange({valueChanged:ngModel})' ";
			if(attrs.hasOwnProperty("options")){
				html =  html + ' ng-options="' + attrs.options + '"';
			}else{
				html =  html + " ng-options=\"item." + attrs.fieldModel + " as item." + attrs.fieldModel + " + ' - ' +  item." + attrs.fieldLabel + "  for item in items\" ";
			}
			if(attrs.hasOwnProperty("multiple")){
				html =  html + ' multiple';
			}
			
			html = html + " class='form-control'></select>";
			
			//list
			html = html + "<div class='input-group-btn'><button tabindex='-1' ";
			if(attrs.hasOwnProperty("ngDisabled")){
				html = html + " ng-disabled='ngDisabled'";
			}
			html = html +" class='btn btn-default form-control' ng-click='showList()'><i class='fa fa-list'></i></button></div>";
			return html;
		},
		controller:function($scope,$modal,$window,$interval){
			var module = eval("(" + $scope.module +"Module)");
			$scope.pathService = module.server_path;
			$scope.fieldsSearch = module.fields_find;
			$scope.list = function(id_app,condition,fields,limit){
				if($scope.pathService=="colleague" || $scope.pathService=="app"){
					var url = "/api/" + $scope.pathService + "?t=1"
				}else{
					var url = "/api/" + id_app + "/" + $scope.pathService + "?t=1"
				}
				if(limit){
					url = url + "&limit=" + limit;
				}
				if(condition){
					if(angular.isObject(condition)){
						var q =JSON.stringify(condition);
						url = url + "&q=" + q;
					}else{
						url = url + "&" + condition;
					}
				}
				if(!fields && $scope.fields){
					fields = $scope.fields;
				}
				if(fields){
					url = url + "&fields=" + fields;
				}
				return $http.get(url);
			}
			
			$scope.refresh = function(){
				var condition = {status:true};
				if($scope.condition){
					_.extend(condition,$scope.condition);
				}
				$scope.list(id_app,condition).success(function(data){
					if(!$scope.condition){
						var key = $scope.module + '_' + id_app;
						$cache[key] = data;
					}
					$scope.items = [];
					if($scope.emptyYn){
						var empty_item = eval("(" + "{" + $scope.fieldModel + ":''," + $scope.fieldLabel + ":'--'}" + ")");
						$scope.items.push(empty_item);
					}
					angular.forEach(data,function(r){
						$scope.items.push(r);
					});
					//default
					if(!$scope.ngModel && $scope.items.length>0 && $scope.emptyYn){
						$scope.ngModel =$scope.items[0][$scope.fieldModel];
					}
				});
			}
			$scope.showList = function () {
				var modalInstance = $modal.open({
				  templateUrl: 'modules/' + $scope.group + "/" + $scope.module + '/templates/dialog-select.html',
				  controller:  function($scope, $modalInstance,parentScope){
						$scope.getList = function(value,limit){
							var condition={};
							if(parentScope.condition){
								_.extend(condition,$scope.condition);
							}
							condition.$or =[];
							parentScope.fieldsSearch.forEach(function(field){
								var f = eval("({" +  field + ":{$regex:'" + value + "',$options:'i'}" + "})");
								condition.$or.push(f);
							});
				
							parentScope.list(id_app,condition,null,limit).then(function(res){
								$scope.items = res.data;
							});
				
							
						}
						$scope.keyup = function($event,value){
							if($event.keyCode==13 && value){
								$scope.getList(value);
							}
						}
						$scope.getList("",10);
						$scope.select = function (item){
							parentScope.ngModel = item[parentScope.fieldModel];
							if(parentScope.fieldLabel){
								parentScope.label = item[parentScope.fieldLabel];
							}
							
							if(parentScope.onSelect){
								parentScope.onSelect({$item:item});
							}
							$modalInstance.close();
						}
						$scope.cancel = function () {
							$modalInstance.dismiss('cancel');
						}
						$scope.openList = function () {
							var url = "#/" + parentScope.module;
							var w = $window.open(url,"Danh mục","width=" + $window.innerWidth.toString() + ",height=400")
							var interval = $interval(function(){
								if(w.closed){
									parentScope.refresh();
									$interval.stop(interval);
								}
							},100);
							$modalInstance.dismiss('cancel');
						}
						$scope.quickadd = function(){
							module.quickadd($modal,function(item){
								
								parentScope.items.push(item);
								parentScope.ngModel = item[parentScope.fieldModel];
								if(parentScope.fieldLabel){
									parentScope.label = item[parentScope.fieldLabel];
								}
								var key = parentScope.module + '_' + id_app;
								if($cache[key]){
									$cache[key].push(item);
								}
							});
							$modalInstance.dismiss('cancel');
						}
						
					},
				  size: "lg",
				  resolve: {
					parentScope: function () {
					  return $scope;
					}
				  }
				});

			}
			
			$scope.getList = function(){
				var key = $scope.module + '_' + id_app;
				if($cache[key] && !$scope.condition){
					var data = $cache[key];
					$scope.items = [];
					if($scope.emptyYn){
						var empty_item = eval("(" + "{" + $scope.fieldModel + ":''," + $scope.fieldLabel + ":'--'}" + ")");
						$scope.items.push(empty_item);
					}
					angular.forEach(data,function(r){
						$scope.items.push(r);
					});
					//default
					if(!$scope.ngModel && $scope.items.length>0 && $scope.emptyYn){
						$scope.ngModel =$scope.items[0][$scope.fieldModel];
					}
				}else{
					$scope.refresh();
				}
				
			}
		},
		link:function(scope,elem,attrs){
			if(attrs.hasOwnProperty("condition")){
				scope.condition = eval("({" + attrs.condition + "})");
			}
			if(attrs.hasOwnProperty("multiple")){
				scope.multiple = attrs.multiple;
			}
			if(attrs.hasOwnProperty("group")){
				scope.group = attrs.group;
			}else{
				scope.group = "lists";
			}
			if(!attrs.hasOwnProperty("ngRequired") && !attrs.hasOwnProperty("required")){
				scope.emptyYn = true;
			}
			scope.getList();
		}
	}
}]);

accApp.directive('ngGetInfo',['$http',function($http){
	return {
		restrict:'A',
		scope:{
			conditionValue:'=',
			runWhenConditionChanged:'=',
			ngModel:'='
		},
		controller:function($scope){
			var list = function(id_app,condition,fields){
				var url = "/api/" + id_app + "/" + $scope.pathService + "?t=1"
				if(condition){
					if(angular.isObject(condition)){
						var q =JSON.stringify(condition);
						url = url + "&q=" + q;
					}else{
						url = url + "&" + condition;
					}
				}
				if(fields){
					url = url + "&fields=" + fields;
				}
				return $http.get(url);
			}
			$scope.getValue = function(callback){
				var condition ={};
				for(var key in $scope.condition){
					var value = $scope.condition[key];
					if(value=='???'){
						condition[key] = $scope.conditionValue;
					}else{
						condition[key] = value;
					}
				}
				
				list(id_app,condition,$scope.fieldInfo)
					.success(function(items){
						if(items.length==1){
							callback(items[0][$scope.fieldInfo]);
						}
						return;
					});
			}
		},
		link:function(scope,elem,attrs){
		
			var ngGetInfo = eval("({" + attrs.ngGetInfo + "})");
			scope.fieldInfo = ngGetInfo.fieldInfo;
			var module = eval("(" + ngGetInfo.module + "Module)");
			scope.pathService = module.server_path;
			scope.condition = ngGetInfo.condition;
			if(!attrs.hasOwnProperty("runWhenConditionChanged")){
				scope.runWhenConditionChanged = true;
			}
			scope.$watch('conditionValue',function(newValue){
				if(!scope.runWhenConditionChanged){
					return;
				}
				if(!newValue){
					scope.ngModel = null;
					return;
				}
				if(scope.fieldInfo){
					
					scope.getValue(function(value){
						scope.ngModel = value;
					});
					
				}
				
			});
		}
	}
}]);
accApp.factory('Base64', function() {
    var keyStr = 'ABCDEFGHIJKLMNOP' +
            'QRSTUVWXYZabcdef' +
            'ghijklmnopqrstuv' +
            'wxyz0123456789+/' +
            '=';
    return {
        encode: function (input) {
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;

            do {
                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);

                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;

                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                }

                output = output +
                        keyStr.charAt(enc1) +
                        keyStr.charAt(enc2) +
                        keyStr.charAt(enc3) +
                        keyStr.charAt(enc4);
                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";
            } while (i < input.length);

            return output;
        },

        decode: function (input) {
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;

            // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
            var base64test = /[^A-Za-z0-9\+\/\=]/g;
            if (base64test.exec(input)) {
                alert("There were invalid base64 characters in the input text.\n" +
                        "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
                        "Expect errors in decoding.");
            }
            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

            do {
                enc1 = keyStr.indexOf(input.charAt(i++));
                enc2 = keyStr.indexOf(input.charAt(i++));
                enc3 = keyStr.indexOf(input.charAt(i++));
                enc4 = keyStr.indexOf(input.charAt(i++));

                chr1 = (enc1 << 2) | (enc2 >> 4);
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                chr3 = ((enc3 & 3) << 6) | enc4;

                output = output + String.fromCharCode(chr1);

                if (enc3 != 64) {
                    output = output + String.fromCharCode(chr2);
                }
                if (enc4 != 64) {
                    output = output + String.fromCharCode(chr3);
                }

                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";

            } while (i < input.length);

            return output;
        }
    };
});
