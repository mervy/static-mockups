const $=(s,c=document)=>c.querySelector(s);
const store={
  get(k,d){try{return JSON.parse(localStorage.getItem(k))??d}catch{return d}},
  set(k,v){localStorage.setItem(k,JSON.stringify(v))}
};
let posts=store.get('posts',[
 {id:1,title:'Arquitetura moderna para APIs em 2026',category:'Backend',excerpt:'Camadas, contratos e observabilidade sem complicar seu domínio.',content:'Uma API moderna começa por fronteiras claras.\n\nSepare transporte, aplicação e domínio. Use contratos versionados, validação na borda e erros previsíveis.\n\nObservabilidade não é opcional: logs estruturados, métricas e tracing ajudam a entender produção.',author:'Rogério',date:'2026-10-18',views:1240,status:'Publicado',emoji:'🧱'},
 {id:2,title:'Rust vs Go para serviços web',category:'Linguagens',excerpt:'Performance, ergonomia e tempo de entrega na prática.',content:'Rust oferece controle de memória e segurança forte.\n\nGo prioriza simplicidade, concorrência acessível e deploy rápido.\n\nA escolha depende do time, do domínio e do custo de manutenção.',author:'Ana Lima',date:'2026-10-12',views:980,status:'Publicado',emoji:'⚙️'},
 {id:3,title:'Design de banco de dados para blogs',category:'Banco de Dados',excerpt:'Modelagem de posts, categorias, autores e métricas.',content:'Comece pelo agregado principal: post.\n\nCategorias podem ser many-to-many. Visitantes e eventos devem ficar separados do conteúdo editorial.',author:'Rogério',date:'2026-10-05',views:760,status:'Rascunho',emoji:'🗄️'},
 {id:4,title:'CSS moderno: variáveis, grid e dark mode',category:'Frontend',excerpt:'Um sistema visual consistente com pouco código.',content:'Custom properties centralizam o tema.\n\nGrid resolve layouts complexos sem media queries excessivas. Prefira contraste real e estados visíveis.',author:'Marina Souza',date:'2026-09-28',views:1520,status:'Publicado',emoji:'🎨'},
 {id:5,title:'Autenticação: do login ao refresh token',category:'Segurança',excerpt:'Fluxos seguros para aplicações web modernas.',content:'Nunca armazene senha em texto puro.\n\nUse hash adaptativo, tokens curtos e rotação de refresh token. Proteja rotas sensíveis no servidor.',author:'Ana Lima',date:'2026-09-20',views:890,status:'Publicado',emoji:'🔐'},
 {id:6,title:'Deploy simples: Git, CI e containers',category:'DevOps',excerpt:'Um pipeline mínimo para colocar seu projeto no ar.',content:'Automatize build, testes e publicação.\n\nContainers garantem consistência, mas não substituem boas configurações e segredos gerenciados.',author:'Rogério',date:'2026-09-14',views:640,status:'Publicado',emoji:'🚀'}
]);
let visitors=store.get('visitors',[
 {id:1,name:'Visitante 1024',country:'Brasil',page:'/post/arquitetura-moderna',device:'Desktop',date:'2026-10-26'},
 {id:2,name:'Visitante 1023',country:'Portugal',page:'/blog',device:'Mobile',date:'2026-10-26'},
 {id:3,name:'Visitante 1022',country:'Brasil',page:'/categorias',device:'Mobile',date:'2026-10-25'},
 {id:4,name:'Visitante 1021',country:'EUA',page:'/post/rust-vs-go',device:'Desktop',date:'2026-10-25'},
 {id:5,name:'Visitante 1020',country:'Brasil',page:'/home',device:'Tablet',date:'2026-10-24'}
]);
let user=store.get('user',null);
const routes={
 'home':renderHome,'categorias':renderCategorias,'blog':renderBlog,'post':renderPost,
 'login':renderLogin,'register':renderRegister,
 'dash-home':renderDashHome,'dash-registros':renderRegistros,'dash-visitantes':renderVisitantes,
 'dash-settings':renderSettings,'form-edicao':renderEditor
};
function nav(){return [
 ['/home','Home'],['/categorias','Categorias'],['/blog','Blog'],
 user?['/dash-home','Dashboard']:null,
 user?['/form-edicao','Novo post']:null
].filter(Boolean)}
function renderNav(){
 $('#nav').innerHTML=nav().map(([href,label])=>`<a href="#${href}" class="${location.hash==='#'+href?'active':''}">${label}</a>`).join('');
 const auth=$('#authLink');
 if(user){auth.textContent='Sair';auth.href='#';auth.onclick=e=>{e.preventDefault();user=null;store.set('user',null);toast('Sessão encerrada');go('/home')}}
 else{auth.textContent='Entrar';auth.href='#/login';auth.onclick=null}
}
function toast(msg){const t=document.createElement('div');t.className='toast';t.textContent=msg;document.body.appendChild(t);t.style.display='block';setTimeout(()=>t.remove(),2600)}
function go(path){location.hash='#'+path}
function requireAuth(){if(!user){toast('Faça login para acessar o dashboard');go('/login');return false}return true}
function postCard(p){return `<article class="card post-card" onclick="go('/post/${p.id}')">
 <div class="thumb">${p.emoji}</div>
 <div class="tag">${p.category}</div>
 <h3>${p.title}</h3>
 <p class="muted">${p.excerpt}</p>
 <div class="row muted" style="font-size:13px"><span>${p.author}</span><span>•</span><span>${p.date}</span><span>•</span><span>${p.views} views</span></div>
</article>`}
function renderHome(){
 $('#app').innerHTML=`
 <section class="hero">
  <div>
   <span class="pill">NOVO · Edição 2026</span>
   <h1>Ideias práticas para quem constrói software</h1>
   <p>Artigos sobre backend, arquitetura, bancos de dados, DevOps e linguagens modernas — com exemplos diretos e código aplicável.</p>
   <div class="row"><a class="btn" href="#/blog">Explorar blog</a><a class="btn ghost" href="#/categorias">Ver categorias</a></div>
  </div>
  <div class="card"><b>Destaque da semana</b><p class="muted">Arquitetura moderna para APIs: contratos, camadas e observabilidade.</p><a class="btn small" href="#/post/1">Ler artigo</a></div>
 </section>
 <section class="section"><h2>Posts recentes</h2><div class="grid cols3">${posts.slice(0,6).map(postCard).join('')}</div></section>
 <section class="section"><h2>Categorias populares</h2><div class="grid cols4">${['Backend','Linguagens','Banco de Dados','Frontend'].map(c=>`<a class="card" href="#/categorias" style="cursor:pointer"><div class="tag">${c}</div><b>${posts.filter(p=>p.category===c).length||1} artigos</b></a>`).join('')}</div></section>`;
}
function renderCategorias(){
 const cats=[...new Set(posts.map(p=>p.category))];
 $('#app').innerHTML=`<section class="section"><h1 style="margin:0 0 8px">Categorias</h1><p class="muted">Filtre o conteúdo por tema.</p>
 <div class="grid cols3">${cats.map(c=>`<div class="card"><div class="tag">${c}</div><h3>${c}</h3><p class="muted">${posts.filter(p=>p.category===c).length} artigos publicados.</p><a class="btn ghost small" href="#/blog?cat=${encodeURIComponent(c)}">Ver posts</a></div>`).join('')}</div></section>`;
}
function renderBlog(params){
 const cat=params.get('cat');
 const list=cat?posts.filter(p=>p.category===cat):posts;
 $('#app').innerHTML=`<section class="section"><div class="spread"><h1 style="margin:0">Blog</h1>${cat?`<span class="badge ok">${cat}</span>`:''}</div>
 <p class="muted">${list.length} artigos encontrados.</p>
 <div class="grid cols3">${list.map(postCard).join('')||'<p class="muted">Nenhum post.</p>'}</div></section>`;
}
function renderPost(params){
 const p=posts.find(x=>x.id==params.get('id'))||posts[0];
 p.views++;store.set('posts',posts);
 $('#app').innerHTML=`<article class="section">
 <div class="article-hero">${p.emoji} ${p.title}</div>
 <div class="row muted" style="margin:16px 0"><span class="tag">${p.category}</span><span>${p.author}</span><span>•</span><span>${p.date}</span><span>•</span><span>${p.views} visualizações</span></div>
 <div class="card prose">${p.content.split('\n\n').map(t=>`<p>${t}</p>`).join('')}</div>
 <div class="row" style="margin-top:22px"><a class="btn ghost" href="#/blog">← Voltar ao blog</a>${user?`<a class="btn" href="#/form-edicao?id=${p.id}">Editar post</a>`:''}</div>
 </article>`;
}
function renderLogin(){
 $('#app').innerHTML=`<div class="auth-wrap"><div class="card auth-card"><h2 class="center">Entrar</h2><p class="muted center">Use qualquer e-mail e senha para o mockup.</p>
 <form class="form" id="loginForm"><label>E-mail<input name="email" type="email" required placeholder="voce@email.com"></label>
 <label>Senha<input name="password" type="password" required placeholder="••••••••"></label>
 <button class="btn">Entrar</button></form>
 <p class="muted center">Não tem conta? <a href="#/register" style="color:var(--primary2)">Criar conta</a></p></div></div>`;
 $('#loginForm').onsubmit=e=>{e.preventDefault();const f=new FormData(e.target);user={name:f.get('email').split('@')[0],email:f.get('email'),role:'Admin'};store.set('user',user);toast('Login realizado');go('/dash-home')};
}
function renderRegister(){
 $('#app').innerHTML=`<div class="auth-wrap"><div class="card auth-card"><h2 class="center">Criar conta</h2>
 <form class="form" id="regForm"><label>Nome<input name="name" required></label>
 <label>E-mail<input name="email" type="email" required></label>
 <label>Senha<input name="password" type="password" required minlength="6"></label>
 <button class="btn">Registrar</button></form>
 <p class="muted center">Já tem conta? <a href="#/login" style="color:var(--primary2)">Entrar</a></p></div></div>`;
 $('#regForm').onsubmit=e=>{e.preventDefault();const f=new FormData(e.target);user={name:f.get('name'),email:f.get('email'),role:'Autor'};store.set('user',user);toast('Conta criada');go('/dash-home')};
}
function dashLayout(active,content){
 if(!requireAuth())return;
 $('#app').innerHTML=`<div class="sidebar-layout section">
 <aside class="card"><b style="display:block;margin-bottom:14px">Painel</b><nav class="dash-nav">
 ${[['/dash-home','Visão geral'],['/dash-registros','Registros'],['/dash-visitantes','Visitantes'],['/dash-settings','Configurações'],['/form-edicao','Editor de post']].map(([h,l])=>`<a href="#${h}" class="${active===h?'active':''}">${l}</a>`).join('')}
 </nav></aside><section>${content}</section></div>`;
}
function renderDashHome(){
 const totalViews=posts.reduce((s,p)=>s+p.views,0);
 dashLayout('/dash-home',`<div class="grid cols4">
 <div class="card stat"><b>${posts.length}</b><span>Posts</span></div>
 <div class="card stat"><b>${totalViews}</b><span>Visualizações</span></div>
 <div class="card stat"><b>${visitors.length}</b><span>Visitas registradas</span></div>
 <div class="card stat"><b>${posts.filter(p=>p.status==='Rascunho').length}</b><span>Rascunhos</span></div></div>
 <div class="card section"><div class="spread"><h2 style="margin:0">Tráfego semanal</h2><span class="muted">últimos 7 dias</span></div>
 <div class="chart">${[42,68,55,90,74,110,96].map((v,i)=>`<div class="bar" style="height:${v}%" data-v="${v} visitas"></div>`).join('')}</div></div>
 <div class="card section"><h2>Últimos posts</h2><table><thead><tr><th>Título</th><th>Status</th><th>Views</th><th></th></tr></thead><tbody>
 ${posts.slice(0,5).map(p=>`<tr><td>${p.title}</td><td><span class="badge ${p.status==='Publicado'?'ok':'warn'}">${p.status}</span></td><td>${p.views}</td><td><a class="btn ghost small" href="#/form-edicao?id=${p.id}">Editar</a></td></tr>`).join('')}
 </tbody></table></div>`);
}
function renderRegistros(){
 dashLayout('/dash-registros',`<div class="card"><div class="spread"><h2 style="margin:0">Registros de conteúdo</h2><a class="btn small" href="#/form-edicao">+ Novo post</a></div>
 <table><thead><tr><th>ID</th><th>Título</th><th>Categoria</th><th>Autor</th><th>Status</th><th>Ações</th></tr></thead><tbody>
 ${posts.map(p=>`<tr><td>#${p.id}</td><td>${p.title}</td><td>${p.category}</td><td>${p.author}</td><td><span class="badge ${p.status==='Publicado'?'ok':'warn'}">${p.status}</span></td>
 <td class="row"><a class="btn ghost small" href="#/post/${p.id}">Ver</a><a class="btn ghost small" href="#/form-edicao?id=${p.id}">Editar</a><button class="btn danger small" onclick="removePost(${p.id})">Excluir</button></td></tr>`).join('')}
 </tbody></table></div>`);
}
window.removePost=id=>{posts=posts.filter(p=>p.id!==id);store.set('posts',posts);toast('Post removido');renderRegistros()};
function renderVisitantes(){
 dashLayout('/dash-visitantes',`<div class="card"><div class="spread"><h2 style="margin:0">Visitantes recentes</h2><button class="btn ghost small" onclick="addVisitor()">Simular visita</button></div>
 <table><thead><tr><th>Visitante</th><th>País</th><th>Página</th><th>Dispositivo</th><th>Data</th></tr></thead><tbody>
 ${visitors.map(v=>`<tr><td>${v.name}</td><td>${v.country}</td><td>${v.page}</td><td>${v.device}</td><td>${v.date}</td></tr>`).join('')}
 </tbody></table></div>`);
}
window.addVisitor=()=>{const devices=['Desktop','Mobile','Tablet'];visitors.unshift({id:Date.now(),name:'Visitante '+(1000+visitors.length),country:['Brasil','Portugal','EUA','Argentina'][Math.floor(Math.random()*4)],page:['/home','/blog','/categorias','/post/1'][Math.floor(Math.random()*4)],device:devices[Math.floor(Math.random()*3)],date:new Date().toISOString().slice(0,10)});store.set('visitors',visitors);toast('Visita registrada');renderVisitantes()};
function renderSettings(){
 dashLayout('/dash-settings',`<div class="grid cols2"><div class="card"><h2>Preferências</h2>
 <form class="form" id="settingsForm">
 <label>Nome do site<input name="site" value="NovaBlog"></label>
 <label>Idioma<select name="lang"><option>Português (BR)</option><option>English</option></select></label>
 <label>Tema<select name="theme"><option value="dark">Escuro</option><option value="light">Claro</option></select></label>
 <button class="btn">Salvar</button></form></div>
 <div class="card"><h2>Conta</h2><p><b>${user?.name||'—'}</b><br><span class="muted">${user?.email||''}</span></p>
 <p class="muted">Função: ${user?.role||'—'}</p><button class="btn danger" onclick="if(confirm('Excluir conta?')){localStorage.clear();location.reload()}">Excluir conta</button></div></div>`);
 $('#settingsForm').onsubmit=e=>{e.preventDefault();const f=new FormData(e.target);document.body.classList.toggle('light',f.get('theme')==='light');toast('Configurações salvas')};
}
function renderEditor(params){
 if(!requireAuth())return;
 const id=params.get('id');const p=posts.find(x=>x.id==id);
 dashLayout('/form-edicao',`<div class="card"><h2>${p?'Editar post':'Novo post'}</h2>
 <form class="form" id="postForm" style="max-width:none">
 <label>Título<input name="title" required value="${p?.title||''}"></label>
 <div class="grid cols2"><label>Categoria<input name="category" required value="${p?.category||'Backend'}"></label>
 <label>Status<select name="status"><option ${p?.status==='Publicado'?'selected':''}>Publicado</option><option ${p?.status==='Rascunho'?'selected':''}>Rascunho</option></select></label></div>
 <label>Resumo<input name="excerpt" required value="${p?.excerpt||''}"></label>
 <label>Conteúdo<textarea name="content" required>${p?.content||''}</textarea></label>
 <div class="row"><button class="btn">${p?'Salvar alterações':'Publicar post'}</button><a class="btn ghost" href="#/dash-registros">Cancelar</a></div></form></div>`);
 $('#postForm').onsubmit=e=>{e.preventDefault();const f=Object.fromEntries(new FormData(e.target));
 if(p){Object.assign(p,f);toast('Post atualizado')}else{posts.unshift({id:Date.now(),...f,author:user.name,date:new Date().toISOString().slice(0,10),views:0,emoji:'✨'});toast('Post criado')}
 store.set('posts',posts);go('/dash-registros')};
}
function router(){
 const raw=location.hash.slice(2)||'home';
 const [path,qs]=raw.split('?');
 const params=new URLSearchParams(qs||'');
 (routes[path]||renderHome)(params);
 renderNav();
 window.scrollTo({top:0,behavior:'smooth'});
}
document.getElementById('themeBtn').onclick=()=>{document.body.classList.toggle('light');toast(document.body.classList.contains('light')?'Tema claro':'Tema escuro')};
window.addEventListener('hashchange',router);
router();