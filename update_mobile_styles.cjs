const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// mob-instructionTx
html = html.replace(
  'id="mob-instructionTx"\n          class="w-[297px] max-w-[90vw] h-[125px] border border-[#e2c079]/40 bg-[#0e1526]/10 backdrop-blur-md rounded-none py-5 px-6 text-center shadow-[0_8px_32px_rgba(0,0,0,0.6)] mb-[6px] text-[8.5px] sm:text-[10px] tracking-[0.15em] text-[#e2c079] drop-shadow-[0_0_8px_rgba(226,192,121,0.5)] uppercase font-medium leading-[2.2] flex items-center justify-center"',
  'id="mob-instructionTx"\n          class="w-[297px] max-w-[90vw] h-[125px] border border-[#e2c079]/40 bg-[#0e1526]/10 backdrop-blur-md rounded-none py-5 px-6 text-center shadow-[0_8px_32px_rgba(0,0,0,0.6)] mb-[6px] text-[8.5px] sm:text-[10px] tracking-[0.15em] text-[#e2c079] drop-shadow-[0_0_8px_rgba(226,192,121,0.5)] uppercase font-medium leading-[2.2] flex items-center justify-center"\n          style="margin-right: 0px; margin-bottom: 36px;"'
);

// mobBtn
html = html.replace(
  'style="background-color: transparent"',
  'style="background-color: transparent; margin-bottom: 34px; height: 50px; padding-bottom: 1px; margin-top: -29px;"'
);

// footer
html = html.replace(
  'style="height: 44.5417px; padding-bottom: 0.3467px; padding-right: 0px; padding-top: 0px; padding-left: 0px; margin-left: 0px; margin-top: 0px; margin-bottom: 0px; margin-right: 0px;"',
  'style="height: 44.5417px; padding-bottom: 0.3467px; padding-top: 0px; padding-left: 0px; margin-left: 0px; margin-right: 0px; margin-bottom: 0px; margin-top: -29px;"'
);

// lower banner
html = html.replace(
  'style="height: 70px;"',
  'style="height: 105px; margin-bottom: 2px;"'
);

// upper banner
html = html.replace(
  'class="w-full mt-0 h-[73px] border-y border-[#e2c079]/30 bg-gradient-to-r from-transparent via-[#1c223c]/60 to-transparent flex items-center justify-center backdrop-blur-sm shadow-[0_4px_20px_rgba(0,0,0,0.5)]"',
  'class="w-full mt-0 h-[73px] border-y border-[#e2c079]/30 bg-gradient-to-r from-transparent via-[#1c223c]/60 to-transparent flex items-center justify-center backdrop-blur-sm shadow-[0_4px_20px_rgba(0,0,0,0.5)]"\n          style="margin-top: 0px; margin-bottom: 0px; height: 95px;"'
);

fs.writeFileSync('index.html', html);
console.log('Mobile styles updated.');
