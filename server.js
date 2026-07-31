import app from './src/app';

app.listen(3000 , (req,res)=>{
  console.log("Hello Message");
  return res.status(200);
})