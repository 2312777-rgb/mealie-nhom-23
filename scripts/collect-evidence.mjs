import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import os from 'node:os';
const load=p=>JSON.parse(readFileSync(p,'utf8').replace(/^\uFEFF/,''));
const final=load('evidence/final-results.json');
const regression=load('evidence/demo-regression/results.json');
const intentional=load('evidence/demo-intentional/results.json');
if(final.stats.expected!==12||final.stats.unexpected!==0)throw new Error('Final verification failed');
for(const result of [regression,intentional])if(result.stats.unexpected!==1||result.stats.expected!==1)throw new Error('Demo status not as expected');
const images=readdirSync('tests/__screenshots__/visual.spec.ts').filter(n=>n.endsWith('.png'));
const hashes=Object.fromEntries(images.map(n=>[n,createHash('sha256').update(readFileSync(`tests/__screenshots__/visual.spec.ts/${n}`)).digest('hex')]));
writeFileSync('evidence/baseline-manifest.json',JSON.stringify({review:'Technical visual inspection completed by Group 23; no separate signature required',sha256:hashes},null,2));
const metadata={generatedAt:new Date().toISOString(),host:{platform:os.platform(),release:os.release(),arch:os.arch()},node:process.version,playwright:load('node_modules/@playwright/test/package.json').version,sourceCommit:execFileSync('git',['-C','..','rev-parse','HEAD'],{encoding:'utf8'}).trim(),dockerImageId:execFileSync('docker',['image','inspect','mealie-r02-k10-backend:latest','--format','{{.Id}}'],{encoding:'utf8'}).trim(),configuration:load('project-lock.json'),finalStats:final.stats,ciExecuted:false,syntheticDemos:true};
writeFileSync('evidence/environment.json',JSON.stringify(metadata,null,2));
const summary={rows:[
['Backend và UI','Đã chạy thành công','Docker healthy và UI localhost 3000'],
['TypeScript','Pass','tsc --noEmit'],
['Visual regression','8 trên 8 pass','evidence/final-results.json'],
['Ba nghiệp vụ','3 trên 3 pass','evidence/flows và final-results.json'],
['Toàn bộ test','12 pass và 0 fail',`${(final.stats.duration/1000).toFixed(1)} giây gồm 1 setup`],
['Seed chạy lại','Không tăng số bản ghi','10 recipe 3 category 10 food 2 list 7 meal'],
['Hai demo CSS','Mỗi demo tạo 1 mismatch đúng dự kiến','evidence/demo-regression và demo-intentional'],
['GitHub CI','Đã cấu hình chưa chạy GitHub','Cần runner Windows và URL workflow run'],
],conclusion:'Qua lần chạy thực tế, nhóm em xác nhận bộ test chạy được trên máy QA hiện tại. Tám baseline đều pass và hai demo CSS tạo ra mismatch đúng như dự kiến. Hai demo này chỉ là thay đổi giả lập, không phải lỗi tự nhiên của Mealie. Nhóm chưa chạy visual test trên máy thành viên thứ hai và chưa chạy toàn bộ test upstream, nên đây vẫn là kết luận trong phạm vi đã chọn.'};
writeFileSync('evidence/verification-summary.json',JSON.stringify(summary,null,2));
console.log(JSON.stringify({final:final.stats,baselines:images.length,demos:2},null,2));
