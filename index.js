/*
** altBlog client-side blog platform using javascript
** Developed 2020 by Ctrl Alt Tec
** Authors: @louloubadillo, @edvilme
** version 1.0 beta
*/
class AltBlog{
    //static Card;
    //static Editor;
    //static UI;
    //static Constants;
    //static currentUser;
    
    async getData(){
        this.data = await this.props.data();
        console.log("a",this.data)
        // URL DIRECTIONERW
        let URLparams = [...new URLSearchParams(window.location.search).entries()][0] || [0,0]
        this.navigationPushContent(URLparams[0], URLparams[1])
    }

    constructor(props){
        this.props = props;
        AltBlog.Constants.sections = props.sections;
        AltBlog.Constants.name = props.name ? props.name : location.hostname;
        AltBlog.currentUser = props.currentUser ? props.currentUser : {email: undefined};

        this.dom = document.querySelector("#BlogContainer");
        window.onpopstate = (event)=>{
            this.navigationSetContent(event.state.page, event.state.args)
        };

        this.navBar = new AltBlog.UI.NavBar(props.navBar, this)
        
    }

    navigationPushContent(page=null, args=null){
        history.pushState({page: page, args: args}, 'Now in page', `?${page}=${args}`);
        this.navigationSetContent(page, args)
    }

    navigationReplaceContent(page=null, args=null){
        history.replaceState({page: page, args: args}, 'Now in page', `?${page}=${args}`);
        this.navigationSetContent(page, args)
    }

    navigationSetContent(page, args){
        this.dom.innerHTML = "";
        this.navBar.emptySelection();
        switch (page) {
            case 'post':
                if(args=='new' && AltBlog.currentUser.email != undefined){args={}}
                if(args=='new' && AltBlog.currentUser.email == undefined){break;}
                let post = this.data.find(i=>(i.id == args))
                this.openPost( post );
                document.title = post.title + " | " + AltBlog.Constants.name;
                break;
            case 'search':
                this.setPagePosts(i => (i.title.includes(args) || i.subtitle.includes(args)));
                document.title = "Searching: " + post.title + " | " + AltBlog.Constants.name;
                break;
            case 'section':
                this.setPagePosts(i => ( i.section == args ));
                this.navBar.selectSection(args);
                document.title = args + " | " + AltBlog.Constants.name;
                break;
            case 'user':
                this.setPageUser();
                document.title = "User | " + AltBlog.Constants.name;
                break;
            case 'tag':
                this.setPagePosts(i => ( i.tags != undefined && i.tags.includes(args) ));
                document.title = "Tag: " + post.title + " | " + AltBlog.Constants.name;

                break;
            default: 
                this.setPagePosts(); 
                document.title = AltBlog.Constants.name;
                break;
        }
    }

    setPageUser(){
        if(AltBlog.currentUser && AltBlog.currentUser.email){
            this.dom.innerHTML = "User!"
        } else {
            this.dom.innerHTML = "Please sign in"
            this.signin()
        }
    }

    signin(){
        let username = prompt("AltBlog Login \nUsername");
        let password = prompt("AltBlog Login \nPassword");
        this.props.login(username, password);
    }

    setPagePosts(f=(i)=>true){
        this.data.filter(f).forEach(l => {
            this.dom.append( new AltBlog.Card(l, this).dom )
        });
        //New post button
        let newPost = document.createElement('div');
        newPost.classList.add('AltBlog_FAB', '__editor-publish');        
        newPost.addEventListener('click', ()=>{
            this.navigationPushContent('post', 'new');
 
        })
        this.dom.append(newPost);
    }


    openPost(post={}){
        this.dom.append(new AltBlog.Editor(post, this).dom)
    }

    deletePost(post){
        if(confirm("¿Borrar el post? \n Esta accion no se puede deshacer")){
            this.props.delete(post.id, post);
            this.getData().then(()=>{ this.navigationReplaceContent("", "") });
        }
    }

    updatePost(id, post){
        this.props.update(id, post);
    }

    createPost(post){
        this.props.create(post);
    }

    async fileUploadAndGetUrl(stream, name){
        let url = await this.props.fileUpload(stream, name);
        return url
    }
}

