var pn5Module = new baseVoucher('pn5','pn5',[],'Phiếu xuất trả lại nhà cung cấp');
pn5Module.module.defaultValues ={
	t_thue_nt:0,t_thue:0,thue_suat:0
}
pn5Module.defaultValues4Detail = {
	sl_xuat:0,
	ty_le_ck:0,
	gia_von_nt:0,gia_von:0,
	tien_hang_nt:0,tien_hang:0,
	tien_ck_nt:0,tien_ck:0,
	px_gia_dd:false,
	tien_xuat_nt:0,tien_xuat:0
}
pn5Module.defaultCondition4Search = {tu_ngay:new Date(),den_ngay:new Date(),so_ct:'',dien_giai:'',ma_kh:''};
pn5Module.prepareCondition4Search = function($scope,vcondition){
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
	
pn5Module.watchDetail = function(scope){
	scope.$watch('dt_current.sl_xuat',function(newData){
		if(newData!=undefined && scope.status.isOpened){
			scope.dt_current.tien_hang_nt = Math.round( scope.dt_current.sl_xuat * scope.dt_current.gia_von_nt,scope.round);
		}
	});
	scope.$watch('dt_current.tien_hang_nt',function(newData){
		if(newData!=undefined && scope.status.isOpened){
			scope.dt_current.tien_ck_nt = Math.round(scope.dt_current.tien_hang_nt * scope.dt_current.ty_le_ck/100,scope.round);
			scope.dt_current.tien_xuat_nt = scope.dt_current.tien_hang_nt - scope.dt_current.tien_ck_nt;
			scope.dt_current.tien_hang = Math.round(scope.dt_current.tien_hang_nt * scope.ngMasterData.ty_gia,0);
		}
	});
	scope.$watch('dt_current.tien_hang',function(newData){
		if(newData!=undefined && scope.status.isOpened){
			scope.dt_current.tien_ck = Math.round(scope.dt_current.tien * scope.dt_current.ty_le_ck/100,0);
		}
	});
	
	scope.$watch('dt_current.gia_von_nt',function(newData){
		if(newData!=undefined && scope.status.isOpened){
			scope.dt_current.gia_von =Math.round(scope.dt_current.gia_von_nt * scope.ngMasterData.ty_gia,0);
			scope.dt_current.tien_hang_nt = Math.round( scope.dt_current.sl_xuat * scope.dt_current.gia_von_nt,scope.round);
		}
	});

	
	scope.$watch('dt_current.ty_le_ck',function(newData){
		if(newData!=undefined && scope.status.isOpened){
			scope.dt_current.tien_ck_nt = Math.round(scope.dt_current.tien_hang_nt * scope.dt_current.ty_le_ck/100,scope.round);
		}
	});
	
	scope.$watch('dt_current.tien_ck_nt',function(newData){
		if(newData!=undefined && scope.status.isOpened){
			scope.dt_current.tien_ck = Math.round(scope.dt_current.tien_ck_nt * scope.ngMasterData.ty_gia,0);
			scope.dt_current.tien_xuat_nt = scope.dt_current.tien_hang_nt - scope.dt_current.tien_ck_nt;
		}
	});
	scope.$watch('dt_current.tien_ck',function(newData){
		if(newData!=undefined && scope.status.isOpened){
			scope.dt_current.tien_xuat = scope.dt_current.tien_hang - scope.dt_current.tien_ck;
		}
	});
	scope.$watch('dt_current.tien_xuat_nt',function(newData){
		if(newData!=undefined && scope.status.isOpened){
			scope.dt_current.tien_xuat =Math.round(scope.dt_current.tien_xuat_nt * scope.ngMasterData.ty_gia,0);
		}
	});
	
	scope.getInvoice = function(){
		var modalInstance = scope.$modal.open({
		templateUrl: 'modules/vouchers/pn5/templates/form-select-invoice.html',
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
					var url = "/api/" + id_app + "/getpn2return?ma_kh=" + $scope.ngMasterData.ma_kh;
					url =url + "&tu_ngay=" + $filter('date')($scope.condition.tu_ngay,'yyyy-MM-dd');
					url =url + "&den_ngay=" + $filter('date')($scope.condition.den_ngay,'yyyy-MM-dd');
					if($scope.condition.so_ct){
						url =url + "&so_ct=" + $scope.condition.so_ct;
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
pn5Module.watchMaster = function(scope){
	scope.$watch('data.ty_gia',function(newData){
		if(scope.data){
			if(newData!=undefined && scope.isDataLoaded){
				angular.forEach(scope.data.details,function(r){
					r.tien_hang = Math.round(r.tien_hang_nt * newData,0);
					r.tien_ck = Math.round(r.tien_ck_nt * newData,0);
					r.tien_xuat = Math.round(r.tien_xuat_nt * newData,0);
				});
				scope.data.t_thue = Math.round(scope.data.t_thue_nt * newData,0)
			}
		}
	});
	scope.$watch('data.thue_suat',function(newData){
		if(scope.data){
			if(newData!=undefined && scope.isDataLoaded){
				scope.data.t_thue_nt = Math.round((scope.data.t_tien_hang_nt-scope.data.t_ck_nt) * scope.data.thue_suat/100,scope.round);
				scope.data.t_thue = Math.round(scope.data.t_thue_nt * scope.data.ty_gia,0)
			}
		}
	});
	scope.$watch('data.t_tien_hang_nt',function(newData){
		if(scope.data){
			if(newData!=undefined && scope.isDataLoaded){
				scope.data.t_thue_nt = Math.round((scope.data.t_tien_hang_nt-scope.data.t_ck_nt) * scope.data.thue_suat/100,scope.round);
				scope.data.t_thue = Math.round(scope.data.t_thue_nt * scope.data.ty_gia,0)
			}
		}
	});
	scope.$watch('data.t_tien_hang',function(newData){
		if(scope.data){
			if(newData!=undefined && scope.isDataLoaded){
				scope.data.t_thue = Math.round((scope.data.t_tien_hang-scope.data.t_ck) * scope.data.thue_suat/100,0);
			}
		}
	});
}

pn5Module.module.setDataSource2Print = function($scope,service,config){
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