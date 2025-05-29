export const flowClassify = {
    1: '假期管理',
    2: '人事管理',
    3: '业务管理',
    4: '其他'
}

export const flowStatus = {
    0: "进行中",
    1: "完成",
    2: '拒绝',
    3: '已撤回',
    4: '退回',
}

export const getUserInfo = () => {
    const info = window.localStorage.getItem('userInfo')
    if (info) {
        return JSON.parse(info)
    }
}

/**
 * 时间格式化
 * @param time
 * @param cFormat
 */
export const dateFormatting = (time: any, cFormat?: string) => {
    const format: string = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
    // 字符串数字形式的时间戳要转换下
    let newTime = time
    if (/^\d+?$/.test(time)) {
        newTime = parseInt(time)
    }
    const date = typeof time === 'object' ? time : new Date(newTime)
    const formatObj: any = {
        y: date.getFullYear(),
        m: date.getMonth() + 1,
        d: date.getDate(),
        h: date.getHours(),
        i: date.getMinutes(),
        s: date.getSeconds(),
        w: date.getDay()
    }
    return format.replace(/{(y|m|d|h|i|s|w)+}/g, (result, key) => {
        let value = formatObj[key]
        if (key === 'w') {
            return ['日', '一', '二', '三', '四', '五', '六'][value]
        }
        if (result.length > 0 && value < 10) {
            value = '0' + value
        }
        return value || 0
    })
}