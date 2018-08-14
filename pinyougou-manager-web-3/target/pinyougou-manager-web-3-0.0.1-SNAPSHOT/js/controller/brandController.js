app.controller('brandController',function($scope,$controller,brandService){
	
	$controller('baseController',{$scope:$scope})
	$scope.findAll=function(){
		brandService.findAll().success(function(response){
			$scope.list=response
		})
	}
	
	
	// 分页查找
	$scope.findPage=function(page, size){
		brandService.findPage(page, size).success(function(response){
			$scope.list=response.rows
		});
	}
	$scope.searchEntity={}
	$scope.search=function(page, size){
		brandService.search(page, size, $scope.searchEntity).success(function(response){
			$scope.paginationConf.totalItems=response.total;
			$scope.list=response.rows;
		});
	}
	
	
	$scope.save=function(){
		var serviceObj;
		if($scope.entity.id!=null){
			serviceObj=brandService.update($scope.entity);
		} else {
			serviceObj=brandService.add($scope.entity);
		}
		serviceObj.success(function(response){
			if(response.success){
				$scope.reloadList();
			}else{
				alert(response.message);
			}
		})
	}
	
	
	
	
	$scope.dele=function(){
		brandService.dele($scope.selectIds).success(function(response){
			if(response.success){
				$scope.reloadList();
			}else{
				alert(response.message);
			}
		});
	}
	
	
})