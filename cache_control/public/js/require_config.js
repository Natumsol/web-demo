/**
 *@description: requireJS 配置文件
 *@author: LiuJ
 */

require.config({
	baseUrl: "/js", // 根目录
	paths:{
		
	},
	shim: {
		"jQuery": {
			exports: "$"
		}
	},
	map: {
		'*': {
			"index": "index-50beb83147",
			"lib/jQuery/jQuery": "lib/jQuery/jQuery-6fb04c3964",
			"require": "require-c8e8015f8d",
			"require_config": "require_config-84a4bb34cb",
			"style": "style-125d3a3f82",
			"tools": "tools-eecff04491"
		}
	}
});