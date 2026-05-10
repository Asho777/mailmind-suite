# Switch Prisma to SQLite
$schemaPath = "prisma/schema.prisma"
$configPath = "prisma.config.ts"
$envPath = ".env"

# Update schema.prisma: 
# 1. Switch provider to sqlite
# 2. Convert String[] to Json?
# 3. Strip @default([]) from Json? fields (not allowed on non-list types)
(Get-Content $schemaPath) -replace 'provider = "postgresql"', 'provider = "sqlite"' -replace 'String\[\]', 'Json?' -replace 'Json\?\s+@default\(\[\]\)', 'Json?' | Set-Content $schemaPath

# Update .env
(Get-Content $envPath) -replace 'DATABASE_URL=.*', 'DATABASE_URL="file:./dev.db"' | Set-Content $envPath

Write-Host "Project switched to SQLite successfully!" -ForegroundColor Green
Write-Host "You can now run: npx prisma migrate dev --name init" -ForegroundColor Cyan
