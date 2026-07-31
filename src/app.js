import express from 'express';

const app = express();

app.get('/describe' , (req,res)=>{
    return res.json({
        name : "Describe API",
        version : "1.0",
        endpoints : "/health"
    })
})

app.get('/health' , (req,res)=>{
    return res.json({
        status : "ok"
    })
})
export default app;