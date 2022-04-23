const express=require('express');
const app = express();
const bodyParser = require('body-parser');
const path= require('path');
const mongoose = require('mongoose');
const viewpath = path.join(__dirname, './view');

const client=require('twilio')('ACc495fd51357629b07f63d7e49844f773','37a09b689b58620ac3bef2efb8e03e65');

app.set('view engine', 'ejs');
app.set('views',viewpath);

app.use(bodyParser.urlencoded({ extended: true}));

mongoose.connect("mongodb://localhost:27017/message");

const msgSchema = {
    msg:String
}

const listmsg=mongoose.model('item',msgSchema);

app.get('/',function(req, res){
    listmsg.findOne({},function(err,founditem){
           res.render('home',{message:founditem});
    })
})

app.post('/',function(req, res){
    const text=req.body.message;
    const number=req.body.number;
    console.log(text);
   

    const meromsg=new listmsg({
        msg:text
    })
    listmsg.findOne({},function(err,founditem){
         if(founditem.length===0){
           meromsg.save();
           }else{
        listmsg.updateOne({_id:founditem.id},{$set:{msg:text}},function(err){
            if(!err){
                console.log('saved msg');
            }
        });
    }
  res.redirect('/');
    })

  //send messages using twilio
   client.messages.create({
    body:text,
    to:'+977'+number,
    from:'+16204728692'
}).then(message =>console.log('message sent'))

.catch(err =>console.log('error'))

})

const port=process.env.PORT||3400;

app.listen(port,function(){
    console.log('server is running');
});
