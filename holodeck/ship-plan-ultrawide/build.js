const fs=require('fs');const t=fs.readFileSync(__dirname+'/page.tpl.html','utf8');const d=fs.readFileSync(__dirname+'/data.js','utf8');
fs.writeFileSync(__dirname+'/hermes-ultrawide.html',t.replace('/*DATA*/',()=>d));
