import { visit } from 'unist-util-visit'
import type { RehypePlugin } from '@astrojs/markdown-remark'

const rehypeImgReferrer: RehypePlugin = () => {
  return (tree) => {
    visit(tree, 'element', (node: any) => {
      if (node.tagName === 'img' && node.properties) {
        node.properties.referrerpolicy = 'no-referrer'
      }
    })
  }
}

export default rehypeImgReferrer
