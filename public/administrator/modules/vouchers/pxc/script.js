var pxcModule = new baseVoucher('pxc','pxc',[],'Phiếu xuất điều chuyển kho');
pxcModule.module.defaultValues ={
}
pxcModule.defaultValues4Detail = {
	sl_xuat:0,
	px_gia_dd:false,
	gia_von_nt:0,gia_von:0,
	tien_xuat_nt:0,tien_xuat:0
}
pxcModule.defaultCondition4Search = {tu_ngay:new Date(),den_ngay:new Date(),so_ct:'',dien_giai:''};
pxcModule.prepareCondition4Search = function($scope,vcondition){
	return {
		so_ct:{$regex:$scope.vcondition.so_ct,$options:'i'},
		dien_giai:{$regex:$scope.vcondition.dien_giai,$options:'i'},
		ngay_ct:{
			$gte:dateTime2Date($scope.vcondition.tu_ngay),
			$lte:dateTime2Date($scope.vcondition.den_ngay)
		}
	};
}
	
pxcModule.watchDetail = function(scope){
	scope.$watch('dt_current.sl_xuat',function(newData){
		if(newData!=undefined && scope.status.isOpened){
			scope.dt_current.tien_xuat_nt = Math.round( scope.dt_current.sl_xuat * scope.dt_current.gia_von_nt,scope.round);
		}
	});
	
	scope.$watch('dt_current.gia_von_nt',function(newData){
		if(newData!=undefined && scope.status.isOpened){
			scope.dt_current.gia_von = Math.round(scope.dt_current.gia_von_nt * scope.ngMasterData.ty_gia,0);
			scope.dt_current.tien_xuat_nt = Math.round( scope.dt_current.sl_xuat * scope.dt_current.gia_von_nt,scope.round);
		}
	});
	scope.$watch('dt_current.gia_von',function(newData){
		if(newData!=undefined && scope.status.isOpened){
			scope.dt_current.tien_xuat = Math.round( scope.dt_current.sl_xuat * scope.dt_current.gia_von,0);
		}
	});
	
	
	
	scope.$watch('dt_current.tien_xuat_nt',function(newData){
		if(newData!=undefined && scope.status.isOpened){
			scope.dt_current.tien_xuat = Math.round(scope.dt_current.tien_xuat_nt * scope.ngMasterData.ty_gia,0);
		}
	});
}
pxcModule.watchMaster = function(scope){
	
	scope.$watch('data.ty_gia',function(newData){
		if(scope.data){
			if(newData!=undefined && scope.isDataLoaded){
				angular.forEach(scope.data.details,function(r){
					r.gia_von = Math.round(r.gia_von_nt * newData,0);
					r.tien_xuat = Math.round(r.tien_xuat_nt * newData,0);
				});
			}
		}
	});
}

pxcModule.module.setDataSource2Print = function($scope,service,config){
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