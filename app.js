const products=[
 {id:'fresa',name:'Fresa con Crema',price:90,img:'assets/transparent/fresa-crema.webp'},
 {id:'cheesecake',name:'Cheesecake',price:90,img:'assets/transparent/cheesecake.webp'},
 {id:'limon',name:'Pay de Limón',price:85,img:'assets/transparent/pay-limon.webp'},
 {id:'tres',name:'Tres Leches',price:85,img:'assets/transparent/tres-leches.webp'},
 {id:'ferrero',name:'Ferrero',price:95,img:'assets/transparent/ferrero.webp'},
 {id:'maracuya',name:'Maracuyá',price:90,img:'assets/transparent/maracuya.webp'},
 {id:'oreo',name:'Oreo',price:90,img:'assets/transparent/oreo.webp'}
];
let selected=null;let cart=JSON.parse(localStorage.getItem('ohqp-cart')||'[]');
// Siempre se corrigen los precios guardados anteriormente a la lista oficial actual.
cart=cart.map(item=>{const official=products.find(p=>p.id===item.id);return official?{...item,name:official.name,price:official.price,img:official.img}:item;});
localStorage.setItem('ohqp-cart',JSON.stringify(cart));
const $=s=>document.querySelector(s);const fmt=n=>'$'+Number(n).toFixed(2);
function toast(t){const el=$('#toast');if(!el)return;el.textContent=t;el.classList.add('show');clearTimeout(window.tt);window.tt=setTimeout(()=>el.classList.remove('show'),2800)}
function renderProducts(){const fridge=$('#fridge'),grid=$('#products');if(!fridge||!grid)return;fridge.innerHTML='';grid.innerHTML='';products.forEach(p=>{const c=document.createElement('div');c.className='can';c.draggable=true;c.dataset.id=p.id;c.innerHTML=`<img src="${p.img}" alt="${p.name}"><span class="price">${fmt(p.price)}</span>`;c.onclick=()=>select(p);c.ondragstart=e=>{e.dataTransfer.setData('text/plain',p.id);const box=$('#fridgeBox');if(box&&!box.classList.contains('open'))box.classList.add('open')};enableTouchCanDrag(c,p);fridge.append(c);const card=document.createElement('article');card.className='product-card';card.innerHTML=`<img src="${p.img}" alt="${p.name}"><h3>${p.name}</h3><p>${fmt(p.price)}</p><button>AGREGAR A MI BOLSA</button>`;card.querySelector('button').onclick=()=>{select(p);receiveSelected()};grid.append(card)})}
function select(p){if(!p)return;selected=p;const can=$('#bagCan'),wrap=$('#bagWrap'),label=$('#dropLabel'),add=$('#addSelected');if(can){can.src=p.img;can.alt=p.name;can.classList.remove('hidden')}if(wrap){wrap.classList.remove('open');requestAnimationFrame(()=>wrap.classList.add('open'))}if(label)label.textContent=p.name;if(add)add.disabled=false;toast(p.name+' seleccionado')}
function receiveSelected(){if(!selected)return;const p=selected,wrap=$('#bagWrap'),can=$('#bagCan');if(wrap)wrap.classList.add('receiving');if(can){can.classList.remove('hidden');can.src=p.img;can.alt=p.name;can.style.opacity='1'}setTimeout(()=>{if(wrap)wrap.classList.remove('receiving');addSelected()},1000)}
function enableTouchCanDrag(el,p){
  let pointerId=null, dragging=false, ghost=null, holdTimer=null, startX=0,startY=0, armed=false;
  const clearHold=()=>{if(holdTimer){clearTimeout(holdTimer);holdTimer=null}};
  const cleanup=()=>{clearHold();ghost?.remove();ghost=null;dragging=false;armed=false;pointerId=null;el.classList.remove('touch-dragging');document.body.classList.remove('oqp-drag-active')};
  const moveGhost=(x,y)=>{if(!ghost)return;ghost.style.transform=`translate(${x-56}px,${y-72}px) rotate(5deg)`};
  const begin=(e)=>{
    if(dragging)return;dragging=true;clearHold();
    ghost=el.querySelector('img').cloneNode(true);ghost.className='drag-ghost';ghost.style.left='0';ghost.style.top='0';document.body.appendChild(ghost);
    el.classList.add('touch-dragging');document.body.classList.add('oqp-drag-active');moveGhost(e.clientX,e.clientY);
  };
  el.addEventListener('pointerdown',e=>{
    if(e.pointerType==='mouse'&&e.button!==0)return;
    pointerId=e.pointerId;startX=e.clientX;startY=e.clientY;armed=e.pointerType!=='touch';
    if(e.pointerType==='touch')holdTimer=setTimeout(()=>{armed=true},260);
  },{passive:true});
  window.addEventListener('pointermove',e=>{
    if(pointerId!==e.pointerId)return;
    const dx=e.clientX-startX,dy=e.clientY-startY,dist=Math.hypot(dx,dy);
    if(!dragging){
      if(!armed){if(dist>12)clearHold();return;}
      if(dist<6)return;begin(e);
    }
    if(dragging){e.preventDefault();moveGhost(e.clientX,e.clientY);}
  },{passive:false});
  window.addEventListener('pointerup',e=>{
    if(pointerId!==e.pointerId)return;
    const wasDragging=dragging,zone=$('#bagZone'),r=zone?.getBoundingClientRect();
    const inside=wasDragging&&r&&e.clientX>=r.left&&e.clientX<=r.right&&e.clientY>=r.top&&e.clientY<=r.bottom;
    const tapped=!wasDragging&&Math.hypot(e.clientX-startX,e.clientY-startY)<10;
    cleanup();
    if(inside){selected=p;receiveSelected()}
    else if(tapped)select(p);
  },{passive:true});
  window.addEventListener('pointercancel',e=>{if(pointerId===e.pointerId)cleanup()},{passive:true});
}const bag=$('#bagZone');if(bag){bag.ondragover=e=>{e.preventDefault();bag.classList.add('dragover')};bag.ondragleave=()=>bag.classList.remove('dragover');bag.ondrop=e=>{e.preventDefault();bag.classList.remove('dragover');const p=products.find(p=>p.id===e.dataTransfer.getData('text/plain'));if(!p)return;select(p);receiveSelected()}}
function addSelected(){if(!selected)return;const found=cart.find(i=>i.id===selected.id);found?found.qty++:cart.push({...selected,qty:1});selected=null;const can=$('#bagCan'),wrap=$('#bagWrap'),label=$('#dropLabel'),add=$('#addSelected');if(can)can.classList.add('hidden');if(wrap)wrap.classList.remove('open');if(label)label.textContent='ARRASTRA TU LATA AQUÍ';if(add)add.disabled=true;save();toast('Agregado a tu bolsa de compra')}
function save(){localStorage.setItem('ohqp-cart',JSON.stringify(cart));renderCart()}
function renderCart(){const items=$('#cartItems'),mini=$('#miniCart'),countEl=$('#cartCount'),sub=$('#subtotal');const count=cart.reduce((a,b)=>a+b.qty,0),total=cart.reduce((a,b)=>a+b.price*b.qty,0);if(countEl)countEl.textContent=count;if(items)items.innerHTML='';if(mini)mini.innerHTML='';if(!cart.length){if(items)items.innerHTML='<p class="payment-note">Tu bolsa está vacía.</p>';if(mini){mini.className='mini-cart empty';mini.textContent='Aún no has elegido una lata.'}}else{if(mini)mini.className='mini-cart';cart.forEach(i=>{const image=i.img||'';if(items)items.insertAdjacentHTML('beforeend',`<div class="cart-line"><img src="${image}" alt=""><div><b>${i.name}</b><small>${i.merch?'Merch oficial':'350 ml'} · ${fmt(i.price)}</small><div class="qty"><button onclick="changeQty('${i.id}',-1)">−</button><b>${i.qty}</b><button onclick="changeQty('${i.id}',1)">+</button></div></div><button class="remove" onclick="removeItem('${i.id}')">×</button></div>`);if(mini)mini.insertAdjacentHTML('beforeend',`<div class="mini-item"><img src="${image}" alt=""><div><b>${i.name}</b><br><small>${i.qty} × ${fmt(i.price)}</small></div><strong>${fmt(i.qty*i.price)}</strong></div>`)})}if(sub)sub.textContent=fmt(total)}
window.changeQty=(id,d)=>{const x=cart.find(i=>i.id===id);if(!x)return;x.qty+=d;if(x.qty<=0)cart=cart.filter(i=>i.id!==id);save()};window.removeItem=id=>{cart=cart.filter(i=>i.id!==id);save()};
function checkout(){
  if(!cart.length){toast('Primero agrega algo a tu bolsa');return}
  const modal=$('#checkoutModal');
  if(!modal){toast('Modo de prueba: conecta Stripe o PayPal para activar el cobro real');return}
  modal.classList.add('show');modal.setAttribute('aria-hidden','false');
}
$('#addSelected')&&($('#addSelected').onclick=receiveSelected);$('#checkoutBtn')&&($('#checkoutBtn').onclick=checkout);$('#drawerCheckout')&&($('#drawerCheckout').onclick=checkout);
function openCart(){const d=$('#drawer'),o=$('#overlay');if(d)d.classList.add('open');if(o)o.classList.add('show')}function closeCart(){const d=$('#drawer'),o=$('#overlay');if(d)d.classList.remove('open');if(o)o.classList.remove('show')}$('#openCart')&&($('#openCart').onclick=openCart);$('#closeCart')&&($('#closeCart').onclick=closeCart);$('#overlay')&&($('#overlay').onclick=closeCart);
const fridgeToggle=$('#toggleFridge'),fridgeBox=$('#fridgeBox'),fridgeDoor=$('#fridgeDoor');function toggleFridge(){if(!fridgeBox)return;const open=fridgeBox.classList.toggle('open');if(fridgeToggle)fridgeToggle.textContent=open?'CERRAR REFRI':'ABRIR REFRI'}if(fridgeToggle)fridgeToggle.onclick=toggleFridge;if(fridgeDoor)fridgeDoor.onclick=toggleFridge;
const intro=$('#intro'),enter=$('#enterSite');
function enterWebsite(){
  if(!intro || intro.classList.contains('hide')) return;
  intro.classList.add('hide');
  intro.setAttribute('aria-hidden','true');
  setTimeout(()=>{ if(intro) intro.style.display='none'; },750);
}
if(intro&&enter){
  // Entrada robusta: botón y también cualquier clic/tap sobre la pantalla de bienvenida.
  enter.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();enterWebsite();});
  enter.addEventListener('pointerup',e=>{e.preventDefault();e.stopPropagation();enterWebsite();});
  enter.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();enterWebsite();}});
  intro.addEventListener('click',e=>{if(!intro.classList.contains('hide')) enterWebsite();});
  intro.addEventListener('pointerup',e=>{if(!intro.classList.contains('hide')) enterWebsite();},{passive:true});
}
// reproductor y continuidad entre Inicio y Merch
const MUSIC_KEY='ohqp-music-state';
function saveMusicState(a){if(!a)return;try{localStorage.setItem(MUSIC_KEY,JSON.stringify({time:Number(a.currentTime)||0,playing:!a.paused,volume:Number(a.volume)||.85,muted:!!a.muted}))}catch(_){}}
function readMusicState(){try{return JSON.parse(localStorage.getItem(MUSIC_KEY)||'{}')}catch(_){return {}}}
const audio=$('#audio'),play=$('#play'),progress=$('#progress'),volume=$('#volume'),mute=$('#mute'),volumeValue=$('#volumeValue');
if(audio&&play&&progress){
  const time=v=>!isFinite(v)?'0:00':Math.floor(v/60)+':'+String(Math.floor(v%60)).padStart(2,'0');
  const saved=readMusicState();audio.volume=typeof saved.volume==='number'?saved.volume:.85;audio.muted=!!saved.muted;
  audio.addEventListener('loadedmetadata',()=>{if(Number.isFinite(saved.time)&&saved.time>0)audio.currentTime=Math.min(saved.time,Math.max(0,(audio.duration||0)-.1));progress.max=audio.duration;$('#duration').textContent=time(audio.duration);if(saved.playing){const p=audio.play();if(p&&p.catch)p.catch(()=>{})}},{once:true});
  const updateVolume=()=>{const v=audio.muted?0:audio.volume;if(volume)volume.value=v;if(volumeValue)volumeValue.textContent=Math.round(v*100)+'%';if(mute)mute.textContent=v===0?'🔇':v<.5?'🔉':'🔊'};
  play.onclick=()=>audio.paused?audio.play():audio.pause();audio.onplay=()=>{play.textContent='❚❚';saveMusicState(audio)};audio.onpause=()=>{play.textContent='▶';saveMusicState(audio)};
  audio.ontimeupdate=()=>{progress.value=audio.currentTime;$('#currentTime').textContent=time(audio.currentTime);if(Math.round(audio.currentTime*2)%10===0)saveMusicState(audio)};
  progress.oninput=()=>audio.currentTime=progress.value;$('#prev').onclick=()=>audio.currentTime=Math.max(0,audio.currentTime-10);$('#next').onclick=()=>audio.currentTime=Math.min(audio.duration||0,audio.currentTime+10);
  if(volume)volume.oninput=()=>{audio.muted=false;audio.volume=Number(volume.value);updateVolume();saveMusicState(audio)};
  if(mute)mute.onclick=()=>{audio.muted=!audio.muted;updateVolume();saveMusicState(audio)};
  document.querySelectorAll('a[href="merch.html"]').forEach(a=>a.addEventListener('click',()=>saveMusicState(audio)));
  window.addEventListener('pagehide',()=>saveMusicState(audio));updateVolume();
}
const merchAudio=$('#merchAudio'),merchMusicToggle=$('#merchMusicToggle');
if(merchAudio){
  const state=readMusicState();merchAudio.volume=typeof state.volume==='number'?state.volume:.85;merchAudio.muted=!!state.muted;
  const restore=()=>{if(state.time>0&&Number.isFinite(merchAudio.duration))merchAudio.currentTime=Math.min(state.time,Math.max(0,merchAudio.duration-.1));if(state.playing){const p=merchAudio.play();if(p&&p.catch)p.catch(()=>{if(merchMusicToggle)merchMusicToggle.textContent='▶'})}};
  merchAudio.addEventListener('loadedmetadata',restore,{once:true});
  window.addEventListener('pageshow',()=>{const st=readMusicState();if(st.playing){const p=merchAudio.play();if(p&&p.catch)p.catch(()=>{})}});
  // Chrome móvil puede bloquear autoplay después de cambiar de documento. Conservamos el estado
  // y reanudamos en el primer toque si el navegador exige una nueva activación del usuario.
  const resumeOnGesture=()=>{const st=readMusicState();if(st.playing&&merchAudio.paused){const p=merchAudio.play();if(p&&p.catch)p.catch(()=>{})}};
  document.addEventListener('pointerdown',resumeOnGesture,{once:true,passive:true});
  merchAudio.addEventListener('play',()=>{if(merchMusicToggle)merchMusicToggle.textContent='❚❚';saveMusicState(merchAudio)});
  merchAudio.addEventListener('pause',()=>{if(merchMusicToggle)merchMusicToggle.textContent='▶';saveMusicState(merchAudio)});
  merchAudio.addEventListener('timeupdate',()=>{if(Math.round(merchAudio.currentTime*2)%10===0)saveMusicState(merchAudio)});
  if(merchMusicToggle)merchMusicToggle.onclick=()=>merchAudio.paused?merchAudio.play():merchAudio.pause();
  document.querySelectorAll('a[href="index.html"]').forEach(a=>a.addEventListener('click',()=>saveMusicState(merchAudio)));
  window.addEventListener('pagehide',()=>saveMusicState(merchAudio));
}
// soporte IA — conversación natural; usa /api/chat cuando el servidor IA está disponible y un fallback local si no.
(()=>{
  const chatForm=$('#chatForm'),chat=$('#chat'),input=$('#chatInput'); if(!chatForm||!chat||!input)return;
  const data={'pay de limon':['Pay de Limón',85],'tres leches':['Tres Leches',85],'cheesecake':['Cheesecake',90],'ferrero':['Ferrero',95],'fresa con crema':['Fresa con Crema',90],'maracuya':['Maracuyá',90],'oreo':['Oreo',90]};
  const norm=s=>String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim();
  const esc=s=>String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
  const add=(who,text)=>{const body=who==='bot'?`<img class="chat-avatar" src="assets/ottavio-standing.png" alt=""><span>${esc(text)}</span>`:esc(text);chat.insertAdjacentHTML('beforeend',`<div class="${who}">${body}</div>`);chat.scrollTop=chat.scrollHeight};
  const typing=()=>{chat.insertAdjacentHTML('beforeend','<div class="bot typing" id="ohTyping"><span></span><span></span><span></span></div>');chat.scrollTop=chat.scrollHeight};
  const stop=()=>$('#ohTyping')?.remove();
  let history=[];try{history=JSON.parse(sessionStorage.getItem('ohqp-chat-history')||'[]')}catch(_){history=[]}
  const remember=(role,content)=>{history.push({role,content});history=history.slice(-16);try{sessionStorage.setItem('ohqp-chat-history',JSON.stringify(history))}catch(_){} };
  function localReply(q){
    const n=norm(q);
    const lang=/\b(hello|hi|hey|how|what|where|price|delivery|thank|thanks|please|buy|order|why|when|which|refund|return|charged|payment|failed|problem|help)\b/.test(n)?'en':/\b(bonjour|salut|combien|livraison|merci|quel|acheter|commande|pourquoi|quand|remboursement|retour|paiement|probleme|aide)\b/.test(n)?'fr':/\b(ciao|quanto|dove|prezzo|consegna|grazie|comprare|ordine|perche|quando|rimborso|reso|pagamento|problema|aiuto)\b/.test(n)?'it':'es';
    const found=Object.keys(data).find(k=>n.includes(k));
    const price=(k)=>data[k][1], name=(k)=>data[k][0];
    const en=lang==='en',fr=lang==='fr',it=lang==='it';
    if(/^(hola|holi|hello|hi|hey|bonjour|salut|ciao)\b/.test(n)) return en?'Ciao! I’m here with you. Tell me what happened or what you’re trying to decide, and we’ll work it out together.':fr?'Ciao ! Je suis là avec vous. Dites-moi ce qui se passe ou ce que vous hésitez à choisir et on va le résoudre ensemble.':it?'Ciao! Sono qui con te. Dimmi cosa è successo o cosa vuoi scegliere e lo risolviamo insieme.':'¡Ciao! Estoy aquí contigo. Cuéntame qué pasó o qué estás tratando de decidir y lo vemos juntos.';
    if(/(me cobraron dos|cobro doble|cargo doble|duplicate charge|charged twice|double charge|deux fois|doppio addebito)/.test(n)) return en?'If you were charged twice, I can help you prepare the case. Check whether both charges are confirmed and, if you have it, send me the order number, amount, date and payment method. I can guide you, but I cannot promise a reversal until the payment is verified.':fr?'Si vous avez été débité deux fois, je peux vous aider à préparer le dossier. Vérifiez si les deux débits sont confirmés et, si vous l’avez, donnez-moi le numéro de commande, le montant, la date et le moyen de paiement. Je peux vous guider, mais je ne peux pas promettre un remboursement avant vérification.':it?'Se ti hanno addebitato due volte, posso aiutarti a preparare il caso. Controlla se entrambi gli addebiti sono confermati e, se ce l’hai, dammi numero d’ordine, importo, data e metodo di pagamento. Posso guidarti, ma non posso promettere uno storno prima della verifica.':'Si te cobraron dos veces, te ayudo a preparar el caso. Revisa si ambos cargos aparecen confirmados y, si lo tienes, dime número de pedido, monto, fecha y método de pago. Puedo guiarte, pero no puedo prometer un reembolso hasta verificarlo.';
    if(/(no me deja pagar|pago fallo|pago falló|pago rechazado|payment failed|cant pay|can't pay|checkout.*error|paiement.*échoué|pagamento.*fallito)/.test(n)) return en?'Let’s troubleshoot it. First tell me what you see when you try to pay: an error message, a rejected payment, a loading screen, or a page that does nothing. If you give me the exact message and whether you’re on phone or computer, I can narrow it down.':fr?'On va le résoudre. Que voyez-vous au moment du paiement : un message d’erreur, un paiement refusé, un chargement qui reste bloqué ou rien ne se passe ? Donnez-moi le message exact et dites-moi si vous êtes sur téléphone ou ordinateur.':'Vamos a solucionarlo. Dime qué pasa al intentar pagar: ¿sale un error, el pago es rechazado, se queda cargando o no sucede nada? Si me das el mensaje exacto y me dices si estás en teléfono o computadora, puedo orientarte mejor.';
    if(/(refund|reembolso|devolucion|devolución|return|retour|rimborso|reso)/.test(n)) return en?'I can help you with the case. I don’t want to invent a return/refund policy that the site hasn’t published, so tell me what happened with the order and whether it was already paid. Then I can tell you what information to gather and the next step.':fr?'Je peux vous aider avec le dossier. Je ne veux pas inventer une politique de retour/remboursement qui n’est pas publiée sur le site. Dites-moi ce qui s’est passé avec la commande et si elle a déjà été payée, puis je vous indiquerai les informations utiles et la prochaine étape.':it?'Posso aiutarti con il caso. Non voglio inventare una politica di reso/rimborso che il sito non ha pubblicato. Dimmi cosa è successo con l’ordine e se è già stato pagato, poi ti indico cosa serve e il prossimo passo.':'Te ayudo con el caso. No quiero inventarte una política de devolución/reembolso que la página no haya definido. Cuéntame qué pasó con el pedido y si ya fue pagado; con eso te digo qué información necesitamos y cuál sería el siguiente paso.';
    if(/(problema|error|no funciona|no sirve|ayuda|help|problem|issue|aide|probleme|aiuto|problema)/.test(n)) return en?'Of course. Tell me exactly what is going wrong and where you are in the page. I’ll help you troubleshoot it step by step instead of sending you to a generic menu.':fr?'Bien sûr. Dites-moi exactement ce qui ne fonctionne pas et où vous êtes sur la page. Je vais vous guider étape par étape, sans vous envoyer vers un menu générique.':it?'Certo. Dimmi esattamente cosa non funziona e in quale parte della pagina sei. Ti guiderò passo dopo passo, senza mandarti a un menu generico.':'Claro. Dime exactamente qué está fallando y en qué parte de la página estás. Te ayudo a resolverlo paso a paso, sin mandarte a un menú genérico.';
    if(found && /precio|cuesta|vale|cuanto|price|cost|how much|combien|quanto/.test(n)) return en?`${name(found)} is $${price(found)} MXN for 350 ml.`:fr?`${name(found)} coûte $${price(found)} MXN pour 350 ml.`:it?`${name(found)} costa $${price(found)} MXN per 350 ml.`:`${name(found)} cuesta $${price(found)} MXN y es de 350 ml.`;
    if(/(cocada|proximamente|próximamente)/.test(n)) return en?'Cocada is coming soon. It is not available to add to the bag yet.':fr?'La Cocada arrive prochainement. Elle n’est pas encore disponible à l’achat.':it?'La Cocada arriverà prossimamente. Per ora non è disponibile per l’acquisto.':'La Cocada estará disponible próximamente; por ahora no se puede agregar a la bolsa.';
    if(/(sabor|sabores|flavor|flavors|postres|desserts|gusti|quels desserts)/.test(n)) return en?'We have Pay de Limón, Tres Leches, Cheesecake, Ferrero, Fresa con Crema, Maracuyá and Oreo. Tell me what you usually like—creamy, fruity, chocolatey, fresh—and I’ll help you choose.':fr?'Nous avons Pay de Limón, Tres Leches, Cheesecake, Ferrero, Fresa con Crema, Maracuyá et Oreo. Dites-moi ce que vous aimez d’habitude et je vous aiderai à choisir.':it?'Abbiamo Pay de Limón, Tres Leches, Cheesecake, Ferrero, Fresa con Crema, Maracuyá e Oreo. Dimmi cosa ti piace di solito e ti aiuto a scegliere.':'Tenemos Pay de Limón, Tres Leches, Cheesecake, Ferrero, Fresa con Crema, Maracuyá y Oreo. Dime qué te gusta normalmente —cremoso, frutal, chocolate, fresco— y te ayudo a elegir.';
    if(/(ciudades|cities|where do you deliver|donde entregan|entregan|delivery|livraison|consegna|houston|el paso|ciudad juarez|ciudad juárez|juarez|juárez)/.test(n)) return en?'For now, sales and deliveries are available only in Ciudad Juárez.':fr?'Pour le moment, les ventes et les livraisons sont disponibles uniquement à Ciudad Juárez.':it?'Per ora, vendite e consegne sono disponibili solo a Ciudad Juárez.':'Por ahora, las ventas y entregas están disponibles únicamente en Ciudad Juárez.';
    if(/(pago|pagar|payment|pay|stripe|paypal)/.test(n)) return en?'I can help you troubleshoot the payment. Tell me what happened at checkout—rejected, pending, charged but no confirmation, or another error—and we’ll narrow it down.':fr?'Je peux vous aider avec le paiement. Dites-moi ce qui s’est passé : refusé, en attente, débité sans confirmation ou autre erreur, et on va le cerner.':it?'Posso aiutarti con il pagamento. Dimmi cosa è successo: rifiutato, in sospeso, addebitato senza conferma o altro errore, e lo analizziamo insieme.':'Te ayudo con el pago. Dime qué ocurrió: ¿rechazado, pendiente, te cobraron pero no aparece la confirmación u otro error? Y lo vamos revisando juntos.';
    if(/(bolsa|carrito|bag|cart|pedido|order|commande|ordine)/.test(n)) return en?'Sure. Tell me what you’re seeing in the bag or what you want to change, and I’ll guide you from there.':fr?'Bien sûr. Dites-moi ce que vous voyez dans votre sac ou ce que vous voulez modifier et je vous guiderai.':it?'Certo. Dimmi cosa vedi nella borsa o cosa vuoi cambiare e ti guido da lì.':'Claro. Dime qué estás viendo en tu bolsa o qué quieres cambiar y te voy guiando desde ahí.';
    if(/(gracias|thanks|thank you|merci|grazie)/.test(n)) return en?'You’re very welcome. I’m right here if you need anything else.':fr?'Avec plaisir. Je reste là si vous avez besoin d’autre chose.':it?'Con piacere. Sono qui se hai bisogno di altro.':'¡Con mucho gusto! Aquí estoy si necesitas otra cosa.';
    if(found) return en?`${name(found)} is $${price(found)} MXN for 350 ml. If you tell me what you like, I can also help you decide whether it’s the best choice for you.`:`${name(found)} cuesta $${price(found)} MXN y es de 350 ml. Si me dices qué sabores te gustan, también puedo ayudarte a decidir si es la mejor opción para ti.`;
    return en?'I’m listening. Tell me what you’re trying to do or what went wrong, and we’ll work through it together.':fr?'Je vous écoute. Dites-moi ce que vous essayez de faire ou ce qui s’est mal passé, et on va le résoudre ensemble.':it?'Ti ascolto. Dimmi cosa stai cercando di fare o cosa è andato storto e lo risolviamo insieme.':'Te escucho. Cuéntame qué quieres hacer o qué salió mal y lo resolvemos juntos.';
  }
  async function getReply(msg){try{const r=await fetch('/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:msg,history})});if(r.ok){const d=await r.json();if(d.reply)return d.reply}}catch(_){}return localReply(msg)}
  chatForm.onsubmit=async e=>{e.preventDefault();const msg=input.value.trim();if(!msg)return;add('user',msg);remember('user',msg);input.value='';typing();const reply=await getReply(msg);stop();add('bot',reply);remember('assistant',reply)};
})();

// registro / login
const account=$('#accountModal');$('#openAccount')&&($('#openAccount').onclick=()=>account.classList.add('show'));$('#closeAccount')&&($('#closeAccount').onclick=()=>account.classList.remove('show'));document.querySelectorAll('[data-tab]').forEach(btn=>btn.onclick=()=>{document.querySelectorAll('[data-tab]').forEach(x=>x.classList.remove('active'));btn.classList.add('active');const reg=btn.dataset.tab==='register';document.querySelector('.register-only')?.classList.toggle('hidden',!reg);const submit=$('#accountSubmit');if(submit)submit.textContent=reg?'CREAR CUENTA':'INICIAR SESIÓN'});const accountForm=$('#accountForm');if(accountForm)accountForm.onsubmit=e=>{e.preventDefault();const email=$('#accountEmail').value;const mode=document.querySelector('[data-tab].active')?.dataset.tab;if(mode==='register')localStorage.setItem('ohqp-user',JSON.stringify({email}));$('#accountStatus').textContent=mode==='register'?'Cuenta creada en modo demo.':'Sesión iniciada en modo demo.';setTimeout(()=>account.classList.remove('show'),900)};
// MERCH: funciona igual que las latas. Se arrastra la pieza hasta la bolsa y entra visualmente.
function merchId(name){return 'merch-'+name.toLowerCase().replaceAll(' ','-')}
function addMerchToCart(item){
  const id=merchId(item.name),found=cart.find(i=>i.id===id);
  found?found.qty++:cart.push({id,name:item.name,price:item.price,img:item.img,qty:1,merch:true});
  save();toast(item.name+' entró en tu bolsa');
}
function receiveMerch(item){
  const zone=$('#merchBagZone'),wrap=$('#merchBagWrap'),img=$('#merchBagItem'),label=$('#merchDropLabel');
  if(!zone||!wrap||!img){addMerchToCart(item);return}
  zone.classList.remove('dragover');
  img.src=item.img;img.alt=item.name;img.classList.remove('hidden');
  wrap.classList.remove('open','receiving');
  requestAnimationFrame(()=>wrap.classList.add('open'));
  setTimeout(()=>wrap.classList.add('receiving'),80);
  if(label)label.textContent=item.name;
  setTimeout(()=>{
    wrap.classList.remove('receiving','open');
    img.classList.add('hidden');
    if(label)label.textContent='ARRASTRA TU MERCH AQUÍ';
    addMerchToCart(item);
  },900);
}
function enableMerchDrag(el,item){
  // PC: HTML5 drag. Móvil/tablet: Pointer Events + coordenadas reales de la bolsa.
  let pointerId=null, dragging=false, ghost=null, startX=0, startY=0, lastX=0, lastY=0;
  const isMobile=()=>window.matchMedia('(pointer:coarse)').matches||navigator.maxTouchPoints>0;

  const clear=()=>{
    if(ghost){ghost.remove();ghost=null}
    dragging=false; pointerId=null;
    el.classList.remove('merch-touch-dragging');
    document.body.classList.remove('oqp-drag-active');
    const z=$('#merchBagZone'); if(z)z.classList.remove('dragover');
  };

  const overBag=(x,y)=>{
    const zone=$('#merchBagZone');
    if(!zone)return false;

    // Primero usa el elemento realmente situado debajo del dedo.
    const below=document.elementFromPoint(x,y);
    if(below && (below===zone || below.closest('#merchBagZone')))return true;

    // Después usa las dimensiones reales visibles de la bolsa.
    const r=zone.getBoundingClientRect();
    const pad=isMobile()?42:12;
    return x>=r.left-pad && x<=r.right+pad && y>=r.top-pad && y<=r.bottom+pad;
  };

  const update=(x,y)=>{
    lastX=x; lastY=y;
    if(ghost){
      const w=ghost.offsetWidth||130,h=ghost.offsetHeight||130;
      ghost.style.transform=`translate3d(${x-w/2}px,${y-h/2}px,0)`;
    }
    const z=$('#merchBagZone');
    if(z)z.classList.toggle('dragover',overBag(x,y));
  };

  const begin=(x,y)=>{
    if(dragging)return;
    dragging=true;
    ghost=el.querySelector('img').cloneNode(true);
    ghost.className='drag-ghost merch-drag-ghost';
    Object.assign(ghost.style,{
      position:'fixed',left:'0',top:'0',margin:'0',
      pointerEvents:'none',zIndex:'2147483647',
      maxWidth:isMobile()?'150px':'170px',
      maxHeight:isMobile()?'150px':'170px',
      objectFit:'contain',touchAction:'none'
    });
    document.body.appendChild(ghost);
    el.classList.add('merch-touch-dragging');
    document.body.classList.add('oqp-drag-active');
    update(x,y);
  };

  // Escritorio
  el.draggable=true;
  el.addEventListener('dragstart',e=>{
    if(isMobile())return;
    e.dataTransfer.setData('application/x-ohqp-merch',JSON.stringify(item));
    e.dataTransfer.effectAllowed='copy';
  });
  el.addEventListener('dragend',()=>$('#merchBagZone')?.classList.remove('dragover'));

  // Móvil/tablet: mantener y arrastrar físicamente.
  el.addEventListener('pointerdown',e=>{
    if(e.pointerType==='mouse')return;
    pointerId=e.pointerId;
    startX=lastX=e.clientX; startY=lastY=e.clientY;
    try{el.setPointerCapture(pointerId)}catch(_){}
  },{passive:true});

  el.addEventListener('pointermove',e=>{
    if(e.pointerId!==pointerId)return;
    const distance=Math.hypot(e.clientX-startX,e.clientY-startY);
    if(!dragging && distance>=7)begin(e.clientX,e.clientY);
    if(dragging){
      e.preventDefault();
      update(e.clientX,e.clientY);
    }
  },{passive:false});

  const finish=e=>{
    if(e.pointerId!==pointerId)return;
    const x=Number.isFinite(e.clientX)?e.clientX:lastX;
    const y=Number.isFinite(e.clientY)?e.clientY:lastY;
    const accepted=dragging && overBag(x,y);
    try{el.releasePointerCapture(pointerId)}catch(_){}
    clear();
    if(accepted)receiveMerch(item);
  };
  el.addEventListener('pointerup',finish,{passive:true});
  el.addEventListener('pointercancel',e=>{if(e.pointerId===pointerId)clear()},{passive:true});
}
const merchZone=$('#merchBagZone');
if(merchZone){
  merchZone.ondragover=e=>{e.preventDefault();merchZone.classList.add('dragover')};
  merchZone.ondragleave=()=>merchZone.classList.remove('dragover');
  merchZone.ondrop=e=>{e.preventDefault();merchZone.classList.remove('dragover');try{const item=JSON.parse(e.dataTransfer.getData('application/x-ohqp-merch'));if(item)receiveMerch(item)}catch(_){}};
}
document.querySelectorAll('[data-merch-card]').forEach(card=>enableMerchDrag(card,{name:card.dataset.merch,price:Number(card.dataset.price),img:card.dataset.img}));
renderProducts();renderCart();


/* ===== RUTAS SOLICITADAS: PC / MÓVIL + MÚSICA + REGRESO =====
   Este bloque NO modifica productos, precios, refri, bolsa ni diseño.
   Solo separa el comportamiento de interacción por tipo de dispositivo,
   conserva el estado de la música entre Inicio/Merch y evita volver al intro. */
(() => {
  const ROUTE_KEY = 'ohqp-route-state';
  const isTouchDevice = () =>
    window.matchMedia('(pointer: coarse)').matches ||
    navigator.maxTouchPoints > 0;

  document.documentElement.dataset.oqpDevice = isTouchDevice() ? 'mobile' : 'desktop';

  const saveRoute = (from) => {
    const a = document.getElementById('audio') || document.getElementById('merchAudio');
    let state = {};
    try { state = JSON.parse(localStorage.getItem('ohqp-music-state') || '{}'); } catch (_) {}
    if (a) {
      state = {
        time: Number.isFinite(a.currentTime) ? a.currentTime : (state.time || 0),
        playing: !a.paused,
        volume: typeof a.volume === 'number' ? a.volume : state.volume,
        muted: !!a.muted
      };
      try { localStorage.setItem('ohqp-music-state', JSON.stringify(state)); } catch (_) {}
    }
    try {
      sessionStorage.setItem(ROUTE_KEY, JSON.stringify({
        from,
        skipIntro: true,
        music: state
      }));
    } catch (_) {}
  };

  // INICIO -> MERCH: guardar estado justo antes de navegar.
  document.querySelectorAll('a[href="merch.html"]').forEach(link => {
    link.addEventListener('click', () => saveRoute('home'), true);
    link.addEventListener('pointerdown', () => saveRoute('home'), {passive:true, capture:true});
  });

  // MERCH -> INICIO: marcar que ya se entró a la web y por tanto NO debe aparecer el intro.
  document.querySelectorAll('a[href="index.html"], a[href="index.html#inicio"], .oqp-back-home').forEach(link => {
    const goHome = () => {
      saveRoute('merch');
      try {
        const r = JSON.parse(sessionStorage.getItem(ROUTE_KEY) || '{}');
        r.skipIntro = true;
        sessionStorage.setItem(ROUTE_KEY, JSON.stringify(r));
      } catch (_) {}
    };
    link.addEventListener('click', goHome, true);
    link.addEventListener('pointerdown', goHome, {passive:true, capture:true});
  });

  // En la página principal, si venimos de Merch, ocultar únicamente el intro.
  const intro = document.getElementById('intro');
  try {
    const route = JSON.parse(sessionStorage.getItem(ROUTE_KEY) || '{}');
    if (route.skipIntro && route.from === 'merch' && intro) {
      intro.classList.add('hide');
      intro.style.display = 'none';
      intro.style.pointerEvents = 'none';
      // Se conserva la ruta normal de Inicio después de volver.
      history.replaceState({oqp:'home'}, '', 'index.html#inicio');
    }
  } catch (_) {}

  // Restauración de música: mismo segundo, volumen y estado.
  const pageAudio = document.getElementById('audio') || document.getElementById('merchAudio');
  if (pageAudio) {
    let routeMusic = null;
    try {
      const route = JSON.parse(sessionStorage.getItem(ROUTE_KEY) || '{}');
      routeMusic = route.music || null;
    } catch (_) {}

    const restore = () => {
      if (!routeMusic) return;
      if (typeof routeMusic.volume === 'number') pageAudio.volume = routeMusic.volume;
      pageAudio.muted = !!routeMusic.muted;
      if (Number.isFinite(routeMusic.time) && routeMusic.time > 0) {
        try { pageAudio.currentTime = Math.min(routeMusic.time, Math.max(0, (pageAudio.duration || routeMusic.time + 1) - .05)); } catch (_) {}
      }
      if (routeMusic.playing) {
        const playPromise = pageAudio.play();
        if (playPromise && playPromise.catch) {
          playPromise.catch(() => {
            // Algunos Chrome/Safari móviles bloquean el autoplay tras cambiar de documento.
            // El primer gesto del usuario reanuda exactamente desde el mismo punto.
            const unlock = () => {
              pageAudio.play().catch(()=>{});
              window.removeEventListener('pointerdown', unlock, true);
              window.removeEventListener('touchstart', unlock, true);
            };
            window.addEventListener('pointerdown', unlock, true);
            window.addEventListener('touchstart', unlock, true);
          });
        }
      }
    };
    if (pageAudio.readyState >= 1) restore();
    else pageAudio.addEventListener('loadedmetadata', restore, {once:true});
  }
})();


// ENTREGA: Ciudad Juárez y datos del cliente antes del pago.
(()=>{
  const modal=$('#checkoutModal'),form=$('#deliveryForm');
  if(!modal||!form)return;
  const close=()=>{modal.classList.remove('show');modal.setAttribute('aria-hidden','true')};
  $('#closeCheckout')?.addEventListener('click',close);
  modal.addEventListener('click',e=>{if(e.target===modal)close()});

  const selectedCity='Ciudad Juárez, Chihuahua';
  const hidden=$('#deliveryCity');if(hidden)hidden.value=selectedCity;
  try{localStorage.removeItem('ohqp-delivery-fee');localStorage.removeItem('ohqp-delivery-city')}catch(_){}

  form.addEventListener('submit',e=>{
    e.preventDefault();
    const delivery={
      city:selectedCity,
      name:$('#deliveryName')?.value.trim()||'',
      phone:$('#deliveryPhone')?.value.trim()||'',
      address:$('#deliveryAddress')?.value.trim()||'',
      neighborhood:$('#deliveryNeighborhood')?.value.trim()||'',
      zip:$('#deliveryZip')?.value.trim()||'',
      reference:$('#deliveryReference')?.value.trim()||''
    };
    try{localStorage.setItem('ohqp-delivery',JSON.stringify(delivery))}catch(_){}
    close();
    toast('Datos de entrega guardados. Próximo paso: pago.');
  });
})();

/* === SOLO OPTIMIZACIÓN ANDROID === */
(()=>{
  const touch=window.matchMedia('(pointer:coarse)').matches||navigator.maxTouchPoints>0;
  if(!touch)return;
  document.documentElement.classList.add('oqp-mobile-performance');
  document.querySelectorAll('img').forEach((img,i)=>{
    try{
      img.decoding='async';
      if(i>10 && !img.loading) img.loading='lazy';
    }catch(_){}
  });
})();

// El botón de localidad abre el checkout de Ciudad Juárez.
(()=>{
  const cta=$('#localityCta');
  if(cta) cta.addEventListener('click',()=>{
    if(typeof checkout==='function') checkout();
    else $('#checkoutModal')?.classList.add('show');
  });

})();
