var dmvtModule = new baseInput('dmvt','dmvt',["ma_vt","ten_vt"],'Danh mục vật tư, hàng hóa');
dmvtModule.defaultValues ={gia_xuat:'1',tk_vt:'1561'};
dmvtModule.module.controller("initDmvt",["$scope","$window","$interval",function($scope,$window,$interval){
	$scope.changePicture_slide = function(){
		var w = $window.open("#uploadfile/products","Upload file","width=600,height=300");
		var interval = $interval(function(){
			if(w.document.body.innerHTML=="success"){
				$scope.data.picture_slide = w.document.title;
				var sp = w.document.title.split(".");
				$scope.data.picture_slide_thumb = w.document.title + ".thumb." + sp[sp.length-1];
				w.close();
				$interval.cancel(interval);
			}
		},100);
		
	}
	$scope.changePicture = function(){
		var w = $window.open("#uploadfile/products","Upload file","width=600,height=300");
		var interval = $interval(function(){
			if(w.document.body.innerHTML=="success"){
				$scope.data.picture = w.document.title;
				var sp = w.document.title.split(".");
				$scope.data.picture_thumb = w.document.title + ".thumb." + sp[sp.length-1];
				w.close();
				$interval.cancel(interval);
			}
		},100);
		
	}
	$scope.changePicture2 = function(){
		var w = $window.open("#uploadfile/products","Upload file","width=600,height=300");
		var interval = $interval(function(){
			if(w.document.body.innerHTML=="success"){
				$scope.data.picture2 = w.document.title;
				var sp = w.document.title.split(".");
				$scope.data.picture2_thumb = w.document.title + ".thumb." + sp[sp.length-1];
				w.close();
				$interval.cancel(interval);
			}
		},100);
		
	}
	$scope.changePicture3 = function(){
		var w = $window.open("#uploadfile/products","Upload file","width=600,height=300");
		var interval = $interval(function(){
			if(w.document.body.innerHTML=="success"){
				$scope.data.picture3 = w.document.title;
				var sp = w.document.title.split(".");
				$scope.data.picture3_thumb = w.document.title + ".thumb." + sp[sp.length-1];
				w.close();
				$interval.cancel(interval);
			}
		},100);
		
	}
	$scope.changePicture4 = function(){
		var w = $window.open("#uploadfile/products","Upload file","width=600,height=300");
		var interval = $interval(function(){
			if(w.document.body.innerHTML=="success"){
				$scope.data.picture4 = w.document.title;
				var sp = w.document.title.split(".");
				$scope.data.picture4_thumb = w.document.title + ".thumb." + sp[sp.length-1];
				w.close();
				$interval.cancel(interval);
			}
		},100);
		
	}
	$scope.changePicture5 = function(){
		var w = $window.open("#uploadfile/products","Upload file","width=600,height=300");
		var interval = $interval(function(){
			if(w.document.body.innerHTML=="success"){
				$scope.data.picture5 = w.document.title;
				var sp = w.document.title.split(".");
				$scope.data.picture5_thumb = w.document.title + ".thumb." + sp[sp.length-1];
				w.close();
				$interval.cancel(interval);
			}
		},100);
	}
}]);
dmvtModule.init = function($scope,$controller){
	$controller("initDmvt",{$scope:$scope});
	$scope.updatePrice = function(r){
		if(r.gia_ban_le && r.ty_le_ck){
			r.tien_ck = Math.round(r.gia_ban_le * r.ty_le_ck,0)
		}
		$scope.update(r)
	}
	$scope.$watch('data.ty_le_ck',function(newData){
		if($scope.isDataLoaded && $scope.data.gia_ban_le && $scope.data.ty_le_ck){
			$scope.data.tien_ck = Math.round($scope.data.ty_le_ck * $scope.data.gia_ban_le/100,0);
		}
	});
	$scope.$watch('data.gia_ban_le',function(newData){
		if($scope.isDataLoaded && $scope.data.gia_ban_le && $scope.data.ty_le_ck){
			$scope.data.tien_ck = Math.round($scope.data.ty_le_ck * $scope.data.gia_ban_le/100,0);
		}
	});
}
