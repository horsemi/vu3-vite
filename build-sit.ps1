param(
  # 分支名称
  [string]$Branch=$(throw "Parameter missing: -Branch name"),
  # 构建后文件需覆盖路径
  [string]$OutPath=$(throw "Parameter missing: -OutPath")
)

$_progress = 1;
Write-Progress -Activity "ODS vu3-vite 构建脚本" -Status "$_progress% Complete:" -PercentComplete $_progress -CurrentOperation "检查git分支是否存在";
# 检验分支是否存在
$_branch = git branch --list $Branch
if([String]::IsNullOrEmpty($_branch)) {
  # throw "branch is not exists, branch name: $Branch"
  git fetch origin $Branch
  git checkout -b $Branch origin/$Branch
}

$_progress = 10;
Write-Progress -Activity "ODS vu3-vite 构建脚本" -Status "$_progress% Complete:" -PercentComplete $_progress -CurrentOperation "获取最新代码";
# 获取最新代码
git checkout $Branch
git pull origin $Branch
Write-Output "------已获取最新代码------"
Write-Output "------开始构建------"

$_progress = 30;
Write-Progress -Activity "ODS vu3-vite 构建脚本" -Status "$_progress% Complete:" -PercentComplete $_progress -CurrentOperation "yarn 安装所有引用";
# 安装依赖
yarn install

$_progress = 60;
Write-Progress -Activity "ODS vu3-vite 构建脚本" -Status "$_progress% Complete:" -PercentComplete $_progress -CurrentOperation "构建应用";
# 构建项目
yarn run build
Write-Output "------构建成功------"

$_progress = 90;
Write-Progress -Activity "ODS vu3-vite 构建脚本" -Status "$_progress% Complete:" -PercentComplete $_progress -CurrentOperation "替换静态文件";
# 判断输出路径是否存在
if(Test-Path $OutPath ) {
    Remove-Item ($OutPath + "\*") -Recurse
    Copy-Item -Path ".\dist\*" -Destination $OutPath -Recurse
    Write-Output "------文件已替换------"
} else {
    throw "输出路径不存在，请检查路径是否存在: $OutPath" 
}

$_progress = 100;
Write-Progress -Activity "ODS vu3-vite 构建脚本" -Status "$_progress% Complete:" -PercentComplete $_progress -CurrentOperation "脚本执行完毕";

# ---------------------------------------------------------------------
# 用于放置服务端辅助构建脚本 通常放置在C:/User/Administrator/Documents/

# param(
#     # 分支名称
#     [string]$Branch=$(throw "Parameter missing: -Branch name"),
# )

# # 输出路径
# $_outPath = "C:\Otwb\OdsWebClient"
# # 项目路径
# $_srcPath = "C:\code\Otwb\vu3-vite"
# $_originalPath = Get-Location

# Write-Output "------开始执行------"
# Write-Output "outPath:"$_outPath "srcPath:"$_srcPath

# Set-Location $_srcPath

# .\build-sit.ps1 -Branch $Branch -OutPath $_outPath -SrcPath $_srcPath

# Set-Location $_originalPath

# Write-Output "------执行完毕------"