 //控制层 
app.controller('goodsController' ,function($scope,$controller   ,goodsService, uploadService, itemCatService, typeTemplateService){	
	
	$controller('baseController',{$scope:$scope});//继承
	
    //读取列表数据绑定到表单中  
	$scope.findAll=function(){
		goodsService.findAll().success(
			function(response){
				$scope.list=response;
			}			
		);
	}    
	
	//分页
	$scope.findPage=function(page,rows){			
		goodsService.findPage(page,rows).success(
			function(response){
				$scope.list=response.rows;	
				$scope.paginationConf.totalItems=response.total;//更新总记录数
			}			
		);
	}
	
	//查询实体 
	$scope.findOne=function(id){				
		goodsService.findOne(id).success(
			function(response){
				$scope.entity= response;					
			}
		);				
	}
	
	//保存 
	$scope.add=function(){	
		$scope.entity.goodsDesc.introduction=editor.html();
		goodsService.add($scope.entity).success(function(response){
			if(response.success){
				alert('保存成功');
				$scope.entity={};
				editor.html('');   // 清空富文本编辑器
			}else{
				alert(response.message);
			}
		});	
	}
	
	 
	//批量删除 
	$scope.dele=function(){			
		//获取选中的复选框			
		goodsService.dele( $scope.selectIds ).success(
			function(response){
				if(response.success){
					$scope.reloadList();//刷新列表
					$scope.selectIds=[];
				}						
			}		
		);				
	}
	
	$scope.searchEntity={};//定义搜索对象 
	
	//搜索
	$scope.search=function(page,rows){			
		goodsService.search(page,rows,$scope.searchEntity).success(
			function(response){
				$scope.list=response.rows;	
				$scope.paginationConf.totalItems=response.total;//更新总记录数
			}			
		);
	}
	
	
	// 上传图片
	$scope.uploadFile=function(){
		uploadService.uploadFile().success(function(response){
			if(response.success){
				// alert('上传成功');
				$scope.image_entity.url=response.message;  // 设置文件地址
				
			}else{
				alert(response.message);
			}
		}).error(function(){
			alert("上传错误!!!");
		});
	}
	
	/////////////////////////////////////////////////////////////
	
	$scope.entity={goods:{},goodsDesc:{itemImages:[],specificationItems:[]}};  // 定义页面实体结构
	// 增加上传的图片到图片列表
	$scope.add_image_entity=function(){
		$scope.entity.goodsDesc.itemImages.push($scope.image_entity);
	}
	
	
	$scope.remove_image_entity=function(index){
		$scope.entity.goodsDesc.itemImages.splice(index, 1);
	}
	
	
	// 一级商品分类
	$scope.selectItemCat1List=function(){
		// console.log('111');
		itemCatService.findByParentId(0).success(function(response){
			$scope.itemCat1List=response;
			// console.log($scope.itemCat1List);
		});
	}
	
	
	// 查询二级分类
	$scope.$watch('entity.goods.category1Id',function(newValue, oldValue){
		// console.log('newValue:' + newValue);
		// console.log('oldVale:' + oldValue);
		itemCatService.findByParentId(newValue).success(function(response){
			$scope.itemCat2List=response;
		});
	});
	
	
	// 查询三级分类
	$scope.$watch('entity.goods.category2Id',function(newValue, oldValue){
		// console.log('newValue:' + newValue);
		// console.log('oldVale:' + oldValue);
		itemCatService.findByParentId(newValue).success(function(response){
			$scope.itemCat3List=response;
		});
	});
	
	// 根据三级分类获取模板
	$scope.$watch('entity.goods.category3Id',function(newValue, oldValue){
		itemCatService.findOne(newValue).success(function(response){
			$scope.entity.goods.typeTemplateId=response.typeId;
		});
	})
	
	
	// 要根据模板id来查询模板里面的品牌   扩展属性
	$scope.$watch('entity.goods.typeTemplateId',function(newValue, oldValue){
		typeTemplateService.findOne(newValue).success(function(response){
			$scope.typeTemplate=response;  // 获取模板类型
			$scope.typeTemplate.brandIds=JSON.parse(response.brandIds);  // 品牌列表
			$scope.typeTemplate.customAttributeItems=JSON.parse(response.customAttributeItems);
			console.log($scope.typeTemplate.customAttributeItems);
		});
		
		typeTemplateService.findSpecList(newValue).success(function(response){
			$scope.specList=response;
		});
		
	})
	
	$scope.updateSpecAttribute=function($event, name,value){
		var object = $scope.searchObjectByKey($scope.entity.goodsDesc.specificationItems,'attributeName',name);
		if(object!=null){
			if($event.target.checked){
				object.attributeValue.push(value);
			}else{
				object.attributeValue.splice(object.attributeValue.indexOf(value),1);
			}
			
			if(object.attributeValue.length==0){
				$scope.entity.goodsDesc.specificationItems.splice(
						$scope.entity.goodsDesc.specificationItems.indexOf(object),1);
			}
		}else{
			$scope.entity.goodsDesc.specificationItems.push({"attributeName":name,"attributeValue":[value]});
		}
	}
	
	
	
	// 从集合中按照key查询对象
	$scope.searchObjectByKey=function(list, key, keyValue){
		for(var i=0; i<list.length;i++){
			if(list[i][key]==keyValue){
				return list[i];
			}
		}
		return null;
	}
	
	
	
	// [{"attributeName":"网络","attributeValue":["移动3G","移动4G","联通3G"]},{"attributeName":"机身内存","attributeValue":["16G","32G"]}]
	
	// 创建SKU列表
	/*$scope.createItemList=function(){
		var newList=[];
		// 初始
		$scope.entity.itemList=[{spec:{},price:0,num:9999,status:'0',isDefault:'0'}];
		// 数据源 数组
		var items = $scope.entity.goodsDesc.specificationItems;
		for(var i = 0; i < items.length; i++) {
			var newList=[];
			for(var j = 0; j < $scope.entity.itemList.length;j++){
				var oldRow=$scope.entity.itemList[j];
				for(var k=0; k<items[i].attributeValue.length; k++){
					var newRow=JSON.parse(JSON.stringify(oldRow));
					newRow.spec[items[i].attributeName]=items[i].attributeValue[k];
					newList.push(newRow);
				}
			}
		}
		console.log(newList);
	}*/
	
	debugger;
	$scope.createItemList=function(){
		$scope.entity.itemList=[{spec:{},price:0,num:99999,status:'0',isDeafult:'0'}];
		var items=$scope.entity.goodsDesc.specificationItems;
		for(var i=0;i<items.length;i++){
			$scope.entity.itemList=addColumn($scope.entity.itemList,items[i].attributeName,items[i].attributeValue);
		}
	}
	
	
	// 添加列值
	/*addColumn=function(list, columnName, columnValues){
		console.log('--------$scope.entity.itemList----------');
		console.log(list);
		console.log('--------$scope.entity.itemList----------');
		// console.log('sss');
		var newList=[];
		for(var i = 0; i < list.length;i++){
			var oldRow=list[i];
			console.log('------oldRow-----');
			console.log(oldRow);
			console.log('------oldRow-----');
			for(var j = 0;j < columnValues.length; j++){
				var newRow = JSON.parse(JSON.stringify(oldRow));
				newRow.spec[columnName]=columnValues[j];
				newList.push(newRow);
				console.log('------newRow------');
				console.log(newRow);
				console.log('------newRow------');
				
			}
		}
		console.log(newList);
		return newList;
	}*/
	
	
	
	addColumn=function(list, columnName, columnValues){
		var newList=[];
		for(var i = 0; i < list.length;i++){
			var oldRow=list[i];
			for(var j = 0;j < columnValues.length; j++){
				var newRow = JSON.parse(JSON.stringify(oldRow));
				newRow.spec[columnName]=columnValues[j];
				newList.push(newRow);
			}
		}
		return newList;
	}
    
});	
