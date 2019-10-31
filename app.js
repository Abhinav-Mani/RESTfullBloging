const express           =require('express'),
      app               =express(),
      bodyParser        =require('body-parser'),
      mongoose          =require('mongoose'),
      methodOverride    =require('method-override'),
      expressSanitizer  =require('express-sanitizer');

mongoose.connect("mongodb://localhost/blog_app");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer());
app.set("view engine","ejs");
app.use(methodOverride("_method"));


var blogSchema=new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    date: {type: Date , default: Date.now}
});

var Blog=mongoose.model("Blog",blogSchema);



//RestFull Route
app.get("/",(req,res)=>{
    res.redirect("/blog");
})

app.get("/blog",(req,res)=>{
    Blog.find({},(err,blog)=>{
        res.render("AllBlog",{blogs: blog});
    })
});
app.get("/blog/new",(req,res)=>{
    res.render("new");
});
app.post("/blog",(req,res)=>{
    req.body.blog.body=req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog,(err,blog)=>{
        if(err)
        {
            console.log(err);
        }
        else
        {
            res.redirect("/blog");
        }
    });
});

app.delete("/blog/:id",(req,res)=>{
    Blog.findByIdAndRemove(req.params.id,(err)=>{
        if(err)
        {
            console.log(err);
        }
        else
        {
            res.redirect("/blog");
        }
    })
    

});

app.put("/blog/:id",(req,res)=>{
    req.body.blog.body=req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id,req.body.blog,(err,myBlog)=>{
        if(err)
        {
            console.log(err);
        }
        else
        {
            res.redirect("/blog/"+req.params.id);
        }
    });
});

app.get("/blog/:id/edit",(req,res)=>{
    Blog.findById(req.params.id,(err,blogData)=>{
        if(err)
        {
            console.log(err);
        }
        else
        {
            res.render("Edit",{blog: blogData});
        }
    });
});

app.get("/blog/:id",(req,res)=>{
    
    Blog.findById(req.params.id,(err,blogData)=>{
        if(err)
        {
            console.log(err);
        }
        else
        {
            res.render("BlogPage",{blog: blogData});
        }
    });
});

app.listen(200,()=>{
    console.log("Listening at 200....");
})