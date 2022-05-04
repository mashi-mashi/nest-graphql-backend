## Supabase

1. 追記

```
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

2. 手動で追加

```
alter user postgres with superuser;
```

## 開発時

- (初回) .env ファイルの作成

- postgresql の立ち上げ

```
docker-compose up
```

- 起動

```
yarn start:local
```
