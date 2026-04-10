import { execSync } from 'child_process';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const apiUrl = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:4500';
const output = path.resolve(__dirname, '../src/services/api/codegen');
const name = 'Api.ts';
const templates = path.resolve(__dirname, '../../../scripts/swagger-templates');

const cleanUrl = apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;

console.log(`🚀 Generating API client from: ${cleanUrl}/openapi.json`);
console.log(`🎨 Using templates from: ${templates}`);

try {
    execSync(`npx swagger-typescript-api generate -p ${cleanUrl}/openapi.json -o ${output} -n ${name} --axios --name-api-class Api --templates ${templates}`, { stdio: 'inherit' });
    console.log(`✅ API client generated successfully.`);
} catch (error) {
    console.error(`❌ Failed to generate API client: ${error.message}`);
    process.exit(1);
}
