export function openControl(liff) {
  document.title = 'MM RSVP Control — Test';
  const root = document.createElement('main');
  document.getElementById('send').hidden = true;
  document.getElementById('status').hidden = true;
  document.body.append(root);
  const meetings = [
    {id:'A', date:'Sep 25 (Fri)', state:'Not launched', action:'Launch', trigger:'MMTEST LAUNCH A'},
    {id:'B', date:'Oct 9 (Fri)', state:'Launched', action:'Remind', trigger:'MMTEST REMIND B'}
  ];
  function choose() {
    root.innerHTML = '<h2>MM RSVP Control</h2><p>Test only · No RSVP data is saved.</p>';
    for (const meeting of meetings) {
      const section = document.createElement('section');
      section.style.cssText='border:1px solid #ddd;border-radius:12px;padding:16px;margin:12px 0';
      section.innerHTML = `<b>TEST ${meeting.id}</b><p>Regular Meeting<br>${meeting.date} · 19:15–21:30</p><p>${meeting.state}</p>`;
      const button = document.createElement('button');button.textContent=meeting.action;
      button.onclick=()=>confirm(meeting);section.append(button);root.append(section);
    }
  }
  function confirm(meeting) {
    root.innerHTML=`<h2>${meeting.id==='A'?'Launch RSVP?':'Send RSVP reminder?'}</h2><p>Regular Meeting<br>${meeting.date} · 19:15–21:30</p><div style="display:flex;gap:10px"><button id="back">Cancel</button><button id="publish">Confirm</button></div><p id="result" role="status"></p>`;
    root.querySelector('#back').onclick=choose;
    root.querySelector('#publish').onclick=async()=>{
      const publish=root.querySelector('#publish'),back=root.querySelector('#back'),result=root.querySelector('#result');
      publish.disabled=back.disabled=true;
      try {
        if(!liff.isInClient()||liff.getContext()?.type!=='group')throw new Error('Open this LIFF from the IT group to send back to that group.');
        await liff.sendMessages([{type:'text',text:meeting.trigger}]);
        result.textContent='Sent';liff.closeWindow();
      } catch(e){result.textContent=e.message||String(e);publish.disabled=back.disabled=false;}
    };
  }
  choose();
}
