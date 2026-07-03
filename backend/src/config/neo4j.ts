import neo4j, { Driver } from 'neo4j-driver'
import { env } from './env'
import { logger } from './logger'

let driver: Driver

function createDriver(): Driver {
  return neo4j.driver(
    env.NEO4J_URI,
    neo4j.auth.basic(env.NEO4J_USER, env.NEO4J_PASSWORD),
    { maxConnectionPoolSize: 10 }
  )
}

export function getDriver(): Driver {
  if (!driver) {
    driver = createDriver()
  }
  return driver
}

export async function verifyNeo4jConnection(): Promise<boolean> {
  try {
    const d = getDriver()
    const serverInfo = await d.getServerInfo()
    logger.info('Neo4j connected', { serverInfo: `${serverInfo.agent} - ${serverInfo.protocolVersion}` })
    return true
  } catch (err) {
    logger.error('Neo4j connection failed', { error: (err as Error).message })
    return false
  }
}

export async function closeDriver(): Promise<void> {
  if (driver) {
    await driver.close()
    logger.info('Neo4j driver closed')
  }
}

export default getDriver
