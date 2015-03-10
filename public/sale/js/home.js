var homeModule = angular.module('homeModule',['ngRoute']);
homeModule.directive('parseHtml',function(){
	return{
		restrict:'A',
		scope:{
			parseHtml:'='
			
		},
		link:function(scope,elem,attrs,controller){
			scope.$watch('parseHtml',function(newValue,oldValue){
				 if(newValue && newValue!=oldValue){
						elem.html(newValue.replace(/\n/g,'<br/>'));
						
				 }
			});
		}
	}
});
homeModule.directive('thumbnailProduct',function(){
	return{
		restrict:'E',
		scope:{
			product:'='
		},
		templateUrl:"templates/thumbnail-product.html"
	}
});
homeModule.directive('shopBanner',function(){
	return{
		restrict:'E',
		templateUrl:"templates/shop-banner.html"
	}
});
homeModule.controller('homeController',function($scope,$rootScope,$routeParams,$http,$window,$location){
	$rootScope.keywords ="danh sách"
	$window.document.title ="CỬA HÀNG VIỆT"
	$rootScope.og_title = $window.document.title;
	$rootScope.og_url = $window.location.href;
	$rootScope.og_image = ""
	$rootScope.mheight = $window.innerHeight-75
	$http.get("/public/province").success(function(province){
		$scope.province = province;
	});
	$scope.gotoProvince = function(tt){
		var url = "/public/apps";
		if(tt){
			var condition ={province:tt};
			url = url + "?q=" + JSON.stringify(condition);
		}
		$http.get(url).success(function(apps){
			$scope.apps = apps;
		});
	};
	$scope.gotoProvince("");
});
homeModule.controller('shopController',function($scope,$rootScope,$routeParams,$http,$window,$location){
	id_app = $routeParams.id_app;
	$scope.page=1;
	$scope.ma_nvt;
	$rootScope.title =''
	$scope.cart = $rootScope.cart;
	$http.get("/public/apps/" + id_app).success(function(app){
		$window.document.title = app.name
		
		$rootScope.title =app.name
		$rootScope.keywords =app.name
		$rootScope.og_title = $window.document.title;
		$rootScope.og_url = "http://cuahangvietonline.com/?_escaped_fragment_=/" + id_app//$window.location.href.replace("localhost","cuahangvietonline.com").replace("#!","?_escaped_fragment_=");
		$scope.og_url = $rootScope.og_url;
		$rootScope.og_image = $location.protocol() + "://cuahangvietonline.com" + app.logo;
		$rootScope.og_description =app.gioi_thieu;
		$scope.app = app;
		
		
	});
	$http.get("/public/dmnvt?id_app=" + id_app).success(function(dmnvt){
		$scope.dmnvt = dmnvt;
	}).error(function(error){
		console.log(error);
	});
	$http.get("/public/dmvt?limit=5&q={picture_slide:{$ne:null}}&id_app=" + id_app).success(function(dmvt){
		var id=0;
		dmvt.forEach(function(vt){
			vt.id = id;
			id++;
		});
		$scope.spNoiBat = dmvt;
	}).error(function(error){
		console.log(error);
	});
	$http.get("/public/dmvt?limit=4&q={$or:[{khuyen_mai:{$ne:null}},{tien_ck:{$gt:0}}]}&id_app=" + id_app).success(function(dmvt){
		var id=0;
		dmvt.forEach(function(vt){
			vt.id = id;
			id++;
		});
		$scope.vts_km = dmvt;
	}).error(function(error){
		console.log(error);
	});
	$http.get("/public/dmvt?limit=4&q={hot:true}&id_app=" + id_app).success(function(dmvt){
		var id=0;
		dmvt.forEach(function(vt){
			vt.id = id;
			id++;
		});
		$scope.vts_hot = dmvt;
	}).error(function(error){
		console.log(error);
	});
	$scope.id_app = id_app
	$scope.next = function(){
		search($scope.ma_vt,$scope.page+1,$scope.ma_nvt,function(error,result){
			if(error) return;
			if($scope.vts){
				result.forEach(function(v){
					$scope.vts.push(v);
				});
				
			}else{
				$scope.vts = result
			}
		});
	}
	$scope.searchKeyup = function($event){
		if($event.keyCode==13){
			search($scope.ma_vt,1,$scope.ma_nvt,function(error,result){
				$scope.searched = true;
				if(result){
					$scope.vts = result;
				}
			});
		}
	}
	$scope.search = function(ma_vt,page,ma_nvt){
		search(ma_vt,page,ma_nvt,function(error,result){
			$scope.searched = true;
			if(result){
				$scope.vts =result;
			}
		});
	}
	$scope.current_page_data =[];
	var search = function(ma_vt,page,ma_nvt,callback){
		if(!page){
			page =1;
		}
		$scope.page = page;
		$scope.ma_nvt = ma_nvt;
		$scope.ma_vt = ma_vt;
		var url = "/public/dmvt?id_app=" + id_app + "&limit=24";
		if(ma_vt){
			url = url + "&k=" + ma_vt
		}
		if(ma_nvt){
			url = url + "&ma_nvt=" + ma_nvt
		}
		url = url + "&page=" + page
		$http.get(url).success(function(vts){
			$scope.current_page_data =vts;
			callback(null,vts);
		}).error(function(error){
			callback(error);
		});
		
	}
	//init
	search("",1,"",function(error,result){
		if(result){
			$scope.vts =result;
		}
	});
});
homeModule.controller('productController',function($scope,$rootScope,$routeParams,$http,$window,$location){
	id_app = $routeParams.id_app;
	$rootScope.title =''
	$scope.cart = $rootScope.cart;
	var comment_width  = $window.innerWidth - 220;
	if(comment_width>550){
		$scope.comment_width = comment_width;
	}
	
	$http.get("/public/apps/" + id_app).success(function(app){
		$rootScope.title =app.name
		$scope.app = app;
		$scope.id_app = id_app
		
		var idx = $routeParams.id.split(".");
		var id = idx[idx.length-1];
		var url = "/public/dmvt/?id_app=" + id_app + "&q={_id:'" + id + "'}"
		$http.get(url).success(function(vts){
			if(vts.length==1){
				$scope.vt = vts[0];
				$scope.picture = $scope.vt.picture
				$rootScope.vt = $scope.vt;
				$rootScope.id_app = id_app;
				$window.document.title = app.name + " - " + $scope.vt.ten_vt
				$rootScope.keywords =app.name + ", " + $scope.vt.ten_vt
				
				$rootScope.og_title = $window.document.title;
				$rootScope.og_url = "http://cuahangvietonline.com/?_escaped_fragment_=/" + id_app + "/SP." + $scope.vt._id //$window.location.href.replace('localhost','cuahangvietonline.com').replace("#!","?_escaped_fragment_=");
				$scope.og_url = $rootScope.og_url;
				$rootScope.og_image = $location.protocol() + "://cuahangvietonline.com" + $scope.vt.picture;
				$rootScope.og_description =$scope.vt.mieu_ta;
				//cac san pham cung nhom
				url ="/public/dmvt/?limit=4&id_app=" + id_app + "&q={ma_nvt:'" + $scope.vt.ma_nvt + "',ma_vt:{$ne:'" + $scope.vt.ma_vt + "'}}"
				$http.get(url).success(function(vts){
					$scope.other_products = vts;
				}).error(function(error){
					console.log(error);
				});
			}
		});
		
	});
	
	
});
homeModule.controller('cartController',function($scope,$rootScope,$routeParams,$http,$window){
	$window.document.title ="CỬA HÀNG VIỆT - Giỏ hàng"
	$rootScope.title ='Giỏ hàng của bạn'
	$rootScope.keywords ="giỏ hàng"
	$scope.cart = $rootScope.cart;
});
homeModule.controller('ttController',function($scope,$rootScope,$routeParams,$http,$location,ipCookie,$window,ngDialog){
	id_app = $routeParams.id_app;
	$rootScope.title =''
	$scope.cart = $rootScope.cart;
	$scope.dia_chi_giao_hang = ipCookie('dia_chi_giao_hang');
	if(!$scope.dia_chi_giao_hang){
		$scope.dia_chi_giao_hang ={};
	}
	$http.get("/public/apps/" + id_app).success(function(app){
		$rootScope.title =app.name
		$scope.app = app;
		$rootScope.keywords =app.name + ", xác nhận"
		$window.document.title =app.name + " - Xác nhận"
		
		$rootScope.title =app.name
		$rootScope.keywords =app.name
		$rootScope.og_title = $window.document.title;
		$rootScope.og_url = "http://cuahangvietonline.com/?_escaped_fragment_=/" + id_app
		$scope.og_url = $rootScope.og_url;
		$rootScope.og_image = $location.protocol() + "://cuahangvietonline.com" + app.logo;
		$rootScope.og_description =app.gioi_thieu;
	});
	$http.get("/public/province").success(function(province){
		$scope.province = province;
	});
	$http.get("/public/ptthanhtoan?id_app=" + id_app).success(function(ptthanhtoan){
		if(ptthanhtoan){
			$scope.ptthanhtoan = ptthanhtoan;
		}
	});
	$scope.so1 ={}
	$scope.id_app = id_app
	$scope.xacnhan = function(){
		$scope.so1.id_app = id_app;
		_.extend($scope.so1,$scope.dia_chi_giao_hang)
		ipCookie('dia_chi_giao_hang',$scope.dia_chi_giao_hang,{ expires: 365});
		var shop = $scope.cart.shops[id_app]
		if(shop){
			$scope.so1.details = shop.listproducts;
		}else{
			return alert("Không có sản phẩm nào từ của hàng này");
		}
		$http.post("/public/so1?id_app=" + id_app,$scope.so1).success(function(so1){
			delete $scope.cart.shops[id_app];
			$rootScope.apply_cart();
			//alert("Cám ơn bạn đã đặt hàng tại cửa hàng " + $scope.app.name + "\nChúng tôi sẽ liên lạc với bạn trong thời gian sớm nhất để xác nhận đơn đặt hàng.");
			
			var dialog = ngDialog.open({
				template: 'templates/thankyou.html',
				scope: $scope,
				controller:function($scope){
					$scope.close = function(){
						dialog.close();
					}
				}
			});
			dialog.closePromise.then(function (data) {
				$window.location.href="#!/" +  id_app;
			});
			
		}).error(function(error){
			alert(error);
		});
	}
});
homeModule.config(['$routeProvider','$locationProvider',function($routeProvider,$locationProvider){
		$locationProvider.hashPrefix('!');
		$routeProvider
			.when("/",{
				templateUrl:"templates/home.html",
				controller:"homeController"
			})
			.when("/cart",{
				templateUrl:"templates/cart.html",
				controller:"cartController"
			})
			.when("/tt/:id_app",{
				templateUrl:"templates/tt.html",
				controller:"ttController"
			})
			.when("/:id_app",{
				templateUrl:"templates/shop.html",
				controller:"shopController"
			})
			.when("/:id_app/:id",{
				templateUrl:"templates/product.html",
				controller:"productController"
			});
}]);
