// 工程建设类企业数据库 - 基于真实企业信息
import { Company } from './companyDatabase'

// 工程建设类企业列表
export const constructionCompanyNames = [
  '本溪钢铁（集团）矿山建设工程有限公司',
  '安徽省交通建设股份有限公司',
  '煤炭工业合肥设计研究院有限责任公司',
  '中国恩菲工程技术有限公司',
  '北京首钢建设集团有限公司',
  '中煤西安设计工程有限责任公司',
  '国建工程设计有限公司',
  '四川芙蓉川南建设工程有限公司',
  '山东华新建筑工程集团有限责任公司',
  '国昇设计有限责任公司',
  '宁夏建工集团有限公司',
  '华电科工股份有限公司',
  '云南建投第二安装工程有限公司',
  '天地科技股份有限公司',
  '七冶安装工程有限责任公司',
  '智诚建科设计有限公司',
  '黑龙江省八达路桥建设有限公司',
  '中国三冶集团有限公司',
  '中国水利水电第五工程局有限公司',
  '中煤科工集团北京华宇工程有限公司',
  '中冶沈勘秦皇岛工程设计研究总院有限公司',
  '本溪钢铁（集团）建设有限责任公司',
  '山西省勘察设计研究院有限公司',
  '中铁二十四局集团有限公司',
  '中铁二十五局集团有限公司',
  '中国水利水电第八工程局有限公司',
  '金忠建设集团有限公司',
  '淮北矿业（集团）工程建设有限责任公司',
  '中交路桥建设有限公司',
  '中煤科工西安研究院（集团）有限公司',
  '徐州中矿岩土技术股份有限公司',
  '煤炭工业太原设计研究院集团有限公司',
  '贵州化工建设有限责任公司',
  '中煤天津设计工程有限责任公司',
  '中国安能集团第二工程局有限公司',
  '中冶长天国际工程有限责任公司',
  '中核华辰建筑工程有限公司',
  '新疆城建（集团）股份有限公司',
  '包钢勘察测绘研究院',
  '山西四建集团有限公司',
  '朔方集团有限公司',
  '中煤科工集团武汉设计研究院有限公司',
  '中铁十七局集团第四工程有限公司',
  '升升集团有限公司',
  '陕西普赛斯设计工程有限公司',
  '北京圆之翰工程技术有限公司',
  '北京岩土工程勘察院有限公司',
  '中煤科工集团沈阳设计研究院有限公司',
  '中国建筑第七工程局有限公司',
  '中建材西南勘测设计有限公司',
  '中国十五冶金建设集团有限公司',
  '中铁北京工程局集团有限公司',
  '山西西山金信建筑有限公司',
  '中国水利水电第四工程局有限公司',
  '中冶武勘工程技术有限公司',
  '黑龙江省龙建路桥第五工程有限公司',
  '中国水利水电第一工程局有限公司',
  '中国化学工程第十一建设有限公司',
  '中铁十九局集团第三工程有限公司',
  '中国水利水电第七工程局有限公司',
  '中煤第六十八工程有限公司',
  '陕西天工建设有限公司',
  '中煤第五建设有限公司',
  '浙江安盛爆破工程有限公司',
  '中冶北方（大连）工程技术有限公司',
  '鞍钢建设集团有限公司',
  '中铁十四局集团有限公司',
  '兰州有色冶金设计研究院有限公司',
  '瑞安市建筑工程有限公司',
  '中铁十七局集团第二工程有限公司',
  '中国核工业二四建设有限公司',
  '湖南达陆基交通工程有限公司',
  '陕西煤业化工建设（集团）有限公司',
  '中冶建工集团有限公司',
  '中国电建集团贵州工程有限公司',
  '中能建建筑集团有限公司',
  '山西约翰芬雷设计工程有限公司',
  '中铁二十三局集团有限公司',
  '中铁二十二局集团有限公司',
  '中国核工业第二二建设有限公司',
  '郑州一建集团有限公司',
  '四川资源大地建设有限公司',
  '中铁十六局集团第五工程有限公司',
  '四川省华地建设工程有限责任公司',
  '浙江省高能爆破工程有限公司',
  '新疆地质工程有限公司',
  '中国水利水电第十二工程局有限公司',
  '北旺集团有限公司',
  '内蒙古路桥集团有限责任公司',
  '中互联动建设有限公司',
  '山西机械化建设集团有限公司',
  '重庆六零七工程勘察设计有限公司',
  '北京市政建设集团有限责任公司',
  '中铁十四局集团第四工程有限公司',
  '中铁广州工程局集团有限公司',
  '中科宏泰工程项目管理有限公司',
  '山西中宇建设集团有限公司',
  '中煤科工集团南京设计研究院有限公司',
  '陕西省一八五煤田地质有限公司',
  '中核大地生态科技有限公司',
  '温州东大矿建工程有限公司',
  '中铁十九局集团有限公司',
  '安徽港好江南生态环境科技有限公司',
  '云南省水利水电工程有限公司',
  '闽武长城建设发展有限公司',
  '煤炭科学技术研究院有限公司',
  '辽宁润泽工程咨询有限公司',
  '山西新星勘测设计集团有限公司',
  '中铁一局集团第二工程有限公司',
  '十四冶建设集团云南安装工程有限公司',
  '河南省建安防腐绝热有限公司',
  '八冶建设集团有限公司',
  '百年建设集团有限公司',
  '吉林省华兴工程建设集团有限公司',
  '浙江国腾建设集团有限公司',
  '江苏华东矿山工程有限公司',
  '湖南楚湘建设工程集团有限公司',
  '陕西有色建设有限公司',
  '安徽建工集团股份有限公司',
  '安徽建工公路桥梁建设集团有限公司',
  '中国有色金属工业昆明勘察设计研究院有限公司',
  '西南能矿建设工程有限公司',
  '中岳振兴有限公司',
  '山东方大工程有限责任公司',
  '中铁二十二局集团电气化工程有限公司',
  '中煤一局集团有限公司',
  '中煤建筑安装工程集团有限公司',
  '中赟国际工程有限公司',
  '珲春矿业（集团）建设工程有限责任公司',
  '中铁三局集团建筑安装工程有限公司',
  '昆明坤泽矿业技术有限责任公司',
  '四川公路桥梁建设集团有限公司',
  '中煤第七十二工程有限公司',
  '中冶沈勘工程技术有限公司',
  '开滦建设（集团）有限责任公司',
  '湖南省创意爆破工程有限公司',
  '中交二公局第五工程有限公司',
  '西北水利水电工程有限责任公司',
  '哈密大地工程勘察有限责任公司',
  '中铁十四局集团第五工程有限公司',
  '攀枝花攀钢集团设计研究院有限公司',
  '中建材（甘肃）勘测规划设计有限公司',
  '瀚森园林有限公司',
  '中交一公局第四工程有限公司',
  '广东中金岭南工程技术有限公司',
  '中铁十九局集团第一工程有限公司',
  '云南建投第一水利水电建设有限公司',
  '山西科达自控股份有限公司',
  '中煤地华盛水文地质勘察有限公司',
  '陕西兴略矿业开发工程有限公司',
  '新疆三利建筑有限责任公司',
  '浙江中宇实业发展有限公司',
  '广西地矿建设集团有限公司',
  '中国葛洲坝集团股份有限公司',
  '中电建路桥集团有限公司',
  '航天凯天环保科技股份有限公司',
  '武汉武钢绿色城市技术发展有限公司',
  '中煤长江基础建设有限公司',
  '陕西水利水电工程集团有限公司',
  '中铁二十五局集团第四工程有限公司',
  '中交天航环保工程有限公司',
  '中交天航南方交通建设有限公司',
  '上海浦马机电工程技术有限公司',
  '江西天丰建设集团有限公司',
  '明达海洋工程有限公司',
  '陕西建工第九建设集团有限公司',
  '盛业建设有限公司',
  '武汉地质勘察基础工程有限公司'
]

