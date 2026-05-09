// 供应商数据存储服务
// 用于实现供应商在不同状态间的流转：寻源结果 -> 备选池 -> 正式供应商

export interface Supplier {
  id: string
  name: string
  logo?: string
  logoColor?: string
  matchScore: number
  industry: string
  location: string
  foundedYear: string
  employeeCount: string
  certifications: string[]
  coreAdvantage: string
  monthlyCapacity: string
  customers: string
  addedAt: string
  status: 'pending' | 'approved' | 'rejected' | 'official'
  fullAddress?: string
  contactPhone?: string
  contactEmail?: string
  website?: string
  annualRevenue?: string
  businessScope?: string[]
  riskLevel?: 'low' | 'medium' | 'high'
  mainProducts?: string[]
  productionCapacity?: string
  deliveryTime?: string
  // 正式供应商特有字段
  contact?: string
  phone?: string
  email?: string
  address?: string
  cooperationYears?: number
  totalOrders?: number
  monthlyAmount?: number
  qualityScore?: number
  lastOrderDate?: string
  // 监控状态
  isMonitored?: boolean
  // 扩展字段 - 用于兼容Company接口
  cooperationHistory?: {
    totalOrders: number
    completedOrders: number
    totalAmount: string
    lastCooperation: string
  }
  financialStatus?: {
    creditRating: string
    paymentTerms: string
    financialHealth: 'excellent' | 'good' | 'fair' | 'poor'
  }
  ratings?: {
    quality: number
    delivery: number
    service: number
    price: number
    overall: number
  }
}

const STORAGE_KEYS = {
  POOL: 'supplier_pool',
  OFFICIAL: 'supplier_official',
  ADDED_TO_POOL: 'added_to_pool'
}

// 获取备选池供应商
export function getPoolSuppliers(): Supplier[] {
  const data = localStorage.getItem(STORAGE_KEYS.POOL)
  return data ? JSON.parse(data) : []
}

// 保存备选池供应商
export function savePoolSuppliers(suppliers: Supplier[]) {
  localStorage.setItem(STORAGE_KEYS.POOL, JSON.stringify(suppliers))
}

// 获取正式供应商
export function getOfficialSuppliers(): Supplier[] {
  const data = localStorage.getItem(STORAGE_KEYS.OFFICIAL)
  return data ? JSON.parse(data) : []
}

// 保存正式供应商
export function saveOfficialSuppliers(suppliers: Supplier[]) {
  localStorage.setItem(STORAGE_KEYS.OFFICIAL, JSON.stringify(suppliers))
}

// 获取已加入备选池的企业ID集合
export function getAddedToPoolIds(): Set<string> {
  const data = localStorage.getItem(STORAGE_KEYS.ADDED_TO_POOL)
  return new Set(data ? JSON.parse(data) : [])
}

// 保存已加入备选池的企业ID
export function saveAddedToPoolIds(ids: Set<string>) {
  localStorage.setItem(STORAGE_KEYS.ADDED_TO_POOL, JSON.stringify([...ids]))
}

// 将企业添加到备选池
export function addToPool(supplier: Supplier): boolean {
  const pool = getPoolSuppliers()
  
  // 检查是否已存在
  if (pool.some(s => s.id === supplier.id)) {
    return false
  }
  
  const newSupplier: Supplier = {
    ...supplier,
    status: 'pending',
    addedAt: new Date().toISOString().split('T')[0]
  }
  
  pool.push(newSupplier)
  savePoolSuppliers(pool)
  
  // 更新已加入集合
  const addedIds = getAddedToPoolIds()
  addedIds.add(supplier.id)
  saveAddedToPoolIds(addedIds)
  
  return true
}

// 从备选池移除企业
export function removeFromPool(supplierId: string): boolean {
  const pool = getPoolSuppliers()
  const filtered = pool.filter(s => s.id !== supplierId)
  
  if (filtered.length === pool.length) {
    return false
  }
  
  savePoolSuppliers(filtered)
  
  // 从已加入集合中移除
  const addedIds = getAddedToPoolIds()
  addedIds.delete(supplierId)
  saveAddedToPoolIds(addedIds)
  
  return true
}

// 将备选池企业转为正式供应商
export function promoteToOfficial(supplierId: string): boolean {
  const pool = getPoolSuppliers()
  const official = getOfficialSuppliers()
  
  const supplier = pool.find(s => s.id === supplierId)
  if (!supplier) return false
  
  // 检查是否已在正式供应商中
  if (official.some(s => s.id === supplierId)) {
    return false
  }
  
  const officialSupplier: Supplier = {
    ...supplier,
    status: 'official',
    contact: supplier.contact || '待补充',
    phone: supplier.contactPhone || '待补充',
    email: supplier.contactEmail || '待补充',
    address: supplier.fullAddress || '待补充',
    cooperationYears: 0,
    totalOrders: 0,
    monthlyAmount: 0,
    qualityScore: 4.5,
    lastOrderDate: '-'
  }
  
  official.push(officialSupplier)
  saveOfficialSuppliers(official)
  
  // 从备选池移除
  removeFromPool(supplierId)
  
  return true
}

