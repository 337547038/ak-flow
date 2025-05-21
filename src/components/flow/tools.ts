/**
 * 返回节点颜色
 * state 当前节点状态 history已同意处理 active当前 danger拒绝 info条件分支时无需处理
 */
export const getNodeStroke = (state: string | undefined) => {
    switch (state) {
        case 'history':
            return 'rgb(40, 199, 163)'
        case 'active':
            return 'rgb(230, 162, 60)'
        case 'danger':
            return 'rgb(245, 108, 108)'
        case 'info':
            return 'rgb(144, 147, 153)'
        default:
            return '#1b7fff'
    }

}