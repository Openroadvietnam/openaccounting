var rptcdpskh = new baseRpt('cdpskh','cdpskh','Cân đối phát sinh theo khách hàng');
rptcdpskh.defaultCondition = function(condition){
	var c = new Date();
	condition.tu_ngay = new Date(c.getFullYear(),c.getMonth(),1);
	condition.den_ngay = c;
}
rptcdpskh.module.controller('initCdkh',['$scope','sctcnkhConfig',function($scope,sctcnkhConfig){
	$scope.sctcnkhConfig = sctcnkhConfig;
}]);
rptcdpskh.init = function($scope,$http,$filter,$location,$config,$controller){
	$controller('initCdkh',{$scope:$scope});
	$scope.drilldown = function(row){
		if(row.ma_kh){
			if(!$scope.sctcnkhConfig.condition){
				$scope.sctcnkhConfig.condition ={};
			}
			$scope.sctcnkhConfig.condition.tk = $scope.condition.tk;
			$scope.sctcnkhConfig.condition.ten_tk = $scope.condition.ten_tk;
			$scope.sctcnkhConfig.condition.ma_kh = row.ma_kh;
			$scope.sctcnkhConfig.condition.ten_kh = row.ten_kh;
			$scope.sctcnkhConfig.condition.tu_ngay = $scope.condition.tu_ngay;
			$scope.sctcnkhConfig.condition.den_ngay = $scope.condition.den_ngay;
			$scope.sctcnkhConfig.condition.ma_dvcs = $scope.condition.ma_dvcs;
			$scope.sctcnkhConfig.isDrillDown = true;
			$location.path("/sctcnkh");
			
		}
		
		
	}
}
rptcdpskh.exportConfig ={
	title:'Cân đối phát sinh theo khách hàng',
	conditions:[
		{name:'tu_ngay',caption:'Từ ngày'},
		{name:'den_ngay',caption:'Đến ngày'},
		{name:'tk',caption:'Tài khoản'},
		{name:'ten_tk',caption:'Tên tài khoản'},
		{name:'ma_kh',caption:'Mã khách'},
		{name:'ten_kh',caption:'Tên khách hàng'},
		{name:'ten_dvcs',caption:'Đơn vị cơ sở'}
	],
	columns:[
		{name:'ma_kh',caption:'Mã khách hàng',type:'string',width:15},
		{name:'ten_kh',caption:'Tên khách hàng',type:'string',width:30},
		{name:'dk_no',caption:'Đầu kỳ nợ',type:'number',width:15},
		{name:'dk_co',caption:'Đầu kỳ có',type:'number',width:15},
		{name:'ps_no',caption:'PS nợ',type:'number',width:15},
		{name:'ps_co',caption:'PS có',type:'number',width:15},
		{name:'ck_no',caption:'Cuối kỳ nợ',type:'number',width:15},
		{name:'ck_co',caption:'Cuối kỳ có',type:'number',width:15}
	]
}
