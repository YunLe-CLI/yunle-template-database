## 动行db
```
docker-compose -f docker-compose.yml up -d

```

## 启动oss备份
```
docker build --rm -t yunle_db_backup .
docker run --restart=always --name  db_backup -d -v /mnt/www/db/:/www/ yunle_db_backup

```