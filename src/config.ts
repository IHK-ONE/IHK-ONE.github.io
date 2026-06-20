import type {
  AnalyticsConfig,
  CommentConfig,
  GithubConfig,
  Link,
  PhotosConfig,
  PostConfig,
  ProjectConfig,
  Site,
  SkillsShowcaseConfig,
  SocialLink,
  TagsConfig,
} from '~/types'

//--- Readme Page Config ---
export const SITE: Site = {
  title: "IHK-1's Blog",
  description:
    'CTF 解题笔记、网络安全研究、技术学习记录 — IHK-1 的个人博客',
  website: 'https://ihk-one.github.io',
  lang: 'zh-CN',
  base: '/blog/',
  author: 'IHK-1',
  ogImage: '/og-image.webp',
  transition: false,
  themeAnimation: true,
}

export const HEADER_LINKS: Link[] = [
  {
    name: '文章',
    url: '/posts',
  },
  {
    name: '项目',
    url: '/projects',
  },
  {
    name: '标签',
    url: '/tags',
  },
]

export const FOOTER_LINKS: Link[] = [
  {
    name: '首页',
    url: '/',
  },
  {
    name: '文章',
    url: '/posts',
  },
  {
    name: '项目',
    url: '/projects',
  },
  {
    name: '标签',
    url: '/tags',
  },
]

export const SOCIAL_LINKS: SocialLink[] = [
  {
    name: 'github',
    url: 'https://github.com/IHK-ONE',
    icon: 'icon-[ri--github-fill]',
    count: 19,
  },
]

export const SKILLSSHOWCASE_CONFIG: SkillsShowcaseConfig = {
  SKILLS_ENABLED: true,
  SKILLS_DATA: [
    {
      direction: 'left',
      skills: [
        {
          name: 'Python',
          icon: 'icon-[skill-icons--python-dark]',
          url: 'https://www.python.org/',
        },
        {
          name: 'CTF',
          icon: 'icon-[skill-icons--linux-dark]',
          url: 'https://ctftime.org/',
        },
        {
          name: 'Docker',
          icon: 'icon-[skill-icons--docker]',
          url: 'https://www.docker.com/',
        },
        {
          name: 'Git',
          icon: 'icon-[skill-icons--git]',
          url: 'https://git-scm.com/',
        },
        {
          name: 'Burp Suite',
          icon: 'icon-[skill-icons--postman]',
          url: 'https://portswigger.net/burp',
        },
      ],
    },
    {
      direction: 'right',
      skills: [
        {
          name: 'Linux',
          icon: 'icon-[skill-icons--linux-dark]',
          url: 'https://www.linux.org/',
        },
        {
          name: 'VS Code',
          icon: 'icon-[skill-icons--vscode-dark]',
          url: 'https://code.visualstudio.com/',
        },
        {
          name: 'Wireshark',
          icon: 'icon-[skill-icons--nginx]',
          url: 'https://www.wireshark.org/',
        },
        {
          name: 'Node.js',
          icon: 'icon-[skill-icons--nodejs-dark]',
          url: 'https://nodejs.org/',
        },
        {
          name: 'Ubuntu',
          icon: 'icon-[skill-icons--ubuntu-dark]',
          url: 'https://ubuntu.com/',
        },
      ],
    },
    {
      direction: 'left',
      skills: [
        {
          name: 'React',
          icon: 'icon-[skill-icons--react-dark]',
          url: 'https://react.dev/',
        },
        {
          name: 'TailwindCSS',
          icon: 'icon-[skill-icons--tailwindcss-dark]',
          url: 'https://tailwindcss.com/',
        },
        {
          name: 'Astro',
          icon: 'icon-[skill-icons--astro]',
          url: 'https://astro.build/',
        },
        {
          name: 'Vercel',
          icon: 'icon-[skill-icons--vercel-dark]',
          url: 'https://vercel.com/',
        },
        {
          name: 'ESP32',
          icon: 'icon-[skill-icons--arduino]',
          url: 'https://www.espressif.com/',
        },
      ],
    },
  ],
}

export const GITHUB_CONFIG: GithubConfig = {
  ENABLED: true,
  GITHUB_USERNAME: 'IHK-ONE',
  TOOLTIP_ENABLED: true,
}

//--- Posts Page Config ---
export const POSTS_CONFIG: PostConfig = {
  title: '文章',
  description: 'IHK-1 的文章归档',
  introduce: 'CTF Writeup、安全研究、技术笔记 —— 记录学习与探索的过程。',
  author: 'IHK-1',
  homePageConfig: {
    size: 6,
    type: 'compact',
  },
  postPageConfig: {
    size: 10,
    type: 'minimal',
  },
  tagsPageConfig: {
    size: 20,
    type: 'compact',
  },
  ogImageUseCover: false,
  postType: 'metaOnly',
  imageDarkenInDark: true,
  readMoreText: '阅读全文',
  prevPageText: '上一页',
  nextPageText: '下一页',
  tocText: '目录',
  backToPostsText: '返回文章列表',
  nextPostText: '下一篇',
  prevPostText: '上一篇',
  recommendText: '推荐',
  wordCountView: true,
}

export const COMMENT_CONFIG: CommentConfig = {
  enabled: true,
  system: 'gitalk',
  gitalk: {
    clientID: import.meta.env.PUBLIC_GITHUB_CLIENT_ID,
    clientSecret: import.meta.env.PUBLIC_GITHUB_CLIENT_SECRET,
    repo: 'blog-comments',
    owner: 'IHK-ONE',
    admin: ['IHK-ONE'],
    language: 'zh-CN',
    perPage: 5,
    pagerDirection: 'last',
    createIssueManually: false,
    distractionFreeMode: false,
    enableHotKey: true,
  },
}

export const TAGS_CONFIG: TagsConfig = {
  title: '标签',
  description: '文章标签汇总',
  introduce: '所有文章标签都在这里，点击可筛选。',
}

export const PROJECTS_CONFIG: ProjectConfig = {
  title: '项目',
  description: '开源项目展示',
  introduce: '我的开源项目与工具。',
}

export const PHOTOS_CONFIG: PhotosConfig = {
  title: '相册',
  description: '日常记录',
  introduce: '生活中的一些照片记录。',
}

export const ANALYTICS_CONFIG: AnalyticsConfig = {
  vercount: {
    enabled: true,
  },
  umami: {
    enabled: false,
    websiteId: 'Your websiteId in umami',
    serverUrl: 'https://cloud.umami.is/script.js',
  },
}
