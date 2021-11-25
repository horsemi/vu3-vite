npm run build:u
docker build --rm -f "dockerfile" -t vu3vite:latest "."
$date = Get-Date -Format 'yyyyMMddHHmm'
docker login registry.cn-shenzhen.aliyuncs.com -u tanzi@1460787438751845 -p Lsmy!@#2020
docker tag vu3vite:latest registry.cn-shenzhen.aliyuncs.com/4pl_tms/ods-webclient-uat:$date
docker push registry.cn-shenzhen.aliyuncs.com/4pl_tms/ods-webclient-uat:$date