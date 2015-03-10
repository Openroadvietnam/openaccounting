var dashboardModule =  angular.module('dashboardModule',['ngRoute']);
dashboardModule.controller("homeController",['$scope','$cookies','user','$rootScope','$location','app','$timeout','$http','$cookieStore','api','$window','$interval',function($scope,$cookies,user,$rootScope,$location,app,$timeout,$http,$cookieStore,api,$window,$interval){
	
	if($location.url().indexOf("/~lg/")>=0){
		var s =$location.url().split("/");
		var fun ="dashboard";
		var id_app,token
		if(s.length>=4){
			token = s[2];
			id_app = s[3];
			if(s.length>4){
				fun =s[4];
			}
		}
		if(token){
			$cookieStore.put("token",token)
			$cookieStore.put("id_app",id_app)
			api.init(token);
			user.getInfo(function(user){
				$location.url("/" + fun);
			});
			return;
		}
	}
	if(!$cookies.token){
		$location.url("/login");
		return;
	}
	if($location.url()=="/dashboard" || $location.url()=="/"){
		loadCharts($scope);
		checkIdApp("/dashboard",$cookies,user,$rootScope,$location,app,function(error,userinfo,appinfo){
			if(error){
				$location.url("/login");
				return;
			}
			//
			var id_app = appinfo._id;
			$scope.nam = (new Date()).getFullYear();
			$scope.nams =[];
			for(var n = $scope.nam-10;n<$scope.nam + 10;n++){
				$scope.nams.push(n);
			}
			//
			loadDatas($scope,$http);
			$scope.$watch("nam",function(newvalue){
				if(newvalue){
					loadDatas($scope,$http);
				}
			});
			// Add a connect listener
			$scope.alert_count = $rootScope.notifies_count;
			socket.on('notifies_count',function(data) {
			  $scope.alert_count = data;
			  $scope.$apply();
			  
			});
			// Add a connect listener
			$scope.msg_count = $rootScope.messages_count;
			socket.on('messages_count',function(data) {
			  $scope.msg_count = data;
			  $scope.$apply();
			});
			//don hang
			var loadSO = function(){
				var conditionSO1 ={id_app:id_app,trang_thai:{$in:['1','2']}}
				var urlSO1 ="/api/" + id_app + "/so1?q=" + JSON.stringify(conditionSO1);
				$http.get(urlSO1).success(function(orders){
					$scope.orders = orders;
				});
			}
			loadSO();
			$scope.editOrder = function(id){
				$window.location.href='#/so1/edit/' + id;
			}
			$interval(loadSO,1000*5*60);
		});
		
		
	}
	
	/* $scope.chartTypes = [
		{"id": "line", "title": "Line"},
		{"id": "spline", "title": "Smooth line"},
		{"id": "area", "title": "Area"},
		{"id": "areaspline", "title": "Smooth area"},
		{"id": "column", "title": "Column"},
		{"id": "bar", "title": "Bar"},
		{"id": "pie", "title": "Pie"},
		{"id": "scatter", "title": "Scatter"}
	 ];
	 */
	 
}]);
var loadDatas = function($scope,$http){
	if(!id_app){
		return;
	}
	$scope.chartConfigRevenue.loading=true;
	$scope.chartConfigExpenseQLDN.loading=true;
	$scope.chartConfigExpenseBH.loading=true;
	$scope.chartConfigExpenseGV.loading=true;
	$scope.chartConfigNetIncome.loading=true;
		
	var url_goc = "/api/" +  id_app + "/getariseofaccountsbymonth?nam=" + $scope.nam.toString();
	data_dt = {};
	data_cp_641 = {};
	data_cp_642 = {};
	data_cp_632 = {};
	data_incom_632 = {};
	var ts =[];
	for(var t=0;t<=(new Date()).getMonth();t++){
		ts.push(t);
	}
	async.map(ts,function(t,callback){
		async.parallel({
			dt:function(callback){
				//doanh thu
				var url = url_goc + "&thang=" + t.toString() + "&tks=511";
				$http.get(url,{ignoreLoadingBar: true}).success(function(data){
					var dt =0;
					data.forEach(function(d){
						dt = dt + d.ps_co;
					});
					callback(null,dt);
				}).error(function(error){callback(error);});
			},
			cp_641:function(callback){
				//chi phi
				var url = url_goc + "&thang=" + t.toString() + "&tks=641";
				$http.get(url,{ignoreLoadingBar: true}).success(function(data){
					var dt =0;
					data.forEach(function(d){
						dt = dt + d.ps_no;
					});
					callback(null,dt);
				}).error(function(error){callback(error);});
			},
			cp_642:function(callback){
				//chi phi
				var url = url_goc + "&thang=" + t.toString() + "&tks=642";
				$http.get(url,{ignoreLoadingBar: true}).success(function(data){
					var dt =0;
					data.forEach(function(d){
						dt = dt + d.ps_no;
					});
					callback(null,dt);
				}).error(function(error){callback(error);});
			},
			cp_632:function(callback){
				//chi phi
				var url = url_goc + "&thang=" + t.toString() + "&tks=632";
				$http.get(url,{ignoreLoadingBar: true}).success(function(data){
					var dt =0;
					data.forEach(function(d){
						dt = dt + d.ps_no;
					});
					callback(null,dt);
				}).error(function(error){callback(error);});
			}
		},function(e,rs){
			if(e) return callback(e);
			var thang = "T" + (t+1).toString();
			
			data_dt[thang] = rs.dt;
			data_cp_632[thang] = rs.cp_632;
			data_cp_641[thang] = rs.cp_641;
			data_cp_642[thang] = rs.cp_642;

			callback(null,rs);
		});
	
	},function(error){
		$scope.chartConfigRevenue.loading=false;
		$scope.chartConfigExpenseQLDN.loading=false;
		$scope.chartConfigExpenseBH.loading=false;
		$scope.chartConfigExpenseGV.loading=false;
		$scope.chartConfigNetIncome.loading=false;
		if(error) return;
		var chartConfigRevenue =[];
		var chartConfigExpenseQLDN =[];
		var chartConfigExpenseBH =[];
		var chartConfigExpenseGV =[];
		var chartConfigIncome =[];
		
		var chartConfigRevenue_growth =[];
		var chartConfigExpenseQLDN_growth =[];
		var chartConfigExpenseBH_growth =[];
		var chartConfigExpenseGV_growth =[];
		var chartConfigIncome_growth =[];
		
		for(var t=1;t<=ts.length;t++){
			var thang = "T" + t.toString();
			var thang_truoc = "T" + (t-1).toString();
			chartConfigRevenue.push(data_dt[thang]);
			chartConfigExpenseBH.push(data_cp_641[thang]);
			chartConfigExpenseQLDN.push(data_cp_642[thang]);
			chartConfigExpenseGV.push(data_cp_632[thang]);
			data_incom_632[thang] = data_dt[thang]-data_cp_641[thang]-data_cp_642[thang]-data_cp_632[thang];
			chartConfigIncome.push(data_incom_632[thang]);
			
			/*if((!data_dt[thang_truoc] && data_dt[thang_truoc]!=0) ||( data_dt[thang_truoc]==0 && data_dt[thang]==0)){
				chartConfigRevenue_growth.push(null);
			}
			else{
				if(data_dt[thang_truoc]==0 && data_dt[thang] !=0){
					chartConfigRevenue_growth.push(100);
				}else{
					var growth = Math.round(((data_dt[thang]- data_dt[thang_truoc])/data_dt[thang_truoc]) *100,0);
					chartConfigRevenue_growth.push(growth);
				}
			}
			
			
			if((!data_cp_641[thang_truoc] && data_cp_641[thang_truoc]!=0) ||( data_cp_641[thang_truoc]==0 && data_cp_641[thang]==0)){
				chartConfigExpenseBH_growth.push(null);
			}
			else{
				if(data_cp_641[thang_truoc]==0 && data_cp_641[thang] !=0){
					chartConfigExpenseBH_growth.push(100);
				}else{
					var growth = Math.round(((data_cp_641[thang]- data_cp_641[thang_truoc])/data_cp_641[thang_truoc]) *100,0);
					chartConfigExpenseBH_growth.push(growth);
				}
			}
			
			
			if((!data_cp_642[thang_truoc] && data_cp_642[thang_truoc]!=0) ||( data_cp_642[thang_truoc]==0 && data_cp_642[thang]==0)){
				chartConfigExpenseQLDN_growth.push(null);
			}
			else{
				if(data_cp_642[thang_truoc]==0 && data_cp_642[thang] !=0){
					chartConfigExpenseQLDN_growth.push(100);
				}else{
					var growth = Math.round(((data_cp_642[thang]- data_cp_642[thang_truoc])/data_cp_642[thang_truoc]) *100,0);
					chartConfigExpenseQLDN_growth.push(growth);
				}
			}
			
			
			
			if((!data_cp_632[thang_truoc] && data_cp_632[thang_truoc]!=0) ||( data_cp_632[thang_truoc]==0 && data_cp_632[thang]==0)){
				chartConfigExpenseGV_growth.push(null);
			}
			else{
				if(data_cp_632[thang_truoc]==0 && data_cp_632[thang] !=0){
					chartConfigExpenseGV_growth.push(100);
				}else{
					var growth = Math.round(((data_cp_632[thang]- data_cp_632[thang_truoc])/data_cp_632[thang_truoc]) *100,0);
					chartConfigExpenseGV_growth.push(growth);
				}
			}
			
			
			if((!data_incom_632[thang_truoc] && data_incom_632[thang_truoc]!=0) ||( data_incom_632[thang_truoc]==0 && data_incom_632[thang]==0)){
				chartConfigIncome_growth.push(null);
			}
			else{
				if(data_incom_632[thang_truoc]==0 && data_incom_632[thang] !=0){
					chartConfigIncome_growth.push(100);
				}else{
					var growth = Math.round(((data_incom_632[thang]- data_incom_632[thang_truoc])/data_incom_632[thang_truoc]) *100,0);
					chartConfigIncome_growth.push(growth);
				}
			}
			
			
		
		*/
		}
		$scope.chartConfigRevenue.series[0].data =chartConfigRevenue;
		$scope.chartConfigExpenseQLDN.series[0].data =chartConfigExpenseQLDN;
		$scope.chartConfigExpenseBH.series[0].data =chartConfigExpenseBH;
		$scope.chartConfigExpenseGV.series[0].data =chartConfigExpenseGV;
		$scope.chartConfigNetIncome.series[0].data =chartConfigIncome;
		
		/*$scope.chartConfigRevenue.series[1].data =chartConfigRevenue_growth;
		$scope.chartConfigExpenseQLDN.series[1].data =chartConfigExpenseQLDN_growth;
		$scope.chartConfigExpenseBH.series[1].data =chartConfigExpenseBH_growth;
		$scope.chartConfigExpenseGV.series[1].data =chartConfigExpenseGV_growth;
		$scope.chartConfigNetIncome.series[1].data =chartConfigIncome_growth;
		*/
		
		
	});
}
var loadCharts = function($scope){
	$scope.chartConfigRevenue = {
	options: {
	  chart: {
		type: 'column',
		margin: 75,
		options3d: {
			enabled: true,
			alpha: 10,
			beta: 25,
			depth: 70
		}
	  },
	  plotOptions: {
		series: {
		  stacking: ''
		},
		line: {
			dataLabels: {
				enabled: false
			},
			enableMouseTracking: true
		}
		,
		column: {
			dataLabels: {
				enabled: false
			},
			enableMouseTracking: true
		}
	  }
	},
	series: [
			{name: "Doanh thu"
				, data: []
				, yAxis: 0
				,tooltip: {
					valueSuffix: ' VND'
				}
				
			}/*,
			{name: "Tăng trưởng"
				, data: []
				, connectNulls: true
				,type:'line'
				,yAxis: 1
				,tooltip: {
					valueSuffix: ' %'
				}
			}*/
	  ],
	xAxis: {
		categories: ['T 1', 'T 2', 'T 3', 'T 4', 'T 5', 'T 6',
			'T 7', 'T 8', 'T 9', 'T 10', 'T 11', 'T 12']
	},
	yAxis: [{ // Primary yAxis
		labels: {
		   // format: '{value} VND',
			style: {
				color: Highcharts.getOptions().colors[1]
			}
		},
		title: {
			text: 'VND',
			style: {
				color: Highcharts.getOptions().colors[1]
			}
		}
	}, { // Secondary yAxis
		title: {
			text: '%',
			style: {
				color: Highcharts.getOptions().colors[0]
			}
		},
		labels: {
			format: '{value} %',
			style: {
				color: Highcharts.getOptions().colors[0]
			}
		},
		opposite: true
	}],
	title: {
	  text: 'Doanh thu'
	},
	loading: false
  }
  //chi phi quan ly doanh nghiep
  $scope.chartConfigExpenseQLDN = {
	options: {
	  chart: {
		type: 'column',
		margin: 75,
		options3d: {
			enabled: true,
			alpha: 10,
			beta: 25,
			depth: 70
		}
	  },
	  plotOptions: {
		series: {
		  stacking: ''
		},
		line: {
			dataLabels: {
				enabled: false
			},
			enableMouseTracking: true
		}
		,
		column: {
			dataLabels: {
				enabled: false
			},
			enableMouseTracking: true
		}
	  }
	},
	series: [{name: "Chi phí"
				, data: []
				, yAxis: 0
				,tooltip: {
					valueSuffix: ' VND'
				}
				
			}/*,
			{name: "Tăng trưởng"
				, data: []
				, connectNulls: true
				,type:'line'
				,yAxis: 1
				,tooltip: {
					valueSuffix: ' %'
				}
				
			}*/
	],
	xAxis: {
		categories: ['T 1', 'T 2', 'T 3', 'T 4', 'T 5', 'T 6',
			'T 7', 'T 8', 'T 9', 'T 10', 'T 11', 'T 12']
	},
	yAxis: [{ // Primary yAxis
		labels: {
		   // format: '{value} VND',
			style: {
				color: Highcharts.getOptions().colors[1]
			}
		},
		title: {
			text: 'VND',
			style: {
				color: Highcharts.getOptions().colors[1]
			}
		}
	}, { // Secondary yAxis
		title: {
			text: '%',
			style: {
				color: Highcharts.getOptions().colors[0]
			}
		},
		labels: {
			format: '{value} %',
			style: {
				color: Highcharts.getOptions().colors[0]
			}
		},
		opposite: true
	}],
	title: {
	  text: 'Chi phí quản lý doanh nghiệp'
	},
	
	loading: false,
	size: {}
  }
  //chi phi ban hang va marketing
   $scope.chartConfigExpenseBH = {
	options: {
	  chart: {
		type: 'column',
		margin: 75,
		options3d: {
			enabled: true,
			alpha: 10,
			beta: 25,
			depth: 70
		}
	  },
	  plotOptions: {
		series: {
		  stacking: ''
		},
		line: {
			dataLabels: {
				enabled: false
			},
			enableMouseTracking: true
		}
		,
		column: {
			dataLabels: {
				enabled: false
			},
			enableMouseTracking: true
		}
	  }
	},
	series: [{"name": "Chi phí"
				, data: []
				, yAxis: 0
				,tooltip: {
					valueSuffix: ' VND'
				}
			}/*,
			{"name": "Tăng trưởng"
				, data: []
				, connectNulls: true
				,type:'line'
				,yAxis: 1
				,tooltip: {
					valueSuffix: ' %'
				}
				
			}*/
	],
	xAxis: {
		categories: ['T 1', 'T 2', 'T 3', 'T 4', 'T 5', 'T 6',
			'T 7', 'T 8', 'T 9', 'T 10', 'T 11', 'T 12']
	},
	yAxis: [{ // Primary yAxis
		labels: {
		   // format: '{value} VND',
			style: {
				color: Highcharts.getOptions().colors[1]
			}
		},
		title: {
			text: 'VND',
			style: {
				color: Highcharts.getOptions().colors[1]
			}
		}
	}, { // Secondary yAxis
		title: {
			text: '%',
			style: {
				color: Highcharts.getOptions().colors[0]
			}
		},
		labels: {
			format: '{value} %',
			style: {
				color: Highcharts.getOptions().colors[0]
			}
		},
		opposite: true
	}],
	title: {
	  text: 'Chi phí bán hàng'
	},
	
	loading: false,
	size: {}
  }
  //gia von hang ban
   $scope.chartConfigExpenseGV = {
	options: {
	  chart: {
		type: 'column',
		margin: 75,
		options3d: {
			enabled: true,
			alpha: 10,
			beta: 25,
			depth: 70
		}
	  },
	  plotOptions: {
		series: {
		  stacking: ''
		},
		line: {
			dataLabels: {
				enabled: false
			},
			enableMouseTracking: true
		}
		,
		column: {
			dataLabels: {
				enabled: false
			},
			enableMouseTracking: true
		}
	  }
	},
	series: [{name: "Chi phí"
				, data: []
				, yAxis: 0
				,tooltip: {
					valueSuffix: ' VND'
				}
			}/*,
			{name: "Tăng trưởng"
				, data: []
				, connectNulls: true
				,type:'line'
				,yAxis: 1
				,tooltip: {
					valueSuffix: ' %'
				}
				
			}*/
	],
	xAxis: {
		categories: ['T 1', 'T 2', 'T 3', 'T 4', 'T 5', 'T 6',
			'T 7', 'T 8', 'T 9', 'T 10', 'T 11', 'T 12']
	},
	yAxis: [{ // Primary yAxis
		labels: {
		   // format: '{value} VND',
			style: {
				color: Highcharts.getOptions().colors[1]
			}
		},
		title: {
			text: 'VND',
			style: {
				color: Highcharts.getOptions().colors[1]
			}
		}
	}, { // Secondary yAxis
		title: {
			text: '%',
			style: {
				color: Highcharts.getOptions().colors[0]
			}
		},
		labels: {
			format: '{value} %',
			style: {
				color: Highcharts.getOptions().colors[0]
			}
		},
		opposite: true
	}],
	title: {
	  text: 'Giá vốn hàng bán'
	},
	
	loading: false,
	size: {}
  }
  //Lợi nhuận ròng
   $scope.chartConfigNetIncome = {
	options: {
	  chart: {
		type: 'column',
		margin: 75,
		options3d: {
			enabled: true,
			alpha: 10,
			beta: 25,
			depth: 70
		}
	  },
	  plotOptions: {
		series: {
		  stacking: ''
		},
		line: {
			dataLabels: {
				enabled: false
			},
			enableMouseTracking: true
		}
		,
		column: {
			dataLabels: {
				enabled: false
			},
			enableMouseTracking: true
		}
	  }
	},
	series: [{name: "Lợi nhuận"
				, data: []
				, yAxis: 0
				,tooltip: {
					valueSuffix: ' VND'
				}
			}/*,
			{name: "Tăng trưởng"
				, data: []
				, connectNulls: true
				,type:'line'
				,yAxis: 1
				,tooltip: {
					valueSuffix: ' %'
				}
				
			}*/
	],
	xAxis: {
		categories: ['T 1', 'T 2', 'T 3', 'T 4', 'T 5', 'T 6',
			'T 7', 'T 8', 'T 9', 'T 10', 'T 11', 'T 12']
	},
	yAxis: [{ // Primary yAxis
		labels: {
		   // format: '{value} VND',
			style: {
				color: Highcharts.getOptions().colors[1]
			}
		},
		title: {
			text: 'VND',
			style: {
				color: Highcharts.getOptions().colors[1]
			}
		}
	}, { // Secondary yAxis
		title: {
			text: '%',
			style: {
				color: Highcharts.getOptions().colors[0]
			}
		},
		labels: {
			format: '{value} %',
			style: {
				color: Highcharts.getOptions().colors[0]
			}
		},
		opposite: true
	}],
	title: {
	  text: 'Lợi nhuận ròng'
	},
	
	loading: false,
	size: {}
  }
}
dashboardModule.controller('dxdController',['$scope',function($scope){
	
}]);
dashboardModule.config(['$routeProvider','$locationProvider','$httpProvider',function($routeProvider,$locationProvider,$httpProvider){
	$httpProvider.responseInterceptors.push('httpInterceptor');
	$routeProvider
		.when("/",{
			templateUrl:"modules/dashboard/templates/db1.html",
			controller:"homeController"
		})
		.when("/lg/:id_app",{
			templateUrl:"modules/dashboard/templates/db1.html",
			controller:"homeController"
		})
		.when("/dxd",{
			templateUrl:"modules/dashboard/templates/dxd.html",
			controller:"dxdController"
		})
		.when("/dashboard",{
			templateUrl:"modules/dashboard/templates/db1.html",
			controller:"homeController"
		});
}]);