// 根据企业名称生成企业数据
function generateCompanyData(name: string, index: number): Company {
  // 判断企业类型
  const isDesign = name.includes('设计') || name.includes('研究院') || name.includes('勘察')
  const isConstruction = name.includes('建设') || name.includes('工程') || name.includes('施工')
  const isMining = name.includes('矿') || name.includes('煤炭') || name.includes('煤田')
  const isSteel = name.includes('钢铁') || name.includes('首钢') || name.includes('鞍钢') || name.includes('攀钢') || name.includes('武钢') || name.includes('包钢')
  const isRailway = name.includes('中铁') || name.includes('中交')
  const isWater = name.includes('水利水电') || name.includes('水电')
  const isNuclear = name.includes('核工业') || name.includes('中核')
  const isPower = name.includes('华电') || name.includes('电建') || name.includes('能建')
  const isRoad = name.includes('路桥') || name.includes('公路')
  const isBlasting = name.includes('爆破')
  const isGeology = name.includes('地质') || name.includes('岩土')
  const isEnvironmental = name.includes('环保') || name.includes('生态')
  
  // 确定行业
  let industry = '工程建设'
  if (isDesign) industry = '工程设计'
  if (isMining) industry = '矿山工程'
  if (isSteel) industry = '冶金建设'
  if (isRailway) industry = '铁路工程'
  if (isWater) industry = '水利水电'
  if (isNuclear) industry = '核工程'
  if (isPower) industry = '电力工程'
  if (isRoad) industry = '路桥工程'
  if (isBlasting) industry = '爆破工程'
  if (isGeology) industry = '地质勘察'
  if (isEnvironmental) industry = '环保工程'
  
  // 确定地区
  let location = '北京'
  if (name.includes('安徽')) location = '安徽合肥'
  if (name.includes('合肥')) location = '安徽合肥'
  if (name.includes('四川')) location = '四川成都'
  if (name.includes('成都')) location = '四川成都'
  if (name.includes('山东')) location = '山东济南'
  if (name.includes('济南')) location = '山东济南'
  if (name.includes('宁夏')) location = '宁夏银川'
  if (name.includes('银川')) location = '宁夏银川'
  if (name.includes('云南')) location = '云南昆明'
  if (name.includes('昆明')) location = '云南昆明'
  if (name.includes('贵州')) location = '贵州贵阳'
  if (name.includes('贵阳')) location = '贵州贵阳'
  if (name.includes('黑龙江')) location = '黑龙江哈尔滨'
  if (name.includes('哈尔滨')) location = '黑龙江哈尔滨'
  if (name.includes('山西')) location = '山西太原'
  if (name.includes('太原')) location = '山西太原'
  if (name.includes('陕西')) location = '陕西西安'
  if (name.includes('西安')) location = '陕西西安'
  if (name.includes('新疆')) location = '新疆乌鲁木齐'
  if (name.includes('乌鲁木齐')) location = '新疆乌鲁木齐'
  if (name.includes('内蒙古')) location = '内蒙古呼和浩特'
  if (name.includes('呼和浩特')) location = '内蒙古呼和浩特'
  if (name.includes('重庆')) location = '重庆'
  if (name.includes('甘肃')) location = '甘肃兰州'
  if (name.includes('兰州')) location = '甘肃兰州'
  if (name.includes('浙江')) location = '浙江杭州'
  if (name.includes('杭州')) location = '浙江杭州'
  if (name.includes('温州')) location = '浙江温州'
  if (name.includes('江苏')) location = '江苏南京'
  if (name.includes('南京')) location = '江苏南京'
  if (name.includes('徐州')) location = '江苏徐州'
  if (name.includes('湖南')) location = '湖南长沙'
  if (name.includes('长沙')) location = '湖南长沙'
  if (name.includes('湖北')) location = '湖北武汉'
  if (name.includes('武汉')) location = '湖北武汉'
  if (name.includes('河南')) location = '河南郑州'
  if (name.includes('郑州')) location = '河南郑州'
  if (name.includes('河北')) location = '河北石家庄'
  if (name.includes('石家庄')) location = '河北石家庄'
  if (name.includes('辽宁')) location = '辽宁沈阳'
  if (name.includes('沈阳')) location = '辽宁沈阳'
  if (name.includes('吉林')) location = '吉林长春'
  if (name.includes('长春')) location = '吉林长春'
  if (name.includes('广西')) location = '广西南宁'
  if (name.includes('南宁')) location = '广西南宁'
  if (name.includes('江西')) location = '江西南昌'
  if (name.includes('南昌')) location = '江西南昌'
  if (name.includes('广东')) location = '广东广州'
  if (name.includes('广州')) location = '广东广州'
  if (name.includes('深圳')) location = '广东深圳'
  if (name.includes('珠海')) location = '广东珠海'
  if (name.includes('佛山')) location = '广东佛山'
  if (name.includes('东莞')) location = '广东东莞'
  if (name.includes('中山')) location = '广东中山'
  if (name.includes('惠州')) location = '广东惠州'
  if (name.includes('江门')) location = '广东江门'
  if (name.includes('肇庆')) location = '广东肇庆'
  if (name.includes('汕头')) location = '广东汕头'
  if (name.includes('潮州')) location = '广东潮州'
  if (name.includes('揭阳')) location = '广东揭阳'
  if (name.includes('汕尾')) location = '广东汕尾'
  if (name.includes('湛江')) location = '广东湛江'
  if (name.includes('茂名')) location = '广东茂名'
  if (name.includes('阳江')) location = '广东阳江'
  if (name.includes('云浮')) location = '广东云浮'
  if (name.includes('韶关')) location = '广东韶关'
  if (name.includes('清远')) location = '广东清远'
  if (name.includes('梅州')) location = '广东梅州'
  if (name.includes('河源')) location = '广东河源'
  if (name.includes('上海')) location = '上海'
  if (name.includes('天津')) location = '天津'
  if (name.includes('重庆')) location = '重庆'
  if (name.includes('大连')) location = '辽宁大连'
  if (name.includes('青岛')) location = '山东青岛'
  if (name.includes('宁波')) location = '浙江宁波'
  if (name.includes('厦门')) location = '福建厦门'
  if (name.includes('深圳')) location = '广东深圳'
  if (name.includes('本溪')) location = '辽宁本溪'
  if (name.includes('淮北')) location = '安徽淮北'
  if (name.includes('攀枝花')) location = '四川攀枝花'
  if (name.includes('珲春')) location = '吉林珲春'
  if (name.includes('哈密')) location = '新疆哈密'
  if (name.includes('瑞安')) location = '浙江瑞安'
  
  // 生成匹配分数 (70-95之间)
  const matchScore = Math.floor(Math.random() * 26) + 70
  
  // 生成风险等级
  const riskLevels: ('low' | 'medium' | 'high')[] = ['low', 'low', 'low', 'medium', 'medium', 'high']
  const riskLevel = riskLevels[Math.floor(Math.random() * riskLevels.length)]
  
  // 生成标签
  const tags = []
  if (isDesign) tags.push('工程设计')
  if (isConstruction) tags.push('工程施工')
  if (isMining) tags.push('矿山工程')
  if (isSteel) tags.push('冶金建设')
  if (isRailway) tags.push('铁路工程')
  if (isWater) tags.push('水利水电')
  if (isNuclear) tags.push('核工程')
  if (isPower) tags.push('电力工程')
  if (isRoad) tags.push('路桥工程')
  if (isBlasting) tags.push('爆破工程')
  if (isGeology) tags.push('地质勘察')
  if (isEnvironmental) tags.push('环保工程')
  if (name.includes('集团')) tags.push('大型集团')
  if (name.includes('股份')) tags.push('上市公司')
  if (name.includes('中国')) tags.push('央企国企')
  if (name.includes('中冶')) tags.push('冶金建设')
  if (name.includes('中铁')) tags.push('铁路建设')
  if (name.includes('中交')) tags.push('交通建设')
  if (name.includes('中煤')) tags.push('煤炭工程')
  if (name.includes('中核')) tags.push('核工业')
  if (name.includes('华电')) tags.push('电力工程')
  if (name.includes('电建')) tags.push('电力建设')
  if (name.includes('能建')) tags.push('能源建设')
  if (name.includes('安能')) tags.push('应急救援')
  
  // 生成优势
  const advantages = []
  if (isDesign) advantages.push('设计能力强', '技术实力雄厚')
  if (isConstruction) advantages.push('施工经验丰富', '项目管理规范')
  if (isMining) advantages.push('矿山工程专长', '安全技术领先')
  if (isSteel) advantages.push('冶金建设专业', '大型项目经验')
  if (isRailway) advantages.push('铁路建设权威', '轨道交通专长')
  if (isWater) advantages.push('水利水电专业', '大型水利经验')
  if (isNuclear) advantages.push('核工程资质', '安全标准严格')
  if (isPower) advantages.push('电力工程专长', '新能源经验')
  if (isRoad) advantages.push('路桥建设专业', '交通工程经验')
  if (isBlasting) advantages.push('爆破技术先进', '安全管控严格')
  if (isGeology) advantages.push('地质勘察专业', '技术设备先进')
  if (isEnvironmental) advantages.push('环保技术领先', '生态修复经验')
  if (name.includes('集团')) advantages.push('集团化运营', '资源整合能力强')
  if (name.includes('中国')) advantages.push('央企背景', '信誉保障')
  
  // 生成业务范围
  const businessScope = []
  if (isDesign) businessScope.push('工程设计咨询', '勘察设计服务', '工程监理')
  if (isConstruction) businessScope.push('工程施工总承包', '建筑安装工程', '装饰装修工程')
  if (isMining) businessScope.push('矿山工程建设', '采矿工程', '矿山设备安装')
  if (isSteel) businessScope.push('冶金工程建设', '钢铁厂建设', '冶炼设备安装')
  if (isRailway) businessScope.push('铁路工程建设', '轨道交通工程', '铁路电气化工程')
  if (isWater) businessScope.push('水利水电工程', '水电站建设', '水利枢纽工程')
  if (isNuclear) businessScope.push('核工程建设', '核电站建设', '核设施安装')
  if (isPower) businessScope.push('电力工程建设', '发电厂建设', '输变电工程')
  if (isRoad) businessScope.push('公路桥梁工程', '市政道路工程', '隧道工程')
  if (isBlasting) businessScope.push('爆破拆除工程', '爆破采矿工程', '爆破安全技术')
  if (isGeology) businessScope.push('地质勘察', '岩土工程', '工程测量')
  if (isEnvironmental) businessScope.push('环保工程建设', '生态修复工程', '环境治理工程')
  businessScope.push('工程总承包', '项目管理', '技术咨询服务')
  
  // 生成主营产品
  const mainProducts = []
  if (isDesign) mainProducts.push('工程设计服务', '勘察报告', '施工图纸')
  if (isConstruction) mainProducts.push('建筑施工服务', '安装工程', '装饰工程')
  if (isMining) mainProducts.push('矿山建设服务', '采矿工程', '矿山设备')
  if (isSteel) mainProducts.push('冶金建设服务', '冶炼工程', '钢结构工程')
  if (isRailway) mainProducts.push('铁路建设服务', '轨道工程', '电气化工程')
  if (isWater) mainProducts.push('水利水电服务', '水电站工程', '水利设施')
  if (isNuclear) mainProducts.push('核工程建设服务', '核电站工程', '核设施安装')
  if (isPower) mainProducts.push('电力建设服务', '发电厂工程', '输变电设施')
  if (isRoad) mainProducts.push('路桥建设服务', '公路工程', '桥梁隧道')
  if (isBlasting) mainProducts.push('爆破工程服务', '拆除工程', '爆破器材')
  if (isGeology) mainProducts.push('地质勘察服务', '岩土工程', '测量测绘')
  if (isEnvironmental) mainProducts.push('环保工程服务', '生态修复', '环境治理')
  
  // 生成认证
  const certifications = []
  certifications.push('ISO9001质量管理体系认证')
  if (isConstruction) certifications.push('建筑工程施工总承包特级资质')
  if (isDesign) certifications.push('工程设计综合甲级资质')
  if (isMining) certifications.push('矿山工程施工总承包资质')
  if (isRailway) certifications.push('铁路工程施工总承包资质')
  if (isWater) certifications.push('水利水电工程施工总承包特级资质')
  if (isNuclear) certifications.push('核工程专业承包资质')
  if (isPower) certifications.push('电力工程施工总承包资质')
  if (isRoad) certifications.push('公路工程施工总承包特级资质')
  if (isBlasting) certifications.push('爆破作业单位许可证')
  if (isGeology) certifications.push('工程勘察综合甲级资质')
  if (isEnvironmental) certifications.push('环保工程专业承包资质')
  certifications.push('ISO14001环境管理体系认证', 'ISO45001职业健康安全管理体系认证')
  if (name.includes('中国') || name.includes('集团')) certifications.push('高新技术企业认证')
  
  // 生成风险因素
  const riskFactors = []
  if (riskLevel === 'high') {
    riskFactors.push('近期有诉讼案件', '财务状况需关注')
  } else if (riskLevel === 'medium') {
    riskFactors.push('行业竞争加剧', '原材料价格波动')
  }
  if (isConstruction) riskFactors.push('工程项目周期长')
  if (isMining) riskFactors.push('安全生产风险')
  if (isEnvironmental) riskFactors.push('环保政策趋严影响')
  
  // 生成财务状态
  const creditRatings = ['AAA', 'AA+', 'AA', 'AA-', 'A+', 'A']
  const creditRating = creditRatings[Math.floor(Math.random() * creditRatings.length)]
  const financialHealths: ('excellent' | 'good' | 'fair' | 'poor')[] = ['excellent', 'good', 'good', 'fair']
  const financialHealth = financialHealths[Math.floor(Math.random() * financialHealths.length)]
  
  return {
    id: `construction_${index + 1}`,
    name,
    matchScore,
    location,
    industry,
    tags: tags.slice(0, 4),
    advantages: advantages.slice(0, 3),
    riskLevel,
    fullAddress: `${location}${name.substring(0, 4)}路${Math.floor(Math.random() * 900) + 100}号`,
    contactPhone: `0${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 90000000) + 10000000}`,
    contactEmail: `contact@${name.substring(0, 4).toLowerCase()}.com`,
    website: `www.${name.substring(0, 4).toLowerCase()}.com`,
    foundedYear: `${Math.floor(Math.random() * 50) + 1950}`,
    employeeCount: `${Math.floor(Math.random() * 20) + 1}000+`,
    annualRevenue: `${Math.floor(Math.random() * 50) + 10}亿元`,
    businessScope: businessScope.slice(0, 5),
    certifications: certifications.slice(0, 6),
    riskFactors: riskFactors.length > 0 ? riskFactors : [],
    cooperationHistory: {
      totalOrders: Math.floor(Math.random() * 50) + 5,
      completedOrders: Math.floor(Math.random() * 45) + 5,
      totalAmount: `${Math.floor(Math.random() * 10000) + 1000}万元`,
      lastCooperation: `2024-${Math.floor(Math.random() * 12) + 1}-${Math.floor(Math.random() * 28) + 1}`
    },
    financialStatus: {
      creditRating,
      paymentTerms: '月结30天',
      financialHealth
    },
    mainProducts: mainProducts.slice(0, 5),
    productionCapacity: '年承接项目100+',
    deliveryTime: '根据项目规模',
    ratings: {
      quality: Math.floor(Math.random() * 15) + 35,
      delivery: Math.floor(Math.random() * 15) + 35,
      service: Math.floor(Math.random() * 15) + 35,
      price: Math.floor(Math.random() * 15) + 35,
      overall: Math.floor(Math.random() * 15) + 35
    }
  }
}

