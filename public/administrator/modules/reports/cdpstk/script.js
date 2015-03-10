var rptCdpstk = new baseRpt('cdpstk','cdpstk','Cân đối phát sinh tài khoản');
rptCdpstk.defaultCondition = function(condition){
	var c = new Date();
	condition.tu_ngay = new Date(c.getFullYear(),c.getMonth(),1);
	condition.den_ngay = c;
}
rptCdpstk.module.controller('initCdpstk',['$scope','scttkConfig',function($scope,scttkConfig){
	$scope.scttkConfig = scttkConfig;
}]);
rptCdpstk.init = function($scope,$http,$filter,$location,$config,$controller){
	$controller('initCdpstk',{$scope:$scope});
	$scope.drilldown = function(row){
		if(row.tk && row.tk!=''){
			if(!$scope.scttkConfig.condition){
				$scope.scttkConfig.condition ={};
			}
			$scope.scttkConfig.condition.tk = row.tk;
			$scope.scttkConfig.condition.ten_tk = row.ten_tk;
			$scope.scttkConfig.condition.tu_ngay = $scope.condition.tu_ngay;
			$scope.scttkConfig.condition.den_ngay = $scope.condition.den_ngay;
			$scope.scttkConfig.condition.ma_dvcs = $scope.condition.ma_dvcs;
			$scope.scttkConfig.isDrillDown = true;
			$location.path("/scttk");
			
		}
		
		
	}
}
rptCdpstk.exportConfig ={
	title:'CÂN ĐỐI PHÁT SINH TÀI KHOẢN',
	conditions:[
		{name:'tu_ngay',caption:'Từ ngày'},
		{name:'den_ngay',caption:'Đến ngày'},
		{name:'tk',caption:'Tài khoản'},
		{name:'ten_tk',caption:'Tên tài khoản'},
		{name:'bu_tru',caption:'Bù trừ công nợ'},
		{name:'ten_dvcs',caption:'Đơn vị cơ sở'}
	],
	columns:[
		{name:'tk',caption:'Tài khoản',type:'string',width:15},
		{name:'ten_tk',caption:'Tên tài khoản',type:'string',width:30},
		{name:'dk_no',caption:'Đầu kỳ nợ',type:'number',width:15},
		{name:'dk_co',caption:'Đầu kỳ có',type:'number',width:15},
		{name:'ps_no',caption:'PS nợ',type:'number',width:15},
		{name:'ps_co',caption:'PS có',type:'number',width:15},
		{name:'ck_no',caption:'Cuối kỳ nợ',type:'number',width:15},
		{name:'ck_co',caption:'Cuối kỳ có',type:'number',width:15}
	]
}