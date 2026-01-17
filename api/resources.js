import { Octokit } from "@octokit/rest";

export default async function handler(req, res) {
  const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
  const OWNER = "jing-gou";
  const REPO = "njupt-notes";

  try {
    // 1. 获取主分支最新的 commit SHA
    const { data: refData } = await octokit.git.getRef({
      owner: OWNER,
      repo: REPO,
      ref: 'heads/master',
    });

    // 2. 递归获取整个仓库的 Tree（全量文件索引）
    const { data: treeData } = await octokit.git.getTree({
      owner: OWNER,
      repo: REPO,
      tree_sha: refData.object.sha,
      recursive: true, // 核心参数：开启递归
    });

    const resources = {};
    const UPLOAD_PATH = "public/uploads/";

    // 3. 过滤并处理文件
    treeData.tree.forEach(item => {
      // 只处理在 uploads 目录下且是文件 (blob) 的项目
      if (item.path.startsWith(UPLOAD_PATH) && item.type === 'blob') {
        const relativePath = item.path.replace(UPLOAD_PATH, "");
        const pathParts = relativePath.split("/");

        // 取第一级目录名作为课程分类，如果是根目录文件则归类到 "其他"
        const course = pathParts.length > 1 ? pathParts[0] : "其他资料";

        if (!resources[course]) resources[course] = [];

        resources[course].push({
          // 如果有多级目录，文件名显示完整路径，方便识别
          name: pathParts.slice(1).join(" / ") || pathParts[0],
          path: `https://raw.githubusercontent.com/${OWNER}/${REPO}/master/${item.path}`,
          size: item.size ? (item.size / 1024).toFixed(1) + " KB" : "未知大小",
          sha: item.sha // 唯一标识符
        });
      }
    });

    // 设置 Vercel 缓存，5分钟内不再请求 GitHub，加快访问速度
    res.setHeader('Cache-Control', 's-maxage=120, stale-while-revalidate');
    return res.status(200).json(resources);

  } catch (error) {
    console.error("GitHub API Error:", error);
    return res.status(500).json({ error: "无法同步远程资料库" });
  }
}