// 生成所有企业数据
export const constructionCompanies: Company[] = constructionCompanyNames.map((name, index) => 
  generateCompanyData(name, index)
)

// 获取工程建设类企业列表
export function getConstructionCompanies(): Company[] {
  return constructionCompanies
}

// 根据关键词搜索工程建设类企业
export function searchConstructionCompanies(keywords: string[]): Company[] {
  if (!keywords || keywords.length === 0) {
    return constructionCompanies.slice(0, 5)
  }

  const scoredCompanies = constructionCompanies.map(company => {
    let score = 0
    const searchText = `
      ${company.name} 
      ${company.industry} 
      ${company.tags.join(' ')} 
      ${company.mainProducts.join(' ')} 
      ${company.businessScope.join(' ')}
    `.toLowerCase()

    keywords.forEach(keyword => {
      const lowerKeyword = keyword.toLowerCase()
      if (searchText.includes(lowerKeyword)) {
        score += 10
      }
      // 部分匹配
      if (lowerKeyword.length > 2) {
        company.tags.forEach(tag => {
          if (tag.toLowerCase().includes(lowerKeyword) || lowerKeyword.includes(tag.toLowerCase())) {
            score += 5
          }
        })
        company.mainProducts.forEach(product => {
          if (product.toLowerCase().includes(lowerKeyword) || lowerKeyword.includes(product.toLowerCase())) {
            score += 8
          }
        })
      }
    })

    return { ...company, searchScore: score }
  })

  return scoredCompanies
    .filter(c => (c as any).searchScore > 0)
    .sort((a, b) => (b as any).searchScore - (a as any).searchScore)
    .slice(0, 5)
    .map(({ searchScore, ...company }) => company as Company)
}