AltBlog.Card = class{
    constructor(post, _altBlog){
        this.dom = document.createElement('div');
        this.dom.classList.add('AltBlog_Card');
        this.dom.addEventListener('click', ()=>{
            _altBlog.navigationPushContent('post', post.id);
        })
        this.dom.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.3) 50%, rgba(0, 0, 0, 0.7) 80%, rgba(0, 0, 0, 0.8) 100%), url(${post.image})`
        
        let tag = document.createElement('span');
        tag.classList.add('tag');
        tag.innerHTML = post.section ? post.section : 'Categoría';
        let title = document.createElement('h1');
        title.innerHTML = post.title;
        let subtitle = document.createElement('span');
        subtitle.innerHTML = post.subtitle;
        subtitle.innerHTML = post.subtitle;
        this.dom.append(tag, title, subtitle);
    }
}

AltBlog.Constants = {
    sections: [],
}

AltBlog.Editor = class{
    //static Tags;
    constructor(post, _altBlog){
        this.post = post;
        this._altBlog = _altBlog;
        this.isNew = post.id == undefined;

        if(this.isNew){
            if(AltBlog.currentUser){
                this.post.author = AltBlog.currentUser.email
            } else {
                _altBlog.signin()
                this.post.author = AltBlog.currentUser.email
            }
        }
        
        
        this.isEditable = this.post.author == AltBlog.currentUser.email;
        
        this.dom = document.createElement('div');
        this.dom.classList.add('AltBlog_Editor_Cont');


        let header = document.createElement('div');
        header.classList.add('AltBlog_Editor_Header')
        header.style.background = `linear-gradient(rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.3) 50%, rgba(0, 0, 0, 0.7) 80%, rgba(0, 0, 0, 0.8) 100%), url(' ${post.image ? post.image : ''}')`
        this.title = document.createElement('h1');
        this.title.innerText = post.title ? post.title : 'Título';
        this.title.contentEditable = "true";
        this.subtitle = document.createElement('h2');
        this.subtitle.innerText = post.subtitle ? post.subtitle : 'Subtitulo';
        this.subtitle.contentEditable = "true";
        this.section = document.createElement('span');
        this.section.classList.add('tag')
        this.section.innerText = post.section ? post.section : 'Categoría';
        let headerImageUpload = document.createElement('input');
        headerImageUpload.type = "file";
        if(this.isEditable){
            header.addEventListener('click', (e)=>{
                e.preventDefault();
                e.stopImmediatePropagation();
                headerImageUpload.click();
            });
            headerImageUpload.addEventListener('change', (e)=>{
                _altBlog.fileUploadAndGetUrl(e.target.files[0], post.id+"/header").then(url=>{
                    post.image = url;
                    header.style.background = `linear-gradient(rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.3) 50%, rgba(0, 0, 0, 0.7) 80%, rgba(0, 0, 0, 0.8) 100%), url(' ${url}')`
                })
            })
        }
        
        header.append(this.section, this.title, this.subtitle);

        
        //hashtags.contentEditable = "true";
    
        //post.hashtags = ["Blog", "Development", "Etc"]

        this.hashtags = new AltBlog.Editor.Tags(post.tags);
        
        this.postCommands = new AltBlog.UI.PostCommands(post, this);
        let byline = document.createElement('div');
        byline.classList.add('AltBlog_Editor_Byline');
        byline.innerHTML = `Por ${ post.author ? post.author : AltBlog.currentUser } `;
        this.editor_cont = document.createElement('div');
        this.editor_cont.classList.add('AltBlog_Editor_editorCont')
        this.publish_btn = document.createElement('div');
        this.publish_btn.classList.add('AltBlog_FAB', '__editor-publish');
        this.publish_btn.addEventListener('click', ()=>{this.publish()})
        this.dom.append(header, this.postCommands.dom, this.hashtags.dom, byline, this.editor_cont, this.publish_btn)
        this.initEditor()
    }

    initEditor(){
        this.editor = new EditorJS({
            tools: { 
                header: Header,
                image: SimpleImage,
                list: {
                    class: List,
                    inlineToolbar: true,
                }, 
                paragraph: {
                    class: Paragraph, 
                    inlineToolbar: true
                }, 
                //raw: RawTool,
                code: CodeTool, 
                table: Table,
                embed: {
                    class: Embed, 
                    inlineToolbar: true,
                },
                //math: Latex
            },
            placeholder: "Empiece a escribir o presione tab para añadir contenido", 
            holder: this.editor_cont,
            data: this.post,
            onReady:()=>{
                console.log(this.post.author)
                if(!this.isEditable){
                    this.readOnly();
                }
            }
        });
    }

    readOnly(){
        this.dom.removeChild(this.postCommands.dom);
        this.dom.removeChild(this.publish_btn);
        let content = this.editor_cont.innerHTML;
        this.editor.destroy();
        this.editor_cont.innerHTML = content;
        this.dom.querySelectorAll('[contenteditable]').forEach(l=>{
            l.contentEditable = false;
        })
        this.dom.querySelectorAll('textarea').forEach(l=>{
            l.disabled = true;
        })
    }

    async getData(){
        let editorData = await this.editor.save();
        return {
            ...this.post,
            ...editorData,
            tags: this.hashtags.getValues(),
            title: this.title.innerText,
            subtitle: this.subtitle.innerText,
            author: AltBlog.currentUser.email,
            ...this.postCommands.getData()
        }
    }

    publish(){
        this.getData().then(data=>{
            if(!this.isNew){
                this._altBlog.updatePost(this.post.id, data);
            } else {
                this._altBlog.createPost(data);
            }
        })        
    }

    delete(){
        this._altBlog.deletePost(this.post)
    }
}

AltBlog.Editor.Tags = class{
    constructor(tags = []){
        this.dom = document.createElement('div');
        this.dom.classList.add('AltBlog_Editor_Hashtags');
        this.dom.contentEditable = "true";
        this.dom.innerHTML = tags.join(" ");

        this.dom.addEventListener('keyup', ()=>{
            if(event.keyCode == 32 || event.keyCode == 13){
                this.render()
            }
        })
        this.render()
    }
    render(){
        let value = this.dom.innerText;
        value = value.replace( /\S+/g, (a)=>new AltBlog.UI.Tag(a).dom.outerHTML).replace("<br>", ""); 
        this.dom.innerHTML = value;
        this.dom.focus();
        document.execCommand('selectAll', false, null);
        document.getSelection().collapseToEnd()
    }
    getValues(){
        return this.dom.innerText.split(' ')
    }
    
}

AltBlog.UI = {
    PostCommnands: null,
    NavBar: null,
    Tag: null
}

AltBlog.UI.PostCommands = class{
    constructor(post, _altBlog_altEditor){
        this.dom = document.createElement('div');
        this.dom.classList.add('AltBlog_Editor_Header-Commands');

        this.commands_delete = document.createElement('button');
        this.commands_delete.textContent = 'Eliminar'
        this.commands_delete.addEventListener('click', ()=>{ _altBlog_altEditor.delete() })

        this.commands_section = document.createElement('select');
        AltBlog.Constants.sections.forEach(i=>{
            let option = document.createElement('option');
            option.value = i;
            option.innerHTML = i;
            this.commands_section.append(option)
        })

        this.commands_section.selectedIndex = AltBlog.Constants.sections.indexOf( post.section ) ? AltBlog.Constants.sections.indexOf( post.section ) : 0
        this.dom.append(this.commands_delete, this.commands_section);
    }
    getData(){
        return {
            section: this.commands_section.value
        }
    }
}

AltBlog.UI.NavBar = class {
    constructor(params, _altBlog){
        this._altBlog = _altBlog;
        this.dom = document.createElement('div');
        this.dom.classList.add('AltBlog_UI_NavBar');
        
        let navCont = document.createElement('div');
        navCont.classList.add('AltBlog_UI_NavBar-Nav')
        let logo = document.createElement('img');
        logo.src = params.logo;
        logo.addEventListener('click', ()=>{
            _altBlog.navigationPushContent(null, null);
        })
        this.sections = AltBlog.Constants.sections.map(l=>{
            let item = document.createElement('span');
            item.innerHTML = l;
            item.addEventListener('click', ()=>{
                _altBlog.navigationPushContent('section', l)
                
            })
            return item
            //navCont.append(item)
        })
        navCont.append(logo, ...this.sections)
        let search = document.createElement('input');
        search.type='search';
        search.placeholder = 'Buscar';
        search.addEventListener('input', ()=>{
            _altBlog.navigationReplaceContent('search', search.value)
        })
        this.user = document.createElement('div');
        this.user.classList.add('AltBlog_UI_Navbar-User')
        this.user.addEventListener('click', ()=>{
            _altBlog.navigationReplaceContent('user', search.value)
        })
        this.dom.append(navCont, search, this.user)
        document.body.prepend(this.dom)
    }
    emptySelection(){
        this.sections.forEach(i=>{
            i.classList.remove('active')
        })
    }
    selectSection(section){
        this.emptySelection();
        this.sections.find(i=>i.innerHTML==section).classList.add('active')
    }
}

AltBlog.UI.Tag = class{
    constructor(value, callback){
        this.dom = document.createElement('a');
        this.dom.href = "?tag="+value;
        this.dom.classList.add('AltBlog_UI_Tag');

        this.dom.innerHTML=value;

    }
}
