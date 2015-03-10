var hd3Module = new baseVoucher('hd3','hd3',[],'Phiếu nhập hàng bán bị trả lại');
hd3Module.module.defaultValues ={
	vatvaos:[]
}
hd3Module.defaultValues4Detail = {
	sl_nhap:0,
	gia_von_nt:0,gia_von:0,
	gia_ban_nt:0,gia_ban:0,
	tien_nt:0,tien:0,
	tien_ck_nt:0,tien_ck:0,
	tien_nhap_nt:0,tien_nhap:0
}
hd3Module.defaultCondition4Search = {tu_ngay:new Date(),den_ngay:new Date(),so_ct:'',dien_giai:'',ma_kh:''};
hd3Module.prepareCondition4Search = function($scope,vcondition){
	return {
		so_ct:{$regex:$scope.vcondition.so_ct,$options:'i'},
		dien_giai:{$regex:$scope.vcondition.dien_giai,$options:'i'},
		ma_kh:{$regex:$scope.vcondition.ma_kh,$options:'i'},
		ngay_ct:{
			$gte:dateTime2Date($scope.vcondition.tu_ngay),
			$lte:dateTime2Date($scope.vcondition.den_ngay)
		}
	};
}
	
hd3Module.watchDetail = function(scope){
	scope.$watch('dt_current.sl_nhap',function(newData){
		if(newData!=undefined && scope.status.isOpened){
			scope.dt_current.tien_nt = Math.round( scope.dt_current.sl_nhap * scope.dt_current.gia_ban_nt,scope.round);
			scope.dt_current.tien_ck_nt = Math.round(scope.dt_current.tien_nt * scope.dt_current.ty_le_ck/100,scope.round);
			
			scope.dt_current.tien = Math.round(scope.dt_current.tien_nt * scope.ngMasterData.ty_gia,0);
			scope.dt_current.tien_ck = Math.round(scope.dt_current.tien_ck_nt * scope.ngMasterData.ty_gia,0);
			
			scope.dt_current.tien_nhap_nt = Math.round( scope.dt_current.sl_nhap * scope.dt_current.gia_von_nt,scope.round);
			scope.dt_current.tien_nhap = Math.round( scope.dt_current.sl_nhap * scope.dt_current.gia_von_nt,0);
		}
	});
	scope.$watch('dt_current.gia_ban_nt',function(newData){
		if(newData!=undefined && scope.status.isOpened){
			scope.dt_current.gia_ban = Math.round(scope.dt_current.gia_ban_nt * scope.ngMasterData.ty_gia,0);
			scope.dt_current.tien_nt = Math.round( scope.dt_current.sl_nhap * scope.dt_current.gia_ban_nt,scope.round);
			scope.dt_current.tien = Math.round( scope.dt_current.tien_nt * scope.ngMasterData.ty_gia,0);
			
			scope.dt_current.tien_ck_nt = Math.round(scope.dt_current.tien_nt * scope.dt_current.ty_le_ck/100,scope.round);
			scope.dt_current.tien_ck = Math.round(scope.dt_current.tien_ck_nt * scope.ngMasterData.ty_gia,0);
			
		}
	});
	scope.$watch('dt_current.gia_ban',function(newData){
		if(newData!=undefined && scope.status.isOpened){
			scope.dt_current.tien = Math.round( scope.dt_current.sl_nhap * scope.dt_current.gia_ban,0);
		}
	});
	
	scope.$watch('dt_current.gia_von_nt',function(newData){
		if(newData!=undefined && scope.status.isOpened){
			scope.dt_current.gia_von = Math.round(scope.dt_current.gia_von_nt,0);
			scope.dt_current.tien_nhap_nt = Math.round( scope.dt_current.sl_nhap * scope.dt_current.gia_von_nt,scope.round);;
			scope.dt_current.tien_nhap = Math.round( scope.dt_current.sl_nhap * scope.dt_current.gia_von_nt,0);
		}
	});
	scope.$watch('dt_current.tien_nhap_nt',function(newData){
		if(newData!=undefined && scope.status.isOpened){
			scope.dt_current.tien_nhap = Math.round(scope.dt_current.tien_nhap_nt * scope.ngMasterData.ty_gia,0);
		}
	});
	
	scope.$watch('dt_current.tien_nt',function(newData){
		if(newData!=undefined && scope.status.isOpened){
			scope.dt_current.tien = Math.round(scope.dt_current.tien_nt * scope.ngMasterData.ty_gia,0);
			
			scope.dt_current.tien_ck_nt = Math.round(scope.dt_current.tien_nt * scope.dt_current.ty_le_ck/100,scope.round);
			scope.dt_current.tien_ck = Math.round(scope.dt_current.tien_ck_nt * scope.ngMasterData.ty_gia,0);
			
		}
	});
	scope.$watch('dt_current.tien',function(newData){
		if(newData!=undefined && scope.status.isOpened){
			scope.dt_current.tien_ck = Math.round(scope.dt_current.tien * scope.dt_current.ty_le_ck/100,0);
		}
	});
	
	scope.$watch('dt_current.ty_le_ck',function(newData){
		if(newData!=undefined && scope.status.isOpened){
			scope.dt_current.tien_ck_nt = Math.round(scope.dt_current.tien_nt * scope.dt_current.ty_le_ck/100,scope.round);
			scope.dt_current.tien_ck = Math.round(scope.dt_current.tien_ck_nt * scope.ngMasterData.ty_gia,0);
		}
	});
	
	scope.$watch('dt_current.tien_ck_nt',function(newData){
		if(newData!=undefined && scope.status.isOpened){
			scope.dt_current.tien_ck = Math.round(scope.dt_current.tien_ck_nt * scope.ngMasterData.ty_gia,0);
		}
	});
	
	scope.getInvoice = function(){
		var modalInstance = scope.$modal.open({
		templateUrl: 'modules/vouchers/hd3/templates/form-select-invoice.html',
		controller:  function($scope, $modalInstance,parentScope,$filter){
				$scope.condition ={tu_ngay:new Date(),den_ngay:new Date()};
				$scope.ngData = parentScope.ngData;
				$scope.dt_current = parentScope.dt_current;
				$scope.ngMasterData=parentScope.ngMasterData;
				$scope.masters =[];
				$scope.details=[];
				$scope.invoiceClick = function(_id){
					$scope.details=[];
					var master = _.find($scope.masters,function(m){
						return m._id = _id;
					});
					$scope.details= master.details;
				}
				$scope.loadInvoice = function(){
					$scope.masters =[];
					$scope.details=[];
					var url = "/api/" + id_app + "/getinvoice2return?ma_kh=" + $scope.ngMasterData.ma_kh;
					url =url + "&tu_ngay=" + $filter('date')($scope.condition.tu_ngay,'yyyy-MM-dd');
					url =url + "&den_ngay=" + $filter('date')($scope.condition.den_ngay,'yyyy-MM-dd');
					if($scope.condition.so_ct){
						url =url + "&so_ct=" + $scope.condition.so_ct;
					}
					if($scope.condition.so_hd){
						url =url + "&so_hd=" + $scope.condition.so_hd;
					}
					scope.$http.get(url)
						.success(function(data){
							$scope.masters = data;
						})
						.error(function(error){
							$scope.masters =[];
							alert(error);
						});
				}
				$scope.ok = function (){
					parentScope.ngMasterData.details =[];
					var line =0;
					$scope.masters.forEach(function(m){
						if(m.sel){
							m.details.forEach(function(d){
								if(d.sel){
									d.line = line;
									parentScope.ngMasterData.details.push(d);
									line++;
								}
							});
						}
					});
					$modalInstance.close();
					
				};
				$scope.cancel = function () {
					$modalInstance.dismiss('cancel');
				};
			},
		size: "lg",
		resolve: {
			parentScope: function () {
				return scope;
			}
		  }
		});
	}

}
hd3Module.watchMaster = function(scope){
	scope.$watch('data.ty_gia',function(newData){
		if(scope.data){
			if(newData!=undefined && scope.isDataLoaded){
				angular.forEach(scope.data.details,function(r){
					r.tien = Math.round(r.tien_nt * newData,0);
					r.tien_ck = Math.round(r.tien_ck_nt * newData,0);
					
					r.tien_nhap = Math.round(r.tien_nhap_nt * newData,0);
				});
				angular.forEach(scope.data.vatvaos,function(r){
					r.t_tien = Math.round(r.t_tien_nt * newData,0);
					r.t_thue = Math.round(r.t_thue_nt * newData,0);
					
				});
				
			}
		}
	});
	
}

hd3Module.module.setDataSource2Print = function($scope,service,config){
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