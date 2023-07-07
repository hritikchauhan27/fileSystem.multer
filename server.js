const fs = require("fs");
const express = require("express");
const http = require("http");
const newfilepath=`./backup/timeS_${Date.now()}.txt`;
const multer = require("multer");

const app = express();
const port = 2001;

app.use(express.urlencoded({extended:false}));


const uploading = multer({
    storage: multer.diskStorage({
        destination: function(req, file, cb){
            cb(null, 'upload');
        },
        filename: function(req, file, cb){
            
            cb(null,`${file.fieldname}.txt`);
        }
    })
}).any();

//****uploading api that creat new file in upload folder******/
app.post("/upload",uploading,(req,res)=>{
    res.send("uploaded");   
 });


//********for merging two file by giving there name in path *********/
app.post("/merge/:n1/:n2",(req,res)=>{
       const file1Path = `./upload/${req.params.n1}.txt`;
       const file2Path = `./upload/${req.params.n2}.txt`;
      
       fs.readFile(file1Path,(err,data)=>{
        if(err){
            console.log(err);
        }
        else{
            fs.writeFile(newfilepath,data,(err)=>{
                if(err){
                    console.log(err);
                }
            });
            fs.readFile(file2Path,(err,data)=>{
                if(err){
                    console.log(err);
                }
                else{
                    fs.appendFile(newfilepath,` ${data}`,(err)=>{
                        if(err){
                            console.log(err);
                        }
                    });
                    
                }
                console.log("new file created");
                res.send("new file created");
               })
            
        }
       })
}); 

//***************for reading file **********/
app.get("/display",(req,res)=>{
    fs.readFile(newfilepath,(err,data)=>{
        if(err){
            console.log(err);
        }
        else{
            res.send(data);
        }
    })
    
})


//**** for deleting file1 and file2 after merging */
app.delete("/delete/:n1/:n2",(req,res)=>{
    fs.unlink(`./upload/${req.params.n1}.txt`, (err) => {
        if (err) {
            console.log(err);
            res.send("Error deleting file");
        } else {
            console.log("File deleted");
        }
    });
    fs.unlink(`./upload/${req.params.n2}.txt`, (err) => {
        if (err) {
            console.log(err);
            res.send("Error deleting file");
        } else {
            console.log("File deleted");
        }
    });
    res.send("Files deleted successfully!");
});

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});










//********************************************************************************/

// fs.readFile('.//file1.txt','utf8',(err,data)=>{
//     if(err) throw err;
//     console.log(data);
// })

// fs.writeFile('./uploacd/file2.txt','Hii, you are in file2',(err)=>{
//     if(err) throw err;
//     console.log('file created');
// })

// fs.mkdir('New_directory',777,(err)=>{
//     if(err) throw err;
//     console.log('folder created');
// })