import { ref, watch, computed } from 'vue'

// 全局共享的单例状态 — 确保所有组件使用同一份数据
const memos = ref([])

// 初始化：从 localStorage 读取（带错误处理）
function loadMemos() {
  try {
    const raw = localStorage.getItem('memos')
    if (raw) {
      memos.value = JSON.parse(raw)
    }
  } catch (e) {
    console.error('读取笔记数据失败:', e)
    memos.value = []
  }
}

// 持久化：写入 localStorage（带错误处理）
function saveMemos(data) {
  try {
    localStorage.setItem('memos', JSON.stringify(data))
  } catch (e) {
    console.error('保存笔记数据失败（可能是存储空间不足）:', e)
    // 返回 false 让调用方知道保存失败
    return false
  }
  return true
}

// 首次加载
loadMemos()

// 自动持久化（deep watch）
watch(memos, (val) => {
  saveMemos(val)
}, { deep: true })

export function useMemos() {
  // ----- 提取所有标签（去重）-----
  const allTags = computed(() => {
    const tagSet = new Set()
    memos.value.forEach(m => {
      if (m.tags && Array.isArray(m.tags)) {
        m.tags.forEach(t => tagSet.add(t))
      }
    })
    return Array.from(tagSet)
  })

  // ----- 当前选中的标签（null 表示"全部"）-----
  const currentTag = ref(null)

  const selectTag = (tag) => {
    currentTag.value = tag
  }

  const clearTagFilter = () => {
    currentTag.value = null
  }

  // ----- 搜索关键词 -----
  const searchQuery = ref('')

  // ----- 增删改方法 -----
  const addMemo = (memo) => {
    const newMemo = {
      id: Date.now(),
      title: memo.title,
      content: memo.content || '',
      tags: memo.tags || [],
      time: new Date().toLocaleString()
    }
    memos.value.unshift(newMemo)
    return newMemo
  }

  const deleteMemo = (id) => {
    memos.value = memos.value.filter(m => m.id !== id)
  }

  const updateMemo = (updated) => {
    const idx = memos.value.findIndex(m => m.id === updated.id)
    if (idx !== -1) {
      memos.value[idx] = { ...memos.value[idx], ...updated }
    }
  }

  // ----- 导出数据功能 -----
  const exportData = (format) => {
    const data = memos.value.map(m => ({
      title: m.title,
      content: m.content || '',
      tags: m.tags || [],
      time: m.time
    }))

    let content = ''
    let filename = ''
    let mimeType = ''

    if (format === 'json') {
      content = JSON.stringify(data, null, 2)
      filename = `轻笔记_${new Date().toISOString().slice(0, 10)}.json`
      mimeType = 'application/json'
    } else if (format === 'markdown') {
      const mdLines = []
      data.forEach((item, index) => {
        mdLines.push(`## ${index + 1}. ${item.title}`)
        if (item.tags && item.tags.length) {
          mdLines.push(`标签：${item.tags.join('、')}`)
        }
        if (item.content) {
          mdLines.push(item.content)
        }
        mdLines.push(`创建时间：${item.time}`)
        mdLines.push('---')
      })
      content = mdLines.join('\n\n')
      filename = `轻笔记_${new Date().toISOString().slice(0, 10)}.md`
      mimeType = 'text/markdown'
    }

    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  // ----- 导入数据功能 -----
  const importData = () => {
    return new Promise((resolve, reject) => {
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = '.json'
      input.onchange = (e) => {
        const file = e.target.files[0]
        if (!file) return reject(new Error('未选择文件'))

        const reader = new FileReader()
        reader.onload = (ev) => {
          try {
            const imported = JSON.parse(ev.target.result)
            if (!Array.isArray(imported)) {
              return reject(new Error('JSON 文件格式错误：需要笔记数组'))
            }

            const now = new Date().toLocaleString()
            let count = 0
            imported.forEach(item => {
              if (item.title) {
                memos.value.unshift({
                  id: Date.now() + count,
                  title: item.title,
                  content: item.content || '',
                  tags: Array.isArray(item.tags) ? item.tags : [],
                  time: item.time || now
                })
                count++
              }
            })
            resolve(count)
          } catch (err) {
            reject(new Error('无法解析 JSON 文件'))
          }
        }
        reader.onerror = () => reject(new Error('读取文件失败'))
        reader.readAsText(file)
      }
      input.oncancel = () => reject(new Error('取消选择'))
      input.click()
    })
  }

  return {
    memos,
    allTags,
    currentTag,
    searchQuery,
    selectTag,
    clearTagFilter,
    addMemo,
    deleteMemo,
    updateMemo,
    exportData,
    importData
  }
}
