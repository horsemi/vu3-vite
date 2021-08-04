param(
  # ��֧����
  [string]$Branch=$(throw "Parameter missing: -Branch name"),
  # �������ļ��踲��·��
  [string]$OutPath=$(throw "Parameter missing: -OutPath")
)

$_progress = 1;
Write-Progress -Activity "ODS vu3-vite �����ű�" -Status "$_progress% Complete:" -PercentComplete $_progress -CurrentOperation "���git��֧�Ƿ����";
# �����֧�Ƿ����
$_branch = git branch --list $Branch
if([String]::IsNullOrEmpty($_branch)) {
  # throw "branch is not exists, branch name: $Branch"
  git fetch origin $Branch
  git checkout -b $Branch origin/$Branch
}

$_progress = 10;
Write-Progress -Activity "ODS vu3-vite �����ű�" -Status "$_progress% Complete:" -PercentComplete $_progress -CurrentOperation "��ȡ���´���";
# ��ȡ���´���
git checkout $Branch
git pull origin $Branch
Write-Output "------�ѻ�ȡ���´���------"
Write-Output "------��ʼ����------"

$_progress = 30;
Write-Progress -Activity "ODS vu3-vite �����ű�" -Status "$_progress% Complete:" -PercentComplete $_progress -CurrentOperation "yarn ��װ��������";
# ��װ����
yarn install

$_progress = 60;
Write-Progress -Activity "ODS vu3-vite �����ű�" -Status "$_progress% Complete:" -PercentComplete $_progress -CurrentOperation "����Ӧ��";
# ������Ŀ
yarn run build
Write-Output "------�����ɹ�------"

$_progress = 90;
Write-Progress -Activity "ODS vu3-vite �����ű�" -Status "$_progress% Complete:" -PercentComplete $_progress -CurrentOperation "�滻��̬�ļ�";
# �ж����·���Ƿ����
if(Test-Path $OutPath ) {
    Remove-Item ($OutPath + "\*") -Recurse
    Copy-Item -Path ".\dist\*" -Destination $OutPath -Recurse
    Write-Output "------�ļ����滻------"
} else {
    throw "���·�������ڣ�����·���Ƿ����: $OutPath" 
}

$_progress = 100;
Write-Progress -Activity "ODS vu3-vite �����ű�" -Status "$_progress% Complete:" -PercentComplete $_progress -CurrentOperation "�ű�ִ�����";

# ---------------------------------------------------------------------
# ���ڷ��÷���˸��������ű� ͨ��������C:/User/Administrator/Documents/

# param(
#     # ��֧����
#     [string]$Branch=$(throw "Parameter missing: -Branch name"),
# )

# # ���·��
# $_outPath = "C:\Otwb\OdsWebClient"
# # ��Ŀ·��
# $_srcPath = "C:\code\Otwb\vu3-vite"
# $_originalPath = Get-Location

# Write-Output "------��ʼִ��------"
# Write-Output "outPath:"$_outPath "srcPath:"$_srcPath

# Set-Location $_srcPath

# .\build-sit.ps1 -Branch $Branch -OutPath $_outPath -SrcPath $_srcPath

# Set-Location $_originalPath

# Write-Output "------ִ�����------"