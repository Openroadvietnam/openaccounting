var pkcModule = new baseVoucher('pkc','pkc',[],'Phiếu kết chuyển cuối kỳ');
pkcModule.module.defaultValues ={
}
pkcModule.defaultValues4Detail = {
	tien_nt:0,tien:0,
}
pkcModule.defaultCondition4Search = {tu_ngay:new Date(),den_ngay:new Date(),so_ct:'',dien_giai:''};
pkcModule.prepareCondition4Search = function($scope,vcondition){
	return {
		so_ct:{$regex:$scope.vcondition.so_ct,$options:'i'},
		dien_giai:{$regex:$scope.vcondition.dien_giai,$options:'i'},
		ngay_ct:{
			$gte:dateTime2Date($scope.vcondition.tu_ngay),
			$lte:dateTime2Date($scope.vcondition.den_ngay)
		}
	};
}	
pkcModule.watchDetail = function(scope){
	scope.$watch('dt_current.tien_nt',function(newData){
		if(newData!=undefined && scope.status.isOpened){
			scope.dt_current.tien =Math.round(newData * scope.ngMasterData.ty_gia,0);
		}
	});
	scope.dmkc = function(){
		scope.$window.open("#dmkc","Khai báo kết chuyển cuối kỳ","width=800,height=400");
	}
	scope.createKC = function(){
		if(!_.isDate(scope.ngMasterData.ngay_ct)){
			scope.ngMasterData.ngay_ct = new Date(scope.ngMasterData.ngay_ct);
		}
		scope.ngMasterData.details = [];
		var url ="/api/" + id_app + "/rp-getdk4pkc?id_ct=" + scope.ngMasterData._id;
		url += "&thang=" + scope.ngMasterData.ngay_ct.getMonth().toString();
		url += "&nam=" + scope.ngMasterData.ngay_ct.getFullYear().toString();
		if(scope.ngMasterData.kc_dvcs){
			url =url + "&ma_dvcs=" + scope.ngMasterData.ma_dvcs;
		}
		scope.$http.get(url).success(function(data){
			scope.messageError = undefined;
			scope.ngMasterData.details = data;
		}).error(function(error){
			scope.alertType ="alert alert-danger";
			scope.messageError = error;
		});
	}
}
pkcModule.watchMaster = function(scope){
	scope.$watch('data.ty_gia',function(newData){
		if(scope.data){
			if(newData!=undefined && scope.isDataLoaded){
				angular.forEach(scope.data.details,function(r){
					r.tien = Math.round(r.tien_nt * newData,0);
				});
			}
		}
	});
}

pkcModule.module.setDataSource2Print = function($scope,service,config){
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