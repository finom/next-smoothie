import path from 'path';
import getConfig from './getConfig.mjs';
import getLogger from '../utils/getLogger.mjs';

export type ProjectInfo = Awaited<ReturnType<typeof getProjectInfo>>;

export default async function getProjectInfo({
  port: givenPort,
  clientOutDir,
  cwd = process.cwd(),
}: { port?: number; clientOutDir?: string; cwd?: string } = {}) {
  const port = givenPort?.toString() ?? process.env.PORT ?? '3000';

  // Make PORT available to the config file at getConfig
  process.env.PORT = port;

  const { config, srcRoot, configPaths } = await getConfig({ clientOutDir, cwd });
  const apiEntryPoint = `${config.origin ?? ''}/${config.rootEntry}`;
  const apiDir = path.join(srcRoot, 'app', config.rootEntry);

  const schemaOutImportPath = path.relative(config.clientOutDir, config.schemaOutDir);
  const fetcherClientImportPath = config.fetcher.startsWith('.')
    ? path.relative(config.clientOutDir, config.fetcher)
    : config.fetcher;

  const validateOnClientImportPath = config.validateOnClient?.startsWith('.')
    ? path.relative(config.clientOutDir, config.validateOnClient)
    : config.validateOnClient;

  const log = getLogger(config.logLevel);

  if (configPaths.length > 1) {
    log.warn(`Multiple config files found. Using the first one: ${configPaths[0]}`);
  }

  return {
    cwd,
    port,
    apiEntryPoint,
    apiDir,
    srcRoot,
    schemaOutImportPath,
    fetcherClientImportPath,
    validateOnClientImportPath,
    config,
    log,
  };
}
