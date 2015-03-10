var pktModule = new baseVoucher('pkt','pkt',[],'Phiếu kế toán');
pktModule.module.defaultValues ={
	vatvaos:[],
	vatras:[]
}
pktModule.defaultValues4Detail = {
	tien_nt:0,tien:0,
}
pktModule.defaultCondition4Search = {tu_ngay:new Date(),den_ngay:new Date(),so_ct:'',dien_giai:''};
pktModule.prepareCondition4Search = function($scope,vcondition){
	return {
		so_ct:{$regex:$scope.vcondition.so_ct,$options:'i'},
		dien_giai:{$regex:$scope.vcondition.dien_giai,$options:'i'},
		ngay_ct:{
			$gte:dateTime2Date($scope.vcondition.tu_ngay),
			$lte:dateTime2Date($scope.vcondition.den_ngay)
		}
	};
}	
pktModule.watchDetail = function(scope){
	scope.$watch('dt_current.tien_nt',function(newData){
		if(newData!=undefined && scope.status.isOpened){
			scope.dt_current.tien =Math.round(newData * scope.ngMasterData.ty_gia,0);
		}
	});
}
pktModule.watchMaster = function(scope){
	scope.$watch('data.ty_gia',function(newData){
		if(scope.data){
			if(newData!=undefined && scope.isDataLoaded){
				angular.forEach(scope.data.details,function(r){
					r.tien = Math.round(r.tien_nt * newData,0);
				});
				angular.forEach(scope.data.vatvaos,function(r){
					r.t_tien = Math.round(r.t_tien_nt * newData,0);
					r.t_thue = Math.round(r.t_thue_nt * newData,0);
				});
				angular.forEach(scope.data.vatras,function(r){
					r.t_tien = Math.round(r.t_tien_nt * newData,0);
					r.t_thue = Math.round(r.t_thue_nt * newData,0);
				});
			}
		}
	});
}

pktModule.module.setDataSource2Print = function($scope,service,config){
	if(config.list){
		for(var i=0;i< config.list.length;i++){
			if(config.list[i].sel==true){
				$scope.dataSource = config.list[i];
				service.getSocai(id_app,$scope.dataSource._id).success(function(data){
					$scope.dataSource.socai = data;
				});
				break;
			}
		}
	}
}