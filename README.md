# issue-prisma-580

I found a pattern that can be processed correctly up to Prisma version 5.7.1, but cannot be processed correctly in version 5.8.0.

## Steps to reproduce

1. Clone this repository
2. Setup mysql database and Edit `.env` file
3. Run `npm install`
4. Run `npm start`

Got error below:

```text
/home/azureuser/issue-prisma-580/index.ts:32:24

  29 // Query which causes the error on Prisma Client 5.8.0
  30 const posts = await Promise.all([...Array(10)].map((_, i) => i).map((i) => {
  31   const id = i + 1;
→ 32   return prisma.post.findUnique(
Timed out fetching a new connection from the connection pool. More info: http://pris.ly/d/connection-pool (Current connection pool timeout: 10, connection limit: 5)
    at si.handleRequestError (/home/azureuser/issue-prisma-580/node_modules/@prisma/client/runtime/library.js:125:6817)
    at si.handleAndLogRequestError (/home/azureuser/issue-prisma-580/node_modules/@prisma/client/runtime/library.js:125:6151)
    at si.request (/home/azureuser/issue-prisma-580/node_modules/@prisma/client/runtime/library.js:125:5859)
    at async l (/home/azureuser/issue-prisma-580/node_modules/@prisma/client/runtime/library.js:130:9805)
    at async Promise.all (index 0)
    at async main (/home/azureuser/issue-prisma-580/index.ts:30:17) {
  code: 'P2024',
  clientVersion: '5.8.0',
  meta: { modelName: 'Post', connection_limit: 5, timeout: 10 }
}
```

## Steps on Prisma 5.7.1

1. Edit `package.json` and change `prisma` and `@prisma/client` version to `5.7.1`
2. Run `npm install`
3. Run `npm start`

In this case, no error will occur and the desired result will be output.

## Workaround

### connection_limit

If you set the value of `connection_limit` in `DATABASE_URL` to a value greater than or equal to the number executed in `Promise.all`, this problem does not occur even in 5.8.0.  
In this repository's case, setting `connection_limit` to `10` works around the issue.
