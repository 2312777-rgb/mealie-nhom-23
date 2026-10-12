import 'dotenv/config';
import { spawnSync } from 'node:child_process';
import { writeFileSync, readFileSync } from 'node:fs';
const base=process.env.MEALIE_API_URL;
let response=await fetch(`${base}/api/auth/token`,{method:'POST',body:new URLSearchParams({username:process.env.MEALIE_TEST_EMAIL,password:process.env.MEALIE_TEST_PASSWORD})});
if(!response.ok)throw new Error('QA login failed');
const {access_token:token}=await response.json();
async function counts(){
 const paths=['/recipes','/organizers/categories','/foods','/households/shopping/lists','/households/mealplans'];
 const result={};
 for(const path of paths){const r=await fetch(`${base}/api${path}?perPage=-1`,{headers:{Authorization:`Bearer ${token}`}});if(!r.ok)throw new Error(`${path}: ${r.status}`); const j=await r.json();result[path]=(Array.isArray(j)?j:j.items).length;}
 return result;
}
const before=await counts();
const run=spawnSync(process.execPath,['scripts/seed.mjs'],{encoding:'utf8',env:process.env});
if(run.status!==0)throw new Error(run.stderr);
const after=await counts();
if(JSON.stringify(before)!==JSON.stringify(after))throw new Error('Seed duplicated data');
const expected=[10,3,10,2,7];
if(Object.values(after).some((count,i)=>count!==expected[i]))throw new Error('Unexpected QA data counts');
writeFileSync('evidence/seed-idempotence.json',JSON.stringify({before,after,unchanged:true},null,2));
writeFileSync('evidence/seed-manifest.json',readFileSync('test-results/seed-manifest.json'));
console.log('Seed idempotence verified:',after);
