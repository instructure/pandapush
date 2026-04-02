export type Environment = "local" | "edge" | "beta" | "prod";

export interface SmokeTestConfig {
  baseUrl: string;
  fayeUrl: string;
  appId: string;
  keyId: string;
  keySecret: string;
  environment: Environment;
  adminAuth?: {
    username: string;
    password: string;
  };
}

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`missing required environment variable: ${name}`);
  }

  return value;
}

function loadConfig(): SmokeTestConfig {
  const baseUrl = requireEnv("SMOKE_TEST_BASE_URL").replace(/\/$/, "");
  const environment = (process.env.SMOKE_TEST_ENVIRONMENT ?? "local") as Environment;

  const adminUsername = process.env.SMOKE_TEST_ADMIN_USERNAME;
  const adminPassword = process.env.SMOKE_TEST_ADMIN_PASSWORD;

  return {
    baseUrl,
    fayeUrl: `${baseUrl}/push`,
    appId: requireEnv("SMOKE_TEST_APP_ID"),
    keyId: requireEnv("SMOKE_TEST_KEY_ID"),
    keySecret: requireEnv("SMOKE_TEST_KEY_SECRET"),
    environment,
    adminAuth:
      adminUsername && adminPassword
        ? { username: adminUsername, password: adminPassword }
        : undefined,
  };
}

export const config = loadConfig();
