// node sheet.js clip [count] -> check/<clip>-sheet.jpg : evenly spaced frames (by time) with timestamps
const fs=require("fs"),{execFileSync}=require("child_process");
if(!fs.existsSync("arial.ttf"))fs.copyFileSync(process.env.FONT||"C:/Windows/Fonts/arial.ttf","arial.ttf");
const [clip,count="12"]=process.argv.slice(2);const j=require(`./clips/${clip}/frames.json`);const f=j.frames,t0=f[0].t,T=f.at(-1).t-t0;
const n=+count,picks=[];for(let k=0;k<n;k++){const tt=t0+T*k/(n-1);let i=0;while(i+1<f.length&&f[i+1].t<=tt)i++;picks.push(i);}
const args=[];picks.forEach(i=>args.push("-i",`clips/${clip}/${f[i].file}`));
const cols=4,rows=Math.ceil(n/cols);
let fc=picks.map((i,k)=>`[${k}]scale=480:-1,drawtext=fontfile=arial.ttf:text='${k}  f${i}  ${(f[i].t-t0).toFixed(1)}s':x=8:y=8:fontsize=22:fontcolor=red:box=1:boxcolor=white[v${k}]`).join(";");
fc+=";"+picks.map((_,k)=>`[v${k}]`).join("")+`xstack=inputs=${n}:layout=`+picks.map((_,k)=>`${(k%cols)*480}_${Math.floor(k/cols)*270}`).join("|")+":fill=black";
execFileSync("ffmpeg",["-loglevel","error","-y",...args,"-filter_complex",fc,"-frames:v","1",`check/${clip}-sheet.jpg`]);
