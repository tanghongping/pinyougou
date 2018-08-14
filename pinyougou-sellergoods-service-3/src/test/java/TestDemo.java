import java.util.List;
import java.util.Map;

import org.junit.Before;
import org.junit.Test;
import org.springframework.context.support.ClassPathXmlApplicationContext;

import com.pinyougou.mapper.TbBrandMapper;

public class TestDemo {

	
	ClassPathXmlApplicationContext ctx = null;
	
	// @Before
	public void init() {
		
		// classpath*   注意需要这个  *  不然一次只能加载一个配置文件
		ctx = new ClassPathXmlApplicationContext("classpath*:spring/applicationContext*.xml");
	}
	
	// @Test
	public void test01() {
		/*String[] names = ctx.getBeanDefinitionNames();
		System.out.println(ctx);
		for(String name : names) {
			System.out.println(name);
		}*/
		
		TbBrandMapper tbBrandMapper = ctx.getBean("tbBrandMapper",TbBrandMapper.class);
		
		// Map map = tbBrandMapper.findById(1L);
		List<Map> list = tbBrandMapper.findAll();
		System.out.println(list);
	}
	
	
	
	
	
}
