import type { FindGlobalVersions } from 'payload/database'
import type { PayloadRequest, SanitizedGlobalConfig } from 'payload/types'

import { buildVersionGlobalFields } from 'payload/versions'
import toSnakeCase from 'to-snake-case'

import type { PostgresAdapter } from './types.d.ts'

import { findMany } from './find/findMany.js'

export const findGlobalVersions: FindGlobalVersions = async function findGlobalVersions(
  this: PostgresAdapter,
  {
    global,
    limit,
    locale,
    page,
    pagination,
    req = {} as PayloadRequest,
    skip,
    sort: sortArg,
    where,
  },
) {
  const globalConfig: SanitizedGlobalConfig = this.payload.globals.config.find(
    ({ slug }) => slug === global,
  )
  const sort = typeof sortArg === 'string' ? sortArg : '-createdAt'

  const tableName = `_${toSnakeCase(global)}_v`
  const fields = buildVersionGlobalFields(globalConfig)

  return findMany({
    adapter: this,
    fields,
    limit,
    locale,
    page,
    pagination,
    req,
    skip,
    sort,
    tableName,
    where,
  })
}
