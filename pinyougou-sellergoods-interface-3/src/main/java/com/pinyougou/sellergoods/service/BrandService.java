package com.pinyougou.sellergoods.service;

import java.util.List;
import java.util.Map;

import com.pinyougou.pojo.TbBrand;

import entity.PageResult;

public interface BrandService {

	
	public List<TbBrand> findAll();
	
	// 分页查询
	public PageResult findPage(int pageNum, int pageSize);

	// 条件分页查询
	public PageResult search(TbBrand brand, int pageNum, int pageSize);
	
	
	public void add(TbBrand brand);
	
	
	public void delete(Long[] ids);
	
	public TbBrand findOne(Long id);
	
	public void update(TbBrand brand);
	
	List<Map> selectOptionList();
}
