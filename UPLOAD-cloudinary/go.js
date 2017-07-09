var express =   require("express");
var cloudinary = require('cloudinary');
var multer  =   require('multer');
var cloudinaryStorage = require('multer-storage-cloudinary');
var exphbs  =   require('express-handlebars');
var flash   =   require('connect-flash');
var session =   require('express-session');
var fs = require('fs');



var go =  express();

//flash
go.use(flash());

//Express Session
go.use(session({
  secret: 'secretsmmsmsmmm',
  saveUninitialized : true,
  resave : true
}));

//Global vars
go.use(function(req,res,next){
  res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
      res.locals.error = req.flash('error');
      res.locals.user = req.user || null;
      next();
});


go.engine('handlebars', exphbs({defaultLayout:'layout'}));
go.set('view engine', 'handlebars');


//static files
go.use(express.static((__dirname, 'public')));

//storage method in multer
cloudinary.config({

    cloud_name: '',
    api_key: '',
    api_secret: '',

});
var storage = cloudinaryStorage({
  cloudinary: cloudinary,
  folder: '',
  allowedFormats: ['jpg', 'png','pdf', 'doc', 'jpeg'],
  filename: function (req, file, cb) {
    cb(undefined, file.originalname);
  }
});

var upload = multer({ storage : storage}).single('upload_file');

go.post('/upload',function(req,res){

    upload(req,res,function(err) {
        if(err) {
          req.flash('error_msg','file not uploaded');
      res.redirect('upload');
        }
         req.flash('success_msg','file  uploaded succesfully');
      res.redirect('upload');
    });
});
/*
var files = fs.readdirSync('./upload/');
for (var i in files) {
//  var definition = require('./upload/' + files[i]).Model;


}*/
//upload
go.get('/upload', function(req, res){

  fs.readdir('./upload/',function (err, files) {
     if (err) throw err;
var result = new Array();
for (var index in files) {
 	if(fs.lstatSync('./upload/'+files[index]).isFile())
    {result[index] = files[index];}
 }
 res.render("upload",{result});
});
});

go.get('', function(req, res){
	res.render('upload');
});

go.get("/download/:this",function(req,res){
	var Name = req.params.this;
		var Path="C:/Users/MAYANK/Desktop/UPLOAD-master/upload/";
		res.download(Path+Name);
});

go.get("/delete/:this",function(req,res){
	var Name = req.params.this;
		var Path="C:/Users/MAYANK/Desktop/UPLOAD-master/upload/";
    fs.unlink(Path+Name, function(err){
    });
    res.redirect('/upload')
});


go.listen(8000);
console.log("listen to the port 8000");
