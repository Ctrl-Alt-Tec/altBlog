# altBlog
[Ctrl Alt Tec](https://ctrl-alt-tec.hackclub.com) altBlog is a javascript client-side engine for blog development, used in Watermelon, Quanta Blog, El Rayo, etc. 

## Getting started
### Include files
In index.html, include the following scripts

```
<script src="https://cdn.jsdelivr.net/gh/Ctrl-Alt-Tec/altBlog/index.js"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Ctrl-Alt-Tec/altBlog/index.css">
<script src="https://cdn.jsdelivr.net/npm/@editorjs/editorjs@latest"></script>
<script src="https://cdn.jsdelivr.net/npm/@editorjs/inline-code@1.0.1"></script>
<script src="https://cdn.jsdelivr.net/npm/@editorjs/header@latest"></script>
<script src="https://cdn.jsdelivr.net/npm/@editorjs/paragraph@latest"></script>
<script src="https://cdn.jsdelivr.net/npm/@editorjs/raw@latest"></script>
<script src="https://cdn.jsdelivr.net/npm/@editorjs/simple-image@latest"></script>
<script src="https://cdn.jsdelivr.net/npm/@editorjs/table@latest"></script>
<script src="https://cdn.jsdelivr.net/npm/@editorjs/embed@latest"></script>
```
### Setup
Instantiate altBlog with configuration options listed below
```
let Blog = new altBlog(options);
```
To start the blog, simply run
```
Blog.getData().then(()=>{Blog.showPosts()})
```

## Configuration
Initiate `altBlog(options)` where `options` is an object with keys:

Key | Default | Description
--- | ---     | ---
data () | async () | Should return an array of posts
login (username, password) | ()=>{} | Connects with backend for log in
update (id, post) | ()=>{} | Connects with backend to update post with id `id` with content `post`
delete (id, post) | ()=>{} | Connects with backend to delete post with id `id`
create (post) | ()=>{} | Connects with backend to push new post into data
fileUpload (stream, name, callback) | async () | Connects with backend to upload dataStream `stream` and store with `name`, should return url
allPosts | document.querySelector("#allPosts") | DOM element where Blog content should be displayed
sections | [] | Array with Blog sections, to be displayed in navbar and selector boxes
name | window.location.host | Name of blog to be displayed in title
navBar | {} | Object containing navbar config.

### navBar options
Contains configuration for navbar object

Key | Default | Description
--- | ---     | ---
logo | 'logo.png' | URL to logo to display in navbar
visible | true | (boolean) Show or hide navbar

## Examples
altBlog is used to develop several blog projects, including:
* [Ctrl Alt Tec Watermelon](https://ctrl-alt-tec.hackclub.com/watermelon) : Blog where we upload programming resources
* [Edvilme blog](http://edvilme.tk/blog) : Personal blog
* [Quanta CSF blog](https://quantacsf.gihtub.io/blog) : Blog for the physics student group to upload resources, tutorials and events

## Contribution
To contribute to this repo, you must first fork it and make a pull request. Because of its nature in supporting multiple projects, modifications should not break current working features, and experimental features must be marked as so. 


## Credits
altBlog is free software developed by Ctrl Alt Tec by [@louloubadillo](https://github.com/louloubadillo) and [@edvilme](https://github.com/edvilme) in its initial release.

altBlog.Editor is built upon [codex editor.js](https://github.com/codex-team/editor.js)
Further contributions will also be listed below

