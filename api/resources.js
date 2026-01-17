import { Octokit } from "@octokit/rest";

export default async function handler(req, res) {
  const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
  const OWNER = "jing-gou";
  const REPO = "njupt-notes";

  try {
    // 1. 获取 uploads 目录下的所有文件夹（课程）
    const { data: folders } = await octokit.repos.getContent({
      owner: OWNER,
      repo: REPO,
      path: "public/uploads",
    });

    const tree = {};

    // 2. 遍历文件夹获取文件列表
    for (const item of folders) {
      if (item.type === 'dir') {
        const { data: files } = await octokit.repos.getContent({
          owner: OWNER,
          repo: REPO,
          path: item.path,
        });

        tree[item.name] = files.map(f => ({
          name: f.name,
          path: f.download_url,
          size: (f.size / 1024).toFixed(1) + ' KB',
          date: "最新" 
        }));
      }
    }

    // 设置缓存控制，让 API 结果缓存 5 分钟，减轻 GitHub 压力
    res.setHeader('Cache-Control', 's-maxage=120');
    return res.status(200).json(tree);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "无法加载资源列表" });
  }
}