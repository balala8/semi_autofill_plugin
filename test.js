
function getNearLabelElement(element) {
    // 获取到父节点的html代码，以自己为中心，切分为上下两部分。
    // 然后去掉html标签，只保留文本内容，上半部分倒序，下半部分正序，存放到数组中。
    // 遍历数组，获取到第一个非空文本内容，然后去掉空格等零宽字符，返回
    

    // 重新排序：将前一个节点放在第一个，后一个节点放在第二个，以此类推
    const reorderedSiblings = [];
    const index = Array.from(element.parentNode.children).indexOf(element);

    let left = index - 1;
    let right = index + 1;

    while (left >= 0 || right < siblings.length) {
        if (left >= 0) {
            reorderedSiblings.push(siblings[left]);
            left--;
        }
        if (right < siblings.length) {
            reorderedSiblings.push(siblings[right]);
            right++;
        }
    }

    // 遍历重新排序后的兄弟节点
    for (let sibling of reorderedSiblings) {
        // 获取兄弟节点的文本内容，并移除 HTML 标签
        let textContent = sibling.textContent.replace(/<[^>]*>/g, '').trim();
        if (textContent) {
            return textContent.replace(/[\s\u200B-\u200D\uFEFF]+/g, '');
        }
    }

    // 如果在兄弟节点中找不到文本，返回 null
    return getNearLabelElement(element.parentNode);
}

// 为所有输入框添加点击事件监听
document.querySelectorAll('input').forEach(input => {
    input.addEventListener('click', function() {
        const labelText = getNearLabelElement(this);
        console.log('Nearest label text:', labelText);
    });
});