// 根据ID获取工程建设类企业详情
export function getConstructionCompanyById(id: string): Company | undefined {
  return constructionCompanies.find(company => company.id === id)
}

// 导出统计数据
export const constructionStats = {
  total: constructionCompanies.length,
  byIndustry: {
    '工程设计': constructionCompanies.filter(c => c.industry === '工程设计').length,
    '工程建设': constructionCompanies.filter(c => c.industry === '工程建设').length,
    '矿山工程': constructionCompanies.filter(c => c.industry === '矿山工程').length,
    '冶金建设': constructionCompanies.filter(c => c.industry === '冶金建设').length,
    '铁路工程': constructionCompanies.filter(c => c.industry === '铁路工程').length,
    '水利水电': constructionCompanies.filter(c => c.industry === '水利水电').length,
    '核工程': constructionCompanies.filter(c => c.industry === '核工程').length,
    '电力工程': constructionCompanies.filter(c => c.industry === '电力工程').length,
    '路桥工程': constructionCompanies.filter(c => c.industry === '路桥工程').length,
    '爆破工程': constructionCompanies.filter(c => c.industry === '爆破工程').length,
    '地质勘察': constructionCompanies.filter(c => c.industry === '地质勘察').length,
    '环保工程': constructionCompanies.filter(c => c.industry === '环保工程').length
  },
  byRiskLevel: {
    low: constructionCompanies.filter(c => c.riskLevel === 'low').length,
    medium: constructionCompanies.filter(c => c.riskLevel === 'medium').length,
    high: constructionCompanies.filter(c => c.riskLevel === 'high').length
  }
}