// 批量将备选池企业转为正式供应商
export function batchPromoteToOfficial(supplierIds: string[]): number {
  let successCount = 0
  supplierIds.forEach(id => {
    if (promoteToOfficial(id)) {
      successCount++
    }
  })
  return successCount
}

// 从正式供应商列表移除企业
export function removeFromOfficial(supplierId: string): boolean {
  const official = getOfficialSuppliers()
  const filtered = official.filter(s => s.id !== supplierId)

  if (filtered.length === official.length) {
    return false
  }

  saveOfficialSuppliers(filtered)
  return true
}

// 切换供应商监控状态
export function toggleMonitorStatus(supplierId: string): boolean {
  const official = getOfficialSuppliers()
  const supplier = official.find(s => s.id === supplierId)

  if (!supplier) {
    return false
  }

  supplier.isMonitored = !supplier.isMonitored
  saveOfficialSuppliers(official)
  return true
}

// 获取已监控的供应商列表
export function getMonitoredSuppliers(): Supplier[] {
  const official = getOfficialSuppliers()
  return official.filter(s => s.isMonitored)
}

// 检查企业是否已在备选池中
export function isInPool(supplierId: string): boolean {
  const pool = getPoolSuppliers()
  return pool.some(s => s.id === supplierId)
}

// 检查企业是否已是正式供应商
export function isOfficial(supplierId: string): boolean {
  const official = getOfficialSuppliers()
  return official.some(s => s.id === supplierId)
}

// 切换企业加入/移除备选池状态
export function togglePoolStatus(supplier: Supplier): { success: boolean; added: boolean; message: string } {
  const pool = getPoolSuppliers()
  const exists = pool.some(s => s.id === supplier.id)
  
  if (exists) {
    // 移除
    removeFromPool(supplier.id)
    return { success: true, added: false, message: '已从备选池移除' }
  } else {
    // 添加
    const added = addToPool(supplier)
    if (added) {
      return { success: true, added: true, message: '已加入备选池' }
    } else {
      return { success: false, added: false, message: '添加失败，企业可能已在备选池中' }
    }
  }
}

// 清空所有数据（调试用）
export function clearAllSupplierData() {
  localStorage.removeItem(STORAGE_KEYS.POOL)
  localStorage.removeItem(STORAGE_KEYS.OFFICIAL)
  localStorage.removeItem(STORAGE_KEYS.ADDED_TO_POOL)
}

// 初始化示例数据（首次访问时）
export function initSampleData() {
  const pool = getPoolSuppliers()
  const official = getOfficialSuppliers()
  
  // 如果都没有数据，添加一些示例数据
  if (pool.length === 0 && official.length === 0) {
    // 备选池示例数据
    const samplePoolData: Supplier[] = [
      {
        id: 'pool_1',
        name: '东莞市鸿远五金制品有限公司',
        logo: '鸿',
        logoColor: 'bg-blue-500',
        matchScore: 98,
        industry: '五金制品',
        location: '东莞',
        foundedYear: '2008',
        employeeCount: '300+人',
        certifications: ['ISO9001', 'ISO14001'],
        coreAdvantage: '自主开模、精密冲压、表面处理一体化，50人研发团队',
        monthlyCapacity: '800万件/月',
        customers: '华为、美的、小米等知名企业',
        addedAt: '2024-04-28',
        status: 'pending',
        fullAddress: '东莞市长安镇振安西路工业园',
        contactPhone: '0769-88886666',
        contactEmail: 'sales@hongyuan.com',
        website: 'www.hongyuan.com',
        annualRevenue: '3-5亿元',
        businessScope: ['五金冲压加工', '精密零件制造', '表面处理加工', '模具设计与制造'],
        riskLevel: 'low',
        mainProducts: ['五金冲压件', '精密零件', '钣金件', '紧固件'],
        productionCapacity: '年产能500万件',
        deliveryTime: '7-15天'
      },
      {
        id: 'pool_2',
        name: '深圳市盛达五金科技有限公司',
        logo: '盛',
        logoColor: 'bg-emerald-500',
        matchScore: 95,
        industry: '五金制品',
        location: '深圳',
        foundedYear: '2010',
        employeeCount: '200+人',
        certifications: ['ISO9001', 'ISO14001'],
        coreAdvantage: '专注于精密五金零件加工，支持复杂结构定制',
        monthlyCapacity: '600万件/月',
        customers: '大疆、TCL、创维等科技企业',
        addedAt: '2024-04-27',
        status: 'pending',
        fullAddress: '深圳市宝安区松岗街道',
        contactPhone: '0755-88885555',
        contactEmail: 'sales@shengda.com',
        website: 'www.shengda.com',
        annualRevenue: '2-4亿元',
        businessScope: ['精密五金加工', 'CNC加工', '表面处理', '五金配件制造'],
        riskLevel: 'low',
        mainProducts: ['精密五金件', 'CNC加工件', '冲压件', '紧固件'],
        productionCapacity: '年产能400万件',
        deliveryTime: '10-20天'
      }
    ]
    
    savePoolSuppliers(samplePoolData)
    
    // 更新已加入集合
    const addedIds = new Set(samplePoolData.map(s => s.id))
    saveAddedToPoolIds(addedIds)
  }
}
