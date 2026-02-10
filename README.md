## 个人主页（GitHub Pages）

这是一个**可直接部署**的静态个人主页模板（HTML/CSS/JS）。你选择的是 **GitHub Pages**，下面是最省事的上线方式：

### 方式一（推荐）：GitHub Actions 自动发布 Pages

#### 1) 新建仓库

在 GitHub 新建一个仓库：

- 仓库名建议：`yourname.github.io`（这样网址会是根域名）
- 也可以用任意仓库名（网址会带子路径）

#### 2) 把本目录作为仓库推上去

在本机执行（把 `YOUR_REPO_URL` 换成你的仓库地址）：

```bash
cd /Users/mikepang/deploy-site

git init
git add .
git commit -m "init site"

git branch -M main
git remote add origin YOUR_REPO_URL
git push -u origin main
```

#### 3) 在 GitHub 打开 Pages

进入仓库：**Settings → Pages**

- **Source** 选择：`GitHub Actions`

完成后，后续你只要 `git push`，Actions 会自动发布。

#### 4) 访问网址

- 如果仓库名是 `yourname.github.io`：网址通常是 `https://yourname.github.io/`
- 否则：`https://yourname.github.io/<repo>/`

### 方式二：不写 Actions（手动 Pages）

也可以在 **Settings → Pages** 里把 Source 选成 `Deploy from a branch`，然后指定 `main` 分支 + 根目录。

> 但你目前项目已经带了 `.github/workflows/pages.yml`，更建议用方式一。

### 常见问题

- **为什么有 `404.html`？**
  GitHub Pages 找不到路径时会显示 `404.html`。我们用它复制 `index.html`，这样即使你以后做“单页路由”，刷新也更不容易白屏。

- **需要构建/打包吗？**
  不需要。直接上传静态文件。

### 你只需要再告诉我 1 件事（可选）

- 你是否要用根域名形式：`yourname.github.io`？如果是，把你的 GitHub 用户名发我（或仓库名），我可以把首页里的标题/文案改成你的信息，并补一个更像个人主页的“关于我/项目/联系方式”版式。
