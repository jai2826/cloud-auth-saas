// apps/api/src/services/fga.ts
import { OpenFgaClient } from '@openfga/sdk';

export interface FgaCheckParams {
  userId: string;
  action: 'reader' | 'writer' | 'owner' | 'admin' | string; // Relations in OpenFGA
  objectType: string;
  objectId: string;
}

/**
 * Initializes the OpenFGA client using runtime environment variables from the edge.
 */
function getFgaClient(env: any): OpenFgaClient {
  if (!env.OPENFGA_API_URL || !env.OPENFGA_STORE_ID) {
    throw new Error("Missing OpenFGA configurations in runtime environment bindings.");
  }
  
  return new OpenFgaClient({
    apiUrl: env.OPENFGA_API_URL,
    storeId: env.OPENFGA_STORE_ID,
    authorizationModelId: env.OPENFGA_MODEL_ID, // Optional but highly recommended
  });
}

/**
 * Executes a definitive Zanzibar relationship check at the cloud edge.
 */
export async function checkPermission(
  env: any,
  params: FgaCheckParams
): Promise<boolean> {
  const fga = getFgaClient(env);

  try {
    const { allowed } = await fga.check({
      user: `user:${params.userId}`,
      relation: params.action,
      object: `${params.objectType}:${params.objectId}`,
    });

    return allowed ?? false;
  } catch (error) {
    console.error("OpenFGA authorization check failed:", error);
    // Fail closed for maximum security
    return false;
  }
}

/**
 * Writes a relationship tuple when resources are created or roles are granted.
 */
export async function writeRelationship(
  env: any,
  userId: string,
  relation: string,
  objectType: string,
  objectId: string
) {
  const fga = getFgaClient(env);
  return await fga.write({
    writes: [{
      user: `user:${userId}`,
      relation: relation,
      object: `${objectType}:${objectId}`
    }]
  });
}